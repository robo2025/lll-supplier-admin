import {
  queryList,
  queryDetail,
  queryUserInfo,
  handleQuotation,
} from '../services/solution';

export default {
  namespace: 'solution',

  state: {
    list: [],
    profile: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, {
        ...payload,
        is_type: 'all',
      });
      const { data, rescode } = response;
      if (rescode === 10000) {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.id };
        });
        yield put({
          type: 'save',
          payload: dataWithKey,
        });
      } else {
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryDetail, { sln_no: payload });
      let userInfo = {};
      if (response.rescode === 10000) {
        if (response.data.customer) {
          const res = yield call(queryUserInfo, {
            id: response.data.customer.sln_basic_info.customer_id,
          });
          userInfo = res.data;
          if (callback) {
            callback(response.data);
          }
        }
      }
      yield put({
        type: 'saveSolutionOrder',
        payload: { ...response.data, userInfo },
      });
    },
    *handleFormSubmit({ payload, callback }, { call, put }) {
      const response = yield call(handleQuotation, { ...payload });
      if (callback && typeof (callback) === 'function') {
        if (response.rescode === 10000) {
          callback(true, response.msg);
        } else {
          callback(false, response.msg);
        }
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    saveSolutionOrder(state, { payload }) {
      return {
        ...state,
        profile: payload,
      };
    },
  },
};
