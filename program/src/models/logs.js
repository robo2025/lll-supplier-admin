import { queryLogs } from '../services/logs';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'logs',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetch({ module, objectId, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryLogs, { module, objectId, offset, limit });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }
      const { headers } = res;
      yield put({
        type: 'saveLogs',
        payload: res.data,
        headers,
      });
    },
  },

  reducers: {
    saveLogs(state, action) {
      return {
        ...state,
        list: action.payload,
        total: action.headers['x-content-total'] >> 0,
      };
    },
  },
};
