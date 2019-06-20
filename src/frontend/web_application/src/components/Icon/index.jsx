import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';

export const typeAssoc = {
  at: 'fa fa-at',
  'address-book': 'fa fa-address-book',
  'angle-down': 'fa fa-angle-down',
  'arrow-right': 'fa fa-arrow-right',
  'arrow-left': 'fa fa-arrow-left',
  bell: 'fa fa-bell',
  'birthday-cake': 'fa fa-birthday-cake',
  briefcase: 'fa fa-briefcase',
  building: 'fa fa-building',
  calendar: 'fa fa-calendar',
  'caret-up': 'fa fa-caret-up',
  'caret-down': 'fa fa-caret-down',
  check: 'fa fa-check',
  circle: 'fa fa-circle',
  cog: 'fa fa-cog',
  comment: 'fa fa-comment',
  comments: 'fa fa-comments',
  'comments-o': 'fa fa-comments-o',
  crosshairs: 'fa fa-crosshairs',
  download: 'fa fa-download',
  'dot-circle': 'fa fa-dot-circle',
  edit: 'fa fa-edit',
  envelope: 'fa fa-envelope',
  'envelope-open': 'fa fa-envelope-open',
  'ellipsis-v': 'fa fa-ellipsis-v',
  email: 'fa fa-envelope',
  editor: 'fa fa-font',
  exchange: 'fa fa-exchange',
  'exclamation-triangle': 'fa fa-exclamation-triangle',
  'expire-soon': 'fa fa-clock-o',
  desktop: 'fa fa-desktop',
  facebook: 'fa fa-facebook',
  file: 'fa fa-file',
  filter: 'fa fa-filter',
  folder: 'fa fa-folder-open',
  github: 'fa fa-github',
  google: 'fa fa-google',
  home: 'fa fa-home',
  'info-circle': 'fa fa-info-circle',
  key: 'fa fa-key',
  laptop: 'fa fa-laptop',
  'list-ul': 'fa fa-list-ul',
  lock: 'fa fa-lock',
  'map-marker': 'fa fa-map-marker',
  'paper-plane': 'fa fa-paper-plane',
  paperclip: 'fa fa-paperclip',
  pencil: 'fa fa-pencil',
  plug: 'fa fa-plug',
  plus: 'fa fa-plus',
  phone: 'fa fa-phone',
  question: 'fa fa-question',
  'question-circle': 'fa fa-question-circle',
  remove: 'fa fa-remove',
  reply: 'fa fa-reply',
  save: 'fa fa-floppy-o',
  send: 'fa fa-paper-plane',
  search: 'fa fa-search',
  server: 'fa fa-server',
  share: 'fa fa-share',
  'share-alt': 'fa fa-share-alt',
  shield: 'fa fa-shield',
  smartphone: 'fa fa-mobile',
  tag: 'fa fa-tag',
  times: 'fa fa-times',
  upload: 'fa fa-upload',
  user: 'fa fa-user',
  users: 'fa fa-users',
  tablet: 'fa fa-tablet',
  tags: 'fa fa-tags',
  twitter: 'fa fa-twitter',
  'th-large': 'fa fa-th-large',
  trash: 'fa fa-trash',
  warning: 'fa fa-warning',
  'window-maximize': 'fa fa-window-maximize',
};


const Icon = ({
  className, type, spaced, rightSpaced, ...props
}) => {
  // eslint-disable-next-line no-console
  const typeClassName = typeAssoc[type] || console.error(`The type "${type}" is not a valid Icon component type`);
  const iconProps = {
    ...props,
    className: classnames(
      className,
      typeClassName,
      { 'm-icon--spaced': spaced, 'm-icon--right-spaced': rightSpaced }
    ),
  };

  return <i {...iconProps} />;
};

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  spaced: PropTypes.bool,
  rightSpaced: PropTypes.bool,
};
Icon.defaultProps = {
  className: undefined,
  type: undefined,
  spaced: false,
  rightSpaced: false,
};

export default Icon;
