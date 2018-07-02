import { query } from '../services/upload';

export default {
  namespace: 'upload',

  state: {
    upload_token: '',
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        upload_token: action.payload.upload_token,
      };
    },
  },
};
