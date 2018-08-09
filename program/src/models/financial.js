import { queryBillList, queryBillDetail, confirmBill, queryNotCheckList, queryHaveCheckList, exportExcel } from '../services/financial';
import { FINANCIAL_URL } from '../constant/config';

export default {
    namespace: 'financial',
    state: {
        billList: [],
        billTotal: 0,
        billDetail: {},
        notChecklist: [],
        notCheckTotal: 0,
        haveCheckList: [],
        haveCheckTotal: 0,
    },
    effects: {
        *fetchBillList({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryBillList, { params, offset, limit });
            const { rescode, headers } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                } 
            } else if (error) {
                error(res);
            }
            yield put({
                type: 'saveBillTotal',
                payload: res.data,
                headers,
            });
        },
        *fetchBillDetail({ code, success, error }, { call, put }) {
            const res = yield call(queryBillDetail, { code });
            const rescode = { res };
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                } 
            } else if (error) {
                error(res);
            }
            yield put({
                type: 'saveBillDetail',
                payload: res.data,
            });
        },
        *fetchConfirmBill({ code, success, error }, { call }) {
            const res = yield call(confirmBill, { code });
            const { rescode } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                } 
            } else if (error) {
                error(res);
            }
        },
        *fetchNotCheckList({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryNotCheckList, { params, offset, limit });
            const { rescode, headers } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res, headers);
                } 
            } else if (error) {
                error(res);
            }
            yield put({
                type: 'saveNotCheck',
                payload: res.data,
                headers,
            });
        },
        *fetchHaveCheckList({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryHaveCheckList, { params, offset, limit });
            const { rescode, headers } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res, headers);
                } 
            } else if (error) {
                error(res);
            }
            yield put({
                type: 'saveHaveCheck',
                payload: res.data,
                headers,
            });
        },
        *fetchExportExcel({ url, offset, limit, params, success, error }, { call }) {
            const res = yield call(exportExcel, { url, params, offset, limit });
            const { rescode } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res, FINANCIAL_URL);
                }
            } else if (error) {
                error(res);
            }
        },
    },
    reducers: {
        saveBillTotal(state, action) {
            return {
                ...state,
                billList: action.payload,
                billTotal: action.headers['x-content-total'],
            };
        },
        saveBillDetail(state, action) {
            return {
                ...state,
                billDetail: action.payload,
            };
        },
        saveNotCheck(state, action) {
            return {
                ...state,
                notChecklist: action.payload,
                notCheckTotal: action.headers['x-content-total'] >> 0,
            };
        },
        saveHaveCheck(state, action) {
            return {
                ...state,
                haveCheckList: action.payload,
                haveCheckTotal: action.headers['x-content-total'] >> 0,
            };
        },
    },
};
