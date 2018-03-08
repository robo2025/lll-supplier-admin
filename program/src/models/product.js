import { queryProducts, queryProductDetail } from '../services/product';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'product',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *fetch({ success, error }, { call, put }) {
      const res = yield call(queryProducts);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'save',
        payload: res.data,
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
