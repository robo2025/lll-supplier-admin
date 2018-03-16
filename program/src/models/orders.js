import {
  queryOrders,
  queryOrderDetail,
  takingOrder,
  openReceipt,
  deliveryGood,
  submitException,
  getReturnsOrders,
  getRefundOrders,
} from '../services/orders';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'orders',

  state: {
    list: [],
    detail: {},
    returns: [],
    refunds: [],
  },

  effects: {
    *fetch({ supplierId, success, error }, { call, put }) {
      const res = yield call(queryOrders, { supplierId });
      // console.log('服务器目录列表', response);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchDetail({ orderId, supplierId, success, error }, { call, put }) {
      const res = yield call(queryOrderDetail, { orderId, supplierId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
    *modifyStatus({ orderId, supplierId, status, success, error }, { call, put }) {
      const res = yield call(takingOrder, { orderId, supplierId, status });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrders, { supplierId });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchOpenReceipt({ orderId, receiptId, images, remarks, success, error }, { call, put }) {
      const res = yield call(openReceipt, { orderId, receiptId, images, remarks });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDeliveryGoods({ data, success, error }, { call, put }) {
      const res = yield call(deliveryGood, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchException({ orderId, supplierId, data, success, error }, { call, put }) {
      const res = yield call(submitException, { orderId, supplierId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchReturns({ success, error }, { call, put }) {
      const res = yield call(getReturnsOrders);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      yield put({
        type: 'saveReturns',
        payload: res.data,
      });
    },
    *fetchRefunds({ success, error }, { call, put }) {
      const res = yield call(getRefundOrders);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      yield put({
        type: 'saveRefunds',
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
    saveReturns(state, action) {
      return {
        ...state,
        returns: action.payload,
      };
    },
    saveRefunds(state, action) {
      return {
        ...state,
        refunds: action.payload,
      };
    },
  },
};
