import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslator } from '@gandi/react-translate';
import { editDraft, requestNewDraft, saveDraft, sendDraft } from '../../store/modules/draft-message';
import { withNotification } from '../../hoc/notification';
import Presenter from './presenter';

const messageDraftSelector = state => state.draftMessage.draftsByInternalId;
const messageSelector = state => state.message.messagesById;
const internalIdSelector = (state, ownProps) => ownProps.match.params.internalId;
const draftSelector = createSelector(
  [messageDraftSelector, internalIdSelector],
  (draftsByInternalId, internalId) => draftsByInternalId[internalId],
);

const mapStateToProps = createSelector(
  [draftSelector, messageSelector, internalIdSelector],
  (draft, messagesById, internalId) => ({
    draft,
    message: draft && messagesById[draft.message_id],
    internalId,
  })
);
const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators({
    requestNewDraft,
    editDraft,
    sendDraft,
  }, dispatch),
  saveDraft: params => dispatch(saveDraft(params))
    .then(() => {
      const { __, notifySuccess } = ownProps;

      return notifySuccess({ message: __('draft.feedback.saved') });
    }),
});

export default compose(
  withTranslator(),
  withNotification(),
  connect(mapStateToProps, mapDispatchToProps)
)(Presenter);
