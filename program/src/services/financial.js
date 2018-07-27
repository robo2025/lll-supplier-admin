import lyRequest from '../utils/lyRequest';
import { FINANCIAL_URL } from '../constant/config';
import { queryString } from '../utils/tools';

export async function queryBillList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${FINANCIAL_URL}/v1/financial/sup/statement?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}
