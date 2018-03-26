import React, { Component } from 'react';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Modal, message, Pagination, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import List from '../../components/List/List';
import InvoiceContent from '../../components/ModalContent/InvoiceContent';
import OpenReceiptContent from '../../components/ModalContent/OpenReceiptContent';
import ExceptionContent from '../../components/ModalContent/ExceptionContent';
import { handleServerMsgObj } from '../../utils/tools';

import styles from './OrderList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@connect(({ orders, upload, loading }) => ({
  orders,
  upload,
  loading: loading.models.orders,
}))
@Form.create()
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      isShowDeliveryModal: false, // 发货单模态框
      isShowOpenModal: false, // 开票模态框
      isShowExceptionModal: false,
      receiptInfo: {}, // 开票Form信息
      deliveryInfo: {}, // 发货Form信息
      exceptionInfo: {}, // 异常Form信息
      openReceipt: [], // 开票信息
      data: {},
      currentPage: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetch',
      supplierId: 100,
    });
  }

  // 显示模态框
  showModal = (key, id, data) => {
    console.log('i am click', id, data);
    const tempJson = {};
    tempJson[key] = true;
    this.setState({ ...tempJson, orderId: id, openReceipt: data.open_receipt, data });
  }

  // 取消
  cancelModal = (key) => {
    const tempJson = {};
    tempJson[key] = false;
    this.setState(tempJson);
  }

  // 确定：模态框
  okModal = (key) => {
    if (key === 'isShowOpenModal') { // 开发票
      this.dispatchOpenReceipt();
    } else if (key === 'isShowDeliveryModal') { // 发货
      this.dispatchDelivery();
    } else if (key === 'isShowExceptionModal') { // 异常处理
      console.log('异常处理');
      this.dispatchException();
    }
  }

  //  接单 
  takingOrder = ({ orderId, supplierId, status }) => {
    console.log('接单', orderId, supplierId, status);
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/modifyStatus',
      orderId,
      supplierId,
      status,
      success: () => { message.success('接单成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 开票表单改变
  handleFormChange = (values) => {
    const { receiptInfo } = this.state;
    this.setState({ receiptInfo: { ...receiptInfo, ...values } });
  }
  // 发起开票请求
  dispatchOpenReceipt = () => {
    const { dispatch } = this.props;
    const { orderId, receiptInfo } = this.state;
    const that = this;
    this.formObj.validateFields((error) => {
      if (!error) {
        that.setState({ isShowOpenModal: false });
        dispatch({
          type: 'orders/fetchOpenReceipt',
          orderId,
          ...receiptInfo,
          error: (res) => { message.error(handleServerMsgObj(res.msg)); },
          succuess: () => { message.success('开票成功'); },

        });
      }
    });
  }

  // 发货表单改变
  handleDeliveryFormChange = (values) => {
    const { deliveryInfo } = this.state;
    this.setState({ deliveryInfo: { ...deliveryInfo, ...values } });
  }
  // 发起发货请求
  dispatchDelivery = () => {
    const { dispatch } = this.props;
    const { deliveryInfo, orderId } = this.state;
    console.log('表单对象', this.formObj);
    const that = this;
    this.formObj.validateFields((error, values) => {
      console.log('校验结果：', error, values);
      if (!error) {
        that.setState({ isShowDeliveryModal: false });
        dispatch({
          type: 'orders/fetchDeliveryGoods',
          data: { ...deliveryInfo, order_sn: orderId },
          error: (res) => { message.error(handleServerMsgObj(res.msg)); },
        });
      }
    });
  }

  // 异常表单改变
  handleExceptionFormChange = (values) => {
    const { exceptionInfo } = this.state;
    this.setState({ exceptionInfo: { ...exceptionInfo, ...values } });
  }
  // 发起异常申请请求
  dispatchException = () => {
    const { dispatch } = this.props;
    const { exceptionInfo, orderId } = this.state;
    console.log('------1--------', { ...exceptionInfo, orderId });
    const that = this;
    this.formObj.validateFields((error, values) => {
      console.log('校验结果：', error, values);
      if (!error) {
        that.setState({ isShowExceptionModal: false });
        dispatch({
          type: 'orders/fetchException',
          orderId,
          data: { ...exceptionInfo },
          success: () => { message.success('订单异常申请提交成功'); },
          error: (res) => { message.error(handleServerMsgObj(res.msg)); },
        });
      }
    });
  }

  // 校验表单：传入的是this.props.form对象
  validateForm = (formObj) => {
    console.log('我被调用了');
    this.formObj = formObj;
    // formObj.validateFields((error, values) => {
    //   console.log('校验出错', error, values);
    // });
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

  // 处理表单改变
  handlePaginationChange = (page, pageSize) => {
    const params = {
      currentPage: page,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
    this.setState(params);
    const { dispatch } = this.props;
    console.log('分页改变', params);    
    dispatch({
      type: 'orders/fetch',
      supplierId: 100,
      offset: params.offset,
      limit: params.limit,
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
    const { orders, loading, upload } = this.props;
    const { total } = orders;
    console.log('订单总量', total);
    const {
      isShowDeliveryModal,
      isShowOpenModal,
      isShowExceptionModal,
      openReceipt,
      data,
      currentPage,
    } = this.state;
    const uploadToken = upload.upload_token;

    const paginationOptions = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: currentPage,
      defaultPageSize: this.state.limit || 10,
      total,
    };

    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <List.Header />
            {
               orders.list.length > 0 
               ?
                null
               :
               <div style={{ textAlign: 'center' }}>暂无订单数据</div>
            }
            <Spin indicator={antIcon} tip="别急，我拼了老命也要把数据加载出来..." spinning={loading} >
            {
              orders.list.map((val, idx) => {
                const orderListItemHeader = (
                  <div className={styles['order-list-header']}>
                    <b>客户订单编号：</b>
                    <a href="#" className="order-sn">{val.order_sn}</a>
                    <span className="order-time">{moment(val.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</span>
                  </div>
                );
                return (
                  <List
                    header={orderListItemHeader}
                    data={val.sub_order}
                    key={idx}
                    bindModalClick={this.showModal}
                    handleTakingClick={this.takingOrder}
                  />
                );
              })
            }
            </Spin>
          </div>
          <Pagination
            className="pull-right"
            {...paginationOptions}
            onChange={this.handlePaginationChange}
          />
        </Card>
        {/* 发货单Modal */}
        <Modal
          visible={isShowDeliveryModal}
          width={800}
          title="发货单"
          onCancel={this.cancelModal.bind(this, 'isShowDeliveryModal')}
          onOk={this.okModal.bind(this, 'isShowDeliveryModal')}
        >
          <InvoiceContent
            data={this.state.data}
            onChange={this.handleDeliveryFormChange}
            handleValidate={this.validateForm}
          />
        </Modal>
        {/* 开票Modal */}
        <Modal
          width={680}
          visible={isShowOpenModal}
          title="开发票"
          onCancel={this.cancelModal.bind(this, 'isShowOpenModal')}
          onOk={this.okModal.bind(this, 'isShowOpenModal')}
        >
          <OpenReceiptContent
            list={openReceipt}
            uploadToken={uploadToken}
            onChange={this.handleFormChange}
            handleValidate={this.validateForm}
          />
        </Modal>
        {/* 异常处理Modal */}
        <Modal
          width={680}
          visible={isShowExceptionModal}
          title="异常处理申请"
          onCancel={this.cancelModal.bind(this, 'isShowExceptionModal')}
          onOk={this.okModal.bind(this, 'isShowExceptionModal')}
        >
          <ExceptionContent
            list={openReceipt}
            data={data}
            onChange={this.handleExceptionFormChange}
            handleValidate={this.validateForm}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
