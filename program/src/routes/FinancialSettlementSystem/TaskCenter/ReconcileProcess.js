import React, { Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Button, Form, DatePicker, Row, Col, Table, Divider } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { FINANCIAL_STATUS } from '../../../constant/statusList';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY/MM';
@Form.create()
@connect(({ financial, loading, user }) => ({
    financial,
    loading,
    currentUser: user.currentUser,
}))
export default class ReconcileProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
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
        status: 2,
        // supplier_id: currentUser.id,
      };
      dispatch({
          type: 'financial/fetchBillList',
          offset,
          limit,
          params: { ...values, ...params },
      });
  }
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
      <Form>
        <Row>
          <Col span={18}>
            <FormItem label="对账时间" {...formItemLayout}>
              {getFieldDecorator('reconcile_time')(
                <RangePicker locale={locale} format={monthFormat} />
              )}
            </FormItem>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary">查询</Button>
            <Button style={{ marginLeft: 15 }}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { financial } = this.props;
    const { billList, billTotal } = financial;
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
            title: '贷款合计(元)',
            key: 'goods_total',
            dataIndex: 'goods_total',
          },
          {
            title: '佣金合计(元)',
            key: 'commission_total',
            dataIndex: 'commission_total',
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
            width: 150,
            render: (record) => {
                return (
                    <Fragment>
                        <a href=" javascript:;" style={{ textDecoration: 'none' }}>确认</a>
                        <Divider type="vertical" />
                        <a href=" javascript:;" style={{ textDecoration: 'none' }}>查看详情</a>
                    </Fragment>
                );
            },
          },
    ];
    return (
      <PageHeaderLayout title="待确认列表">
        <Card>{this.renderForm()}</Card>
        <Card style={{ marginTop: 30 }}>
            <Table
            columns={columns} 
            dataSource={billList.map((ele) => { return { ...ele, key: ele.code }; })} 
            scroll={{ x: 1300 }}
            />
        </Card>
      </PageHeaderLayout>
    );
  }
}
