import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// unable to use @lingui/macro due to a miss-interpolated value in Plural component
import { Trans, withI18n } from '@lingui/react';
import { ContactList } from 'src/modules/contact';
import {
  PageTitle,
  Spinner,
  Button,
  ActionBarWrapper,
  ActionBar,
  Checkbox,
  SidebarLayout,
  NavList,
  NavItem,
  Confirm,
  Modal,
} from '../../components';
import { withPush } from '../../modules/routing';
import { withScrollManager, ScrollDetector } from '../../modules/scroll';
import {
  withTags,
  TagsForm,
  getCleanedTagCollection,
  getTagNamesInCommon,
  DEFAULT_SORT_DIR,
} from '../../modules/tags';
import TagList from './components/TagList';
import ImportContactButton from './components/ImportContactButton';
import { withTagSearched } from './hoc/withTagSearched';
import './style.scss';
import './contact-book-menu.scss';

function getFilteredContacts(contactList, tag) {
  if (tag === '') {
    return contactList;
  }

  return contactList.filter(
    (contact) => contact.tags && contact.tags.includes(tag)
  );
}

@withTags()
@withTagSearched()
@withPush()
@withI18n()
@withScrollManager()
class ContactBook extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    requestContacts: PropTypes.func.isRequired,
    loadMoreContacts: PropTypes.func.isRequired,
    deleteContacts: PropTypes.func.isRequired,
    updateContactTags: PropTypes.func.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({})),
    userContact: PropTypes.shape({}),
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    tagSearched: PropTypes.string,
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    hasMore: PropTypes.bool,
    i18n: PropTypes.shape({ _: PropTypes.func }).isRequired,
  };

  static defaultProps = {
    contacts: [],
    userContact: undefined,
    tags: [],
    tagSearched: '',
    isFetching: false,
    didInvalidate: false,
    hasMore: false,
  };

  state = {
    sortDir: DEFAULT_SORT_DIR,
    isDeleting: false,
    selectedEntitiesIds: [],
    isTagModalOpen: false,
  };

  componentDidMount() {
    // FIXME: Contacts not filtered by tags
    this.props.requestContacts();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.didInvalidate && !nextProps.isFetching) {
      this.props.requestContacts();
    }
  }

  onSelectEntity = (type, id) => {
    if (type === 'add') {
      this.setState((prevState) => ({
        ...prevState,
        selectedEntitiesIds: [...prevState.selectedEntitiesIds, id],
      }));
    }

    if (type === 'remove') {
      this.setState((prevState) => ({
        ...prevState,
        selectedEntitiesIds: [...prevState.selectedEntitiesIds].filter(
          (item) => item !== id
        ),
      }));
    }
  };

  onSelectAllEntities = (checked) => {
    const { contacts, tagSearched } = this.props;
    const contactIds = getFilteredContacts(contacts, tagSearched).map(
      ({ contact_id: contactId }) => contactId
    );

    this.setState((prevState) => ({
      ...prevState,
      selectedEntitiesIds: checked ? contactIds : [],
    }));
  };

  loadMore = () => {
    this.props.loadMoreContacts();
  };

  handleSelectAllEntitiesChange = (ev) => {
    const { checked } = ev.target;
    this.onSelectAllEntities(checked);
  };

  handleDeleteContacts = async () => {
    const { contacts, deleteContacts } = this.props;
    const selectedContactIds = new Set(this.state.selectedEntitiesIds);

    this.setState((prevState) => ({
      ...prevState,
      isDeleting: true,
    }));

    await deleteContacts({
      contacts: contacts.filter((contact) =>
        selectedContactIds.has(contact.contact_id)
      ),
    });

    this.setState((prevState) => ({
      ...prevState,
      selectedEntitiesIds: [],
      isDeleting: false,
    }));
  };

  handleClickAddContact = () => {
    this.props.push('/new-contact');
  };

  handleClickEditGroups = () => {
    this.props.push('/settings/tags');
  };

  handleUploadSuccess = () => {
    this.props.requestContacts();
  };

  handleOpenTags = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  };

  handleCloseTags = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  };

  handleTagsChange = (tags) => {
    const { updateContactTags, i18n } = this.props;

    return updateContactTags(i18n, this.state.selectedEntitiesIds, tags, {
      withThrottle: false,
    });
  };

  renderTagsModal = () => {
    const { contacts, tags: userTags, i18n } = this.props;
    const selectedEntitiesIds = new Set(this.state.selectedEntitiesIds);
    const selectedEntities = contacts.filter((contact) =>
      selectedEntitiesIds.has(contact.contact_id)
    );

    const tagNamesInCommon = getTagNamesInCommon(selectedEntities);

    const tagsInCommon = getCleanedTagCollection(userTags, tagNamesInCommon);

    const title = (
      <Trans
        id="tags.header.title"
        message="Tags <0>(Total: {nb})</0>"
        values={{ nb: tagsInCommon.length }}
        components={[<span className="m-tags-form__count" />]}
      />
    );

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={i18n._(/* i18n */ 'tags.header.label', null, {
          message: 'Tags',
        })}
        title={title}
        onClose={this.handleCloseTags}
      >
        {tagNamesInCommon.length > 1 && (
          <Trans
            id="tags.common_tags_applied"
            message="Common tags applied to the current selection:"
          />
        )}

        <TagsForm
          tagCollection={tagsInCommon}
          updateTags={this.handleTagsChange}
        />
      </Modal>
    );
  };

  renderActionBar() {
    const { isFetching, contacts } = this.props;

    const count = this.state.selectedEntitiesIds.length;
    const totalCount = contacts.length;

    return (
      <ScrollDetector
        offset={136}
        render={(isSticky) => (
          <ActionBarWrapper isSticky={isSticky}>
            <ActionBar
              isLoading={isFetching}
              actionsNode={
                <div className="s-contact-book-menu">
                  {count > 0 && (
                    <Fragment>
                      <span className="s-contact-book-menu__label">
                        <Trans
                          id="contact-book.contacts.selected"
                          values={{ count, totalCount }}
                          message="{count, plural, one {#/{totalCount} selected contact:} other {#/{totalCount} selected contacts:}}"
                        />
                      </span>
                      <Confirm
                        onConfirm={this.handleDeleteContacts}
                        title={
                          <Trans
                            id="contact-book.confirm-delete.title"
                            value={count}
                            message="{count, plural, one {Delete contact} other {Delete contacts}}"
                          />
                        }
                        content={
                          <Trans
                            id="contact-book.confirm-delete.content"
                            value={count}
                            message="{count, plural, one { The deletion is permanent, are you sure you want to delete this contact? } other { The deletion is permanent, are you sure you want to delete these contacts? }}"
                          />
                        }
                        render={(confirm) => (
                          <Button
                            className="s-contact-book-menu__action-btn"
                            display="inline"
                            noDecoration
                            icon={
                              this.state.isDeleting ? (
                                <Spinner
                                  svgTitleId="delete-contacts-spinner"
                                  isLoading
                                  display="inline"
                                />
                              ) : (
                                'trash'
                              )
                            }
                            onClick={confirm}
                            disabled={this.state.isDeleting}
                          >
                            <Trans
                              id="contact-book.action.delete"
                              message="Delete"
                            />
                          </Button>
                        )}
                      />
                      <Button
                        className="s-contact-book-menu__action-btn"
                        display="inline"
                        noDecoration
                        icon="tag"
                        onClick={this.handleOpenTags}
                      >
                        <Trans
                          id="contact-book.action.manage-tags"
                          message="Manage tags"
                        />
                      </Button>
                      {this.state.isTagModalOpen && this.renderTagsModal()}
                      {/* <Button
                        className="s-contact-book-menu__action-btn"
                        display="inline"
                        noDecoration
                        icon="share"
                        >
                        <Trans id="contact-book.action.start-discussion" message="Start discussion" />
                      </Button> */}
                    </Fragment>
                  )}
                  <div
                    className={classnames('s-contact-book-menu__select-all', {
                      's-contact-book-menu__select-all--label-hidden':
                        count > 0,
                    })}
                  >
                    <Checkbox
                      checked={count > 0 && count === totalCount}
                      indeterminate={count > 0 && count < totalCount}
                      onChange={this.handleSelectAllEntitiesChange}
                      label={
                        <Trans
                          id="contact-book.action.select-all"
                          message="Select all contacts"
                        />
                      }
                      showLabelforSr={count > 0}
                    />
                  </div>
                </div>
              }
            />
          </ActionBarWrapper>
        )}
      />
    );
  }

  renderContacts() {
    const { contacts, userContact, hasMore, tagSearched } = this.props;

    return (
      <Fragment>
        <ContactList
          sortDir={this.state.sortDir}
          onSelectEntity={this.onSelectEntity}
          selectedContactsIds={this.state.selectedEntitiesIds}
        />
        {hasMore && (
          <div className="s-contact-book-list__load-more">
            <Button shape="hollow" onClick={this.loadMore}>
              <Trans id="general.action.load_more" message="Load more" />
            </Button>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    const { i18n } = this.props;

    return (
      <div className="s-contact-book">
        <PageTitle
          title={i18n._(/* i18n */ 'header.menu.contacts', null, {
            message: 'Contacts',
          })}
        />
        {this.renderActionBar()}
        <SidebarLayout
          sidebar={
            <div className="s-contact-book__sidebar">
              <div>
                <h2 className="s-contact-book__tags-title">
                  <Trans id="contact-book.contacts.title" message="Contacts" />
                </h2>
                <NavList dir="vertical">
                  <NavItem>
                    <Button
                      className="s-contact-book__action-button"
                      icon="plus"
                      shape="plain"
                      display="block"
                      onClick={this.handleClickAddContact}
                    >
                      <Trans id="contact-book.action.add" message="Add" />
                    </Button>
                  </NavItem>
                  <NavItem>
                    <ImportContactButton
                      className="s-contact-book__action-button"
                      onUploadSuccess={this.handleUploadSuccess}
                    />
                  </NavItem>
                </NavList>
              </div>
              <div>
                <h2 className="s-contact-book__tags-title">
                  <Trans id="contact-book.groups.title" message="Groups" />
                </h2>
                <TagList />
                <NavList dir="vertical">
                  <NavItem>
                    <Button
                      className="s-contact-book__action-button"
                      icon="tag"
                      shape="plain"
                      display="block"
                      onClick={this.handleClickEditGroups}
                    >
                      <Trans
                        id="contact-book.tags.action.edit-groups"
                        message="Edit groups"
                      />
                    </Button>
                  </NavItem>
                </NavList>
              </div>
            </div>
          }
        >
          {this.renderContacts()}
        </SidebarLayout>
      </div>
    );
  }
}

export default ContactBook;
