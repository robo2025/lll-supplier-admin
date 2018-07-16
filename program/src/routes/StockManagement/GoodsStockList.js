import React from 'react';
import qs from 'qs';
import moment from 'moment';
import { connect } from 'dva';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Card, Form, Row, Col, Input, Select, Button, Icon, Modal, DatePicker, Table, InputNumber } from 'antd';
import GoodsStockListTable from "../../components/StockManagement/GoodsStockListTable.js";
import styles from "./stock.less";
import { STOCK_OPERATION_TYPE } from "../../constant/statusList";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const InOutOperationModal = Form.create()(
    class extends React.Component {
        handleChangeNum = (rule, value, callback) => {
            const { recordInfo, recordType } = this.props;
            const checkValue = recordType === "I" ? recordInfo.goods_max_in : recordInfo.goods_max_out;
            const tipValue = recordType === "I" ? `不能超过最大入库值${recordInfo.goods_max_in}` : `不能超过最大调拨值${recordInfo.goods_max_out}`;
            if (value < 0) {
                callback("请输入正整数")
            } else if (value > checkValue) {
                callback(tipValue)
            } else {
                callback()
            }
        }
        onInOutOk = () => {
            const {form,onInOutOk,recordType,recordInfo} = this.props;
            form.validateFields((err,fieldsValue) => {
                if(err) return;
                const values = {...fieldsValue};
                if(!values.change_info) {
                    values.change_info = ""
                }
                values.change_option = recordType;
                values.gno = recordInfo.gno;
                const params_type = recordType === "I" ? "inbound" : "allocation";
                onInOutOk({...values},params_type)
            })
        }
        render() {
            const { visible, onInOutCancel,  form, recordType, recordInfo } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    md: { span: 6 },
                },
                wrapperCol: {
                    md: { span: 18 },
                },
            };
            return (
                <Modal
                    width="800px"
                    visible={visible}
                    title={recordType === "I" ? "商品入库面板操作" : "商品调拨面板操作"}
                    okText="确定"
                    onCancel={onInOutCancel}
                    onOk={this.onInOutOk}
                >
                    <Row className={styles['recordInfo']}>
                        <Col span={8}>
                            <Col span={8}><span>商品ID :</span></Col><Col span={14}>{recordInfo.gno}</Col>
                        </Col>
                        <Col span={8}>
                            <Col span={8}><span>商品名称 :</span></Col><Col span={14}>{recordInfo.product_name}</Col>
                        </Col>
                        <Col span={8}>
                            <Col span={8}><span>商品型号 :</span></Col><Col span={14}>{recordInfo.partnumber}</Col>
                        </Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem label={recordType === "I" ? "入库数量" : "调拨数量"} {...formItemLayout}>
                                    {getFieldDecorator('change_count', {
                                        rules: [{ required: true, message: '请输入正整数' }, { validator: this.handleChangeNum }],
                                    })(
                                        <InputNumber precision={0} style={{width:"80%"}} placeholder="请输入正整数"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="备注" {...formItemLayout}>
                                    {getFieldDecorator('change_info')(
                                        <Input type="textarea" style={{width:"80%"}} placeholder="请输入备注"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>


                    </Form>
                </Modal>
            )
        }
    }
)
@Form.create()
@connect(({ stock, loading }) => ({ stock, loading: loading.effects["stock/fetch"], recordLoading: loading.effects['stock/fetchRecord'] }))
export default class GoodsStockList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expandForm: false,
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
            searchValues: {},
            recordModalShow: false,  // 查看记录模态框
            recordInfo: {},// 查看记录信息
            recordArgs: {
                page: 1 // 查看记录页面当前页
            },
            recordSearchValues: {},// 查看记录页面搜索条件
            inOutOperationModalShow: false,// 入库出库操作面板是否显示
            recordType: "", //执行入库还是调拨操作 I 入库 O 调拨
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: "stock/fetch",
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize
        })
    }
    // 点击查看记录按钮
    onviewRecord = (record) => {
        const { dispatch } = this.props;
        this.setState({
            recordInfo: record,
            recordModalShow: true,
        })
        dispatch({
            type: "stock/fetchRecord",
            params: {
                gno: record.gno
            }
        })
    }
    // 取消查看记录
    onCancel = () => {
        const { form } = this.props;
        this.setState({
            recordArgs: {
                page: 1
            },
            recordInfo: {},
            recordModalShow: false,
            recordSearchValues: {}
        })
        form.resetFields(['create_time']);
    }
    // 查看记录搜索条件
    viewRecordSearch = (e) => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const { recordInfo } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {};
            if (fieldsValue.create_time && fieldsValue.create_time.length > 0) {
                values.start_time = fieldsValue.create_time[0].format("YYYY-MM-DD");
                values.stop_time = fieldsValue.create_time[1].format("YYYY-MM-DD");
            }
            this.setState({
                recordArgs: {
                    page: 1
                },
                recordSearchValues: values
            })
            dispatch({
                type: "stock/fetchRecord",
                params: {
                    gno: recordInfo.gno,
                    ...values
                }
            })
        })
    }
    // 查看记录重置
    onsearchReset = () => {
        const { form, dispatch } = this.props;
        const { recordInfo } = this.state;
        form.resetFields(['create_time']);
        this.setState({
            recordArgs: {
                page: 1
            }
        });
        dispatch({
            type: "stock/fetchRecord",
            params: {
                gno: recordInfo.gno
            }
        })
    }
    // 查看记录页数改变
    onRecordChange = (pagination) => {
        const { dispatch } = this.props;
        const { recordInfo, searchValues } = this.state;
        this.setState({
            recordArgs: {
                page: pagination.current
            },
        })
        dispatch({
            type: "stock/fetchRecord",
            params: {
                gno: recordInfo.gno,
                ...searchValues
            },
            offset: (pagination.current - 1) * pagination.pageSize
        })
    }
    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
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
            type: "stock/fetch",
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
            delete filedsValue.create_time;
            for (var key in filedsValue) {
                if (filedsValue[key]) {
                    values[key] = filedsValue[key];
                }
            }
            this.setState({
                args: {
                    page: 1,
                    pageSize: args.pageSize
                },
                searchValues: values
            })
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`,
            });
            dispatch({
                type: "stock/fetch",
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
            type: "stock/fetch",
            offset: 0,
            limit: args.pageSize,
        })
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入产品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入产品型号" />
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
        )
    }
    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入产品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入产品型号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="上下架状态">
                            {getFieldDecorator('publish_status')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="0">下架中</Option>
                                    <Option value="1">上架中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="审核状态">
                            {getFieldDecorator('audit_status')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="0">未审核</Option>
                                    <Option value="1">审核通过</Option>
                                    <Option value="2">审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="库存数量">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('stock_start')(
                                        <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最小值" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center', fontSize: '20px' }}>
                                    ~
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('stock_end')(
                                        <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最大值" />
                                    )}
                                </FormItem>
                            </Col>
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
        )
    }
    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    // 出入库操作面板取消
    onInOutCancel = () => {
        this.setState({
            inOutOperationModalShow: false
        })
    }
    // 出入库操作面板确认
    onInOutOk = (params,paramsType) => {
        const {dispatch} = this.props;
        // dispatch({
        //     type:"stock/inOutIDGeneration",
        
        // })
        console.log(params,paramsType)
    }   
    // 点击出入库按钮执行
    onInOutOperation = (record, type) => {
        console.log(record)
        this.setState({
            inOutOperationModalShow: true,
            recordInfo: record,
            recordType: type,
        })


    }
    render() {
        const { stock, loading, form, recordLoading } = this.props;
        const { args, recordModalShow, recordInfo, recordArgs, inOutOperationModalShow, recordType } = this.state;
        const { goodsStockList, total, stockRecord, recordTotal } = stock;
        const { page, pageSize } = args;
        const current = recordArgs.page >> 0;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const columns = [{
            title: "序号",
            dataIndex: "idx",
            key: 'idx'
        }, {
            title: "单号",
            dataIndex: "order_id",
            key: 'order_id'
        }, {
            title: "操作类型",
            dataIndex: "change_option",
            key: 'change_option',
            render: (val) => <span>{STOCK_OPERATION_TYPE[val]}</span>
        }, {
            title: "库存变动数量",
            dataIndex: "change_count",
            key: 'change_count'
        }, {
            title: "操作时间",
            dataIndex: "add_time",
            key: 'add_time',
            render: val => <span>{moment(val * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
        }]
        const paginationOptions = {
            total: recordTotal,
            showQuickJump: true,
            current
        }
        const { getFieldDecorator } = form;
        stockRecord.map((ele, idx) => {
            ele.idx = idx + 1;
        })
        return (
            <PageHeaderLayout title="商品库存列表">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} className={styles['search-wrap']}>
                    <div className={styles.tableListForm}>
                        <GoodsStockListTable
                            data={goodsStockList}
                            loading={loading}
                            total={total}
                            current={page >> 0}
                            pageSize={pageSize >> 0}
                            onTableChange={this.onTableChange}
                            onviewRecord={this.onviewRecord}
                            onInOutOperation={this.onInOutOperation}
                        />
                        <Modal
                            visible={recordModalShow}
                            title="商品库存历史记录"
                            width="700px"
                            onCancel={this.onCancel}
                            footer={[<div key="recordSearch" style={{ textAlign: "center" }}><Button type="primary" onClick={this.onCancel}>关闭</Button></div>]}
                        >
                            <Row className={styles['recordInfo']}>
                                <Col span={12}>
                                    <Col span={6}><span>商品名称 :</span></Col><Col span={17}>{recordInfo.product_name}</Col>

                                </Col>
                                <Col span={12}>
                                    <Col span={6}><span>商品型号 :</span></Col><Col span={17}>{recordInfo.partnumber}</Col>
                                </Col>
                            </Row>
                            <Form layout="inline" onSubmit={this.viewRecordSearch} style={{ marginBottom: 30 }}>
                                <FormItem label="时间段" {...formItemLayout}>
                                    {getFieldDecorator("create_time")(
                                        <RangePicker style={{ width: '100%' }} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ marginRight: 10 }}>查询</Button>
                                    <Button onClick={this.onsearchReset}>重置</Button>
                                </FormItem>
                            </Form>
                            <Table dataSource={stockRecord} columns={columns}
                                loading={recordLoading}
                                rowKey={record => record.idx}
                                pagination={paginationOptions}
                                onChange={this.onRecordChange}
                            />
                        </Modal>
                        <InOutOperationModal
                            wrappedComponentRef={this.saveFormRef}
                            visible={inOutOperationModalShow}
                            recordInfo={recordInfo}
                            recordType={recordType}
                            onInOutCancel={this.onInOutCancel}
                            onInOutOk={this.onInOutOk}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}