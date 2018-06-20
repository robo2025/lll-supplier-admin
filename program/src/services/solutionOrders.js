import lyRequest from '../utils/lyRequest';
import { SLN_ORDER_URL, SOLUTION_URL } from '../constant/config';

export async function queryOrders(params) {
    const { offset = 0, limit = 10, is_type = 0, ...others } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/user/order`, {
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
    return lyRequest(`${SLN_ORDER_URL}/v1/user/order/${plan_order_sn}`);
}

export async function prepareGoods(params) {
    const { plan_order_sn, is_type } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/user/order/${plan_order_sn}`, {
        method: 'put',
        data: { is_type },
    });
}
export async function querySolutionDetail(plan_order_sn) {
    return lyRequest('https://api.robo2025.com/slncenter/v1/welding/FA20180611182536001?role=supplier');
}

