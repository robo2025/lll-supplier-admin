import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './List.less';

class List extends Component {
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
    <Col span={5} className="item">
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
    <Col span={3} className="item vertical amount">
      <span className="money">￥60000.08</span>
      <span className="delivery">包邮</span>
    </Col>
    <Col span={2} className="item vertical">
      待结单
    </Col>
    <Col span={3} className="extra item vertical">
      <span className="btn">发货</span>
      <span>开票</span>
      <a href="#">订单详情</a>
    </Col>
  </Row>
);

export default List;
