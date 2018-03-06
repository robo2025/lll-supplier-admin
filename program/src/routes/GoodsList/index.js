import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Checkbox, Select, Icon, Button, Menu, DatePicker, Modal, message } from 'antd';
import GoodsTable from '../../components/StandardTable/GoodsTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodCheckboxGroup from '../../components/Checkbox/GoodCheckboxGroup';
import EditableTable from '../../components/CustomTable/EditTable';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const plainOptions = ['gno', 'product_name', 'brand_name', 'english_name', 'partnumber', 'prodution_place', 'category', 'stock', 'price', 'supplier_name', 'min_buy', 'audit_status', 'publish_status', 'created_time'];// 所有选项
const { TextArea } = Input;

// 商品列表
@connect(({ rule, loading, good }) => ({
  rule,
  good,
  loading: loading.models.rule,
}))
@Form.create()
export default class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.showExportModal = this.showExportModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handlePublishGood = this.handlePublishGood.bind(this);
    this.state = {
      expandForm: false,
      selectedRows: [],
      formValues: {},
      isShowExportModal: false,
      exportFields: [], // 导出产品字段 
      isCheckAll: false, // 是否全选导出数据  
      isShowUnpublishModal: false, // 是否显示下架原因Modal
      isShowPriceSettingModal: false,
      unpublishReason: {
        publish_type: 1,
      }, // 下架原因
      prices: [], // 商品价格区间数组
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    dispatch({
      type: 'good/fetch',
    });
  }

  onDatepickerChange = (date, dateString) => {
    console.log(date, dateString);
  }

  // 导出数据复选框改变
  onExportFieldsChange = (fields) => {
    console.log('exportFiles', fields);
    this.setState({
      exportFields: fields,
      isCheckAll: fields.length === plainOptions.length,
    });
  }

  // 全选按钮改变
  onCheckAllChange = (e) => {
    this.setState({
      isCheckAll: e.target.checked,
      exportFields: e.target.checked ? plainOptions : [],
    });
  }

  // 取消下架原因弹窗
  onCancelUnpublishModal = () => {
    this.setState({ isShowUnpublishModal: false });
  }

  // 确定下架原因弹窗  
  onOkUnpublishModal = () => {
    const { dispatch } = this.props;
    const { unpublishReason, goodId } = this.state;
    console.log('确定下架', unpublishReason.publish_type);
    this.setState({ isShowUnpublishModal: false });
    if (unpublishReason.publish_type) {
      dispatch({
        type: 'good/modifyGoodStatus',
        goodId,
        goodStatus: 0,
        publishType: unpublishReason.publish_type,
        desc: unpublishReason.desc,
        callback: () => { alert('下架成功。'); },
      });
    }
  }

  // 显示导出数据Modal
  showExportModal() {
    this.setState({ isShowExportModal: true });
  }

  // 取消导出数据
  handleCancel() {
    this.setState({ isShowExportModal: false });
  }
  // 确定导出数据
  handleOk() {
    this.setState({ isShowExportModal: false });
    console.log('商品导出数据项目', this.state.exportFields);
    const { dispatch } = this.props;
    dispatch({
      type: 'good/queryExport',
      fields: this.state.exportFields,
      callback: (res) => {
        console.log('http://139.199.96.235:9005/api/goods_reports?filename=' + res.filename);
        window.open('http://139.199.96.235:9005/api/goods_reports?filename=' + res.filename);
      },
    });
  }

  // 上下架商品
  handlePublishGood(goodId, status) {
    const { dispatch } = this.props;
    console.log(goodId, status);
    if (status === 0) { // 如果是下架商品，需要填写下架原因
      this.setState({ isShowUnpublishModal: true, goodId });
      return;
    }
    dispatch({
      type: 'good/modifyGoodStatus',
      goodId,
      goodStatus: status,
      callback: () => { alert('上架成功'); },
    });
  }

  // 选择下架原因类型
  handlePublishType = (type) => {
    console.log('type', type);
    const { unpublishReason } = this.state;
    this.setState({
      unpublishReason: { ...unpublishReason, publish_type: type },
    });
  }
  // 下架原因描述
  handlePublishDesc = (desc) => {
    console.log('desc', desc);
    const { unpublishReason } = this.state;
    this.setState({
      unpublishReason: { ...unpublishReason, desc },
    });
  }

  // 点击价格设置按钮
  handleClickPriceSettingBtn = (goodId) => {
    console.log('需要设置价格商品ID', goodId);
    const GoodsList1 = this.props.good.list;
    const selectedGood = GoodsList1.filter(val => (
      val.id === goodId
    ));
    this.setState({ 
      prices: selectedGood[0].prices, 
      isShowPriceSettingModal: true,
      goodId,
    });
  }
  // 确定：价格设置Modal
  okPriceSettingModal = () => {
    const { dispatch } = this.props;
    const { prices, goodId } = this.state;
    this.setState({ isShowPriceSettingModal: false });
    dispatch({
      type: 'good/modifyPrice',
      goodId,
      data: {
        prices,
      },
    });
  }
  // 取消：价格设置Modal 
  cancelPriceSettingModal = () => {
    this.setState({ isShowPriceSettingModal: false });
  }
  /**
  * 价格改变时处理
  * @param {object} obj json对象，产品属性key=>value
  */
  handleGoodPrice = (obj) => {
    console.log('商品列表·组件收到：', obj);
    this.setState({
      prices: obj.prices,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="商品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="2">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="佣金比率">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('no')(
                <InputGroup>
                  <Input style={{ width: 80, textAlign: 'center' }} placeholder="最低价" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <Input style={{ width: 80, textAlign: 'center', borderLeft: 0 }} placeholder="最高价" />
                </InputGroup>
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
            <FormItem label="商品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="1">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="1">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="佣金比率">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('no')(
                <InputGroup>
                  <Input style={{ width: 80, textAlign: 'center' }} placeholder="最低价" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <Input style={{ width: 80, textAlign: 'center', borderLeft: 0 }} placeholder="最高价" />
                </InputGroup>
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
          <Col xll={4} md={6} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="所属类目">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未知</Option>
                  <Option value="1">未知</Option>
                  <Option value="1">未知</Option>
                </Select>
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
    const { loading, good } = this.props;
    const { selectedRows, isShowPriceSettingModal, isShowExportModal, prices } = this.state;
    const data = good.list;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    console.log('商品列表页', this.state);

    return (
      <PageHeaderLayout title="商品列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button onClick={this.showExportModal}>导出数据</Button>
            </div>
            {/* 导出数据Modal */}
            <Modal
              visible={isShowExportModal}
              width="600px"
              title={<h4>导出数据<Checkbox style={{ marginLeft: 20 }} onChange={this.onCheckAllChange} checked={this.state.isCheckAll}>全选</Checkbox></h4>}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
            >
              <GoodCheckboxGroup
                onChange={this.onExportFieldsChange}
                isCheckAll={this.state.isCheckAll}
                checkedList={this.state.exportFields}
              />
            </Modal>
            {/* 填写下架原因Modal */}
            <Modal
              visible={this.state.isShowUnpublishModal}
              title="申请下架"
              onOk={this.onOkUnpublishModal}
              onCancel={this.onCancelUnpublishModal}
            >
              <Row gutter={24}>
                <Col span={5}>
                  下架类型：
                </Col>
                <Col span={12}>
                  <Select defaultValue="1" onChange={this.handlePublishType}>
                    <Option value="1">暂停生产该产品</Option>
                    <Option value="2">暂不供货</Option>
                    <Option value="3">产品升级</Option>
                    <Option value="0">其他</Option>
                  </Select>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={5}>
                  其他说明：
                </Col>
                <Col span={12}>
                  <TextArea onChange={(e) => { this.handlePublishDesc(e.target.value); }} />
                </Col>
              </Row>
            </Modal>
            <Modal
              width={805}
              title="价格设置"
              visible={isShowPriceSettingModal}
              onCancel={this.cancelPriceSettingModal}
              onOk={this.okPriceSettingModal}
            >
              <EditableTable
                data={prices}
                onChange={this.handleGoodPrice}
              />
            </Modal>
            <GoodsTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onPublish={this.handlePublishGood}
              onPriceSetting={this.handleClickPriceSettingBtn}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

