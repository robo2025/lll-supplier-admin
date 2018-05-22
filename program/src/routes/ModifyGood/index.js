import React, { Component } from 'react';
import moment from 'moment';
import qs from 'qs';
import { connect } from 'dva';
import { Card, Button, message, Table, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ModifyGoodForm from '../../components/CustomeForm/ModifyGoodForm';
import { ACTION_FLAG } from '../../constant/statusList';
import { handleServerMsg } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;
// 操作记录列
const actionColumns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{ACTION_FLAG[val]}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}, {
  title: '操作员',
  dataIndex: 'creator',
  key: 'creator',
  render: (text, record) => (<span>{`${text}(${record.creator_id})`}</span>),
}, {
  title: '操作时间',
  dataIndex: 'created_time',
  key: 'created_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}];
const formItemLayout2 = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};

@connect(({ logs, loading, good }) => ({
  good,
  logs,
  loading,
}))
@Form.create()
export default class ModifyGood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'good/fetchDetail',
      gno: args.gno,
      success: (res) => { this.setState({ fields: res.data }); },
    });
    // 获取商品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'goods',
      objectId: args.gno,
    });
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
  }


  // 显示添加其他属性modal
  ShowAttrModal = () => {
    this.setState({ isShowAttrMOdal: true });
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
    const { fields, args } = this.state;
    const { id, shelf_life, sales_unit, stock, min_buy, prices } = fields;
    const { dispatch } = this.props;
    console.log('修改产品信息', fields);
    dispatch({
      type: 'good/modifyInfo',
      gno: args.gno,
      data: {
        shelf_life, sales_unit, stock, min_buy, prices,
      },
      success: () => { this.props.history.push('/goods/list'); },
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  render() {
    const { isShowAttrMOdal, fields } = this.state;
    const { good, logs, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
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

    console.log('商品修改详情页:', good, loading.models.good);

    return (
      <PageHeaderLayout title="修改商品信息" >
        <Card bordered={false} className={styles['modify-good-wrap']}>
          <ModifyGoodForm
            loading={loading.models.good}
            data={fields}
            onChange={this.handleFormChange}
            onAttrChange={this.handleGoodAttr}
          />
          <SectionHeader
            title="产品其他属性"
          />
          <div className="spec-wrap" style={{ width: 200 }}>
            <Form>
              {
                good.detail.product_model && good.detail.product_model.specs.map(val => (
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
              }
            </Form>
          </div>
          <div className={styles['section-header']}>
            <h2>操作日志</h2>
          </div>
          <Table
            loading={loading.models.logs}
            rowKey="id"
            columns={actionColumns}
            dataSource={logs.list}
          />
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交审核</Button>
            <Button onClick={() => { this.props.history.goBack(); }}>取消</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

