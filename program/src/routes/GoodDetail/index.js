import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import moment from 'moment';
import { Card, Table, Button, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ShowGoodForm from '../../components/CustomeForm/ShowGoodForm';
import { ACTION_FLAG } from '../../constant/statusList';

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

@connect(({ good, logs, loading }) => ({
  good,
  logs,
  loading,
}))
@Form.create()
export default class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    });
    // 获取商品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'goods',
      objectId: args.gno,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { good, logs, loading } = this.props;

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
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
