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
  Modal,
  Spin,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './index.less';
import { SLN_PAY_STATUS } from '../../constant/statusList';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Description } = DescriptionList;
const deviceColumns = [
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
const DeliveryModal = Form.create()((props) => {
  const {
    guest_info,
    order_info,
    supplier,
    form,
    modalVisible,
    handleModalVisible,
    handleConfirm,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleConfirm(fieldsValue, order_info.plan_order_sn);
    });
  };

  return (
    <Modal
      title="发货单"
      visible={modalVisible}
      onOk={okHandle}
      width={900}
      onCancel={() => {
        handleModalVisible(false);
        form.resetFields();
      }}
    >
      {guest_info ? (
        <Fragment>
          <DescriptionList size="small" col="3">
            <Description term="收货单位">
              {guest_info.guest_company_name}
            </Description>
            <Description term="收货人">{guest_info.receiver}</Description>
            <Description term="收货方式">配送</Description>
            <Description term="联系电话">{guest_info.mobile}</Description>
            <Description term="地址">{guest_info.address}</Description>
          </DescriptionList>

          <Table
            style={{ marginTop: 28 }}
            columns={deviceColumns}
            dataSource={supplier.sln_device}
            pagination={false}
          />
          <Row style={{ marginTop: 28 }}>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                label="物流公司名称"
              >
                {form.getFieldDecorator('logistics_company', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入' },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                label="物流编号"
              >
                {form.getFieldDecorator('logistics_number', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入' },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                label="联系电话"
              >
                {form.getFieldDecorator('mobile', {
                  rules: [
                    { required: true, pattern: /^[0-9-]*$/, message: '请输入正确的电话号码' },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
                label="送货人"
              >
                {form.getFieldDecorator('sender', {
                  rules: [
                    { required: true, whitespace: true, message: '请输入' },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </Fragment>
      ) : (
        <Spin />
      )}
    </Modal>
  );
});
@connect(({ solutionOrders, loading }) => ({
  solutionOrders,
  loading: loading.effects['solutionOrders/fetch'],
}))
@Form.create()
class SolutionOrderList extends React.Component {
  state = {
    formExpand: false,
    modalVisible: false,
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
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
    });
  };
  handleDelivery=(fieldsValue, plan_order_sn) => {
    this.setState({ modalVisible: false });
    this.props.dispatch({
      type: 'solutionOrders/handleDelivery',
      payload: { ...fieldsValue, plan_order_sn },
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
  }
  showDeliveryModal = (plan_order_sn) => {
    this.setState({ modalVisible: true });
    this.props.dispatch({
      type: 'solutionOrders/fetchDetail',
      payload: plan_order_sn,
    });
  };
  render() {
    const { list, pagination, profile } = this.props.solutionOrders;
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
          } else if (row.status === 4) {
            // 待发货
            return (
              <Fragment>
                <a onClick={() => this.showDeliveryModal(row.plan_order_sn)}>
                  发货
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
        <Card bordered={false} style={{ marginTop: 30 }} loading={loading}>
          <Table columns={columns} pagination={false} dataSource={list} />
          <Pagination {...paginationProps} />
        </Card>
        <DeliveryModal
          {...profile}
          modalVisible={this.state.modalVisible}
          handleModalVisible={this.handleModalVisible}
          handleConfirm={this.handleDelivery}
        />
      </PageHeaderLayout>
    );
  }
}
export default SolutionOrderList;
