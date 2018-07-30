import { queryBillList } from '../services/financial';

export default {
    namespace: 'financial',
    state: {
        billList: [],
        billTotal: 0,
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
    },
    reducers: {
        saveBillTotal(state, action) {
            return {
                ...state,
                billList: action.payload,
                billTotal: action.headers['x-content-total'],
            };
        },
    },
};
