import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import Cookies from 'js-cookie';
import { Row, Upload, Col, Card, Form, Input, Checkbox, Select, Icon, Button, DatePicker, Modal, message } from 'antd';
import GoodsTable from '../../components/StandardTable/GoodsTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodCheckboxGroup from '../../components/Checkbox/GoodCheckboxGroup';
import EditableTable from '../../components/CustomTable/EditTable';
import ModelContent from './ModelContent';
import { handleServerMsg, handleServerMsgObj, checkFile } from '../../utils/tools';
import { PAGE_SIZE, SUCCESS_STATUS, FAIL_STATUS } from '../../constant/config';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const plainOptions = ['gno', 'product_name', 'brand_name', 'english_name', 'partnumber', 'prodution_place', 'category', 'stock', 'price', 'supplier_name', 'min_buy', 'audit_status', 'publish_status', 'created_time'];// 所有选项
const { TextArea } = Input;

// 商品列表
@connect(({ loading, good }) => ({
  good,
  loading,
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
      isImportModal: false,
      prices: [], // 商品价格区间数组
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
      searchValues: {},
    };
  }

  componentDidMount() {
    this.dispatchDefaultList();
    this.dispatchProductModelList({});
  }


  onDatepickerChange = (date, dateString) => {
    console.log(date, dateString);
  }

  // 导出数据复选框改变
  onExportFieldsChange = (fields) => {
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
    const { unpublishReason, gno } = this.state;
    this.setState({ isShowUnpublishModal: false });
    if (unpublishReason.publish_type) {
      dispatch({
        type: 'good/modifyGoodStatus',
        gno,
        goodStatus: 0,
        publishType: unpublishReason.publish_type,
        desc: unpublishReason.desc,
        success: () => {
          message.success('下架成功。');
          this.dispatchDefaultList();
        },
        error: (res) => { message.error(handleServerMsgObj(res.msg)); },
      });
    }
  }

  // 获取商品列表
  dispatchDefaultList = () => {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'good/fetch',
      params: null,
      offset: args.page ? (args.page - 1) * PAGE_SIZE : 0,
      limit: PAGE_SIZE,
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'good/queryExport',
      fields: this.state.exportFields,
      success: (res) => {
        window.open(`http://139.199.96.235:9005/api/goods/goods_reports?filename=${res.filename}`);
      },
    });
  }

  // 获取产品型号列表
  dispatchProductModelList = ({ offset = 0, limit = 6, params = {} }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'good/fetchAassociatedProduct',
      offset,
      limit,
      params,
    });
  }

  // bindState
  bindModelThis = ($this) => {
    this.$ModelThis = $this;
  }

  // 处理下载模板产品列表改变
  handleModelTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    this.dispatchProductModelList({ offset: params.offset, limit: params.pageSize });
  }

  // 是否显示modal
  toggleModal = (key, visible) => {
    this.setState({ [key]: visible });
  }

  // 图片上传前处理：验证文件类型
  handleBeforeUpload = (file) => {
    if (!checkFile(file.name, ['xls', 'xlsx'])) {
      message.error(`${file.name}的文件格式暂不支持上传`);
      return false;
    }
  }

  handleModelUploadChange = ({ file }) => {
    const DOWNLOAD_URL = 'https://testapi.robo2025.com/scm-service/download';
    if (file.status === 'done' && file.response) {
      const { data, msg, rescode } = file.response;
      if (rescode >> 0 === SUCCESS_STATUS) {
        message.success(msg);
      } else if (rescode >> 0 === FAIL_STATUS) {
        Modal.error({
          title: '导入失败',
          content: <div><p>失败文件下载：</p><a href={`${DOWNLOAD_URL}?filename=${data.filename}`}>{data.filename}</a></div>,
        });
      } else {
        message.error(msg);
      }
    }
  }

  handleModelOk = () => {
    console.log('$ModelThis', this.$ModelThis, this.$ModelThis.state);
    const { modelList } = this.$ModelThis.state;
    const mnos = modelList.map(val => val.mno);
    if (mnos.length > 0) {
      this.setState({ isImportModal: false });
      window.open(`https://testapi.robo2025.com/scm-service/goods/template?${qs.stringify({ mnos }, { indices: false })}`);
    } else {
      this.setState({ isImportModal: false });
    }
  }

  // 上下架商品
  handlePublishGood(gno, status) {
    const { dispatch } = this.props;
    if (status === 0) { // 如果是下架商品，需要填写下架原因
      this.setState({ isShowUnpublishModal: true, gno });
      return;
    }
    dispatch({
      type: 'good/modifyGoodStatus',
      gno,
      goodStatus: status,
      success: () => {
        message.success('上架成功');
        this.dispatchDefaultList();
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 选择下架原因类型
  handlePublishType = (type) => {
    const { unpublishReason } = this.state;
    this.setState({
      unpublishReason: { ...unpublishReason, publish_type: type },
    });
  }
  // 下架原因描述
  handlePublishDesc = (desc) => {
    const { unpublishReason } = this.state;
    this.setState({
      unpublishReason: { ...unpublishReason, desc },
    });
  }

  // 点击价格设置按钮
  handleClickPriceSettingBtn = (gno) => {
    const GoodsList1 = this.props.good.list;
    const selectedGood = GoodsList1.filter(val => (
      val.gno === gno
    ));
    this.setState({
      prices: selectedGood[0].prices.sort((a, b) => a.min_quantity - b.min_quantity),
      isShowPriceSettingModal: true,
      gno,
    });
  }
  // 确定：价格设置Modal
  okPriceSettingModal = () => {
    const { dispatch } = this.props;
    const { prices, gno } = this.state;
    this.setState({ isShowPriceSettingModal: false });
    dispatch({
      type: 'good/modifyPrice',
      gno,
      data: {
        prices,
      },
      success: () => {
        message.success('操作成功');
        this.dispatchDefaultList();
      },
      error: (res) => { message.error(handleServerMsg(res.msg)); },
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
    this.setState({
      prices: obj.prices,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, history } = this.props;
    const { searchValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };

    // 分页：将页数提取到url上
    history.push({
      search: `?page=${params.currentPage}`,
    });

    dispatch({
      type: 'good/fetch',
      offset: params.offset,
      limit: params.pageSize,
      params: searchValues,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'good/fetch',
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

  jumpToPage = (url) => {
    const { history } = this.props;
    history.push(url);
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const createTime = {};
      if (fieldsValue.create_time) {
        createTime.created_start = fieldsValue.create_time[0].format('YYYY-MM-DD');
        createTime.created_end = fieldsValue.create_time[1].format('YYYY-MM-DD');
      }
      const values = {
        ...fieldsValue,
        ...createTime,
      };

      this.setState({ searchValues: values });
      const {
        gno,
        created_start,
        created_end,
      }
        = values;
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'good/fetch',
        params: {
          gno,
          created_start,
          created_end,
        },
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
              {getFieldDecorator('gno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('audit_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="上下架状态">
              {getFieldDecorator('publish_status')(
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
              {getFieldDecorator('yj')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('price')(
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
              {getFieldDecorator('gno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('audit_status')(
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
              {getFieldDecorator('publish_status')(
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
              {getFieldDecorator('yj')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('price')(
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
              {getFieldDecorator('good_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('model')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="所属类目">
              {getFieldDecorator('cata')(
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
              {getFieldDecorator('create_time')(
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
    const { loading, good, productModel } = this.props;
    const { selectedRows, isShowPriceSettingModal, isShowExportModal, prices, isImportModal } = this.state;
    const data = good.list;
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
              <Button type="primary" icon="plus" onClick={this.jumpToPage.bind(this, 'new')}>新建</Button>

              {/* <Button onClick={this.showExportModal}>导出数据</Button> */}
              <div style={{ display: 'inline-block', marginLeft: 32 }}>
                <Upload
                  className={styles.upload}
                  name="file"
                  action="https://testapi.robo2025.com/scm-service/goods/template"
                  headers={{
                    Authorization: Cookies.get('access_token') || 'null',
                  }}
                  showUploadList={false}
                  onChange={this.handleModelUploadChange}
                  beforeUpload={this.handleBeforeUpload}
                >
                  <Button type="primary">
                    <Icon type="upload" />批量导入商品数据
                  </Button>
                </Upload>
                <Button onClick={() => { this.toggleModal('isImportModal', true); }}>下载数据模板</Button>
              </div>
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
              loading={loading.models.good}
              data={data}
              total={good.total}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onPublish={this.handlePublishGood}
              onPriceSetting={this.handleClickPriceSettingBtn}
            />
          </div>
          {/* 下载数据模板Modal */}
          <Modal
            width="60%"
            visible={isImportModal}
            title="下载模板选择"
            okText=""
            cancelText=""
            onCancel={() => { this.toggleModal('isImportModal', false); }}
            onOk={this.handleModelOk}
          >
            <ModelContent
              dataSource={good.products}
              total={good.productTotal}
              loading={loading.models.good}
              onModelTableChange={this.handleModelTableChange}
              bindModelThis={this.bindModelThis}
              onSearch={this.dispatchProductModelList}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}

