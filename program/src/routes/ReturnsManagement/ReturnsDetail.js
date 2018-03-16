import React, { Component } from 'react';
import { Card, Icon, Table, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './ReturnsDetail.less';

const { Description } = DescriptionList;
// 订单商品明细列
const goodsColumns = [{
  title: '商品编号',
  dataIndex: 'goods_sn',
  key: 'goods_sn',
}, {
  title: '商品名称',
  dataIndex: 'goods_name',
  key: 'goods_name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '发货日',
  dataIndex: 'max_delivery_time',
  key: 'max_delivery_time',
  render: text => (<span>{text}天</span>),
}, {
  title: '单价',
  dataIndex: 'univalent',
  key: 'univalent',
}, {
  title: '单价优惠',
  dataIndex: 'price_discount',
  key: 'price_discount',
}, {
  title: '商品销售单价',
  key: 'sold_price',
  render: text => (<span>{text.univalent - text.price_discount}</span>),
}];
// 发货记录列
const logisticsColumns = [{
  title: '商品ID',
  dataIndex: 'good_sn',
  key: 'good_sn',
}, {
  title: '商品名称',
  dataIndex: 'good_name',
  key: 'good_name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '发货日期',
  dataIndex: 'delivery',
  key: 'delivery',
}, {
  title: '送货人',
  dataIndex: 'delivery_man',
  key: 'delivery_man',
}, {
  title: '联系号码',
  dataIndex: 'mobile',
  key: 'mobile',
}, {
  title: '物流公司',
  dataIndex: 'delivery_company',
  key: 'delivery_company',
}, {
  title: '物流单号',
  dataIndex: 'delivery_id',
  key: 'delivery_id',
}];

export default class OrderDetail extends Component {
  render() {
    const descriptionContent = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="状态"><span><Badge status="success" />待收货</span></Description>
        <Description term="退货金额"><span style={{ color: 'red' }}>￥168，702.00元</span></Description>
        <Description term="客户订单号">DD1611060005</Description>
        <Description term="运费">包邮</Description>
        <Description term="退货单号">TH1611060005</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title="退货单号：TH1611060005"
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={descriptionContent}
      >
        <Card title="退货说明" style={{ marginBottom: 24 }} bordered>
          <div>买多了，想要退掉！</div>
        </Card>
        <Card title="退货商品明细" style={{ marginBottom: 24 }} bordered>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={[]}
            columns={goodsColumns}
            rowKey="goods_sn"
          />
        </Card>
        <Card title="物流信息" style={{ marginBottom: 24 }} bordered>
          <DescriptionList className={styles.headerList} col="4">
            <Description term="送货人">天阙子</Description>
            <Description term="联系号码">1886688778</Description>
            <Description term="物流公司">量子快递</Description>
            <Description term="物流单号">YHX00101011101</Description>
          </DescriptionList>
        </Card>
        <Card title="操作记录" style={{ marginBottom: 24 }} bordered>
          <div className={styles.noData}>
            <Icon type="smile-o" />暂无记录
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

