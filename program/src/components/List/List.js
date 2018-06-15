import React, { Component } from 'react';
import { Row, Col, Tooltip, Badge } from 'antd';
import { ORDER_STATUS, ABNORMAL_TYPE } from '../../constant/statusList';
import styles from './List.less';

const mapOrderProgress = [
  'default', 'error', 'processing', 'processing', 'processing',
  'success', 'default', 'processing', 'processing', 'processing',
  'processing', 'error', 'warning', 'success', 'success',
];

class List extends Component {
  render() {
    const { header, data, bindModalClick, handleTakingClick } = this.props;

    return (
      <div className={styles.list}>
        {header || null}
        {
          data.map((val, idx) => (
            <ListItem
              key={idx}
              data={val}
              onSendClick={bindModalClick}
              onTakingClick={handleTakingClick}
              onOpenReceiptClick={bindModalClick}
              onExceptionClick={bindModalClick}
            />
          ))
        }
      </div>
    );
  }
}

const action = ({
  status,
  onSendClick,
  onTakingClick,
  id,
  orderSn,
  data,
  onOpenReceiptClick,
  onExceptionClick }) => {
  if (status === 3) { // 待结单
    return (
      <React.Fragment>
        <span className="btn taking" onClick={() => { onTakingClick({ orderId: id, supplierId: 100, status: 2 }); }}>接单</span>
        <span className="btn exception" onClick={() => { onExceptionClick('isShowExceptionModal', id, data); }}>异常处理</span>
      </React.Fragment>
    );
  } else if (status === 4) { // 代发货
    return (
      <span className="btn send" onClick={() => { onSendClick('isShowDeliveryModal', orderSn, data); }}>发货</span>
    );
  } else if (status === 5) { // 已发货，配送中
    // return (
    //   <span
    //     className="open-receipt-btn"
    //     onClick={() => { onOpenReceiptClick('isShowOpenModal', orderSn, data); }}

    //   >开票
    //   </span>
    // );
  } else {
    return null;
  }
};

const ListItem = ({ data, onSendClick, onTakingClick, onOpenReceiptClick, onExceptionClick }) => (
  <Row gutter={16} className="list-item">
    <Col span={3} className="item">
      <Tooltip placement="top" title={data.goods_sn}>
        {data.goods_sn}
      </Tooltip>
    </Col>
    <Col span={5} className="item">
      <Tooltip placement="topLeft" title={`${data.goods_name} / ${data.model}`}>
        {data.goods_name}&nbsp;/&nbsp;{data.model}
      </Tooltip>
    </Col>
    <Col span={3} className="item">
      {data.brand}
    </Col>
    <Col span={2} className="item">
      {data.number}{data.goods_unit}
    </Col>
    <Col span={3} className="item">
      ￥{data.univalent}元/{data.goods_unit}
    </Col>
    <Col span={3} className="item vertical amount">
      <span className="money">￥{data.subtotal_money}</span>
      <span className="delivery">包邮</span>
    </Col>
    <Col span={2} className="item vertical">
      <Badge status={mapOrderProgress[data.status - 1]} />
      <span
        title={`${ORDER_STATUS[data.status]}${ABNORMAL_TYPE[data.abnormal_type]}`}
      >
        {ORDER_STATUS[data.status]}{ABNORMAL_TYPE[data.abnormal_type]}
      </span>

    </Col>
    <Col span={3} className="extra item vertical">
      {
        action({
          data,
          id: data.id,
          status: data.status,
          onSendClick,
          onTakingClick,
          orderSn: data.son_order_sn,
          onOpenReceiptClick,
          onExceptionClick,
        })
      }
      <a href={`#/deal/orders/detail?id=${data.id}`}>订单详情</a>
    </Col>
  </Row >
);

// 订单Header
const ListHeader = () => (
  <Row gutter={16} className={styles['list-header']}>
    <Col span={3} className="item">
      商品ID
    </Col>
    <Col span={5} className="item">
      商品名称&nbsp;/&nbsp;型号
    </Col>
    <Col span={3} className="item">
      品牌
    </Col>
    <Col span={2} className="item">
      数量
    </Col>
    <Col span={3} className="item">
      单价
    </Col>
    <Col span={3} className="item">
      订单总计
    </Col>
    <Col span={2} className="item">
      订单状态
    </Col>
    <Col span={3} className="item">
      操作
    </Col>
  </Row>
);

List.Header = ListHeader;


export default List;
