import { queryGoods, queryGoodDetail, modifyGoodStatus, modifyGoodInfo, modifyGoodPrice, addGood, queryOperationLog, exportGood } from '../services/good';
import { SUCCESS_STATUS } from '../constant/config.js';


export default {
  namespace: 'good',

  state: {
    list: [],
    detail: {},
    logs: [],
    total: 0,
  },

  effects: {
    *fetch({ params, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryGoods, { params, offset, limit });
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
    *fetchDetail({ goodId, success, error }, { call, put }) {
      const res = yield call(queryGoodDetail, { goodId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
    *add({ data, success, error }, { call, put }) {
      const res = yield call(addGood, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryGoods);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
    },
    *modifyInfo({ goodId, data, success, error }, { call, put }) {
      const res = yield call(modifyGoodInfo, { goodId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryGoods);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *modifyGoodStatus({ goodId, goodStatus, publishType, desc, success, error }, { call, put }) {
      const res = yield call(modifyGoodStatus, { goodId, goodStatus, publishType, desc });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryGoods);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *modifyPrice({ goodId, data, success, error }, { call, put }) {
      const res = yield call(modifyGoodPrice, { goodId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryGoods);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *queryLogs({ module, goodId, success, error }, { call, put }) {
      const res = yield call(queryOperationLog, { module, goodId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'logs',
        payload: res.data,
      });
    },
    *queryExport({ fields, success, error }, { call, put }) {
      const res = yield call(exportGood, { fields });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'export',
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
    saveOne(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    modify(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    remove(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    logs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
    export(state, action) {
      return {
        ...state,
        export: action.payload,
      };
    },
  },
};
