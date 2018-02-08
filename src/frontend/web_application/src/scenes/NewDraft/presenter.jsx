import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NewDraftForm, DraftMessageActionsContainer } from '../../modules/drafts';

class NewDraft extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({})),
    draft: PropTypes.shape({}),
    message: PropTypes.shape({}),
    currentTab: PropTypes.shape({}),
    internalId: PropTypes.string,
    requestNewDraft: PropTypes.func.isRequired,
    onEditDraft: PropTypes.func.isRequired,
    onSaveDraft: PropTypes.func.isRequired,
    onDeleteMessage: PropTypes.func.isRequired,
    onSendDraft: PropTypes.func.isRequired,
    onUpdateEntityTags: PropTypes.func.isRequired,
    notifySuccess: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: [],
    draft: undefined,
    message: undefined,
    internalId: undefined,
    currentTab: undefined,
  };

  state = {
    isSending: false,
  };

  componentDidMount() {
    const { internalId, draft, requestNewDraft } = this.props;
    if (!internalId || !draft) {
      requestNewDraft({ internalId });
    }
  }

  handleEditDraft = ({ draft }) => {
    const { internalId, message, onEditDraft } = this.props;

    return onEditDraft({ internalId, draft, message });
  };

  handleTagsChange = ({ tags }) => {
    const { internalId, draft, onUpdateEntityTags, i18n, tags: userTags, message } = this.props;

    return onUpdateEntityTags(internalId, i18n, userTags, message, { type: 'message', entity: draft, tags });
  }

  handleSaveDraft = async ({ draft }) => {
    const { i18n, onSaveDraft, notifySuccess, notifyError, internalId, message } = this.props;

    try {
      await onSaveDraft({ internalId, draft, message });

      return notifySuccess({ message: i18n._('draft.feedback.saved', { defaults: 'Draft saved' }) });
    } catch (err) {
      return notifyError({
        message: i18n._('draft.feedback.save-error', { defaults: 'Unable to save the draft' }),
      });
    }
  }

  handleSend = async ({ draft }) => {
    const { onSendDraft, internalId, message, currentTab, notifyError, i18n } = this.props;
    this.setState({ isSending: true });

    try {
      await onSendDraft(currentTab, { draft, message, internalId });
    } catch (err) {
      notifyError({
        message: i18n._('draft.feedback.send-error', { defaults: 'Unable to send the message' }),
      });
    }
    this.setState({ isSending: false });
  }

  handleDelete = () => {
    const { message, onDeleteMessage } = this.props;
    onDeleteMessage({ message });
  };

  renderDraftMessageActionsContainer = () => {
    const { draft, internalId } = this.props;

    return (
      <DraftMessageActionsContainer
        message={draft}
        internalId={internalId}
        onDelete={this.handleDelete}
        onTagsChange={this.handleTagsChange}
      />
    );
  }

  render() {
    const { draft, internalId } = this.props;

    return (
      <NewDraftForm
        internalId={internalId}
        draft={draft}
        onChange={this.handleEditDraft}
        onSave={this.handleSaveDraft}
        onSend={this.handleSend}
        isSending={this.state.isSending}
        renderDraftMessageActionsContainer={this.renderDraftMessageActionsContainer}
      />
    );
  }
}

export default NewDraft;
