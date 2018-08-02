import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, DatePicker, Row, Col, Table, Divider, message } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { FINANCIAL_STATUS } from '../../../constant/statusList';
import styles from './taskCenter.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY/MM';
@Form.create()
@connect(({ financial, loading, user }) => ({
  financial,
  loading: loading.effects['financial/fetchBillList'],
  currentUser: user.currentUser,
}))
export default class ReconcileProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {
        page: 1,
        pageSize: 10,
      },
      searchValues: {},
    };
  }
  componentDidMount() {
    this.onGetBillList({
      params: {},
      offset: 0,
      limit: 10,
    });
  }
  onGetBillList({ params, offset, limit }) {
    const { dispatch, currentUser } = this.props;
    const values = {
      status: 4,
      supplier_id: currentUser.id,
    };
    dispatch({
      type: 'financial/fetchBillList',
      offset,
      limit,
      params: { ...values, ...params },
    });
  }
  // 确认待确认账单
  onConfirmBill = (record) => {
      const { dispatch } = this.props;
      const { args, searchValues } = this.state;
      dispatch({
          type: 'financial/fetchConfirmBill',
          code: record.code,
          success: () => {
            message.success('确认成功,待对方付款');
            this.setState({
                args: {
                    page: 1,
                    pageSize: args.pageSize,
                },
            });
            this.onGetBillList({
                params: searchValues,
                offset: 0,
                limit: args.pageSize,
            });
          },
          error: () => {
              message.error('操作失败，请重试');
          },
      });
  }
  onPaginationChange = (pagination) => {
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.onGetBillList({
      params: searchValues,
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValues) => {
      const values = {};
      const { reconcile_time } = fieldsValues;
      if (reconcile_time && reconcile_time.length > 0) {
        values.start_ym = reconcile_time[0].format('YYYY-MM');
        values.end_ym = reconcile_time[1].format('YYYY-MM');
      }
      this.setState({
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
        searchValues: values,
      });
      this.onGetBillList({
        params: values,
        offset: 0,
        limit: args.pageSize,
      });
    });
  };
  handleFormReset = () => {
    const { form } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      searchValues: {},
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
    });
    this.onGetBillList({
      params: {},
      offset: 0,
      limit: args.pageSize,
    });
  };
  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: 3,
      },
      wrapperCol: {
        sm: 21,
      },
    };
    return (
      <Form onSubmit={this.handleSearch}>
        <Row>
          <Col span={18}>
            <FormItem label="对账时间" {...formItemLayout}>
              {getFieldDecorator('reconcile_time')(
                <RangePicker locale={locale} format={monthFormat} />
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 15 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { financial, loading } = this.props;
    const { billList, billTotal } = financial;
    const { args } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '对账对象',
        key: 'supplier_name',
        dataIndex: 'supplier_name',
      },
      {
        title: '对账月份',
        key: 'month',
        dataIndex: 'month',
      },
      {
        title: '对账周期',
        key: 'cycle',
        dataIndex: 'cycle',
      },
      {
        title: '对账单单号',
        key: 'code',
        dataIndex: 'code',
      },
      {
        title: '贷款合计',
        key: 'goods_total',
        dataIndex: 'goods_total',
        render: val => <span>&yen; {val}</span>,
      },
      {
        title: '佣金合计',
        key: 'commission_total',
        dataIndex: 'commission_total',
        render: val => <span>&yen; {val}</span>,
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: val => FINANCIAL_STATUS[val],
      },
      {
        title: '操作',
        fixed: 'right',
        width: 170,
        render: (record) => {
          return (
            <Fragment>
              <a href=" javascript:;" style={{ textDecoration: 'none' }} onClick={() => this.onConfirmBill(record)}>
                确认账单
              </a>
              <Divider type="vertical" />
              <a href={`${location.href}/billDeatil/${record.code}`} style={{ textDecoration: 'none' }}>
                查看详情
              </a>
            </Fragment>
          );
        },
      },
    ];
    const paginationOptions = {
      total: billTotal >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    return (
      <PageHeaderLayout title="待确认列表">
        <Card>{this.renderForm()}
          <Table
          className={styles.footer}
            columns={columns}
            dataSource={billList.map((ele) => {
              return { ...ele, key: ele.code };
            })}
            scroll={{ x: 1300 }}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
            loading={loading}
            footer={billList.length ? ((data) => {
                let goodsTotal = 0;
                let commissionTotal = 0;
                data.forEach((ele) => {
                  goodsTotal += parseFloat(ele.goods_total);
                  commissionTotal += parseFloat(ele.commission_total);
                });
                return (
                  <div className={styles.total}>
                    <div className={styles.desc}><span className={styles.txt}>贷款合计 : </span>&yen; {goodsTotal} </div>
                    <div className={styles.desc}><span className={styles.txt}>佣金合计 : </span>&yen; {commissionTotal} </div>
                  </div>
                );
              }) : null}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
