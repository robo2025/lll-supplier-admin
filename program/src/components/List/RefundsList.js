import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { REFUND_STATUS } from '../../constant/statusList';
import styles from './List.less';

const mapRefundStatus = ['等待退款', '退款完成'];
const mapRefundProgress = [{ color: '#2395FF' }, { color: '#52C41A' }];

class RefundsList extends Component {
  render() {
    const { header, data, onConfirmReturn } = this.props;
    return (
      <div className={styles.list}>
        {header || null}
        <ListItem data={data} onConfirmReturn={onConfirmReturn} />
      </div>
    );
  }
}


const ListItem = ({ data, onConfirmReturn }) => (
  <Row gutter={16} className="list-item">
    <Col span={3} className="item">
      {data.order_sn}
    </Col>
    <Col span={4} className="item">
      {data.goods_name}
    </Col>
    <Col span={3} className="item">
      {data.brand}
    </Col>
    <Col span={2} className="item">
      {data.number}盒
    </Col>
    <Col span={3} className="item">
      ￥{data.univalent}元/盒
    </Col>
    <Col span={2} className="item vertical amount">
      <span>￥{data.subtotal_money}</span>
    </Col>
    <Col span={2} className="item vertical amount">
      <span className="money">￥{data.subtotal_money - 0}</span>
      <span className="delivery">（含运费：0元）</span>
    </Col>
    <Col span={2} className="item vertical" style={mapRefundProgress[data.status - 1]}>
      {REFUND_STATUS[data.refund_status]}
    </Col>
    <Col span={3} className="extra item vertical">
      {/* <span
        className="btn"
        onClick={() => { onConfirmReturn({ orderId: data.id, status: 3 }); }}
      >
        确认收货
      </span> */}
      <a href={`#/refunds/list/detail?orderId=${data.id}`}>查看详情</a>
    </Col>
  </Row>
);

// 退换货Header
const ListHeader = () => (
  <Row gutter={16} className={styles['list-header']}>
    <Col span={15} className="item" >
      退款商品商品明细
    </Col>
    <Col span={2} className="item">
      交易金额
    </Col>
    <Col span={2} className="item">
      退款金额
    </Col>
    <Col span={2} className="item">
      退款状态
    </Col>
    <Col span={3} className="item">
      操作
    </Col>
  </Row>
);

RefundsList.Header = ListHeader;
export default RefundsList;
