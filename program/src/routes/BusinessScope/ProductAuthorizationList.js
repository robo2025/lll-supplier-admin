import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  DatePicker,
  Table,
  Pagination,
  Badge,
  Modal,
  Alert,
  Cascader,
} from 'antd';
import styles from './index.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
function getStandardCategory(data) {
  data.map((ele) => {
    if (ele.children && ele.children.length > 0 && ele.level < 3) {
      getStandardCategory(ele.children);
    } else {
      delete ele.children;
    }
  });
}
@connect(({ businessScope, loading }) => ({
  businessScope,
  loading: loading.effects['businessScope/fetch'],
}))
@Form.create()
export default class ProductAuthorizationList extends Component {
  state = {
    formExpand: false,
    selectedRowKeys: [],
  };
  componentDidMount() {
    const { id, dispatch } = this.props;
    dispatch({
      type: 'businessScope/fetch',
      payload: { id },
    });
    dispatch({
      type: 'businessScope/fetchLevel',
    });
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const { rangeValue, category, ...others } = fieldsValue;
    let categoryId = {};
    if (category && category.length > 0) {
      categoryId = {
        category_id_1: category[0],
        category_id_2: category[1],
        category_id_3: category[2],
      };
    }
    this.props.dispatch({
      type: 'businessScope/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'businessScope/fetch',
      payload: {
        ...others,
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
        ...categoryId,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form, id } = this.props;
    form.resetFields();
    dispatch({
      type: 'businessScope/fetch',
      payload: { id },
    });
  };
  handleSearch = (e) => {
    const { id } = this.props;
    e.preventDefault();
    const { dispatch, form, businessScope } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { rangeValue, category, ...others } = fieldsValue;
      let categoryId = {};
      if (category && category.length > 0) {
        categoryId = {
          category_id_1: category[0],
          category_id_2: category[1],
          category_id_3: category[2],
        };
      }
      const values = {
        ...others,
        id: this.props.id,
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
        ...categoryId,
      };
      dispatch({
        type: 'businessScope/savePagination',
        payload: { ...businessScope.pagination, current: 1 },
      });
      dispatch({
        type: 'businessScope/fetch',
        payload: { ...values, id },
      });
    });
  };
  handleExport = () => {};
  render() {
    const { loading, businessScope } = this.props;
    const { list, pagination, level } = businessScope;
    getStandardCategory(level);
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      ...pagination,
      style: { float: 'right', marginTop: 24 },
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '注册地',
        dataIndex: 'registration_place',
        key: 'registration_place',
      },
      {
        title: '所属三级类目',
        dataIndex: 'category_id_3.category_name',
        key: 'category_id_3.id',
      },
      {
        title: '所属二级类目',
        dataIndex: 'category_id_2.category_name',
        key: 'category_id_2.id',
      },
      {
        title: '所属一级类目',
        dataIndex: 'category_id_1.category_name',
        key: 'category_id_1.id',
      },
      {
        title: '授权日期',
        dataIndex: 'created_time',
        key: 'created_time',
        render: text => moment.unix(text).format('YYYY-MM-DD'),
      },
      {
        title: '操作',
        key: 'option',
        render: row => (
          <a
            onClick={() =>
              this.props.dispatch(
                routerRedux.push({
                  pathname: '/BusinessScope/ProductDetail',
                  search: `?pno=${row.pno}`,
                })
              )
            }
          >
            查看
          </a>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="授权产品列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="产品名称">
                  {getFieldDecorator('product_name')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="品牌">
                  {getFieldDecorator('brand_name')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="所属类目">
                  {getFieldDecorator('category')(
                    <Cascader
                      options={level}
                      changeOnSelect
                      placeholder="请选择类目"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="授权时间">
                      {getFieldDecorator('rangeValue')(<RangePicker />)}
                    </FormItem>
                  </Col>
                </Row>
              </Fragment>
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
        <Card style={{ marginTop: 10 }} loading={loading}>
          <Button
            disabled
            type="primary"
            onClick={() => this.handleExport(this.state.selectedRowKeys)}
          >
            批量导出
          </Button>
          <div style={{ marginTop: 8 }}>
            <Alert
              message={
                <Fragment>
                  已选择
                  <a style={{ fontWeight: 600 }}>
                    {this.state.selectedRowKeys.length}
                  </a>
                  项
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
          <Table
            columns={columns}
            pagination={false}
            dataSource={list}
            rowKey="pno"
            rowSelection={rowSelection}
          />
          <Pagination {...paginationProps} />
        </Card>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Button
            size="large"
            type="primary"
            onClick={() => {
              Modal.info({
                content:
                  '申请产品授权变更请联系工业魔方客服人员，并提交相关产品资质证件！',
                title: '申请变更产品权限',
              });
            }}
          >
            申请变更产品授权
          </Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
