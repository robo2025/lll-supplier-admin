import { queryGoodsStockList, queryGoodsStockRecord, queryGoodsStockConfig, stockConfig } from "../services/stock";
import { SUCCESS_STATUS } from '../constant/config';
export default {
    namespace: 'stock',
    state: {
        goodsStockList: [],
        stockRecord: [],
        stockConfigList: [],
        total: 0,
        recordTotal: 0,
        configTotal: 0

    },
    effects: {
        *fetch({ offset, limit, params, success, error }, { call, put }) {
            const res = yield call(queryGoodsStockList, { offset, limit, params });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); }
            const { headers } = res;
            yield put({
                type: "save",
                payload: res.data,
                headers,
            })
        },
        *fetchRecord({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryGoodsStockRecord, { params, offset, limit });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res) }
            } else if (typeof error === 'function') { error(res) }
            const { headers } = res;
            yield put({
                type: "saveRecord",
                payload: res.data,
                headers
            })
        },
        *fetchConfig({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryGoodsStockConfig, { params, offset, limit });
            const { headers } = res;
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res) }
            } else if (typeof error === 'function') { error(res) }
            yield put({
                type: "saveConfig",
                payload: res.data,
                headers
            })
        },
        *fetchSettingConfig({ params, success, error }, { call }) {
            const res = yield call(stockConfig, { params });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res) }
            } else if (typeof error === 'function') { error(res) }
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                goodsStockList: action.payload,
                total: action.headers['x-content-total'] >> 0
            }
        },
        saveRecord(state, action) {
            return {
                ...state,
                stockRecord: action.payload,
                recordTotal: action.headers['x-content-total'] >> 0
            }
        },
        saveConfig(state, action) {
            return {
                ...state,
                stockConfigList: action.payload,
                configTotal: action.headers['x-content-total'] >> 0
            }
        }
    }
}