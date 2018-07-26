import {
    queryAccountList,
    queryAccountDetail,
    modifyPassword,
} from '../services/account';

export default {
    namespace: 'account',
    state: {
        accountList: [],
        accountDeatil: {},
        accountTotal: 0,
    },
    effects: {
        *fetchAccountList({ params, offset, limit, success, error }, { call, put }) {
            const res = yield call(queryAccountList, { params, offset, limit });
            const { rescode } = res.rescode;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                }
            } else if (error) {
                error(res);
            }
            const { headers } = res;
            yield put({
                type: 'saveAccountList',
                payload: res.data,
                headers,
            });
        },
        *fetchAccontDetail({ user_id, success, error }, { call, put }) {
            const res = yield call(queryAccountDetail, { user_id });
            const { rescode } = res.rescode;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                }
            } else if (error) {
                error(res);
            }
            yield put({
                type: 'saveAccountDetail',
                payload: res.data,
            });
        },
        *fetchModifyPassword({ user_id, params, success, error }, { call }) {
            const res = yield call(modifyPassword, { user_id, params });
            const { rescode } = res;
            if (rescode >> 0 === 10000) {
                if (success) {
                    success(res);
                }
            } else if (error) {
                error(res);
            }
        },
    },
    reducers: {
        saveAccountList(state, action) {
            return {
                ...state,
                accountList: action.payload,
                accountTotal: action.headers['x-content-total'] >> 0,
            };
        },
        saveAccountDetail(state, action) {
            return {
                ...state,
                accountDeatil: action.payload,
            };
        },
    },
};
