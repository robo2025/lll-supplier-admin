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
      // console.log('action token', action);
      // window.sessionStorage.setItem('upload_token',`${action.payload.data.id}`);
      return {
        ...state,
        upload_token: action.payload.upload_token,
      };
    },
  },
};
