import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useContacts } from 'src/modules/contact';
import { filterIdentities } from 'src/modules/draftMessage/services/filterIdentities';
import { useIdentities } from 'src/modules/identity';
import { messageSelector, getMessage } from 'src/modules/message';
import { useUser } from 'src/modules/user';
import { DraftMessageFormData } from 'src/modules/draftMessage';

const EMPTY_ARRAY = [];

export function useAvailableIdentities(
  draft: undefined | DraftMessageFormData
) {
  const dispatch = useDispatch();
  const { identities } = useIdentities();
  const user = useUser();
  const { contacts } = useContacts();
  const parentMessage = useSelector((state) =>
    messageSelector(state, { messageId: draft?.parent_id })
  );
  const [fetching, setFetching] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async function fetch() {
      if (draft && draft.parent_id && !fetching) {
        setFetching(true);
        await dispatch(getMessage({ messageId: draft.parent_id }));
        setFetching(false);
      }
    })();
  }, [draft, fetching]);

  if (!identities) {
    return EMPTY_ARRAY;
  }

  if (!user) {
    return EMPTY_ARRAY;
  }

  return filterIdentities({
    identities,
    user,
    contacts,
    parentMessage,
  });
}
