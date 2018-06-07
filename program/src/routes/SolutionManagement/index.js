import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Divider,
  Card,
  Badge,
  message,
  Table,
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: false, message: '请选择日期' }],
};
const slnStatus = (status) => {
  switch (status) {
    case 'P':
      return (
        <span>
          <Badge status="processing" />未报价
        </span>
      );
    case 'M':
      return (
        <span>
          <Badge status="success" />已报价
        </span>
      );
    case 'S':
      return (
        <span>
          <Badge status="default" />未发布
        </span>
      );
    default:
      return (
        <span>
          <Badge status="default" />无状态
        </span>
      );
  }
};
@connect(({ solution, loading }) => ({
  solution,
  loading: loading.models.solution,
}))
@Form.create()
class SolutionList extends React.Component {
  state = {
    formExpand: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetch',
    });
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'solution/handleTabChange',
      payload: key,
    });
    dispatch({
      type: 'solution/savePagination',
      payload: {
        current: 1,
        pageSize: 10,
      },
    });
    dispatch({
      type: 'solution/fetch',
    });
  };
  addCart = (row) => {
    this.props.dispatch({
      type: 'solution/addCart',
      payload: { gno: row.sln_no, quantity: 1 },
      callback: (success, data) => {
        if (success && success === true) {
          Modal.success({
            title: '添加购物车成功！',
            okText: '去看看',
            maskClosable: true,
            closable: true,
            onOk() {},
          });
        } else {
          message.error(data);
        }
      },
    });
  };
  render() {
    const { list } = this.props.solution;
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '方案询价单号',
        dataIndex: 'sln_no',
        key: 'sln_no',
      },
      {
        title: '方案名称',
        dataIndex: 'sln_name',
        key: 'sln_name',
      },
      {
        title: '预算金额',
        dataIndex: 'customer_price',
        key: 'customer_price',
        render: text => <span>¥{text}</span>,
      },
      {
        title: '状态',
        dataIndex: 'sln_status',
        key: 'sln_status',
        render: text => slnStatus(text),
      },
      {
        title: '报价金额',
        dataIndex: 'supplier_price',
        key: 'supplier_price',
        render: text => (text === 0 ? '-' : `¥${text}`),
      },
      {
        title: '创建时间',
        dataIndex: 'sln_date',
        key: 'sln_date',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:MM'),
      },
      {
        title: '操作',
        key: 'option',
        render: (row) => {
          if (row.sln_status === 'P') { // 未报价（已发布）
            return <a href={`${location.href}/detail?sln_no=${row.sln_no}`}>报价</a>;
          } else {
            return <a onClick={() => this.handleDelete(row)}>查看详情</a>;
          }
        },
      },
    ];
    return (
      <PageHeaderLayout title="方案询价单列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="方案编号">
                  {getFieldDecorator('sln_no')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="状态">
                  {getFieldDecorator('sln_status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="2">未报价</Option>
                      <Option value="2">已报价</Option>
                      <Option value="4">失效</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="创建时间">
                  {getFieldDecorator('brand')(
                    <RangePicker onChange={this.onDatepickerChange} />
                  )}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="应用">
                    {getFieldDecorator('no')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="">全部</Option>
                        <Option value="2">焊接</Option>
                        <Option value="4">搬运</Option>
                        <Option value="6">码垛</Option>
                        <Option value="6">切割</Option>
                        <Option value="6">抛光</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="行业">
                    {getFieldDecorator('no')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="">全部</Option>
                        <Option value="2">航空</Option>
                        <Option value="4">电力</Option>
                        <Option value="6">3C</Option>
                        <Option value="6">工业</Option>
                        <Option value="6">汽车</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.handleFormReset}
                >
                  重置
                </Button>
                <span
                  style={{ marginLeft: 8 }}
                  onClick={this.toggleForm}
                  className={styles.unfold}
                >
                  {this.state.formExpand ? (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: false });
                      }}
                    >
                      收起<Icon type="up" />
                    </a>
                  ) : (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: true });
                      }}
                    >
                      展开<Icon type="down" />
                    </a>
                  )}
                </span>
              </span>
            </div>
          </Form>
        </Card>
        <Card bordered={false} loading={loading} style={{ marginTop: 30 }}>
          <Table columns={columns} pagination={false} dataSource={list} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default SolutionList;
