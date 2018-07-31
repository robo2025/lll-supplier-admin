import {
    queryGoods,
    queryGoodDetail,
    modifyGoodStatus,
    modifyGoodInfo,
    modifyGoodPrice,
    addGood,
    queryAssociatedProduct,
    queryOperationLog,
    exportGood,
    queryAssociatedProductDetail,
    queryCatalogLevel,
} from '../services/good';
import { SUCCESS_STATUS } from '../constant/config.js';


export default {
    namespace: 'good',

    state: {
        list: [],
        detail: {},
        logs: [],
        total: 0,
        productTotal: 0,
        products: [],
        productDetail: {},
        level: [],
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
        *fetchDetail({ gno, success, error }, { call, put }) {
            const res = yield call(queryGoodDetail, { gno });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); return; }

            yield put({
                type: 'saveDetail',
                payload: res.data,
            });
        },
        *fetchAassociatedProduct({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryAssociatedProduct, { params, offset, limit });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); return; }

            const { headers } = res;
            yield put({
                type: 'saveProduct',
                payload: res.data,
                headers,
            });
        },
        *fetchAassociatedProductDetail({ mno, success, error }, { call, put }) {
            const res = yield call(queryAssociatedProductDetail, { mno });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); return; }

            yield put({
                type: 'saveProductDetail',
                payload: res.data,
            });
        },
        *add({ data, success, error }, { call }) {
            const res = yield call(addGood, { data });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); }
        },
        *modifyInfo({ gno, data, success, error }, { call, put }) {
            const res = yield call(modifyGoodInfo, { gno, data });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); }
        },
        *modifyGoodStatus({ gno, goodStatus, publishType, desc, success, error }, { call }) {
            const res = yield call(modifyGoodStatus, { gno, goodStatus, publishType, desc });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); }
        },
        *modifyPrice({ gno, data, success, error }, { call }) {
            const res = yield call(modifyGoodPrice, { gno, data });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res); }
            } else if (typeof error === 'function') { error(res); }
        },
        *queryLogs({ module, gno, success, error }, { call, put }) {
            const res = yield call(queryOperationLog, { module, gno });
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
        *fetchLevel({ pid, success, error }, { call, put }) {
            const res = yield call(queryCatalogLevel, { pid });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') success(res);
            } else if (typeof error === 'function') { error(res); return; }
            // console.log('服务器目录列表', response);

            yield put({
                type: 'saveLevel',
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
        saveProduct(state, action) {
            return {
                ...state,
                products: action.payload,
                productTotal: action.headers['x-content-total'] >> 0,
            };
        },
        saveProductDetail(state, action) {
            return {
                ...state,
                productDetail: action.payload,
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
        saveLevel(state, action) {
            return {
                ...state,
                level: action.payload,
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/goods/new' && !(/mno/.test(search))) {
                    dispatch({
                        type: 'saveProductDetail',
                        payload: {},
                    });
                }
            });
        },
    },
};
