import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './List.less';

class ReturnsList extends Component {
  render() {
    const { header } = this.props;

    return (
      <div className={styles.list}>
        {header || null}
        <ListItem />
        <ListItem />
      </div>
    );
  }
};

const ListItem = data => (
  <Row gutter={16} className="list-item">
    <Col span={3} className="item">
      DD1245645687123456
    </Col>
    <Col span={4} className="item">
      精密滚珠丝杆
      BSS1505-[150-1098/1]
    </Col>
    <Col span={3} className="item">
      欧姆龙（OUML）
    </Col>
    <Col span={2} className="item">
      3盒
    </Col>
    <Col span={3} className="item">
      ￥3043.60元/盒
    </Col>
    <Col span={2} className="item vertical amount">
      <span>￥60000.08</span>
    </Col>
    <Col span={2} className="item vertical amount">
      <span className="money">￥50000.08</span>
      <span className="delivery">（含运费：200元）</span>
    </Col>
    <Col span={2} className="item vertical">
      待收货
    </Col>
    <Col span={3} className="extra item vertical">
      <span className="btn">发货</span>
      <span>开票</span>
      <a href="#/returns/list/detail">订单详情</a>
    </Col>
  </Row>
);

// 退换货Header
const ListHeader = data => (
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
