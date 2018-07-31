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

const haveCheckListUrl = '/v1/financial/sup/statementexdetail/statement';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY/MM';
@Form.create()
@connect(({ financial, loading }) => ({
  financial,
  loading: loading.effects['financial/fetchHaveCheckList'],
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
    this.onGetHaveCheckList({
      params: {},
      offset: 0,
      limit: 10,
    });
  }
  onGetHaveCheckList({ params, offset, limit }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'financial/fetchHaveCheckList',
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
      this.onGetHaveCheckList({
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
          const { create_time, ...others } = fieldsValue;
          if (create_time && create_time.length > 0) {
              values.start_dt = create_time[0].format('YYYY-MM');
              values.end_dt = create_time[1].format('YYYY-MM');
          }
          for (const key in others) {
            if (others[key] && others[key].trim().length > 0) {
                values[key] = others[key].trim();
            }
          }
          console.log(values, 123456);
          this.setState({
              args: {
                  page: 1,
                  pageSize: args.pageSize,
              },
              searchValues: values,
          });
          this.onGetHaveCheckList({
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
      this.onGetHaveCheckList({
          params: {},
          offset: 0,
          limit: args.pageSize,
      });
  }
  // 导出列表
  exportExcelList = () => {
    const { dispatch, financial } = this.props;
    const { haveCheckTotal } = financial;
    const { searchValues } = this.state;
    dispatch({
        type: 'financial/fetchExportExcel',
        url: haveCheckListUrl,
        offset: 0,
        limit: haveCheckTotal,
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
        xs: 17,
      },
      labelCol: {
        xs: 7,
      },
    };
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 10, xs: 12 }}>
          <Col xl={8} md={12} xs={12}>
            <FormItem label="对账月份" {...formItemLayout}>
              {getFieldDecorator('create_time')(
                  <RangePicker format={monthFormat} />
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
          <Col xl={8} md={12} xs={12}>
            <FormItem label="对账单单号" {...formItemLayout}>
            {getFieldDecorator('code')(
                   <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col
          xl={{ span: 8, offset: 16 }}
            md={12}
            xs={12}
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
    const { haveCheckList, haveCheckTotal } = financial;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '对账月份',
        key: 'limit',
        dataIndex: 'limit',
      },
      {
        title: '对账周期',
        key: 'term',
        dataIndex: 'term',
      },
      {
        title: '对账单单号',
        key: 'code',
        dataIndex: 'code',
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
      total: haveCheckTotal >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    return (
      <PageHeaderLayout title="已对账查询">
        <Card>
          {this.renderForm()}
          <Table
            className={styles.footer}
            columns={columns}
            dataSource={haveCheckList.map((ele) => {
              return { ...ele, key: ele.order_code };
            })}
            scroll={{ x: 1600 }}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
            loading={loading}
            footer={
                haveCheckList.length
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
