import React, { Component } from 'react';
import { Row, Col, Card, Form, Input, Checkbox, Select, Icon, Button, Menu, DatePicker, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import List from '../../components/List/List';

import styles from './OrderList.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

// 订单列表假数据
const orderListData = [];
for (let i = 0; i < 5; i++) {
  orderListData.push({
    order_sn: '123456',
    add_time: '2018-03-02',
    sub_order: [
      {
          son_order_sn: 'DD00000009800000' + i,
          supplier_id: 100 + i,
          number: 10,
          univalent: 19.9,
          max_delivery_time: 7,
          status: '已确认收货',
          subtotal_money: 199,
          goods_id: 1,
          model: 'AK-47',
          brand: 'bronk',
          commission: 0,
          open_receipt: [
              {
                  receipt_sn: 12345556,
                  order_sn: 'DD000000098000001',
                  images: '6ONXsjip0QIZ8tyhnq/it/u=3217455691,1712838045&fm=173&s=99A4E5175FD271EFCAF1C4F803004021&w=218&h=146&img.JPEG',
                  remarks: '',
                  add_time: '2018-03-03T11:37:25.048172',
              },
          ],
      },
  ],
  });
}
 

@Form.create()
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
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

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户订单号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="商品ID">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待接单</Option>
                  <Option value="2">已发货</Option>
                  <Option value="3">已收货</Option>
                  <Option value="4">商家无货</Option>
                  <Option value="5">申请延时发货</Option>
                  <Option value="5">允许延时发货</Option>
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
            <FormItem label="客户订单号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="商品ID">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待接单</Option>
                  <Option value="2">已发货</Option>
                  <Option value="3">已收货</Option>
                  <Option value="4">商家无货</Option>
                  <Option value="5">申请延时发货</Option>
                  <Option value="5">允许延时发货</Option>
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
            <FormItem label="产品提交日期">
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
    const orderListItemHeader = (
      <div>
        <b>客户订单编号</b><a href="#">XH1611060005</a><span>(2017-12-07 17:12)</span>
      </div>
    );

    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card border={false}>
            <div className={styles.tableList}>
              <List
                header={orderListItemHeader}
                data={orderListData}
              />
            </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
