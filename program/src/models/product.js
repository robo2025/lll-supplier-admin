import { queryProducts, queryProductDetail } from '../services/product';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'product',

  state: {
    list: [],
    detail: {},
    total: 0,
  },

  effects: {
    *fetch({ offset, limit, success, error }, { call, put }) {
      const res = yield call(queryProducts, { offset, limit });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const { headers } = res;
      yield put({
        type: 'save',
        payload: res.data,
        headers,
      });
    },
    *fetchDetail({ productId, success, error }, { call, put }) {
      const res = yield call(queryProductDetail, { productId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
        total: action.headers['x-content-total'] >> 0,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
