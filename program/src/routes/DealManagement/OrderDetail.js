import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Card, Icon, Table, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { queryString } from '../../utils/tools';
import { ORDER_STATUS, PAY_STATUS } from '../../constant/statusList';
import styles from './OrderDetail.less';

const mapPayStatus = ['未支付', '已支付'];
const { Description } = DescriptionList;
// 订单商品明细列
const goodsColumns = [{
  title: '商品编号',
  dataIndex: 'goods_id',
  key: 'goods_id',
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
  render: () => (<span>0</span>),
}, {
  title: '商品销售单价',
  key: 'sold_price',
  render: text => (<span>{text.univalent - 0}元</span>),
}];
// 发货记录列
const logisticsColumns = [{
  title: '商品ID',
  dataIndex: 'goods_id',
  key: 'goods_id',
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
  title: '发货日期',
  dataIndex: 'add_time',
  key: 'add_time',
  render: val => (<span>{moment(val * 1000).format('YYYY-MM-DD h:mm:ss')}</span>),
}, {
  title: '送货人',
  dataIndex: 'sender',
  key: 'sender',
  render: text => (<span>{text || '---'}</span>),
}, {
  title: '联系号码',
  dataIndex: 'mobile',
  key: 'mobile',
}, {
  title: '物流公司',
  dataIndex: 'logistics_company',
  key: 'logistics_company',
}, {
  title: '物流单号',
  dataIndex: 'logistics_number',
  key: 'logistics_number',
}];
// 操作记录列
const columns = [{
  title: '操作员',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '操作记录',
  dataIndex: 'execution_detail',
  key: 'execution_detail',
  render: val => <span>{val}</span>,
}, {
  title: '进程',
  dataIndex: 'progress',
  key: 'progress',
}, {
  title: '操作时间',
  dataIndex: 'add_time',
  key: 'add_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}];
// 发票列
const receiptColumns = [{
  title: '发票编号',
  dataIndex: 'receipt_sn',
  key: 'receipt_sn',
}, {
  title: '发票照片',
  dataIndex: 'images',
  key: 'images',
  render: text => (text ? <img src={text} alt="发票图片" width={20} height={20} /> : <span>无</span>),
}, {
  title: '更新日期',
  dataIndex: 'add_time',
  key: 'add_time',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD')}</span>),
}, {
  title: '操作人员',
  dataIndex: 'operator',
  key: 'operator',
  render: () => (<span>{Cookies.getJSON('userinfo').username}</span>),
}, {
  title: '备注',
  dataIndex: 'remarks',
  key: 'remarks',
  render: text => (<span>{text || '无'}</span>),
}];


@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(this.props.location.search),
      operationkey: 'tab1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'orders/fetchDetail',
      supplierId: 100,
      orderId: args.id,
    });
  }

  render() {
    console.log(Cookies.getJSON('userinfo').username);
    const { orders, loading } = this.props;
    const { detail } = orders;// 订单详情
    const orderInfo = detail.order_info || {}; // 订单信息
    const payInfo = detail.pay_info || {}; // 支付信息
    const receiptInfo = detail.receipt_info || {}; // 开票信息
    const receiptList = detail.open_receipt || [];// 发票信息
    const logistics = detail.logistics || [orderInfo]; // 物流信息
    const operations = detail.operations || []; // 操作日志

    // const subOrder
    console.log('hello --:', [{ ...logistics, ...orderInfo }]);
    const descriptionContent = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="状态"><span><Badge status="success" />{ORDER_STATUS[orderInfo.status]}</span></Description>
        <Description term="订单总金额">￥{orderInfo.subtotal_money}元</Description>
        <Description term="运费">包邮</Description>
        <Description term="实收总金额"><span style={{ color: 'red' }}>￥{orderInfo.subtotal_money}元</span></Description>
        <Description term="生效日期">{moment(orderInfo.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`订单编号：${orderInfo.son_order_sn}`}
        logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
        content={descriptionContent}
      >
        <Card title="收货方式：配送" style={{ marginBottom: 24 }} bordered loading={loading}>
          <DescriptionList col={1}>
            <Description term="收货人">{orderInfo.receiver}</Description>
            <Description term="联系电话">{orderInfo.mobile}</Description>
            <Description term="地址">{orderInfo.address}</Description>
          </DescriptionList>
        </Card>
        <Card title={`支付方式：${PAY_STATUS[payInfo.pay_type]}`} style={{ marginBottom: 24 }} bordered>
          <div>支付状态：{mapPayStatus[payInfo.pay_status - 1]}</div>
        </Card>
        {/* <Card title="开票信息" style={{ marginBottom: 24 }} bordered loading={loading}>
          <DescriptionList col={3}>
            <Description term="公司全称(抬头)">{receiptInfo.title}</Description>
            <Description term="公司账户">{receiptInfo.account}</Description>
            <Description term="税务编号">{receiptInfo.tax_number}</Description>
            <Description term="公司电话">{receiptInfo.telephone}</Description>
            <Description term="开户银行">{receiptInfo.bank}</Description>
            <Description term="公司地址">{receiptInfo.company_address}</Description>
          </DescriptionList>
        </Card> */}
        <Card title="商品明细" style={{ marginBottom: 24 }} bordered loading={loading}>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={[orderInfo]}
            columns={goodsColumns}
            rowKey="add_time"
          />
          <div className={styles['extra-good-info']} >
            <div className="info">
              <span>运费：</span>
              <span>包邮</span>
            </div>
            <div className="info">
              <span>商品总金额：</span>
              <span className="money">￥{orderInfo.subtotal_money}</span>
            </div>
          </div>
        </Card>
        <Card title="发货记录" style={{ marginBottom: 24 }} bordered loading={loading}>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={logistics.length > 0 ? [{ ...logistics[0], ...orderInfo }] : []}
            columns={logisticsColumns}
            rowKey="add_time"
            locale={{
              emptyText: '暂无发货记录',
            }}
          />
        </Card>
        {/* <Card title="发票信息" style={{ marginBottom: 24 }} bordered loading={loading}>
          {
            receiptList.length > 0 ?
              (
                <Table
                  dataSource={receiptList}
                  columns={receiptColumns}
                  pagination={{
                    defaultPageSize: 3,
                  }}
                  key="order_sn"
                />
              )
              :
              (
                <div className={styles.noData}>
                  <Icon type="smile-o" />暂无记录
                </div>
              )
          }
        </Card> */}
        <Card title="买方备注" style={{ marginBottom: 24 }} bordered loading={loading}>
          {
            orderInfo.remarks ? orderInfo.remarks : (
              <div className={styles.noData}>
                <Icon type="smile-o" />买家没有添加备注
              </div>
            )
          }
        </Card>
        {/* <Card
          bordered
          title="操作记录"
          style={{ marginBottom: 24 }}
          // tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
          loading={loading}
        >
          {
            operations.length > 0 ?
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

