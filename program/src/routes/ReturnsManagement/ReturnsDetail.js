import React, { Component } from 'react';
import { Card, Icon, Table, Badge, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { RETURNS_STATUS } from '../../constant/statusList';
import { queryString } from '../../utils/tools';

import styles from './ReturnsDetail.less';

const { Description } = DescriptionList;
// 订单商品明细列
const goodsColumns = [{
  title: '商品编号',
  dataIndex: 'son_order_sn',
  key: 'son_order_sn',
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
  key: 'yh',
  rener: () => (<span>无</span>),
}, {
  title: '商品销售单价',
  key: 'sold_price',
  render: text => (<span>{text.univalent - 0}</span>),
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
// 操作记录列
const columns = [{
  title: '操作时间',
  dataIndex: 'add_time',
  key: 'add_time',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>),
}, {
  title: '操作记录',
  dataIndex: 'execution_detail',
  key: 'execution_detail',
  render: val => <span>{val}</span>,
}, {
  title: '进程',
  dataIndex: 'progress',
  key: 'progress',
}];
const mapOrderProgress = ['processing', 'processing', 'error', 'success'];

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.loading,
}))
export default class ReturnsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
      operationkey: 'tab1',      
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'orders/fetchReturnDetail',
      orderId: args.orderId,
    });
  }

  render() {
    const { orders, loading } = this.props;
    const orderInfo = orders.returnDetail.order_info; // 订单信息
    const returnInfo = orders.returnDetail.return_info;// 退货信息
    const operationRecord = orders.returnDetail.operation_record || [];// 开票信息
    const returnLogistics = orders.returnDetail.return_logistics; // 退货物流信息


    if (!orderInfo) {
      console.log('数据还没来');
      return <Spin />;
    }

    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={loading}
        dataSource={operationRecord}
        columns={columns}
        rowKey="add_time"
      />,
    };

    const descriptionContent = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="状态"><span><Badge status={mapOrderProgress[returnInfo.status - 1]} />{RETURNS_STATUS[returnInfo.status]}</span></Description>
        <Description term="退货金额"><span style={{ color: 'red' }}>￥{returnInfo.returns_money}元</span></Description>
        <Description term="客户订单号">{returnInfo.order_sn}</Description>
        <Description term="运费">包邮</Description>
        <Description term="退货单号">{returnInfo.returns_sn}</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`退货单号：${returnInfo.returns_sn}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={descriptionContent}
      >
        <Card title="退货说明" style={{ marginBottom: 24 }} bordered>
          <div>{orderInfo.remarks || '无'}</div>
        </Card>
        <Card title="退货商品明细" style={{ marginBottom: 24 }} bordered>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={[orderInfo]}
            columns={goodsColumns}
            rowKey="goods_sn"
          />
        </Card>
        <Card title="物流信息" style={{ marginBottom: 24 }} bordered>
          <DescriptionList className={styles.headerList} col="4">
            <Description term="收货人">{returnLogistics.receiver}</Description>
            <Description term="联系号码">{returnLogistics.mobile}</Description>
            <Description term="物流公司">{returnLogistics.logistics_company}</Description>
            <Description term="物流单号">{returnLogistics.logistics_number}</Description>
          </DescriptionList>
        </Card>
        {/* <Card
          bordered
          loading={loading}
          title="操作记录"
          style={{ marginBottom: 24 }}
          onTabChange={this.onOperationTabChange}
        >
         {
            operationRecord.length > 0 ?
              (
                contentList[this.state.operationkey]               
              ) :
              (
                <div className={styles.noData}>
                  <Icon type="smile-o" />暂无记录
                </div>
              )
          }
        </Card> */}
      </PageHeaderLayout>
    );
  }
}

