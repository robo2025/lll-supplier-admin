import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { RETURNS_STATUS } from '../../constant/statusList';
import styles from './List.less';


class ReturnsList extends Component {
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
    <Col span={2} className="item vertical">
      {RETURNS_STATUS[data.return_status]}
    </Col>
    <Col span={3} className="extra item vertical">
      <Button
        onClick={() => { onConfirmReturn({ orderId: data.id, status: 3 }); }}
        disabled={data.return_status >> 0 !== 2}
        size="small"
      >确认收货
      </Button>
      <a href={`#/returns/list/detail?orderId=${data.id}`}>查看详情</a>
    </Col>
  </Row>
);

// 退换货Header
const ListHeader = () => (
  <Row gutter={16} className={styles['list-header']}>
    <Col span={15} className="item" >
      退货商品商品明细
    </Col>
    <Col span={2} className="item">
      交易金额
    </Col>
    <Col span={2} className="item">
      退货金额
    </Col>
    <Col span={2} className="item">
      退货状态
    </Col>
    <Col span={3} className="item">
      操作
    </Col>
  </Row>
);

ReturnsList.Header = ListHeader;
export default ReturnsList;
