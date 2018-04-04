import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ShowGoodForm from '../../components/CustomeForm/ShowGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

// 其他属性列
const attrClomns = [{
  title: '属性名',
  dataIndex: 'attr_name',
  key: 'attr_name',
}, {
  title: '属性值',
  dataIndex: 'attr_value',
  key: 'attr_value',
}];
// 操作记录列
const actionFlag = ['新增', '修改', '删除']; // 操作类型 (1:新增 2:修改 3:删除)
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
export default class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: {
        pics: [],
        other_attrs: [],
      },
      newFiled: {}, // 用户自定义的其他属性
      otherAttrs: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'good/fetchDetail',
      goodId: args.goodId,
    });
    // 获取商品日志
    dispatch({
      type: 'good/queryLogs',
      module: 'goods',
      goodId: args.goodId,
    });
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
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }


  render() {
    const { isShowModal, isShowAttrMOdal, otherAttrsFiled } = this.state;
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

    console.log('商品详情页:', good.detail);

    return (
      <PageHeaderLayout title="新增商品信息" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          <ShowGoodForm
            loading={loading.models.good}
            data={good.detail}
            onChange={this.handleFormChange}
          />
          <SectionHeader
            title="商品其他属性"
          />
          <div style={{ width: '50%', maxWidth: 500 }}>
            <Table
              className="attr-table"
              bordered
              pagination={false}
              columns={attrClomns}
              dataSource={good.detail.product ? good.detail.product.other_attrs : []}
              locale={{
                emptyText: '该产品没有其它属性',
              }}
            />
          </div>
          <div className={styles['section-header']}>
            <h2>操作日志</h2>
          </div>
          <Card
            className={styles.tabsCard}
            bordered={false}
          >
            <Table
              pagination={{
                defaultPageSize: 6,
                pageSize: 6,
              }}
              loading={loading.models.good}
              dataSource={good.logs}
              columns={columns}
            />
          </Card>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.push('/goods/list'); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

