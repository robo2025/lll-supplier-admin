import {
  queryOrders,
  prepareGoods,
  queryDetail,
  querySolutionDetail,
  delivery,
} from '../services/solutionOrders';

export default {
  namespace: 'solutionOrders',

  state: {
    list: [],
    profile: {},
    pagination: { current: 1, pageSize: 10 },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.solutionOrders.pagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(queryOrders, {
        ...payload,
        ...params,
        is_type: 'all',
      });
      const { data, headers, rescode } = response;
      if (rescode === '10000') {
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
      const response = yield call(queryDetail, { plan_order_sn: payload });
      let slnInfo = {};
      const { data, rescode } = response;
      if (rescode === '10000') {
        const res = yield call(querySolutionDetail, data.order_info.plan_sn);
        slnInfo = res.data;
        if (callback) {
          callback(data);
        }
      }
      yield put({
        type: 'saveSolutionOrder',
        payload: { ...response.data, ...slnInfo },
      });
    },
    *handlePrepare({ payload, callback }, { call, put }) {
      const response = yield call(prepareGoods, { ...payload, is_type: 1 });
      if (response.status === 200 && response.rescode === '10000') {
        callback(true, response.msg);
      } else {
        callback(false, response.msg);
      }
    },
    *handleDelivery({ payload, callback }, { call }) {
      const response = yield call(delivery, { ...payload });
      if (response.status === 200 && response.rescode === '10000') {
        callback(true, response.msg);
      } else {
        callback(false, response.msg);
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
