import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Input, Form, message, Select, Row, Col, Cascader } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import NewGoodForm from '../../components/CustomeForm/NewGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
};
function getStanrdCatalog(data) {
    data.forEach((val) => {
        val.value = val.id;
        val.label = val.category_name;
        if (val.children && val.children.length > 0 && val.level < 3) {
            getStanrdCatalog(val.children);
        } else {
            delete val.children;
        }
    });
}
@connect(({ loading, product, good }) => ({
    product,
    good,
    loading,
}))
@Form.create()
export default class NewGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            isShowAttrMOdal: false,
            args: queryString.parse(this.props.location.search),
            fields: {
                shelf_life: '', // 质保期
                sales_unit: '', // 销售单位
                stock: '', // 库存
                min_buy: '', // 最小采购量 (可选)
                prices: [ // 价格
                    {
                        id: -100,
                        min_quantity: 1, // 最小数量
                        max_quantity: 1, // 最大数量
                        price: '0', // 价格
                        shipping_fee_type: 1, // 包邮
                        lead_time: '0', // 货期
                    },
                ],
            },
            newFiled: {}, // 用户自定义的其他属性
            otherAttrsFiled: [{
                attr_name: '形状',
            }, {
                attr_name: '控制输出',
            }, {
                attr_name: '检测物体',
            }],
            otherAttrs: [],
            associationTableParams: { offset: 0, limit: 6, params: {} },// 存储关联modal数据
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        // 获取产品列表
        dispatch({
            type: 'good/fetchAassociatedProduct',
            offset: 0,
            limit: 6
        });
        dispatch({
            type: 'good/fetchLevel',
        })
        if (args.mno) {
            dispatch({
                type: 'good/fetchAassociatedProductDetail',
                mno: args.mno,
            });
        }
        window.onhashchange = this.hashChangeFire;
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
        }
    }

    // 浏览器hash改变
    hashChangeFire = () => {
        const { dispatch } = this.props;
        const args = queryString.parse(this.props.location.search);
        this.setState({ args });
        if (args.mno) {
            dispatch({
                type: 'good/fetchAassociatedProductDetail',
                mno: args.mno,
            });
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
    * @param {string=} mno 产品型号ID
    *
    * */
    handleAssociate = (mno) => {
        const { history } = this.props;
        const { fields } = this.state;
        history.push(`/goods/new?mno=${mno}`);
        this.setState({ isShowModal: false, fields: { ...fields, product_id: mno } });
    }

    // 当表单输入框被修改事件
    handleFormChange = (changedFields) => {
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
        this.setState({
            fields: { ...this.state.fields, ...obj },
        });
    }

    // 当商品列表数据改变时：分页
    handleProductTableChange = (pagination, filtersArg, sorter) => {
        console.log(pagination, filtersArg, sorter, 123456)
        const { dispatch } = this.props;
        const { associationTableParams } = this.state;
        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            offset: (pagination.current - 1) * (pagination.pageSize),
        };
        this.setState({
            associationTableParams: {
                offset: pagination.current - 1,
                limit: pagination.pageSize,
                params: associationTableParams.params
            }
        })
        dispatch({
            type: 'good/fetchAassociatedProduct',
            offset: params.offset,
            limit: params.pageSize,
            params: associationTableParams.params,
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        const { associationTableParams } = this.state;
        form.resetFields();
        this.setState({
            formValues: {},
            associationTableParams: {
                offset: 0,
                limit: associationTableParams.limit,
                params: {}
            }
        });
        dispatch({
            type: 'good/fetchAassociatedProduct',
            offset: 0,
            limit: associationTableParams.limit,
            params: {}
        });
    }

    // 搜索
    handleSearch = (e) => {
        e.preventDefault();

        const { dispatch, form } = this.props;
        const { associationTableParams } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const category = {};
            if(fieldsValue.category&&fieldsValue.category.length > 0) {
                category.category_id_1 = fieldsValue.category[0];
                category.category_id_2 = fieldsValue.category[1];
                category.category_id_3 = fieldsValue.category[2];
            }
            const values = {
                ...fieldsValue,
                ...category,
            };
            delete values.category;
            console.log(values,1234566788);
            this.setState({
                formValues: values,
                associationTableParams: {
                    offset: 0,
                    limit: associationTableParams.limit,
                    params: values
                }
            });

            dispatch({
                type: 'good/fetchAassociatedProduct',
                params: values,
                offset: 0,
                limit: associationTableParams.limit
            });
        });
    }

    /**
    * 提交商品信息
    *
    */
    handleSubmitProduct = () => {
        const { fields, args } = this.state;
        const { dispatch, history } = this.props;
        if (!args.mno) {
            message.error('请选择产品！');
            return;
        }
        if (this.$formObj) {
            this.$formObj.validateFields((err, values) => {
                if (!err) {
                    dispatch({
                        type: 'good/add',
                        data: {
                            ...fields,
                            mno: args.mno,
                        },
                        success: () => { message.success('提交成功'); history.push('/goods/list'); },
                        error: (res) => { message.error(res.msg, 2.5); },
                    });
                }
            });
        }
    }

    bindForm = (formObj) => {
        this.$formObj = formObj;
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const {good} = this.props;
        const {level} = good;
        getStanrdCatalog(level);
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
                    <Col xll={9} md={9} sm={24}>
                        <FormItem label="所属分类">
                            {getFieldDecorator('category')(
                                <Cascader
                                style={{ width: 250 }}
                                    options={level}
                                    placeholder="请选择类目"
                                    changeOnSelect
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={8} md={8} sm={24}>
                        <FormItem label="型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={7} md={7} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
                    <Col xll={9} md={9} sm={24}>
                        <FormItem label="产品型号ID">
                            {getFieldDecorator('mno')(
                                <Input placeholder="请输入" style={{ width: 238 }}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={8} md={8} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xll={7} md={7} sm={24}>
                        <FormItem label="是否已关联">
                            {getFieldDecorator('has_goods')(
                                <Select placeholder="请选择" style={{ width: 130 }}>
                                    <Option value="">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginTop: 18 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                </div>
            </Form>
        );
    }

    render() {
        const { isShowModal, fields, args, associationTableParams } = this.state;
        const { good, loading } = this.props;
        const total = good.productTotal;
        const { getFieldDecorator } = this.props.form;
        const current = associationTableParams.offset + 1;
        return (
            <PageHeaderLayout title="新增商品信息" >
                <Card bordered={false} className={styles['new-good-wrap']}>
                    {/* 参照数据Modal */}
                    <Modal
                        width="90%"
                        visible={isShowModal}
                        title="关联参照数据"
                        okText=""
                        cancelText=""
                        onCancel={this.onCancel}
                        onOk={this.onOk}
                    >
                        <div className={styles.tableListForm}>
                            {this.renderSimpleForm()}
                        </div>
                        <ProductList
                            loading={loading.models.good}
                            data={good.products}
                            onAssociate={this.handleAssociate}
                            onChange={this.handleProductTableChange}
                            total={total}
                            current={current}
                        />
                    </Modal>
                    <NewGoodForm
                        showModal={this.showModal}
                        loading={loading.models.good}
                        data={{ ...good.productDetail, ...fields }}
                        onChange={this.handleFormChange}
                        onAttrChange={this.handleGoodAttr}
                        args={args}
                        bindForm={this.bindForm}
                    />
                    <SectionHeader
                        title="商品其他属性"
                    />
                    <div className="spec-wrap" style={{ width: 200 }}>
                        <Form>
                            {
                                (good.productDetail.specs && good.productDetail.specs.length > 0) ?
                                    good.productDetail.specs.map(val => (
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
                                    :
                                    '无'
                            }
                        </Form>
                    </div>
                    <div className={styles['submit-btn-wrap']}>
                        <Button type="primary" onClick={this.handleSubmitProduct}>提交审核</Button>
                        <Button onClick={() => { this.props.history.push('/goods/list'); }}>取消</Button>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
