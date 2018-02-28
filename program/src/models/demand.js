import { queryAllDemands, checkDemand, deleteDemand, getDemandDetail } from '../services/demand';

export default {
  namespace: 'demand',

  state: {
    list: [],
    loading: false,
    detail: {},
    offset: 0,
    total: 0,
    limit: 10,
  },

  effects: {
    * fetch({ offset, limit }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAllDemands, offset, limit);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'saveAll',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchDemandDetail({ reqId }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getDemandDetail, reqId);
      // console.log('获取需求详情响应：', response);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *setDemandStatus({ reqId, status }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(checkDemand, reqId, status);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'changeStatus',
        reqId,
        status,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *setDetailStatus({ reqId, status }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(checkDemand, reqId, status);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'changeStatus2',
        reqId,
        status,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *removeDemand({ reqId }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deleteDemand, reqId);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'remove',
        reqId,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveAll(state, action) {
      return {
        ...state,
        list: action.payload.data,
        total: action.payload.headers['x-content-total'] >> 0,
        offset: action.offset >> 0,
        limit: action.limit >> 0,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    changeStatus(state, action) {
      return {
        ...state,
        list: state.list.map((val) => {
          if (val.id === (action.reqId >> 0)) {
            val.status = action.status;
            return val;
          } else {
            return val;
          }
        }),
      };
    },
    changeStatus2(state, action) {
      return {
        ...state,
        detail: {
          ...state.detail,
          req: { ...state.detail.req, status: action.status },
        },
      };
    },
    remove(state, action) {
      return {
        ...state,
        list: state.list.map(val => (
          val.id !== action.reqId >> 0
        )),
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
