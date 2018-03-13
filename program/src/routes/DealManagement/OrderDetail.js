import React, { Component } from 'react';
import { Card, Icon, Table, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './OrderDetail.less';

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
        <Description term="状态"><span><Badge status="success" />已完成</span></Description>        
        <Description term="订单总金额">￥168，702.00元</Description>
        <Description term="运费">包邮</Description>        
        <Description term="实收总金额"><span style={{ color: 'red' }}>￥168，702.00元</span></Description>
        <Description term="生效日期">2017-07-07 16:46</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout 
        title="订单编号：DD1611060005"
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={descriptionContent}
      >
        <Card title="收货方式：配送" style={{ marginBottom: 24 }} bordered>
          <div>收货人：张三</div>
          <div>联系电话：13574488306</div>
          <div>地址：湖南长沙岳麓区桃子湖路口</div>
        </Card>
        <Card title="支付方式：在线网银" style={{ marginBottom: 24 }} bordered>
          <div>长沙银行：已支付</div>
        </Card>
        <Card title="开票信息" style={{ marginBottom: 24 }} bordered>
          <DescriptionList col={3}>
            <Description term="公司全称(抬头)">长沙孚中数据科技</Description>
            <Description term="公司账户">43048219912450145100</Description>
            <Description term="税务编号">94545111111123SD445DF</Description>
            <Description term="公司电话">0731-7600216</Description>
            <Description term="开户银行">中国建设银行某某支行</Description>
            <Description term="公司地址">随便寄就行</Description>
          </DescriptionList>
        </Card>
        <Card title="商品明细" style={{ marginBottom: 24 }} bordered>
          <Table
              style={{ marginBottom: 24 }}
              pagination={false}
              loading={false}
              dataSource={[]}
              columns={goodsColumns}
              rowKey="goods_sn"
          />
        </Card>
        <Card title="发货记录" style={{ marginBottom: 24 }} bordered>
          <Table
              style={{ marginBottom: 24 }}
              pagination={false}
              loading={false}
              dataSource={[]}
              columns={logisticsColumns}
              rowKey="good_sn"
          />
        </Card>
        <Card title="发票信息" style={{ marginBottom: 24 }} bordered>
          <DescriptionList col={3}>
            <Description term="公司全称(抬头)">长沙孚中数据科技</Description>
            <Description term="公司账户">43048219912450145100</Description>
            <Description term="税务编号">94545111111123SD445DF</Description>
            <Description term="公司电话">0731-7600216</Description>
            <Description term="开户银行">中国建设银行某某支行</Description>
            <Description term="公司地址">随便寄就行</Description>
          </DescriptionList>
        </Card>
        <Card title="买方备注" style={{ marginBottom: 24 }} bordered>
          <div className={styles.noData}>
              <Icon type="smile-o" />买家没有添加备注
          </div>
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

