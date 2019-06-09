# -*- coding: utf-8 -*-
"""
Caliopen mail message format management.

mail parsing is included in python, so this is not
getting external dependencies.

For formats with needs of external packages, they
must be defined outside of this one.
"""

import logging
import base64
from itertools import groupby
from mailbox import Message
from email.header import decode_header
import datetime
import pytz

from email.utils import parsedate_tz, mktime_tz, getaddresses

import zope.interface

from caliopen_main.common.helpers.normalize import clean_email_address
from caliopen_main.common.helpers.strings import to_utf8
from caliopen_main.common.interfaces import (IAttachmentParser, IMessageParser,
                                             IParticipantParser)

log = logging.getLogger(__name__)

TEXT_CONTENT_TYPE = ['text', 'xml', 'vnd', 'xhtml', 'json', 'msword']


class MailAttachment(object):
    """Mail part structure."""

    zope.interface.implements(IAttachmentParser)

    def __init__(self, part):
        """Extract attachment attributes from a mail part."""
        self.content_type = part.get_content_type()
        self.filename = part.get_filename()
        if self.filename:
            try:
                self.filename = self.filename.decode('utf-8')
            except UnicodeError:
                log.warn('Invalid filename encoding')
        content_disposition = part.get("Content-Disposition")
        if content_disposition:
            dispositions = content_disposition.strip().split(";")
            self.is_inline = bool(dispositions[0].lower() == "inline")
        else:
            self.is_inline = True
        data = part.get_payload()
        self.can_index = False
        if any(x in part.get_content_type() for x in TEXT_CONTENT_TYPE):
            self.can_index = True
            charsets = part.get_charsets()
            if len(charsets) > 1:
                raise Exception('Too many charset %r for %s' %
                                (charsets, part.get_payload()))
            self.charset = charsets[0]
            if 'Content-Transfer-Encoding' in part.keys():
                if part.get('Content-Transfer-Encoding') == 'base64':
                    data = base64.b64decode(data)
            if self.charset:
                data = data.decode(self.charset, 'replace'). \
                    encode('utf-8')
        boundary = part.get("Mime-Boundary", failobj="")
        if boundary is not "":
            self.mime_boundary = boundary
        else:
            self.mime_boundary = ""
        self.data = data
        self.size = len(data) if data else 0

    @classmethod
    def is_attachment(cls, part):
        """Check if a part conform to Caliopen's attachment definition.

        A part is an "attachment" if it verifies ANY of this conditions :
        - it has a Content-Disposition header with param "attachment"
        - the main part of the Content-Type header
                                        is within "attachment_types" list below
        - the part is not a PGP/Mime encryption envelope

        see https://www.iana.org/assignments/media-types/media-types.xhtml

        :param part: an email/message's part as return by the walk() func.
        :return: true or false
        """
        content_disposition = part.get("Content-Disposition")
        if content_disposition:
            dispositions = content_disposition.strip().split(";")
            if bool(dispositions[0].lower() == "attachment") or \
                    bool(dispositions[0].lower() == "inline"):
                return True

        attachment_types = (
            "application", "image", "video", "audio", "message", "font")
        if part.get_content_maintype() in attachment_types:
            return True
        return False


class MailParticipant(object):
    """Mail participant parser."""

    zope.interface.implements(IParticipantParser)

    def __init__(self, type, addr):
        """Parse an email address and create a participant."""
        self.type = type
        parts = clean_email_address(addr)
        self.address = parts[0]
        self.label = parts[1]


class MailMessage(object):
    """
    Mail message structure.

    Got a mail in raw rfc2822 format, parse it to
    resolve all recipients emails, parts and group headers
    """

    zope.interface.implements(IMessageParser)

    recipient_headers = ['From', 'To', 'Cc', 'Bcc']
    message_protocol = 'email'
    warnings = []
    body_html = ""
    body_plain = ""

    def __init__(self, raw_data):
        """Parse an RFC2822,5322 mail message."""
        self.raw = raw_data
        self._extra_parameters = {}
        try:
            self.mail = Message(raw_data)
        except Exception as exc:
            log.error('Parse message failed %s' % exc)
            raise exc
        if self.mail.defects:
            # XXX what to do ?
            log.warn('Defects on parsed mail %r' % self.mail.defects)
            self.warnings = self.mail.defects
        self._parse()

    def _parse(self):
        """Main function to build mail representation."""
        attachments = []
        html_bodies = []
        text_bodies = []
        multipart_type = None
        in_alternative = False
        parts = self.mail.get_payload()
        self._parse_structure(parts, multipart_type, in_alternative,
                              attachments, html_bodies, text_bodies)
        self.body_html = '\n'.join(html_bodies)
        self.body_plain = '\n'.join(text_bodies)
        self._attachments = attachments

    def _is_part_inline(self, part):
        """Return true if part is inline, false otherwise."""
        sub_type = part.get_content_subtype()
        if sub_type in ['html', 'text']:
            return True
        content_disposition = part.get("Content-Disposition")
        if content_disposition:
            dispositions = content_disposition.strip().split(";")
            return bool(dispositions[0].lower() == "inline")
        return True

    def _in_inline_media(self, part):
        """
        function isInlineMediaType ( type ) {
          return type.startsWith( 'image/' ) ||
                 type.startsWith( 'audio/' ) ||
                 type.startsWith( 'video/' );
        }
        """
        maintype = part.get_content_maintype()
        if maintype in ['image', 'audio', 'video']:
            return True
        return False

    def _parse_structure(self, parts, multipart_type, in_alternative,
                         attachments, html_bodies, text_bodies):
        """
        Parse a mail part structure.

        Inspired from: https://jmap.io/spec-mail.html#body-parts
        """
        text_length = sum(len(x) for x in text_bodies) if text_bodies else -1
        html_length = sum(len(x) for x in html_bodies) if html_bodies else -1
        for part in parts:
            is_multipart = part.is_multipart()
            is_inline = self._is_part_inline(part)
            if is_multipart:
                subtype = part.get_content_subtype()
                alternative = in_alternative or subtype == 'alternative'
                self._parse_structure(part.get_payload(),
                                      part.get_content_type(),
                                      alternative,
                                      attachments,
                                      html_bodies,
                                      text_bodies)
            else:
                if is_inline:
                    if multipart_type == 'alternative':
                        subtype = part.get_content_subtype()
                        if subtype == 'html':
                            html_bodies.append(part.get_payload())
                        elif subtype == 'plain':
                            text_bodies.append(part.get_payload())
                        else:
                            attachments.append(part)
                    else:
                        if in_alternative:
                            # reset html_bodies and text_bodies ?
                            log.warn('Please HELP')
                            pass
                        else:
                            subtype = part.get_content_subtype()
                            if subtype == 'html':
                                html_bodies.append(part.get_payload())
                            elif subtype == 'plain':
                                text_bodies.append(part.get_payload())
                    if not (text_bodies or html_bodies) and \
                       self._is_part_inline(part):
                        attachments.append(part)
                else:
                    attachments.append(part)

        if multipart_type == 'alternative' and html_bodies and text_bodies:
            if text_length == sum(len(x) for x in text_bodies) and \
               html_length != sum(len(x) for x in html_bodies):
                for html in html_bodies:
                    text_bodies.append(html)
            if html_length == sum(len(x) for x in html_bodies) and \
               text_length != sum(len(x) for x in text_bodies):
                for text in text_bodies:
                    html_bodies.append(text)

    @property
    def subject(self):
        """Mail subject."""
        s = decode_header(self.mail.get('Subject'))
        charset = s[0][1]
        if charset is not None:
            return s[0][0].decode(charset, "replace"). \
                encode("utf-8", "replace")
        else:
            try:
                return s[0][0].decode('utf-8', errors='ignore')
            except UnicodeError:
                log.warn('Invalid subject encoding')
                return s[0][0]

    @property
    def size(self):
        """Get mail size in bytes."""
        return len(self.mail.as_string())

    @property
    def external_references(self):
        """Return mail references to be used as external references.

         making use of RFC5322 headers :
            message-id
            in-reply-to
            references
        headers' strings are pruned to extract email addresses only.
        """
        ext_id = self.mail.get('Message-Id')
        parent_id = self.mail.get('In-Reply-To')
        ref = self.mail.get_all("References")
        ref_addr = getaddresses(ref) if ref else None
        ref_ids = [address[1] for address in ref_addr] if ref_addr else []
        mid = clean_email_address(ext_id)[1] if ext_id else None
        if not mid:
            log.error('Unable to find correct message_id {}'.format(ext_id))
            mid = ext_id
        pid = clean_email_address(parent_id)[1] if parent_id else None
        if not pid:
            pid = parent_id
        return {
            'message_id': mid,
            'parent_id': pid,
            'ancestors_ids': ref_ids}

    @property
    def date(self):
        """Get UTC date from a mail message."""
        mail_date = self.mail.get('Date')
        if mail_date:
            try:
                tmp_date = parsedate_tz(mail_date)
                return datetime.datetime.fromtimestamp(mktime_tz(tmp_date))
            except TypeError:
                log.error('Invalid date in mail {}'.format(mail_date))
        log.debug('No date on mail using now (UTC)')
        return datetime.datetime.now(tz=pytz.utc)

    @property
    def participants(self):
        """Mail participants."""
        participants = []
        for header in self.recipient_headers:
            addrs = []
            participant_type = header.capitalize()
            if self.mail.get(header):
                parts = self.mail.get(header).split('>,')
                if not parts:
                    pass
                if parts and parts[0] == 'undisclosed-recipients:;':
                    pass
                filtered = [x for x in parts if '@' in x]
                addrs.extend(filtered)
            for addr in addrs:
                participant = MailParticipant(participant_type, addr.lower())
                if participant.address == '' and participant.label == '':
                    log.warn('Invalid email address {}'.format(addr))
                else:
                    participants.append(participant)
        return participants

    @property
    def attachments(self):
        return self._attachments

    @property
    def extra_parameters(self):
        """Mail message extra parameters."""
        lists = self.mail.get_all("List-ID")
        lists_addr = getaddresses(lists) if lists else None
        lists_ids = [address[1] for address in lists_addr] \
            if lists_addr else []
        self._extra_parameters.update({'lists': lists_ids})
        return self._extra_parameters

    # Others parameters specific for mail message

    @property
    def headers(self):
        """Extract all headers into list.

        Duplicate on headers exists, group them by name
        with a related list of values
        """
        def keyfunc(item):
            return item[0]

        # Group multiple value for same headers into a dict of list
        headers = {}
        data = sorted(self.mail.items(), key=keyfunc)
        for k, g in groupby(data, key=keyfunc):
            headers[k] = [x[1] for x in g]
        return headers


def walk_with_boundary(message, boundary):
    """Recurse in boundaries."""
    message.add_header("Mime-Boundary", boundary)
    yield message
    if message.is_multipart():
        subboundary = message.get_boundary("")
        for subpart in message.get_payload():
            for subsubpart in walk_with_boundary(subpart, subboundary):
                yield subsubpart
