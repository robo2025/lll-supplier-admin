import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import List from '../../components/List/ReturnsList';

import styles from './ReturnsList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
@Form.create()
export default class ReturnsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchReturns',
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 处理表单搜索
  handleSearch = (e) => {
    e.preventDefault();
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        start_time: fieldsValue.create_time ? fieldsValue.create_time[0].format('YYYY-MM-DD') : '',
        end_time: fieldsValue.create_time ? fieldsValue.create_time[1].format('YYYY-MM-DD') : '',
      };

      console.log('搜索字段', values);
      dispatch({
        type: 'orders/fetchSearch',
        data: values,
      });
    });
  }

  // 确认收货
  handleConfirmReturn = ({ orderId, status }) => {
    console.log('return', orderId, status);
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchConfirmReturn',
      orderId,
      status,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="退货单号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户订单号">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="退货状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待收货</Option>
                  <Option value="2">确认收货</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="退货单号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户订单号">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="退货状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待收货</Option>
                  <Option value="2">确认收货</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={10} sm={24}>
            <FormItem label="退货单起止时间">
              {getFieldDecorator('no')(
                <RangePicker onChange={this.onDatepickerChange} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { orders, loading } = this.props;
    console.log('退货单列表--', orders.returns);

    return (
      <PageHeaderLayout title="退货单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <List.Header />
            {
              orders.returns.length > 0
                ?
                null
                :
                <div style={{ textAlign: 'center' }}>暂无退货单数据</div>
            }
            {
              orders.returns.map((val, idx) => {
                const orderListItemHeader = (
                  <div className={styles['returns-list-header']}>
                    <div>
                      <b>客户订单编号：</b>
                      <a href="#" className="order-sn">{val.order_sn}</a>
                    </div>
                    <div>
                      <b>退货单编号：</b>
                      <a href="#" className="order-sn">{val.returns_sn}</a>
                      <span className="order-time">({moment(val.returns_time * 1000).format('YYYY-MM-DD hh:mm')})</span>
                    </div>
                  </div>
                );
                return (
                  <List
                    header={orderListItemHeader}
                    key={idx}
                    data={val}
                    onConfirmReturn={this.handleConfirmReturn}
                  />
                );
              })
            }
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
