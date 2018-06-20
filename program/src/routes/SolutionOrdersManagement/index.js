import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Badge,
  message,
  Table,
  Pagination,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Icon,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import { SLN_PAY_STATUS } from '../../constant/statusList';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

export const SlnStatus = ({ status }) => {
  switch (status) {
    case 1:
      return (
        <span>
          <Badge status="default" />待支付
        </span>
      );
    case 2:
      return (
        <span>
          <Badge status="error" />已取消
        </span>
      );
    case 3:
      return (
        <span>
          <Badge status="processing" />备货中
        </span>
      );
    case 4:
      return (
        <span>
          <Badge status="processing" />待发货
        </span>
      );
    case 5:
      return (
        <span>
          <Badge status="processing" />发货中
        </span>
      );
    case 6:
      return (
        <span>
          <Badge status="success" />已确认收货
        </span>
      );
    case 7:
      return (
        <span>
          <Badge status="success" />订单已完成
        </span>
      );
    default:
      return (
        <span>
          <Badge status="processing" />无状态
        </span>
      );
  }
};
@connect(({ solutionOrders, loading }) => ({
  solutionOrders,
  loading: loading.models.solutionOrders,
}))
@Form.create()
class SolutionOrderList extends React.Component {
  state = {
    formExpand: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'solutionOrders/fetch',
    });
  }
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const rangeValue = fieldsValue['range-picker'];
    this.props.dispatch({
      type: 'solutionOrders/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'solutionOrders/fetch',
      payload: {
        start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : null,
        end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : null,
        ...fieldsValue,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'solutionOrders/fetch',
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form, solutionOrders } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue['range-picker'];
      const { plan_order_sn, status, plan_name, pay_status } = fieldsValue;
      const values = {
        start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : null,
        end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : null,
        plan_order_sn,
        status,
        plan_name,
        pay_status,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'solutionOrders/savePagination',
        payload: { ...solutionOrders.pagination, current: 1 },
      });
      dispatch({
        type: 'solutionOrders/fetch',
        payload: values,
      });
    });
  };
  handlePrepare = (plan_order_sn) => {
    this.props.dispatch({
      type: 'solutionOrders/handlePrepare',
      payload: { plan_order_sn },
      callback: (success, data) => {
        if (success && success === true) {
          message.success(data);
          this.props.dispatch({
            type: 'solutionOrders/fetch',
          });
        } else {
          message.error(data);
        }
      },
    });
  };

  render() {
    const { list, pagination } = this.props.solutionOrders;
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    const paginationProps = {
      ...pagination,
      style: { float: 'right', marginTop: 24 },
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const columns = [
      {
        title: '序号',
        key: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '方案订单号',
        dataIndex: 'plan_order_sn',
        key: 'plan_order_sn',
      },
      {
        title: '方案名称',
        dataIndex: 'plan_name',
        key: 'plan_name',
      },
      {
        title: '方案总金额',
        dataIndex: 'total_money',
        key: 'total_money',
        render: text => <span>¥{text}</span>,
      },
      {
        title: '支付状态',
        dataIndex: 'pay_status',
        key: 'pay_status',
        render: text => SLN_PAY_STATUS[text],
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render: status => SlnStatus({ status }),
      },
      {
        title: '交货期',
        dataIndex: 'delivery_date',
        key: 'delivery_date',
        render: text => `${text}天`,
      },
      {
        title: '下单日期',
        dataIndex: 'place_an_order_time',
        key: 'place_an_order_time',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:MM'),
      },
      {
        title: '操作',
        key: 'option',
        render: (row) => {
          if (row.status === 3) {
            // 备货中
            return (
              <Fragment>
                <a onClick={() => this.handlePrepare(row.plan_order_sn)}>
                  备货
                </a>
                <Divider type="vertical" />
                <a
                  href={`${location.href}/detail?order_id=${row.plan_order_sn}`}
                >
                  查看
                </a>
              </Fragment>
            );
          } else {
            return (
              <a href={`${location.href}/detail?order_id=${row.plan_order_sn}`}>
                查看
              </a>
            );
          }
        },
      },
    ];
    return (
      <PageHeaderLayout title="方案询价单列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="方案订单号">
                  {getFieldDecorator('plan_order_sn')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="订单状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="0">全部</Option>
                      <Option value="3">备货中</Option>
                      <Option value="4">待发货</Option>
                      <Option value="5">已发货待确认</Option>
                      <Option value="6">已确认收货</Option>
                      <Option value="7">已完成</Option>
                      <Option value="2">订单已取消</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="方案名称">
                  {getFieldDecorator('plan_name')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="支付状态">
                    {getFieldDecorator('plan_name')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="0">全部</Option>
                        <Option value="2">尾款未支付</Option>
                        <Option value="3">已全部支付</Option>
                        <Option value="4">订单已取消</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="创建时间">
                    {getFieldDecorator('range-picker')(
                      <RangePicker onChange={this.onDatepickerChange} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.handleFormReset}
                >
                  重置
                </Button>
                <span
                  style={{ marginLeft: 8 }}
                  onClick={this.toggleForm}
                  className={styles.unfold}
                >
                  {this.state.formExpand ? (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: false });
                      }}
                    >
                      收起<Icon type="up" />
                    </a>
                  ) : (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: true });
                      }}
                    >
                      展开<Icon type="down" />
                    </a>
                  )}
                </span>
              </span>
            </div>
          </Form>
        </Card>
        <Card bordered={false} loading={loading} style={{ marginTop: 30 }}>
          <Table columns={columns} pagination={false} dataSource={list} />
          <Pagination {...paginationProps} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default SolutionOrderList;
