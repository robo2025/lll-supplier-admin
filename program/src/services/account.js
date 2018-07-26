import lyRequest from '../utils/lyRequest';
import { ACCOUNT_URL } from '../constant/config';
import { queryString } from '../utils/tools';

export async function queryAccountList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${ACCOUNT_URL}?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

export async function queryAccountDetail({ user_id }) {
    return lyRequest(`${ACCOUNT_URL}/${user_id}`);
}

export async function modifyPassword({ user_id, params }) {
    return lyRequest(`${ACCOUNT_URL}/${user_id}/password`, {
        method: 'put',
        data: params,
    });
}
