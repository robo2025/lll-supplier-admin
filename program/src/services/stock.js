import lyRequest from '../utils/lyRequest';
import { STOCKLIST_URL,ID_GENERATION } from '../constant/config';
import { queryString } from '../utils/tools';

// 获取商品库存列表
export async function queryGoodsStockList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${STOCKLIST_URL}/v1/inventory?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

// 获取库存记录
export async function queryGoodsStockRecord({params, offset = 0, limit = 10}) {
    return lyRequest(`${STOCKLIST_URL}/v1/inout?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

// 进出库操作
export async function inOutOperation({params}) {
    return lyRequest(`${STOCKLIST_URL}/v1/inout`,{
        methods:"post",
        data:params
    })
}

// ID生成器生成ID
export async function inOutIDGeneration({params}){
    return lyRequest(`${ID_GENERATION}/api/${params}`,{
        methods:"post",
        data:{}
    }) 
}


