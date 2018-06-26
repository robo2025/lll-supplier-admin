import lyRequest from '../utils/lyRequest';
import { SLN_ORDER_URL, SOLUTION_URL } from '../constant/config';

export async function queryOrders(params) {
    const { offset = 0, limit = 10, is_type = 0, ...others } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/supplier/order`, {
        params: {
            offset,
            limit,
            is_type,
            ...others,
        },
    });
}

export async function queryDetail(params) {
    const { plan_order_sn } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/supplier/order/${plan_order_sn}`);
}

export async function prepareGoods(params) {
    const { plan_order_sn, is_type } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/supplier/order/${plan_order_sn}`, {
        method: 'put',
        data: { is_type },
    });
}
export async function delivery(params) {
    const { plan_order_sn, mobile, logistics_company, logistics_number, sender } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/supplier/order/${plan_order_sn}`, {
        method: 'put',
        data: { mobile, logistics_company, logistics_number, sender, plan_order_sn, is_type: 2 },
    });
}

export async function querySolutionDetail(plan_order_sn) {
    return lyRequest(`${SOLUTION_URL}/v1/sln/${plan_order_sn}?role=supplier`);
}
