import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Row, Col, Form, Input, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import NewGoodForm from '../../components/CustomeForm/NewGoodForm';
import styles from './index.less';

const FormItem = Form.Item;

@connect()
export default class NewGood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      fields: {
        pics: [],
        other_attrs: [],
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
      file: { uid: '', name: '' },
      isPicture: true,
    };
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
      console.log('提交新属性', newFiled);
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


  render() {
    const { isShowModal, isShowAttrMOdal, otherAttrsFiled } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    
    return (
      <PageHeaderLayout title="新增商品信息" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          {/* 参照数据Modal */}
          <Modal
            width="60%"
            visible={isShowModal}
            title="关联参照数据"
            okText=""
            cancelText=""
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            {/* <ProductList
              data={product.list}
              onAssociate={this.handleAssociate}
            /> */}
            弹窗
          </Modal>
          {/* 添加其它属性Modal */}
          <Modal
            width="650px"
            visible={isShowAttrMOdal}
            title="添加属性项"
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            {/*  <AddAttrForm
              onFieldsChange={this.handleAddOtherAttrFiled}
            /> */}
            添加其他属性
          </Modal>
          <Form layout="horizontal" style={{ with: 1050 }}>
            <FormItem
              label="选择产品"
              required
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 6 }}
              
            >
              <Button type="primary" onClick={this.showModal}>选择产品</Button>
            </FormItem>
          </Form>
          <NewGoodForm />
          <SectionHeader
            title="产品其他属性"
            extra={<Button style={{ marginLeft: 20 }} icon="plus" onClick={this.ShowAttrModal}>添加其他属性项</Button>}
          />
          <Form style={{ width: 700, maxWidth: '70%' }} >
            {
              otherAttrsFiled.map((val, idx) => (
                <FormItem
                  label={val.attr_name}
                  key={'otherAttr' + idx}
                  {...formItemLayout}
                >
                  <Row gutter={12}>
                    <Col span={6}>
                      <Input
                        defaultValue={val.attr_value}
                        onChange={(e) => {
                          this.handleAddProductOtherAttr(idx - 100, {
                            attr_name: val.attr_name,
                            attr_value: e.target.value,
                          });
                        }
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <Upload>
                        <Button icon="upload">上传图片</Button>
                      </Upload>
                    </Col>
                    <Col span={4}>
                      <span>{val.img_url}</span>
                    </Col>
                    <Col span={5}>
                      <span>
                        <a>删除</a>|
                        <a>查看</a>
                      </span>
                    </Col>
                  </Row>
                </FormItem>
              ))
            }
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
