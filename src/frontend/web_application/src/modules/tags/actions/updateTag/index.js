import { updateTag as updateTagBase, invalidate } from '../../store/reducer';
import { tryCatchAxiosPromise } from '../../../../services/api-client';

export const updateTag =
  ({ tag, original }) =>
  async (dispatch) => {
    const result = tryCatchAxiosPromise(
      dispatch(updateTagBase({ tag, original }))
    );
    dispatch(invalidate());

    return result;
  };
