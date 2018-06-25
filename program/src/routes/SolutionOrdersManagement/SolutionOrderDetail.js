import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Card, Spin, Table, Divider, Button, Row, Col } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { SlnStatus } from './index';
import styles from './SolutionOrderDetail.less';

const { Description } = DescriptionList;
const Tablefooter = (props) => {
  const { sln_support } = props;
  return (
    <DescriptionList
      size="small"
      col="3"
      title={<span style={{ fontSize: 16 }}>技术支持</span>}
    >
      {sln_support.map(item => (
        <Description term={item.name}>￥{item.price}元</Description>
      ))}
    </DescriptionList>
  );
};
const logisticsColumns = [
  // {
  //   title: '商品ID',
  //   dataIndex: 'goods_sn',
  //   key: 'goods_sn',
  // },
  // {
  //   title: '商品名称',
  //   dataIndex: 'goods_name',
  //   key: 'goods_name',
  // },
  // {
  //   title: '型号',
  //   dataIndex: 'model',
  //   key: 'model',
  // },
  // {
  //   title: '品牌',
  //   dataIndex: 'brand',
  //   key: 'brand',
  // },
  {
    title: '物流公司',
    dataIndex: 'logistics_company',
    key: 'logistics_company',
  },
  {
    title: '物流单号',
    dataIndex: 'logistics_number',
    key: 'logistics_number',
  },
  
  {
    title: '送货人',
    dataIndex: 'sender',
    key: 'sender',
    render: text => <span>{text || '---'}</span>,
  },
  {
    title: '联系号码',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '发货日期',
    dataIndex: 'add_time',
    key: 'add_time',
    render: val => (
      <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
    ),
  },
];
const opreationColumns = [
  {
    title: '操作人',
    key: 'operator',
    align: 'center',
    dataIndex: 'operator',
  },
  {
    title: '操作时间',
    key: 'add_time',
    align: 'center',
    dataIndex: 'add_time',
    render: text => moment.unix(text).format('YYYY-MM-D  HH:mm'),
  },
  {
    title: '操作描述',
    key: 'execution_detail',
    align: 'center',
    dataIndex: 'execution_detail',
  },
  {
    title: '进度',
    key: 'progress',
    align: 'center',
    dataIndex: 'progress',
  },
];
const columns = [
  {
    title: '组成部分',
    dataIndex: 'device_component',
    key: 'device_component',
  },
  {
    title: '商品名称',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: '型号',
    dataIndex: 'device_model',
    key: 'device_model',
  },
  {
    title: '品牌',
    dataIndex: 'brand_name',
    key: 'brand_name',
  },
  {
    title: '数量',
    dataIndex: 'device_num',
    key: 'device_num',
  },
  {
    title: '单价（元）',
    dataIndex: 'device_price',
    key: 'device_price',
  },
  {
    title: '小计（元）',
    key: 'total_price',
    render: row => <span>{row.device_num * row.device_price}</span>,
  },
  {
    title: '备注',
    key: 'device_note',
    dataIndex: 'device_note',
    render: text => (text === '' ? '无' : text),
  },
];

@connect(({ solutionOrders, loading }) => ({
  profile: solutionOrders.profile,
  loading: loading.models.solutionOrders,
}))
class SolutionOrderDetail extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'solutionOrders/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  render() {
    const { profile, loading } = this.props;
    if (!profile.order_info) {
      return <Spin />;
    }
    const {
      order_info,
      pay_info,
      guest_info,
      receipt_info,
      supplier_info,
      delivery_info,
      order_operations,
      supplier,
      customer,
    } = profile;
    return (
      <PageHeaderLayout title="方案订单详情">
        <Spin spinning={loading}>
          <div className={styles.SolutionOrderDetail}>
            <Card title="订单基本信息">
              <DescriptionList size="small" col="3">
                <Description term="方案订单号">
                  {order_info.plan_order_sn}{' '}
                </Description>
                <Description term="订单金额">
                  ￥{order_info.total_money}
                </Description>
                <Description term="订单状态">
                  {<SlnStatus status={order_info.status} />}
                </Description>
                <Description term="下单时间">
                  {moment
                    .unix(order_info.place_an_order_time)
                    .format('YYYY-MM-DD HH:MM')}
                </Description>
              </DescriptionList>
            </Card>
            <Card title="支付信息">
              {pay_info.ia}
              <DescriptionList size="small" col="4">
                <Description term="首款">{pay_info[0].pay_ratio} %</Description>
                <Description term="金额">
                  ￥{order_info.total_money * (pay_info[0].pay_ratio / 100)}
                </Description>
                <Description term="支付状态">
                  {pay_info[0].status === 2 ? '已支付' : '未支付'}
                </Description>
                <Description term="支付时间">
                  {moment.unix(pay_info[0].pay_time).format('YYYY-MM-DD HH:MM')
                  // 1为已支付，2为未支付
                  }
                </Description>
                <Description term="尾款">
                  {pay_info[1].pay_ratio} %
                </Description>
                <Description term="金额">
                  ￥{order_info.total_money * (pay_info[1].pay_ratio / 100)}
                </Description>
                <Description term="支付状态">
                  {pay_info[1].status === 2 ? '已支付' : '未支付'}
                </Description>
                <Description term="支付时间">
                  {moment.unix(pay_info[1].pay_time).format('YYYY-MM-DD HH:MM')}
                </Description>
              </DescriptionList>
            </Card>
            <Card title="客户信息">
              <DescriptionList size="small" col="3">
                <Description term="联系人">{guest_info.receiver} </Description>
                <Description term="联系电话">{guest_info.mobile}</Description>
                <Description term="公司名称">
                  {guest_info.guest_company_name}
                </Description>
                <Description term="收货地址">
                  {guest_info.province +
                    guest_info.city +
                    guest_info.district +
                    guest_info.address}
                </Description>
                <Description term="备注">{guest_info.remarks}</Description>
              </DescriptionList>
            </Card>
            <Card title="开票信息">
              <DescriptionList size="small" col="3">
                <Description term="发票抬头">{receipt_info.title}</Description>
                <Description term="公司账户">
                  {receipt_info.account}
                </Description>
                <Description term="税务编号">
                  {receipt_info.tax_number}
                </Description>
                <Description term="公司电话">
                  {receipt_info.telephone}
                </Description>
                <Description term="开户银行">{receipt_info.bank}</Description>
                <Description term="公司地址">
                  {receipt_info.company_address}
                </Description>
              </DescriptionList>
            </Card>
            <Card title="供应商信息">
              <DescriptionList size="small" col="3">
                <Description term="联系人">
                  {supplier_info.username}
                </Description>
                <Description term="联系电话">
                  {supplier_info.mobile}
                </Description>
                <Description term="公司名称">
                  {supplier_info.profile.company}
                </Description>
                <Description term="地址">
                  {supplier_info.profile.address}
                </Description>
              </DescriptionList>
            </Card>
            <Card title="方案商品信息">
              <DescriptionList size="small" col="3">
                {/* <Description term="方案询价单号">0000000022</Description> */}
                <Description term="方案编号">{supplier.sln_no}</Description>
                <Description term="方案名称">
                  {customer.sln_basic_info.sln_name}
                </Description>
              </DescriptionList>
              {/* TODO: dataSource={supplier.sln_device.map((item) => { return { ...item, key: item.device_id }; })} */}
              <Table
                style={{ marginTop: 28 }}
                columns={columns}
                dataSource={supplier.sln_device}
                pagination={false}
                footer={() => <Tablefooter {...supplier} />}
              />
              <Divider />
              <Row style={{ textAlign: 'right' }}>
                <Col span={8} offset={8}>
                  交货期：<span>
                    {supplier.sln_supplier_info.delivery_date}天
                      </span>
                </Col>
                <Col span={8} style={{ fontSize: 18 }}>
                  方案总金额：<span style={{ color: 'red' }}>
                    ￥{supplier.sln_supplier_info.total_price}元
                        </span>
                </Col>
              </Row>
            </Card>
            <Card title="发货记录">
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                dataSource={delivery_info}
                columns={logisticsColumns}
                rowKey="add_time"
                locale={{
                  emptyText: '暂无发货记录',
                }}
              />
            </Card>
            <Card title="订单操作记录">
              <Table
                columns={opreationColumns}
                dataSource={order_operations}
                pagination={false}
              />
              <div className={styles.footerBotton}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    this.props.dispatch(routerRedux.goBack());
                  }}
                >
                  返回
                </Button>
              </div>
            </Card>
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

export default SolutionOrderDetail;
