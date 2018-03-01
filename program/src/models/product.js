import { queryProducts, queryProductDetail } from '../services/product';

export default {
  namespace: 'product',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryProducts);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDetail({ productId, callback }, { call, put }) {
      const response = yield call(queryProductDetail, { productId });
      if (response.rescode >> 0 === 10000) {
        if (callback) callback(response.data);
      }
      yield put({
        type: 'saveDetail',
        payload: response.data,
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
