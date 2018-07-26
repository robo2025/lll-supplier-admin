import React, { Fragment } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import moment from 'moment';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Input,
  Table,
  Divider,
  Modal,
  Spin,
  message,
} from 'antd';
import { sha256 } from 'js-sha256';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './account.less';

const ModifyPasswordModal = Form.create()((props) => {
  const {
    passwordModalVisible,
    modifyPasswordModalCancel,
    modifyPasswordOk,
    form,
    recordInfo,
    modifyPasswordLoading,
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      sm: 5,
    },
    wrapperCol: {
      sm: 16,
    },
  };
  const checkConfirm = (rule, value, callback) => {
    if (value && value.length < 6) {
      callback('密码长度为6-12位');
    } else if (value && value.length > 12) {
      callback('密码长度为6-12位');
    } else if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };
  const checkNewpassword = (rule, value, callback) => {
    const newPassword = form.getFieldValue('new_password');
    if (newPassword && newPassword.length >= 6) {
      form.validateFields(['new_password'], { force: true });
    }
    callback();
  };
  const onOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return false;
      let values = {};
      if (fieldsValue.old_password) {
        const { old_password, new_password } = fieldsValue;
        values = { old_password: sha256.hex(old_password), new_password: sha256.hex(new_password) };
      } else {
        const { new_password } = fieldsValue;
        values = { new_password: sha256.hex(new_password) };
      }
        modifyPasswordOk(values, form);
    });
  };
  return (
    <Modal
      title="修改密码"
      okText="确认修改"
      onOk={onOk}
      onCancel={() => modifyPasswordModalCancel(form)}
      visible={passwordModalVisible}
    >
    <Spin spinning={modifyPasswordLoading}>
    <Form>
        <FormItem label="旧密码" {...formItemLayout}>
          {getFieldDecorator('old_password', {
            rules: [
              {
                required: recordInfo.is_subuser === 0,
                message: '请输入旧密码',
              },
              {
                min: 6,
                message: '密码长度为6-12位',
              },
              {
                max: 12,
                message: '密码长度为6-12位',
              },
            ],
          })(
            <Input
              type="password"
              placeholder={
                recordInfo.is_subuser !== 0 ? '********' : '请输入旧密码'
              }
              disabled={recordInfo.is_subuser !== 0}
            />
          )}
        </FormItem>
        <FormItem label="新密码" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入新密码' },
              {
                min: 6,
                message: '密码长度为6-12位',
              },
              {
                max: 12,
                message: '密码长度为6-12位',
              },
              {
                validator: checkNewpassword,
              },
            ],
          })(<Input type="password" placeholder="请输入新密码" />)}
        </FormItem>
        <FormItem label="确认密码" {...formItemLayout}>
          {getFieldDecorator('new_password', {
            rules: [
              { required: true, message: '请输入密码' },
              { validator: checkConfirm },
            ],
          })(<Input placeholder="请确认密码" type="password" />)}
        </FormItem>
    </Form>
    </Spin>
      
    </Modal>
  );
});
const FormItem = Form.Item;
const permissionDetail = [
  {
    code: 'contract_all',
    name: '合同管理',
  },
  {
    code: 'goods_all',
    name: '商品管理',
  },
  {
    code: 'bus_scope_all',
    name: '经营范围',
  },
  {
    code: 'trande_all',
    name: '交易管理',
  },
  {
    code: 'stock_all',
    name: '库存管理',
  },
  {
    code: 'return_all',
    name: '退货管理',
  },
  {
    code: 'refund_all',
    name: '退款管理',
  },
  {
    code: 'sln_quote_all',
    name: '方案询价管理',
  },
  {
    code: 'sln_order_all',
    name: '方案订单管理',
  },
  {
    code: 'company_all',
    name: '企业信息',
  },
];
@Form.create()
@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/fetchAccountList'],
  accountDetailLoading: loading.effects['account/fetchAccontDetail'],
  modifyPasswordLoading: loading.effects['account/fetchModifyPassword'],
}))
export default class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, {
        ignoreQueryPrefix: true,
      }),
      searchValues: {},
      infoVisible: false, // 查看详情模态框
      passwordModalVisible: false, // 修改密码模态框
      recordInfo: {}, // 记录需要修改密码的信息
    };
  }
  componentDidMount() {
    const { args } = this.state;
    this.getAccountList({
      params: {},
      offset: (args.page - 1) * args.pageSize,
      limit: args.pageSize,
    });
  }
  // table页面改变
  onPaginationChange = (pagination) => {
    const { history } = this.props;
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    history.replace({
      search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`,
    });
    this.getAccountList({
      params: searchValues,
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });
  };

  // 获取帐号列表
  getAccountList({ params, offset = 0, limit = 10 }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchAccountList',
      params,
      offset,
      limit,
    });
  }
  // 得到详情中的权限
  getPermissions = (permissions) => {
    const permissionDictionary = {};
    permissionDetail.forEach((ele) => {
      permissionDictionary[ele.code] = ele.name;
    });
    const permissionArr = [];
    const params = Object.values(permissions);
    params.forEach((ele) => {
      ele.forEach((val) => {
        permissionArr.push(permissionDictionary[val]);
      });
    });
    return permissionArr.join(' ');
  };
  // 点击搜索
  handleSearch = (e) => {
    e.preventDefault();
    const { form, history } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};
      for (const key in fieldsValue) {
        if (fieldsValue[key]) {
          values[key] = fieldsValue[key];
        }
      }
      this.setState({
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
        searchValues: values,
      });
      history.replace({
        search: `?page=1&pageSize=${args.pageSize}`,
      });
      this.getAccountList({
        params: values,
        offset: 0,
        limit: args.pageSize,
      });
    });
  };
  // 点击重置
  handleFormReset = () => {
    const { form, history } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      searchValues: {},
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
    });
    history.replace({
      search: `?page=1&pageSize=${args.pageSize}`,
    });
    this.getAccountList({
      params: {},
      offset: 0,
      limit: args.pageSize,
    });
  };
  // 弹出修改密码模态框
  modifyPassword = (record) => {
    this.setState({
      passwordModalVisible: true,
      recordInfo: record,
    });
  };
  // 修改密码模态框取消
  modifyPasswordModalCancel = (form) => {
    this.setState({
      passwordModalVisible: false,
    });
    form.resetFields();
  };
  // 确认修改密码
  modifyPasswordOk = (values, form) => {
    const { recordInfo } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchModifyPassword',
      user_id: recordInfo.id,
      params: values,
      success: () => {
        form.resetFields();
        message.success('修改密码成功');
        this.setState({
            passwordModalVisible: false,
        });
      },
      error: (res) => {
        message.error(res.msg);
      },
    });
  };
  // 查看详情
  viewRecord = (record) => {
    const { dispatch } = this.props;
    this.setState({
      infoVisible: true,
    });
    dispatch({
      type: 'account/fetchAccontDetail',
      user_id: record.id,
    });
  };
  // 取消查看详情
  cancelViewInfo = () => {
    this.setState({
      infoVisible: false,
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSearch}
        className={styles.tableListForm}
        layout="inline"
      >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="帐号">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('position')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('realname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    const { account, loading, accountDetailLoading, modifyPasswordLoading } = this.props;
    const { accountList, accountTotal, accountDeatil } = account;
    const { args, infoVisible, passwordModalVisible, recordInfo } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '账号',
        key: 'username',
        dataIndex: 'username',
      },
      {
        title: '账号类型',
        key: 'is_subuser',
        dataIndex: 'is_subuser',
        render: val => (val === 1 ? '子账号' : '主账号'),
      },
      {
        title: '姓名',
        key: 'realname',
        render: record => record.profile.realname || '--',
      },
      {
        title: '联系方式',
        key: 'mobile',
        render: record =>
          (record.is_subuser === 1
            ? record.profile.telphone || '--'
            : record.mobile || '--'),
      },
      {
        title: '岗位',
        key: 'position',
        render: record => record.profile.position || '--',
      },
      {
        title: '操作',
        key: 'operation',
        render: (record) => {
          return (
            <Fragment>
              <a
                href=" javascript:;"
                style={{ textDecoration: 'none' }}
                onClick={() => this.viewRecord(record)}
              >
                查看{' '}
              </a>
              <Divider type="vertical" />
              <a
                href=" javascript:;"
                style={{ textDecoration: 'none' }}
                onClick={() => this.modifyPassword(record)}
              >
                修改密码{' '}
              </a>
            </Fragment>
          );
        },
      },
    ];
    const paginationOptions = {
      total: accountTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    const formItemLayout = {
      labelCol: {
        sm: 11,
      },
      wrapperCol: {
        sm: 12,
      },
    };
    const {
      username,
      is_subuser,
      mobile,
      create_time,
      profile,
    } = accountDeatil;
    const { position, realname, telphone, permissions } = profile || {};
    return (
      <PageHeaderLayout title="帐号列表">
        <Card title="搜索条件">{this.renderForm()}</Card>
        <Card style={{ marginTop: 30 }}>
          <Table
            columns={columns}
            dataSource={accountList.map((ele, index) => {
              return { ...ele, key: index };
            })}
            loading={loading}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
          />
        </Card>
        <Modal
          title="帐号详情"
          width={500}
          visible={infoVisible}
          onCancel={this.cancelViewInfo}
          footer={[
            <div style={{ textAlign: 'center' }} key="goBack">
              <Button type="primary" onClick={this.cancelViewInfo}>
                返回
              </Button>
            </div>,
          ]}
        >
          <Spin spinning={accountDetailLoading}>
            <Form>
              <FormItem label="账号" {...formItemLayout}>
                {username}
              </FormItem>
              <FormItem label="账号类型" {...formItemLayout}>
                {is_subuser === 1 ? '子账号' : '主账号'}
              </FormItem>
              <FormItem label="联系人" {...formItemLayout}>
                {realname || '--'}
              </FormItem>
              <FormItem label="联系方式" {...formItemLayout}>
                {is_subuser === 1 ? telphone || '--' : mobile || '--'}
              </FormItem>
              <FormItem label="部门角色" {...formItemLayout}>
                {is_subuser === 1 ? position || '--' : '超级管理员'}
              </FormItem>
              <FormItem label="授权模块" {...formItemLayout}>
                {permissions ? this.getPermissions(permissions) : '--'}
              </FormItem>
              <FormItem label="创建日期" {...formItemLayout}>
                {moment(create_time).format('YYYY-MM-DD HH:mm:ss')}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
        <ModifyPasswordModal
          passwordModalVisible={passwordModalVisible}
          modifyPasswordModalCancel={this.modifyPasswordModalCancel}
          recordInfo={recordInfo}
          modifyPasswordOk={this.modifyPasswordOk}
          modifyPasswordLoading={modifyPasswordLoading}
        />
      </PageHeaderLayout>
    );
  }
}
