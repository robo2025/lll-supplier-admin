import React from 'react';
import { connect } from 'dva';
import {
  Card,
  DatePicker,
  Form,
  Input,
  Row,
  Col,
  Button,
  Icon,
  Table,
  message,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './reportCenter.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const notCheckListUrl = '/v1/financial/sup/statementexdetail/unstatement';
@Form.create()
@connect(({ financial, loading }) => ({
  financial,
  loading: loading.effects['financial/fetchNotCheckList'],
}))
export default class NotCheckList extends React.Component {
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
    this.onGetNotCheckList({
      params: {},
      offset: 0,
      pageSize: 10,
    });
  }
  onGetNotCheckList({ params, offset, limit }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'financial/fetchNotCheckList',
      params,
      offset,
      limit,
    });
  }
  onPaginationChange=(pagination) => {
      const { searchValues } = this.state;
      this.setState({
          args: {
              page: pagination.current,
              pageSize: pagination.pageSize,
          },
      });
      this.onGetNotCheckList({
          params: searchValues,
          offset: (pagination.current - 1) * pagination.pageSize,
          limit: pagination.pageSize,
      });
  }
  handleSearch=(e) => {
      e.preventDefault();
      const { form } = this.props;
      const { args } = this.state;
      form.validateFields((err, fieldsValue) => {
          const values = {};
          const { create_time, order_code } = fieldsValue;
          if (create_time && create_time.length > 0) {
              values.start_dt = create_time[0].format('YYYY-MM-DD');
              values.end_dt = create_time[1].format('YYYY-MM-DD');
          }
          if (order_code && order_code.trim().length > 0) {
              values.order_code = order_code.trim();
          }
          this.setState({
              args: {
                  page: 1,
                  pageSize: args.pageSize,
              },
              searchValues: values,
          });
          this.onGetNotCheckList({
              params: values,
              offset: 0,
              limit: args.pageSize,
          });
      });
  }
  handleFormReset = () => {
      const { form } = this.props;
      const { args } = this.state;
      form.resetFields();
      this.setState({
          args: {
              page: 1,
              pageSize: args.pageSize,
          },
          searchValues: {},
      });
      this.onGetNotCheckList({
          params: {},
          offset: 0,
          limit: args.pageSize,
      });
  }
  // 导出列表
  exportExcelList = () => {
    const { dispatch, financial } = this.props;
    const { notCheckTotal } = financial;
    const { searchValues } = this.state;
    dispatch({
        type: 'financial/fetchExportExcel',
        url: notCheckListUrl,
        offset: 0,
        limit: notCheckTotal,
        params: searchValues,
        success: (res, financialUrl) => {
            message.success('导出成功,下载中...');
            location.href = `${financialUrl}/v1${res.data.url}`;
        },
        error: () => {
            message.error('导出失败');
        },
    });
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        xs: 18,
      },
      labelCol: {
        xs: 6,
      },
    };
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 24, xs: 12 }}>
          <Col xl={8} md={12} xs={12}>
            <FormItem label="单据日期" {...formItemLayout}>
              {getFieldDecorator('create_time')(
                  <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={12}>
            <FormItem label="订单编号" {...formItemLayout}>
            {getFieldDecorator('order_code')(
                   <Input placeholder="请输入" />
              )}
             
            </FormItem>
          </Col>
          <Col
            xl={{ span: 8, offset: 0 }}
            md={{ span: 8, offset: 16 }}
            xs={{ span: 8, offset: 16 }}
            style={{ textAlign: 'right' }}
          >
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.exportExcelList}>
              <Icon type="export" />导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { financial, loading } = this.props;
    const { args } = this.state;
    const { page, pageSize } = args;
    const { notChecklist, notCheckTotal } = financial;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '单据日期',
        key: 'order_date',
        dataIndex: 'order_date',
      },
      {
        title: '单据类型',
        key: 'type',
        dataIndex: 'type',
        render: val =>
          (val === '退货单' ? (
            <span style={{ color: '#f40' }}>{val}</span>
          ) : (
            <span>{val}</span>
          )),
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
      total: notCheckTotal >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    return (
      <PageHeaderLayout title="未对账查询">
        <Card>
          {this.renderForm()}
          <Table
            className={styles.footer}
            columns={columns}
            dataSource={notChecklist.map((ele) => {
              return { ...ele, key: ele.order_code };
            })}
            scroll={{ x: 1300 }}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
            loading={loading}
            footer={
              notChecklist.length
                ? (data) => {
                    let amount = 0;
                    let commission = 0;
                    let number = 0;
                    data.forEach((ele) => {
                      amount += parseFloat(ele.amount);
                      commission += parseFloat(ele.commission);
                      number += parseFloat(ele.number);
                    });
                    return (
                      <div className={styles.total}>
                        <div className={styles.desc}><span className={styles.txt}>数量合计 :</span> {number} </div>
                        <div className={styles.desc}><span className={styles.txt}>贷款合计 :</span> &yen; {amount} </div>
                        <div className={styles.desc}><span className={styles.txt}>佣金合计 :</span> &yen; {commission} </div>
                      </div>
                    );
                  }
                : null
            }
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
