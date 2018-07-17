import { queryGoodsStockList, queryGoodsStockRecord, inOutOperation, inOutIDGeneration } from "../services/stock";
import { SUCCESS_STATUS } from '../constant/config';
export default {
    namespace: 'stock',
    state: {
        goodsStockList: [],
        stockRecord: [],
        total: 0,
        recordTotal: 0,
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
        *inOutOperation({ params, success, error }, { call, put }) {
            const res = yield call(inOutOperation, { params });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res) }
            } else if (typeof error === 'function') { error(res) }
        },
        *fetchIDGeneration({ params,success,error }, { call }) {
            const res = yield call(inOutIDGeneration, { params });
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
    }
}