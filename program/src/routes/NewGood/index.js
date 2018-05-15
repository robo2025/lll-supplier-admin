import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Input, Form, message, Select, Row, Col, Cascader } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import NewGoodForm from '../../components/CustomeForm/NewGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout2 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};

@connect(({ loading, product, good }) => ({
  product,
  good,
  loading,
}))
@Form.create()
export default class NewGood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: {
        shelf_life: '1年', // 质保期
        sales_unit: '个', // 销售单位
        stock: '20', // 库存
        min_buy: '10', // 最小采购量 (可选)
        prices: [ // 价格
          {
            id: -100,
            min_quantity: 10, // 最小数量
            max_quantity: 100, // 最大数量
            price: '1000', // 价格
            lead_time: '1天', // 货期
          },
        ],
      },
      newFiled: {}, // 用户自定义的其他属性
      otherAttrsFiled: [{
        attr_name: '形状',
      }, {
        attr_name: '控制输出',
      }, {
        attr_name: '检测物体',
      }],
      otherAttrs: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取产品列表
    dispatch({
      type: 'good/fetchAassociatedProduct',
    });
    if (args.mno) {
      dispatch({
        type: 'good/fetchAassociatedProductDetail',
        mno: args.mno,
      });
    }
    window.onhashchange = this.hashChangeFire;
  }

  onCancel = () => {
    this.setState({ isShowModal: false });
    this.setState({ isShowAttrMOdal: false });
  }

  onOk = () => {
    this.setState({ isShowModal: false });
    const { newFiled, otherAttrsFiled, otherAttrs } = this.state;
    if (newFiled.attr_name && newFiled.attr_value) {
      this.setState({ isShowAttrMOdal: false }); // 隐藏添加属性弹窗
      this.setState({
        otherAttrsFiled: [
          ...otherAttrsFiled,
          { attr_name: newFiled.attr_name.value, attr_value: newFiled.attr_value.value },
        ],
        otherAttrs: [
          ...otherAttrs,
          {
            id: otherAttrsFiled.length - 100,
            attr_name: newFiled.attr_name.value,
            attr_value: newFiled.attr_value.value,
          },
        ],
      });
    }
  }

  // 浏览器hash改变
  hashChangeFire = () => {
    const { dispatch } = this.props;
    const args = queryString.parse(this.props.location.search);
    this.setState({ args });
    if (args.mno) {
      dispatch({
        type: 'good/fetchAassociatedProductDetail',
        mno: args.mno,
      });
    }
  }

  // 显示关联产品modal
  showModal = () => {
    this.setState({ isShowModal: true });
  }
  // 显示添加其他属性modal
  ShowAttrModal = () => {
    this.setState({ isShowAttrMOdal: true });
  }

  /**
  * 点击关联后事件
  * @param {string=} mno 产品型号ID
  *
  * */
  handleAssociate = (mno) => {
    const { history } = this.props;
    const { fields } = this.state;
    history.push(`/goods/new?mno=${mno}`);
    this.setState({ isShowModal: false, fields: { ...fields, product_id: mno } });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }

  /**
  * 当商品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
  *
  * @param {object} obj json对象，产品属性key=>value
  *
  */
  handleGoodAttr = (obj) => {
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
  }

  // 当商品列表数据改变时：分页
  handleProductTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'good/fetchAassociatedProduct',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  /**
  * 提交商品信息
  *
  */
  handleSubmitProduct = () => {
    const { fields, args } = this.state;
    const { dispatch, history } = this.props;
    dispatch({
      type: 'good/add',
      data: {
        ...fields,
        mno: args.mno,
      },
      success: () => { history.goBack(); },
      error: (res) => { message.error(res.msg, 2.5); },
    });
  }

  handleSearch = () => {
    Modal.info({
      title: '提示',
      content: (
        <div>
          <p>搜索功能还没有提供接口</p>
        </div>
      ),
      onOk() { },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
          <Col xll={6} md={8} sm={24}>
            <FormItem label="所属分类">
              {getFieldDecorator('catalog')(
                <Cascader
                  options={[]}
                  placeholder="请您选择类目"
                />
              )}
            </FormItem>
          </Col>
          <Col xll={6} md={8} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('type')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={6} md={8} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
          <Col xll={8} md={8} sm={24}>
            <FormItem label="产品ID">
              {getFieldDecorator('pno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={8} md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('catalog')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={8} md={8} sm={24}>
            <FormItem label="是否已关联">
              {getFieldDecorator('Association', {
                initialValue: '全部',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginTop: 18 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const { isShowModal, fields, args } = this.state;
    const { good, loading } = this.props;
    const { total } = good;
    const { getFieldDecorator } = this.props.form;

    console.log('新建props和state', this.props.product, this.state);

    return (
      <PageHeaderLayout title="新增商品信息" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          {/* 参照数据Modal */}
          <Modal
            width="90%"
            visible={isShowModal}
            title="关联参照数据"
            okText=""
            cancelText=""
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <ProductList
              loading={loading.models.good}
              data={good.products}
              onAssociate={this.handleAssociate}
              onChange={this.handleProductTableChange}
              total={total}
            />
          </Modal>
          <NewGoodForm
            showModal={this.showModal}
            loading={loading.models.good}
            data={{ ...good.productDetail, ...fields }}
            onChange={this.handleFormChange}
            onAttrChange={this.handleGoodAttr}
            args={args}
          />
          <SectionHeader
            title="商品其他属性"
          />
          <div className="spec-wrap" style={{ width: 200 }}>
            <Form>
              {
                (good.productDetail.specs && good.productDetail.specs.length > 0) ?
                  good.productDetail.specs.map(val => (
                    <FormItem
                      label={val.spec_name}
                      {...formItemLayout2}
                      key={val.id}
                    >
                      {getFieldDecorator(`spec_${val.spec_name}`, {
                      })(
                        <span>{val.spec_value}{val.spec_unit}</span>
                      )}
                    </FormItem>
                  ))
                  :
                  '无'
              }
            </Form>
          </div>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交审核</Button>
            <Button onClick={() => { this.props.history.goBack(); }}>取消</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
