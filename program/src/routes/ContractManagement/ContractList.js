import React from 'react';
import qs from 'qs';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {
    Form,
    Row,
    Col,
    Button,
    Icon,
    Badge,
    Select,
    Input,
    Card,
    Table,
    Modal,
    message,
    Spin,
    DatePicker,
  } from 'antd';
  import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { CONTRACT_STATUS } from '../../constant/statusList';
import styles from './contract.less';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const contractBadge = ['default', 'success', 'warning', 'error'];
@Form.create()
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects['contract/fetch'],
  detailLoading: loading.effects['contract/fetchContractDetail'],
}))
export default class ContractList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, {
        ignoreQueryPrefix: true,
      }),
      searchValues: {},
      visible: false, // 查看模态
    };
  }
  componentDidMount() {
    const { args } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
      offset: (args.page - 1) * args.pageSize,
      limit: args.pageSize,
    });
  }
  onCancel = () => {
    // 取消查看模态框
    this.setState({
      visible: false,
    });
  };
  onTableChange = (pagination) => {
    // 表格页码发生改变
    const { dispatch, history } = this.props;
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
    dispatch({
      type: 'contract/fetch',
      offset: pagination.pageSize * (pagination.current - 1),
      limit: pagination.pageSize,
      params: searchValues,
    });
  };
  // 搜索条件
  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch, history } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { create_time, ...values } = fieldsValue;
      if (create_time && create_time.length > 0) {
        values.start_time = create_time[0].format('YYYY-MM-DD');
        values.end_time = create_time[1].format('YYYY-MM-DD');
      }
      const searchValues = {};
      for (const key in values) {
        if (values[key]) {
          searchValues[key] = values[key].trim();
        }
      }
      this.setState({
        searchValues,
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
      });
      history.replace({
        search: `?page=1&pageSize=${args.pageSize}`,
      });
      dispatch({
        type: 'contract/fetch',
        offset: 0,
        limit: args.pageSize,
        params: searchValues,
      });
    });
  };
  handleFormReset = () => {
    const { form, history, dispatch } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
      searchValues: {},
    });
    history.replace({
      search: `?page=1&pageSize=${args.pageSize}`,
    });
    dispatch({
      type: 'contract/fetch',
      offset: 0,
      limit: args.pageSize,
    });
  };
  viewInfo = (record) => {
    // 确定查看详情
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetchContractDetail',
      id: record.id,
      success: () => {},
      error: (res) => {
        message.error(res.msg);
      },
    });
    this.setState({
      visible: true,
    });
  };
  renderForm() {
    const { form } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles.tableListForm} onSubmit={this.handleSearch}>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="合同编号">
              {getFieldDecorator('contract_no')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同类型">
              {getFieldDecorator('contract_type')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="合同状态">
              {getFieldDecorator('contract_status')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  <Option value="1">未过期</Option>
                  <Option value="2">即将过期</Option>
                  <Option value="3">已过期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? (
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
              <FormItem label="创建时间">
                {getFieldDecorator('create_time')(<RangePicker locale={locale} />)}
              </FormItem>
            </Col>
          </Row>
        ) : null}
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <span
              style={{ marginLeft: 8 }}
              onClick={this.toggleForm}
              className={styles.unfold}
            >
              {expandForm ? (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: false });
                  }}
                >
                  收起<Icon type="up" />
                </a>
              ) : (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: true });
                  }}
                >
                  展开<Icon type="down" />
                </a>
              )}
            </span>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    const { contract, loading, detailLoading } = this.props;
    const { contractList, contractTotal, contractDetail } = contract;
    const { contract_info, supplier_info } = contractDetail;
    const {
      contract_no,
      contract_type,
      start_time,
      end_time,
      contract_urls,
      contract_status,
    } =
      contract_info || {};
    const { mobile, username, profile } = supplier_info || {};
    const { company, legal } = profile || {};
    const { args, visible } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        width: 60,
        key: 'idx',
        dataIndex: 'idx',
        render: (text, record, index) => index + 1,
      },
      {
        title: '合同编号',
        // width:"240px",
        dataIndex: 'contract_no',
        key: 'contract_no',
      },
      {
        title: '合同类型',
        // width:"240px",
        dataIndex: 'contract_type',
        key: 'contract_type',
      },
      {
        title: '合同有效期',
        // width:"180px",
        key: 'startAndEnd',
        render: record => `${record.start_time} ~ ${record.end_time}`,
      },
      {
        title: '合同状态',
        width: '120px',
        dataIndex: 'contract_status',
        key: 'contract_status',
        render: val => (
          <Badge status={contractBadge[val]} text={CONTRACT_STATUS[val]} />
        ),
      },
      {
        title: '创建时间',
        // width:"180px",
        key: 'created_time',
        dataIndex: 'created_time',
        render: val => moment(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        width: 80,
        render: (record) => {
          return (
            <a
              style={{ textDecoration: 'none' }}
              href=" javascript:;"
              onClick={() => this.viewInfo(record)}
            >
              查看
            </a>
          );
        },
      },
    ];
    const paginationOptions = {
      total: contractTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    const FormItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };
    return (
      <PageHeaderLayout title="供应商合同列表">
        <Card title="搜索条件" className={styles['search-wrap']}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card>
          <Table
            columns={columns}
            dataSource={contractList}
            rowKey={record => record.id}
            pagination={paginationOptions}
            loading={loading}
            onChange={this.onTableChange}
          />
          <Modal
            visible={visible}
            title="查看合同"
            width="600px"
            onCancel={this.onCancel}
            footer={null}
          >
            <Spin spinning={detailLoading}>
              <Form layout="horizontal">
                <Row>
                  <Col span={12}>
                    <FormItem label="合同编号" {...FormItemLayout}>
                      {contract_no}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="企业名称" {...FormItemLayout}>
                      {company}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="合同类型" {...FormItemLayout}>
                      {contract_type}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="法人" {...FormItemLayout}>
                      {legal}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="合同有效期" {...FormItemLayout}>
                      {`${start_time} ~ ${end_time}`}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="帐号" {...FormItemLayout}>
                      {username}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="合同状态" {...FormItemLayout}>
                      {CONTRACT_STATUS[contract_status]}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="联系电话" {...FormItemLayout}>
                      {mobile}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="合同电子档" {...FormItemLayout}>
                      {contract_urls ? (
                        <a href={contract_urls.split('@')[1]} target=" _blank">
                          {contract_urls.split('@')[0]}
                        </a>
                      ) : null}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Spin>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
