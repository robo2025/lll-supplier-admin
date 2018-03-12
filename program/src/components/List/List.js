import { Button } from 'antd';
import React, { Component } from 'react';
import styles from './List.less';

export default class List extends Component {
  render() {
    const { header } = this.props;

    return (
      <div className={styles.list}>
        {header || null}
        <div className="list-item">
          <div className="td type">
            c1245645687
          </div>
          <div className="td title">
            精密滚珠丝杆
            BSS1505-[150-1098/1]
          </div>
          <div className="td brand">
            欧姆龙（OUML）
          </div>
          <div className="td unit">
            3盒
          </div>
          <div className="td price">
            ￥3043.60元/盒
          </div>
          <div className="td vertical amount">
            <span>￥6000008</span>
            <i>包邮</i>
          </div>
          <div className="td vertical status">
            待结单
          </div>
          <div className="td vertical extra">
              <span className="btn">发货</span>
              <span>发货</span>
              <a href="#">订单详情</a>
          </div>
        </div>
      </div>
    );
  }
}
