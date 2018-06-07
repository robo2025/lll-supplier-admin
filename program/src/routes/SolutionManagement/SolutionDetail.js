import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Spin, Table, Divider, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './SolutionOrderDetail.less';

const { Description } = DescriptionList;
const extra = (
  <Row>
    <Col xs={24} sm={15}>
      <div>状态</div>
      <div style={{ fontSize: 20, color: 'red' }}>未报价</div>
    </Col>
  </Row>
);
const columns = [
  {
    title: '组成部分',
    dataIndex: 'son_order_sn',
    key: 'son_order_sn',
  },
  {
    title: '商品名称',
    dataIndex: 'goods_name',
    key: 'goods_name',
  },
  {
    title: '型号',
    dataIndex: 'model',
    key: 'model',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '数量',
    dataIndex: 'max_delivery_time',
    key: 'max_delivery_time',
    render: text => <span>{text}天</span>,
  },
  {
    title: '单价（元）',
    dataIndex: 'univalent',
    key: 'univalent',
  },
  {
    title: '小计（元）',
    dataIndex: 'price_discount',
    key: 'price_discount',
    rener: () => <span>无</span>,
  },
  {
    title: '备注',
    key: 'sold_price',
    render: text => <span>{text.univalent - 0}</span>,
  },
];
@connect(({ solution, loading }) => ({
  profile: solution.profile,
  loading: loading.models.solution,
}))
class SolutionDetail extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetchDetail',
      payload: location.href.split('/').pop(),
    });
  }
  render() {
    const { profile, loading } = this.props;
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">焊接</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 18 }}>￥600000.00 </span>
        </Description>
        <Description term="方案编号">FABH8378824</Description>
        <Description term="意向付款比例">30%</Description>
        <Description term="创建时间">2017-01-10 10:21:34</Description>
        <Description term="客户备注">请于两个工作日内报价</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title="方案询价单号：FAXJ201805121021001"
        // title={`单号：${subOrder.son_order_sn}`}
        logo={
          <img
            alt="logo"
            src="https://imgcdn.robo2025.com/login/robotImg.jpg"
          />
        }
        content={headContent}
        extraContent={extra}
      >
        <Card title="用户信息">
        helloword
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default SolutionDetail;
