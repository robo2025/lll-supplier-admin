import lyRequest from '../utils/lyRequest';
import { STOCKLIST_URL } from '../constant/config';
import { queryString } from '../utils/tools';

export async function queryGoodsStockList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${STOCKLIST_URL}/v1/inventory?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

export async function queryGoodsStockRecord({params, offset = 0, limit = 10}) {
    return lyRequest(`${STOCKLIST_URL}/v1/inout?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

export async function queryGoodsStockConfig({params,offset=0,limit=10}) {
    return lyRequest(`${STOCKLIST_URL}/v1/setting?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`)
}

export async function stockConfig({params}) {
    return lyRequest(`${STOCKLIST_URL}/v1/setting`,{
        method:"post",
        data:params
    })
}