import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';

const SUPPLIER_SYS_URL = 'http://13.250.57.253:8000/v1/supplier';
const ORDER_URL = 'http://13.250.57.253:8000/v1/order';
const TEST_SUPPLIER_ID = Cookies.getJSON('userinfo').id;

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders() {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;  
  return lyRequest(`${SUPPLIER_SYS_URL}/order?supplier_id=${supplierId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}


/**
 * 获取服务器订单详情
 */
export async function queryOrderDetail({ orderId }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}


// 接单接口
export async function takingOrder({ orderId, status }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}`, {
    method: 'put',    
    headers: {
      Authorization: accessToken,
    },
    data: {
      status,
    },
  });
}

// 开发票接口
export async function openReceipt({ orderId, receiptId, images, remarks }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_URL}/receipt`, {
    method: 'post',    
    headers: {
      Authorization: accessToken,
    },
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
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_URL}/logistics`, {
    method: 'post',    
    headers: {
      Authorization: accessToken,
    },
    data: {
     ...data,
    },
  });
}

// 异常申请接口
export async function submitException({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}`, {
    method: 'put',    
    headers: {
      Authorization: accessToken,
    },
    data: {
     ...data,
    },
  });
}

// 退货单接口
export async function getReturnsOrders() {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order?supplier_id=${supplierId}&is_type=1`, {
    method: 'get',    
    headers: {
      Authorization: accessToken,
    },
  });
}
// 退货单详情接口
export async function getReturnOrderDetail({ orderId }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}&is_type=1`, {
    method: 'get',    
    headers: {
      Authorization: accessToken,
    },
  });
}


// 退款单接口
export async function getRefundOrders() {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order?supplier_id=${supplierId}&is_type=2`, {
    method: 'get', 
    headers: {
      Authorization: accessToken,
    },
  });
}
// 退货单详情接口
export async function getRefundOrderDetail({ orderId }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}&is_type=2`, {
    method: 'get',    
    headers: {
      Authorization: accessToken,
    },
  });
}

// 确认退货接口
export async function confirmReturn({ orderId, status }) {
  const accessToken = Cookies.get('access_token');
  const supplierId = TEST_SUPPLIER_ID;
  return lyRequest(`${SUPPLIER_SYS_URL}/order/${orderId}?supplier_id=${supplierId}`, {
    method: 'put', 
    headers: {
      Authorization: accessToken,
    },
    data: {
      status,
    },
  });
}


/**
 * 搜索接口
 * 
 */
export async function querySearchResults({ 
  guest_order_sn, pay_status, order_status, supplier_name, guest_company_name, start_time, end_time,
 }) {
  const guestOrderSN = guest_order_sn || '';
  const orderStatus = order_status || '';
  const payStatus = pay_status || '';
  const supplierName = supplier_name || '';
  const guestCompanyName = guest_company_name || '';
  const startTime = start_time || '';
  const endTime = end_time || '';

  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_URL}/order?
  guest_order_sn=${guestOrderSN}&pay_status=${payStatus}&order_status=${orderStatus}&supplier_name=${supplierName}&guest_company_name=${guestCompanyName}&start_time=${startTime}&end_time=${endTime}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}
