import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import qs from 'qs';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Pagination, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PAGE_SIZE } from '../../constant/config';
import List from '../../components/List/RefundsList';

import styles from './RefundsList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
    orders,
    loading: loading.models.orders,
}))
@Form.create()
export default class RefundsList extends Component {
    constructor(props) {
        super(props);
        const args = qs.parse(props.location.search || {page:1,pageSize:10}, { ignoreQueryPrefix: true });
        this.state = {
            expandForm: false,
            args,
            searchValues: {},
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: 'orders/fetchRefunds',
            offset:(args.page - 1) *(args.pageSize),
            limit: args.pageSize,
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleFormReset = () => {
        const { form,dispatch, history } = this.props;
        const {args} = this.state;
        form.resetFields();
        this.setState({
            searchValues:{},
            args:{
                page:1,
                pageSize:args.pageSize,
            }
        })
        history.replace({
            search: `?page=1&pageSize=${args.pageSize}`,
        });
        dispatch({
            type: 'orders/fetchRefunds',
            offset:0,
            limit: args.pageSize,
        });
    }

    // 处理表单搜索
    handleSearch = (e) => {
        e.preventDefault();

        const { dispatch, form ,history} = this.props;
        const {args} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                start_time: fieldsValue.create_time && fieldsValue.create_time.length > 0 ? fieldsValue.create_time[0].format('YYYY-MM-DD') : '',
                end_time: fieldsValue.create_time && fieldsValue.create_time.length > 0 ? fieldsValue.create_time[1].format('YYYY-MM-DD') : '',
            };
            delete values.create_time;
            this.setState({ 
                searchValues: values ,
                args:{
                    page:1,
                    pageSize:args.pageSize
                }
            });
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`,
            });
            dispatch({
                type: 'orders/fetchRefunds',
                params: values,
                offset:0,
                limit: args.pageSize
            });
        });
    }

    // 处理分页改变
    handlePaginationChange = (page, pageSize) => {
        const { dispatch, history } = this.props;
        const { searchValues } = this.state;

        const params = {
            offset: (page - 1) * pageSize,
            limit: pageSize,
        };
        this.setState({
            args:{
                page,
                pageSize
            }
        });

        // 分页：将页数提取到url上
        history.replace({
            search: `?page=${page}&pageSize=${pageSize}`,
        });

        dispatch({
            type: 'orders/fetchRefunds',
            offset: params.offset,
            limit: params.limit,
            params: searchValues,
        });
    }

    // 确认收货
    handleConfirmReturn = ({ orderId, status }) => {
        console.log('return', orderId, status);
        const { dispatch } = this.props;
        dispatch({
            type: 'orders/fetchConfirmReturn',
            orderId,
            status,
        });
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="单号">
                            {getFieldDecorator('sn')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="退款状态">
                            {getFieldDecorator('refund_status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="1">等待退款</Option>
                                    <Option value="2">退款完成</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
                            展开 <Icon type="down" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="单号">
                            {getFieldDecorator('sn')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="退款状态">
                            {getFieldDecorator('refund_status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="1">等待退款</Option>
                                    <Option value="2">退款完成</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xll={4} md={6} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('goods_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={4} md={10} sm={24}>
                        <FormItem label="退款单起止时间">
                            {getFieldDecorator('create_time')(
                                <RangePicker onChange={this.onDatepickerChange} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const { orders, loading } = this.props;
        const { total } = orders;
        const {args} = this.state;
        const current = parseInt(args.page);
        const pageSize = parseInt(args.pageSize);
        console.log(current,pageSize,123456)
        const paginationOptions = {
            showSizeChanger: true,
            showQuickJumper: true,
            current,
            pageSize,
            defaultPageSize: 10,
            total,
        };

        return (
            <PageHeaderLayout title="退款单列表">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} loading={loading}>
                    <div className={styles.tableList}>
                        <List.Header />
                        {
                            orders.refunds.length > 0
                                ?
                                null
                                :
                                <div style={{ textAlign: 'center' }}>暂无退款单数据</div>
                        }
                        {
                            orders.refunds.map((val, idx) => {
                                const orderListItemHeader = (
                                    <div className={styles['returns-list-header']}>
                                        <div>
                                            <b>退款单编号：</b>
                                            <a className="order-sn">{val.refund_sn}</a>
                                            <span className="order-time">({moment(val.refund_time * 1000).format('YYYY-MM-DD HH:mm')})</span>
                                        </div>
                                        <div>
                                            <b>退货单编号：</b>
                                            <a className="order-sn">{val.returns_sn}</a>
                                        </div>
                                    </div>
                                );
                                return (
                                    <List
                                        header={orderListItemHeader}
                                        key={idx}
                                        data={val}
                                        onConfirmReturn={this.handleConfirmReturn}
                                    />
                                );
                            })
                        }
                    </div>
                    <Pagination
                        className="pull-right"
                        {...paginationOptions}
                        onChange={this.handlePaginationChange}
                        onShowSizeChange={this.handlePaginationChange}
                    />
                </Card>
            </PageHeaderLayout>
        );
    }
}
