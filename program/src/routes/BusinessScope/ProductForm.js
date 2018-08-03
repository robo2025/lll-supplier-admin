import React, { Component } from 'react';
import { Form, Row, Col, Upload, Modal, Tabs } from 'antd';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import styles from './ProductForm.less';


const FormItem = Form.Item;
const { TabPane } = Tabs;
const mapImageType = ['正面', '侧面', '反面', '包装图一', '包装图二', '包装图三'];

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

@Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const fields = {};
    Object.keys(data).forEach((key) => {
      fields[key] = Form.createFormField({
        value: data[key],
      });
    });
    return {
      ...fields,
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
@Form.create()
export default class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.pics = [];
    this.state = {
      previewVisible: false,
      previewImage: '',
      file: { uid: '', name: '' },
      a: getPic('正面', ['this.pics']),
      b: getPic('反面', ['this.pics']),
      c: getPic('侧面', ['this.pics']),
      d1: getPic('包装图1', ['this.pics']),
      d2: getPic('包装图2', ['this.pics']),
      d3: getPic('包装图3', ['this.pics']),
    };
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

  render() {
    const formItemLayout = {
      labelCol: { md: { span: 4 }, xxl: { span: 3 } },
      wrapperCol: { span: 18 },
    };
    const { data, loading } = this.props;
    const { category } = data;
    const slectedCatagory = category ? [
      category.category_name,
      category.children.category_name,
      category.children.children.category_name,
      category.children.children.children.category_name,
    ] : [];
    const { previewVisible, previewImage, a, b, c, d1, d2, d3, file } = this.state;

    let uploaders = []; // 商品图片
    let uploaderCAD = []; // 商品cad图   
    if (data.pics) {
      // 商品图片集合
      uploaders = data.pics.map(val => (
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
            // onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
          />
          <p className="upload-pic-desc">{mapImageType[val.img_type - 1]}</p>
        </Col>
      ));
      // 商品cad图
      if (data.cad_urls) {
        uploaderCAD = data.cad_urls.map((val, idx) => (
          <Row span={8} key={idx}>
            <a href={val} target="_blank">{val}</a>
          </Row>
        ));
      }
    }


    return (
      <div className={styles['good-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal" style={{ width: '100%' }}>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              <span>{data.pno}</span>
            </FormItem>
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              <span>{slectedCatagory.join('-')}</span>
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.brand_name : ''}</span>
            </FormItem>
            <FormItem
              label="品牌英文名"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.english_name : ''}</span>
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.registration_place : ''}</span>
            </FormItem>
          </Form>
        </div >
        {/* 产品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', width: '50%', maxWidth: 360 }}>
          <h3>产品图片</h3>
          <Row gutter={24}>
            {uploaders}
          </Row>
          <h3>CAD图</h3>
          <Row gutter={24}>
            {uploaderCAD}
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="产品概述" key="1">
              <RichEditorShow content={data.summary ? data.summary : '无'} />
            </TabPane>
            <TabPane tab="产品详情" key="2">
              <RichEditorShow content={data.description ? data.description : '无'} />
            </TabPane>
            <TabPane tab="学堂" key="3">
              <RichEditorShow content={data.course ? data.course : '无'} />
            </TabPane>
            <TabPane tab="视频详解" key="4">
              <RichEditorShow content={data.video ? data.video : '无'} />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="5" >
              <RichEditorShow content={data.faq ? data.faq : '无'} />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}
