import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Table, Spin, message, Icon } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import { FINANCIAL_STATUS } from '../../../constant/statusList';
import styles from './taskCenter.less';

const billDetailUrl = '/v1/financial/sup/statement/';
const { Description } = DescriptionList;
@connect(({ financial, loading }) => ({
  financial,
  loading: loading.effects['financial/fetchBillDetail'],
}))
export default class BillDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'financial/fetchBillDetail',
      code: match.params.id,
    });
  }
  onConfirmBill = () => {
    const { dispatch, match, history } = this.props;
    dispatch({
      type: 'financial/fetchConfirmBill',
      code: match.params.id,
      success: () => {
        message.success('确认成功,待对方付款');
        history.go(-1);
      },
      error: () => {
          message.error('操作失败，请重试');
      },
    });
  }
   // 导出列表
   exportExcelList = () => {
    const { dispatch, financial, match } = this.props;
    const { billDetail } = financial;
    const { detail } = billDetail;
    dispatch({
        type: 'financial/fetchExportExcel',
        url: `${billDetailUrl}${match.params.id}`,
        offset: 0,
        limit: detail.length,
        params: {},
        success: (res, financialUrl) => {
            message.success('导出成功,下载中...');
            location.href = `${financialUrl}/v1${res.data.url}`;
        },
        error: () => {
            message.error('导出失败');
        },
    });
  }
  render() {
    const { history, financial, loading } = this.props;
    const { billDetail } = financial;
    const { title, detail } = billDetail;
    const {
      supplier_name,
      month,
      cycle,
      code,
      goods_total,
      commission_total,
      status,
    } =
      title || {};
    const columns = [
        {
            title: '序号',
            key: 'idx',
            render: (record, text, index) => index + 1,
          },
      {
        title: '单据日期',
        key: 'date',
        dataIndex: 'date',
      },
      {
        title: '单据类型',
        key: 'typename',
        dataIndex: 'typename',
        render: val => (val === '退货单' ? <span style={{ color: '#f40' }}>{val}</span> : <span>{val}</span>),
      },
      {
        title: '商品订单号',
        key: 'order_code',
        dataIndex: 'order_code',
      },
      {
        title: '商品名称',
        width: 200,
        key: 'goods_name',
        dataIndex: 'goods_name',
      },
      {
        title: '型号',
        key: 'model',
        dataIndex: 'model',
      },
      {
        title: '单价',
        key: 'price',
        dataIndex: 'price',
        render: val => <span>&yen; {val}</span>,

      },
      {
        title: '数量',
        key: 'number',
        dataIndex: 'number',
      },
      {
        title: '贷款',
        key: 'amount',
        dataIndex: 'amount',
        render: val => <span>&yen; {val}</span>,
      },
      {
        title: '佣金',
        key: 'commission',
        dataIndex: 'commission',
        render: val => <span>&yen; {val}</span>,
      },
    ];
    const paginationOptions = {
        showSizeChanger: true,
        showQuickJumper: true,
    };
    return (
      <PageHeaderLayout title="账单详情">
      <Spin spinning={loading}>
        <Card
          style={{ paddingBottom: 30 }}
          extra={
            <div className={styles.extra}>
              <Button type="primary" onClick={this.onConfirmBill}>确认账单</Button>
              <Button onClick={() => history.go(-1)}>返回</Button>
              <Button onClick={this.exportExcelList}><Icon type="export" />导出</Button>
            </div>
          }
        >
          <DescriptionList md={3} sm={2} style={{ marginBottom: 30 }}>
            <Description term="对账单单号">{code}</Description>
            <Description term="对账月份">{month}</Description>
            <Description term="对账对象">{supplier_name}</Description>
            <Description term="对账单状态">
              {FINANCIAL_STATUS[status]}
            </Description>
            <Description term="佣金合计"><span>￥ {goods_total}</span></Description>
            <Description term="贷款合计"><span>￥ {commission_total}</span></Description>
            <Description term="对账周期">{cycle}</Description>
          </DescriptionList>
          <Table dataSource={detail ? detail.map((ele) => { return { ...ele, key: ele.order_code }; }) : []} columns={columns} pagination={paginationOptions} scroll={{ x: 1300 }} />
        </Card>
      </Spin>
      </PageHeaderLayout>
    );
  }
}
