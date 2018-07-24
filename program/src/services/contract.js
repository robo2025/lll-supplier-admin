import {CONTRACT_URL} from "../constant/config";
import lyRequest from "../utils/lyRequest";
import {queryString} from '../utils/tools';

//请求合同列表
export async function queryContractList({params, offset = 0, limit = 10}) {
    return lyRequest(`${CONTRACT_URL}?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`)
}
// 请求合同详情
export async function queryContractDetail({id}) {
    return lyRequest(`${CONTRACT_URL}/${id}`)
}