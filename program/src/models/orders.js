import {
  queryOrders,
  queryOrderDetail,
  takingOrder,
  openReceipt,
  deliveryGood,
  submitException,
  getReturnsOrders,
  getRefundOrders,
  confirmReturn,
  getReturnOrderDetail,
  getRefundOrderDetail,
} from '../services/orders';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'orders',

  state: {
    list: [],
    detail: {},
    returns: [],
    refunds: [],
    returnDetail: {},
    refundDetail: {},
    total: 0,
  },

  effects: {
    *fetch({ params, offset, limit, supplierId, success, error }, { call, put }) {
      const res = yield call(queryOrders, { params, supplierId, offset, limit });
      // console.log('服务器目录列表', response);
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
      const { headers } = response;      
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchOpenReceipt({ orderId, receiptId, images, remarks, success, error }, { call, put }) {
      const res = yield call(openReceipt, { orderId, receiptId, images, remarks });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders, {});
      const { headers } = response;            
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchDeliveryGoods({ data, success, error }, { call, put }) {
      const res = yield call(deliveryGood, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders, {});
      const { headers } = response;                  
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchException({ orderId, supplierId, data, success, error }, { call, put }) {
      const res = yield call(submitException, { orderId, supplierId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryOrders, {});
      const { headers } = response;      
      yield put({
        type: 'save',
        payload: response.data,
        headers,
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
    *fetchConfirmReturn({ orderId, status, success, error }, { call, put }) {
      const res = yield call(confirmReturn, { orderId, status });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(getReturnsOrders);
      yield put({
        type: 'saveReturns',
        payload: response.data,
      });
    },
    *fetchReturnDetail({ orderId, success, error }, { call, put }) {
      const res = yield call(getReturnOrderDetail, { orderId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      yield put({
        type: 'saveReturnDetail',
        payload: res.data,
      });
    },
    *fetchRefundDetail({ orderId, success, error }, { call, put }) {
      const res = yield call(getRefundOrderDetail, { orderId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') { success(res); }
      } else if (typeof error === 'function') { error(res); }

      yield put({
        type: 'saveRefundDetail',
        payload: res.data,
      });
    },
    *fetchSearch({ params, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryOrders, { params, offset, limit });
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
    saveReturnDetail(state, action) {
      return {
        ...state,
        returnDetail: action.payload,
      };
    },
    saveRefundDetail(state, action) {
      return {
        ...state,
        refundDetail: action.payload,
      };
    },
  },
};
