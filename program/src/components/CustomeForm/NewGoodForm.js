import React, { Component } from 'react';
import { Form, Input, Row, Col, Upload, Modal, Button, Tabs, message } from 'antd';
import EditableTable from '../../components/CustomTable/EditTable';
import { checkFile, replaceObjFromArr } from '../../utils/tools';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import styles from './good-form.less';


const FormItem = Form.Item;
const { TabPane } = Tabs;
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型

// 拼凑单个商品图片数据
function getPic(key, pics) {
    if (!Array.isArray(pics)) {
        throw new Error('传参必须是一个数组');
    }
    const pic = pics.filter(val => (val.img_type === key));
    if (pic.length > 0) {
        return [{ uid: pic[0].id, name: pic[0].img_type, url: pic[0].img_url }];
    } else {
        return [];
    }
}
const imagesType = ['正面', '反面', '侧面', '包装图1', '包装图2', '包装图3'];

@Form.create({
    onValuesChange(props, values) {
        props.onChange(values);
    },
})
@Form.create()
export default class NewGoodForm extends Component {
    constructor(props) {
        super(props);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleUploaderChange = this.handleUploaderChange.bind(this);
        this.pics = [];
        this.state = {
            previewVisible: false,
            previewImage: '',
            isPicture: true,
            isCad: true,
            file: { uid: '', name: '' },
            pics: this.pics, // 产品图片集合
            cad_url: [], // 产品cad文件集合
            a: getPic('正面', ['this.pics']),
            b: getPic('反面', ['this.pics']),
            c: getPic('侧面', ['this.pics']),
            d1: getPic('包装图1', ['this.pics']),
            d2: getPic('包装图2', ['this.pics']),
            d3: getPic('包装图3', ['this.pics']),
        };
    }

    componentDidMount() {
        if (this.props.bindForm) {
            this.props.bindForm(this.props.form);
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange(key, value) {
        const tempJson = {};
        tempJson[key] = value;
        this.props.onAttrChange(tempJson);
    }

    // 图片上传前处理：验证文件类型
    beforeUpload(key, file) {
        this.setState({ file });
        // console.log('before', file);
        if (checkFile(file.name, ['cad'])) {
            this.setState({ isCad: true });
        } else if (checkFile(file.name, FILE_TYPES)) {
            this.setState({ isPicture: true });
        }
        if (key === 'cad_url') {
            if (!checkFile(file.name, ['cad', 'dwt', 'dwg', 'dws', 'dxf'])) {
                message.error(`${file.name} 暂不支持上传`);
                this.setState({ isCad: false });
                return false;
            }
        } else if (!checkFile(file.name, FILE_TYPES)) {
            message.error(`${file.name} 暂不支持上传`);
            this.setState({ isPicture: false });
            return false;
        }
    }

    // cad和图片上传时处理
    handleUploaderChange(key, fileList) {
        // console.log('文件上传', key, fileList);
        const { pics, cad_url } = this.state;
        const { onAttrChange } = this.props;
        // 如果上传的是cad文件
        if (key === 'cad_url' && this.state.isCad) {
            fileList.slice(-1).forEach((file) => {
                if (file.status === 'done') {
                    this.setState({ cad_url: [...cad_url, file.response.key] });
                    onAttrChange({ cad_url: [...cad_url, file.response.key] });
                }
            });
            return;
        }
        // 如果上传的是图片
        if (this.state.isPicture) {
            const tempJson = {};
            tempJson[key] = fileList;
            this.setState(tempJson);
            // console.log('状态改变', fileList);
            const that = this;
            // 上传成功，则将图片放入state里的pics数组内
            fileList.map((file) => {
                if (file.status === 'done') {
                    message.success(`${file.name} 文件上传成功`);
                    // that.setState({ file_url: file.response.key });
                    if (key === 'a') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '正面', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '正面', img_url: file.response.key }] });
                    } else if (key === 'b') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '反面', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '反面', img_url: file.response.key }] });
                    } else if (key === 'c') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '侧面', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '侧面', img_url: file.response.key }] });
                    } else if (key.substr(0, 1) === 'd') {
                        const idx = key.substr(1, 1);
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: `包装图${idx}`, img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: `包装图${idx}`, img_url: file.response.key }] });
                    }
                } else if (file.status === 'error') {
                    message.error(`${file.name} 文件上传失败`);
                }
                return file;
            });
        } else if (this.state.isCad) {
            // console.log('cad fileList', fileList);
        }
    }
    handleStock = (rule, value, callback) => { // 校验库存数量
        if (value > 9999) {
            callback('库存数量不能超过9999个');
        }
        callback();
    }
    handleMinBuy = (rule, value, callback) => { // 校验采购量
        if (value > 9999) {
            callback('最低采购量不能超过9999个');
        }
        callback();
    }
    render() {
        const formItemLayout = {
            labelCol: { md: { span: 4 }, xxl: { span: 3 } },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        const { data, loading, args } = this.props;
        const { product } = data;
        const slectedCatagory = product ? [
            product.category.category_name,
            product.category.children.category_name,
            product.category.children.children.category_name,
            product.category.children.children.children.category_name,
        ] : [];
        const { previewVisible, previewImage, a, b, c, d1, d2, d3, file } = this.state;

        let uploaders = []; // 商品图片
        let uploaderCAD = []; // 商品cad文件

        if (data.product) {
            // 商品图片集合
            uploaders = data.product.pics.map(val => (
                <Col span={8} key={val.id}>
                    <Upload
                        action="//jsonplaceholder.typicode.com/posts/"
                        listType="picture-card"
                        fileList={[{
                            uid: -1,
                            name: '测试',
                            url: val.img_url,
                        }]}
                        onPreview={this.handlePreview}
                        onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
                    />
                    <p className="upload-pic-desc">{imagesType[val.img_type - 1]}</p>
                </Col>
            ));
            // 商品cad集合
            if (data.product) {
                uploaderCAD = data.product.cad_urls.map((val, idx) => (
                    <Col span={24} key={idx}>
                        <a href={val} style={{ display: 'block' }} target=" _blank">
                            {val}
                        </a>
                    </Col>
                ));
            }
        }
        return (
            <div className={styles['good-info-wrap']} >
                {/* 产品主要属性 */}
                <div style={{ float: 'left', width: '50%' }}>
                    <Form layout="horizontal" style={{ width: '100%' }}>
                        <FormItem
                            label="选择产品"
                            {...formItemLayout}
                        >
                            <Button type="primary" onClick={this.props.showModal}>{args.mno ? '重选产品' : '选择产品'}</Button>
                        </FormItem>
                        {/* <FormItem
              label="产品型号ID"
              {...formItemLayout}
            >
              {getFieldDecorator('pno', {
                initialValue: data.mno,
              })(
                <Input disabled />
              )}
            </FormItem> */}
                        <FormItem
                            label="所属分类"
                            {...formItemLayout}
                        >
                            <Input value={slectedCatagory.join('-')} disabled />
                        </FormItem>
                        <FormItem
                            label="商品名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('product_name', {
                                initialValue: product ? product.product_name : '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="型号"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('partnumber', {
                                initialValue: data.partnumber,
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="品牌"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('brand_name', {
                                initialValue: product ? product.brand.brand_name : '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="品牌英文名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('english_name', {
                                initialValue: product ? product.brand.english_name : '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="产地"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('registration_place', {
                                initialValue: product ? product.brand.registration_place : '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="最低采购量"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('min_buy', {
                                rules: [ 
                                {
                                    pattern: /^(\d+)$/,
                                    message: '库存数量必须是整数',
                                }, {
                                    validator: this.handleMinBuy,
                                }],
                                initialValue: data.min_buy >> 0,
                            })(
                                <Input type="number" />
                            )}
                        </FormItem>
                        <FormItem
                            label="质保期"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('shelf_life', {
                                rules: [{
                                    required: true,
                                    message: '请输入2-6个字符',
                                }, {
                                    max: 6,
                                    message: '请输入2~6个字符',
                                }, {
                                    min: 2,
                                    message: '请输入2~6个字符',
                                }],
                                initialValue: data.shelf_life,
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="销售单位"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('sales_unit', {
                                rules: [{
                                    required: true,
                                    message: '请输入1~8个字符',
                                }, {
                                    max: 8,
                                    message: '请输入1~8个字符',
                                }, {
                                    min: 1,
                                    message: '请输入1~8个字符',
                                }],
                                initialValue: data.sales_unit,
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="库存数量"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('stock', {
                                rules: [{
                                    required: true,
                                    message: '请输入库存数量',
                                }, {
                                    pattern: /^(\d+)$/,
                                    message: '库存数量必须是整数',
                                },
                                {
                                    validator: this.handleStock,
                                },
                                ],
                                initialValue: data.stock,
                            })(
                                <Input type="number" />
                            )}
                        </FormItem>
                    </Form>
                </div >
                {/* 产品图片 */}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal >
                <div style={{ float: 'left', width: '50%', maxWidth: 360 }}>
                    <h3 style={{ paddingTop: 12, paddingBottom: 15 }}>产品图片</h3>
                    <Row gutter={24}>
                        {uploaders}
                    </Row>
                    <h3>CAD图</h3>
                    <Row gutter={24}>
                        {uploaderCAD}
                    </Row>
                </div>
                <div style={{ clear: 'both' }} />
                <div style={{ width: '95%', maxWidth: 1000 }}>
                    <Form layout="horizontal" style={{ width: '100%' }}>
                        <FormItem
                            label="价格设置"
                            labelCol={{ md: { span: 2 }, xxl: { span: 2 } }}
                            wrapperCol={{ md: { span: 20 }, xxl: { span: 21 } }}
                            required
                        >
                            <EditableTable
                                data={data.prices}
                                dataLen={data.prices.length}
                                onChange={this.props.onAttrChange}
                            />
                        </FormItem>
                    </Form>
                </div>
                {/* 商品描述、详情 */}
                <div style={{ clear: 'both' }} />
                <div className="good-desc">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="产品概述" key="1">
                            <RichEditorShow content={data.product ? data.product.summary : '无'} />
                        </TabPane>
                        <TabPane tab="产品详情" key="2">
                            <RichEditorShow content={data.product ? data.product.description : '无'} />
                        </TabPane>
                        <TabPane tab="学堂" key="3">
                            <RichEditorShow content={data.product ? data.product.course : '无'} />
                        </TabPane>
                        <TabPane tab="视频详解" key="4">
                            <RichEditorShow content={data.product ? data.product.video : '无'} />
                        </TabPane>
                        <TabPane tab="常见问题FAQ" key="5" >
                            <RichEditorShow content={data.product ? data.product.faq : '无'} />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        );
    }
}
