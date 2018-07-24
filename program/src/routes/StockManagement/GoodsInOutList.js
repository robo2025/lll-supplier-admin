import React from 'react';
import qs from 'qs';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Button, Icon, Modal, DatePicker, Table } from 'antd';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./stock.less";
import StockInOutTable from "../../components/StockManagement/StockInOutTable";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ stock, loading }) => ({ stock, loading:loading.effects['stock/fetchRecord'] }))
export default class GoodsInOutList extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
            searchValues: {},
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: "stock/fetchRecord",
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize
        })
    }
    onTableChange = (pagination) => {
        const { history, dispatch } = this.props;
        const { searchValues } = this.state;
        this.setState({
            args: {
                page: pagination.current,
                pageSize: pagination.pageSize
            },
        })
        history.replace({
            search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`
        })
        dispatch({
            type: "stock/fetchRecord",
            offset: (pagination.current - 1) * pagination.pageSize,
            limit: pagination.pageSize,
            params: searchValues
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        const { form, history, dispatch } = this.props;
        const { args } = this.state;
        form.validateFields((err, filedsValue) => {
            if (err) return;
            const values = {};
            for (var key in filedsValue) {
                if (filedsValue[key]) {
                    values[key] = filedsValue[key];
                }
            }
            if(values.create_time && values.create_time.length > 0) {
                values.start_time = values.create_time[0].format("YYYY-MM-DD");
                values.stop_time = values.create_time[1].format("YYYY-MM-DD");
            }
            delete values.create_time;
            this.setState({
                args: {
                    page: 1,
                    pageSize: args.pageSize
                },
                searchValues: values
            })
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`
            })
            dispatch({
                type: "stock/fetchRecord",
                offset: 0,
                limit: args.pageSize,
                params: values
            })
        })
    }
    handleFormReset = () => {
        const { form, history, dispatch } = this.props;
        const { args } = this.state;
        form.resetFields()
        this.setState({
            args: {
                page: 1,
                pageSize: args.pageSize
            },
            searchValues: {},
            viewRecordModalShow: false
        })
        history.replace({
            search: `?page=1&pageSize=${args.pageSize}`
        })
        dispatch({
            type: "stock/fetchRecord",
            offset: 0,
            limit: args.pageSize,
        })
    }
    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="单号">
                            {getFieldDecorator('order_id')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="操作类型">
                            {getFieldDecorator('change_option')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="I">入库</Option>
                                    <Option value="O">调拨</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="创建时间">
                            {getFieldDecorator('create_time')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                </div>
            </Form>
        )
    }
    render() {
        const {stock,loading} = this.props;
        const {args} = this.state;
        const {page,pageSize} = args;
        const {stockRecord,recordTotal} = stock;
        return (
            <PageHeaderLayout title="出入库存记录">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} className={styles['search-wrap']}>
                    <div className={styles.tableListForm}>
                        <StockInOutTable 
                        data={stockRecord}
                        total={recordTotal}
                        loading={loading}
                        current={page >> 0}
                        pageSize={pageSize >> 0}
                        onTableChange={this.onTableChange}

                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}