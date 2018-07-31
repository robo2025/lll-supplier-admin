import lyRequest from '../utils/lyRequest';
import { FINANCIAL_URL } from '../constant/config';
import { queryString } from '../utils/tools';

export async function queryBillList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statement?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

export async function queryBillDetail({ code }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statement/${code}`);
}

export async function confirmBill({ code }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statement/confirm`, {
        method: 'put',
        data: { code },
    });
}

export async function queryNotCheckList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statementexdetail/unstatement?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}
export async function queryHaveCheckList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statementexdetail/statement?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

export async function exportExcel({ url, params, offset = 0, limit = 10 }) {
    return lyRequest(`${FINANCIAL_URL}${url}?offset=${offset}&limit=${limit}&export=1&${queryString.toQueryString(params)}`);
}
