import Cookies from 'js-cookie';
import qs from 'qs';
import { ORDERS_URL } from '../constant/config';
import lyRequest from '../utils/lyRequest';
import { queryString } from '../utils/tools';

const SUPPLIER_SYS_URL = `${ORDERS_URL}/v1/supplier`;
const ORDER_URL = `${ORDERS_URL}/v1/order`;
const TEST_SUPPLIER_ID = Cookies.getJSON('userinfo').id;

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders({ params, offset = 0, limit = 10 }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

/**
 * 获取服务器订单详情
 */
export async function queryOrderDetail({ orderId }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}`);
}


// 接单接口
export async function takingOrder({ orderId, status }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      status,
    },
  });
}

// 开发票接口
export async function openReceipt({ orderId, receiptId, images, remarks }) {
  return lyRequest(`${ORDER_URL}/receipt`, {
    method: 'post',
    data: {
      order_sn: orderId,
      receipt_sn: receiptId,
      images,
      remarks,
    },
  });
}

// 发货接口
export async function deliveryGood({ data }) {
  return lyRequest(`${ORDER_URL}/logistics`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}

// 异常申请接口
export async function submitException({ orderId, data }) {
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

// 退货单列表接口
export async function getReturnsOrders({ offset = 0, limit = 10, params = {} }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order?offset=${offset}&limit=${limit}&is_type=1&${qs.stringify(params)}`);
}
// 退货单详情接口
export async function getReturnOrderDetail({ orderId }) {
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}&is_type=1`);
}

// 退款单列表接口
export async function getRefundOrders({ params = {}, offset = '0', limit = '10' }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order?offset=${offset}&limit=${limit}&is_type=2&${qs.stringify(params)}`);
}

// 退货单详情接口
export async function getRefundOrderDetail({ orderId }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?is_type=2`);
}

// 确认退货接口
export async function confirmReturn({ orderId, status }) {
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      status,
    },
  });
}

