import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Row, Col, Form, Input, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import NewGoodForm from '../../components/CustomeForm/NewGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;

@connect(({ loading, product, good }) => ({
  product,
  good,
  loading,
}))
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
            min_quantity: 2, // 最小数量
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
      type: 'product/fetch',
      offset: 0,
      limit: 8,
    });
    if (args.origin_prdId) {
      dispatch({
        type: 'product/fetchDetail',
        productId: args.origin_prdId,
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
      console.log('提交新属性', newFiled);
    }
  }

  // 浏览器hash改变
  hashChangeFire = () => {
    const { dispatch } = this.props;
    const args = queryString.parse(this.props.location.search);
    this.setState({ args });
    if (args.origin_prdId) {
      dispatch({
        type: 'product/fetchDetail',
        productId: args.origin_prdId,
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
  * @param {string=} prdId 产品ID
  *
  * */
  handleAssociate = (prdId) => {
    const { history } = this.props;
    const { fields } = this.state;
    history.push(`/goods/new?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false, fields: { ...fields, product_id: prdId } });
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
    console.log('商品信息', { ...this.state.fields, ...obj });
  }

  // 当商品列表数据改变时：分页
  handleProductTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    console.log('产品table改变--：', pagination, filtersArg, sorter);
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'product/fetch',
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
    console.log('url参数', args);
    const { dispatch } = this.props;
    dispatch({
      type: 'good/add',
      data: {
        ...fields,
        product_id: args.origin_prdId,
      },
      success: () => { this.props.history.push('/goods/list'); },
      error: (res) => { message.error(res.msg, 2.5); },
    });
  }

  render() {
    const { isShowModal, isShowAttrMOdal, otherAttrsFiled, fields } = this.state;
    const { product, good, loading } = this.props;
    const { total } = product;
   
     // 其他属性列
     const attrClomns = [{
      title: '属性名',
      dataIndex: 'attr_name',
      key: 'attr_name',
    }, {
      title: '属性值',
      dataIndex: 'attr_value',
      key: 'attr_value',
      render: (text, record) => (
      <Input 
        defaultValue={text}      
        onChange={(e) => { 
          this.handleAddProductOtherAttr(
            record.id,
            { attr_name: record.attr_name, attr_value: e.target.value }
          ); 
        }}
      />
      ),
    }];

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
            <ProductList
              loading={loading.models.product}
              data={product.list}
              onAssociate={this.handleAssociate}
              onChange={this.handleProductTableChange}
              total={total}
            />
          </Modal>
          <NewGoodForm
            showModal={this.showModal}
            loading={loading.models.good}
            data={{ ...product.detail, ...fields }}
            onChange={this.handleFormChange}
            onAttrChange={this.handleGoodAttr}
          />
          <SectionHeader
            title="产品其他属性"
          />
          <div style={{ width: '50%', maxWidth: 500 }}>
            <Table
              className="attr-table"
              bordered
              pagination={false}
              columns={attrClomns}
              dataSource={product.detail.other_attrs}
            />
          </div>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交审核</Button>
            <Button onClick={() => { this.props.history.push('/goods/list'); }}>取消</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
