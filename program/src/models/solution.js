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
    pagination: { current: 1, pageSize: 10 },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.solution.pagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(queryList, {
        ...payload,
        ...params,
      });
      const { data, headers, rescode } = response;
      if (rescode === 10000) {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.plan_order_sn };
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
      const newPagination = {
        ...pagination,
        total: parseInt(headers['x-content-total'], 10),
        current: parseInt(headers['x-content-range'][0], 10) + 1,
      };
      yield put({
        type: 'savePagination',
        payload: newPagination,
      });
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
    savePagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
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
