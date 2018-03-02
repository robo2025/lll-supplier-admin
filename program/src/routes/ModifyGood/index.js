import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Modal, Button, Row, Col, Form, Input, Upload, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ModifyGoodForm from '../../components/CustomeForm/ModifyGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;
const actionFlag = ['新增', '修改', '删除']; // 操作类型 (1:新增 2:修改 3:删除)
const operationTabList = [{
  key: 'tab1',
  tab: '操作日志一',
}, {
  key: 'tab2',
  tab: '操作日志二',
}, {
  key: 'tab3',
  tab: '操作日志三',
}];
// 操作记录列
const columns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{actionFlag[val - 1]}</span>,
}, {
  title: '操作员',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '执行结果',
  dataIndex: 'status',
  key: 'status',
  render: () => (<span>成功</span>),
}, {
  title: '操作时间',
  dataIndex: 'action_time',
  key: 'action_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}];

@connect(({ loading, good }) => ({
  good,
  loading,
}))
export default class ModifyGood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: {},
      newFiled: {}, // 用户自定义的其他属性
      otherAttrs: [],
      operationkey: 'tab1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'good/fetchDetail',
      goodId: args.goodId,
      callback: (res) => { this.setState({ fields: res }); },
    });
    // 获取商品日志
    dispatch({
      type: 'good/queryLogs',
      module: 'goods',
      goodId: args.goodId,
    });
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
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
    history.push(`/goods/new?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    console.log('form改变了', changedFields);
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
    console.log('母·组件收到：', obj);
    const goodInfo = { ...this.state.fields, ...obj };
    console.log('商品信息', goodInfo);
    this.setState({
      fields: goodInfo,
    });
  }

  /**
  * 提交修改商品信息
  * 
  */
  handleSubmitProduct = () => {
    const { fields } = this.state;
    const { id, shelf_life, sales_unit, stock, min_buy, prices } = fields;
    const { dispatch } = this.props;
    console.log('修改产品信息', fields);
    dispatch({
      type: 'good/modifyInfo',
      goodId: id,
      data: {
        shelf_life, sales_unit, stock, min_buy, prices,
      },
    });
  }

  render() {
    const { isShowAttrMOdal, fields } = this.state;
    const { good, loading } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={loading.models.good}
        dataSource={good.logs}
        columns={columns}
      />,
      tab2: <Table
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
        }}
        loading={loading.models.good}
        dataSource={good.logs}
        columns={columns}
      />,
      tab3: <Table
        pagination={{
          defaultPageSize: 3,
          pageSize: 3,
        }}
        loading={loading.models.good}
        dataSource={good.logs}
        columns={columns}
      />,
    };

    console.log('商品详情页index:', good, loading.models.good);

    return (
      <PageHeaderLayout title="新增商品信息" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          {/* 添加其它属性Modal */}
          <Modal
            width="650px"
            visible={isShowAttrMOdal}
            title="添加属性项"
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            {/*  <AddAttrForm
              onFieldsChange={this.handleAddOtherAttrFiled}
            /> */}
            添加其他属性
          </Modal>
          <ModifyGoodForm
            loading={loading.models.good}
            data={fields}
            onChange={this.handleFormChange}
            onAttrChange={this.handleGoodAttr}
          />
          <SectionHeader
            title="产品其他属性"
          />
          <Form style={{ width: 700, maxWidth: '70%' }} >
            {
              good.product ? (good.product.detail.map((val, idx) => (
                <FormItem
                  label={val.attr_name}
                  key={'otherAttr' + idx}
                  {...formItemLayout}
                >
                  <Row gutter={12}>
                    <Col span={6}>
                      <Input
                        defaultValue={val.attr_value}
                        onChange={(e) => {
                          this.handleAddProductOtherAttr(idx - 100, {
                            attr_name: val.attr_name,
                            attr_value: e.target.value,
                          });
                        }
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <Upload>
                        <Button icon="upload">上传图片</Button>
                      </Upload>
                    </Col>
                    <Col span={4}>
                      <span>{val.img_url}</span>
                    </Col>
                    <Col span={5}>
                      <span>
                        <a>删除</a>|
                        <a>查看</a>
                      </span>
                    </Col>
                  </Row>
                </FormItem>
              ))) : <span>无</span>
            }
          </Form>
          <div className={styles['section-header']}>
            <h2>操作日志</h2>
          </div>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[this.state.operationkey]}
          </Card>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交审核</Button>
            <Button onClick={() => { this.props.history.push('/goods/list'); }}>取消</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

