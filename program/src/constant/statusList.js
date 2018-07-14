// 江朝 操作记录 status 字段说明
const ACTION_STATUS = {
  1: '提交订单',
  2: '支付订单',
  3: '取消订单',
  4: '待结单',
  5: '接单',
  6: '发货',
  7: '客户确认收货',
  8: '申请无货',
  9: '确认延期',
  10: '申请延期',
  11: '系统生成退款单',
  12: '提交退货申请',
  13: '退货审核通过',
  14: '供应商确认收货',
  15: '确认退款',
  16: '处理无货订单',
  17: '填写退货物流',
  18: '退货审核失败',
};

// 刘彪 操作记录类型
const ACTION_FLAG = {
  1: '新增',
  2: '修改',
  4: '审核',
  8: '发布',
  16: '删除',
};

// 异常状态
const ABNORMAL_TYPE = {
  0: '',
  1: '(无货)',
  2: '(延期)',
};


// 订单状态
const ORDER_STATUS = {
  1: '待支付',
  2: '订单已取消',
  3: '待接单',
  4: '待发货',
  5: '已发货,配送中',
  6: '已完成',
  8: '延期申请中',
  10: '退款中',
  11: '退货中',
  12: '作废',
  13: '无货申请中',
  14: '已退款完成',
  15: '已退货完成',
  16: '订单流转结束',
};

// 支付类型
const PAY_STATUS = {
  1: '微信支付',
  2: '支付宝支付',
  3: '银联支付',
  4: '其它方式支付',
};

// 退货单状态
const RETURNS_STATUS = {
  1: '申请退货中',
  2: '退货中',
  3: '退货失败',
  4: '退货完成',
};

// 退款单状态
const REFUND_STATUS = {
  1: '等待退款',
  2: '退款完成',
};

// 责任方说明
const RESPONSIBLE_PARTY = {
  1: '客户',
  2: '供应商',
  3: '平台',
};

// 母订单状态
const MONTHER_ORDER_STATUS = {
  1: '未支付',
  2: '全部支付',
  3: '部分支付',
  4: '已取消',
  5: '部分发货',
  6: '全部发货',
};

const PIC_TYPES = {
  1: '正面',
  2: '反面',
  3: '侧面',
  4: '包装图一',
  5: '包装图二',
  6: '包装图三',
};

const SHIPPING_FEE_TYPE = {
  1: '包邮',
  2: '货到付款',
};

const AUDIT_STATUS = {
  0: '未审核',
  1: '审核通过',
  2: '审核不通过',
};

const PUBLISH_STATUS = {
  0: '下架中',
  1: '上架中',
  2: '待下架(无法交易)',
};

// 方案支付状态
const SLN_PAY_STATUS = {
  2: '尾款未支付',
  3: '已全部支付',
  4: '订单已取消',
};
// 入库操作类型
const STOCK_OPERATION_TYPE = {
    I:"入库",
    O:"调拨"
}
export {
  ACTION_STATUS,
  ACTION_FLAG,
  ABNORMAL_TYPE,
  ORDER_STATUS,
  PAY_STATUS,
  RETURNS_STATUS,
  REFUND_STATUS,
  RESPONSIBLE_PARTY,
  MONTHER_ORDER_STATUS,
  PIC_TYPES,
  SHIPPING_FEE_TYPE,
  AUDIT_STATUS,
  PUBLISH_STATUS,
  SLN_PAY_STATUS,
  STOCK_OPERATION_TYPE
};
