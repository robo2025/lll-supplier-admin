import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Modal, Button, Row, Col, Form, Input, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import ModifyGoodForm from '../../components/CustomeForm/ModifyGoodForm';
import { queryString } from '../../utils/tools';

import styles from './index.less';

const FormItem = Form.Item;

@connect(({ loading, good }) => ({
  good,
  loading,
}))
export default class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: {
        pics: [],
        other_attrs: [],
      },
      newFiled: {}, // 用户自定义的其他属性
      otherAttrs: [],
      file: { uid: '', name: '' },
      isPicture: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'good/fetchDetail',
      goodId: args.goodId,
    });
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

  /**
  * 点击关联后事件
  * @param {string=} prdId 产品ID
  *
  * */
  handleAssociate = (prdId) => {
    const { history } = this.props;
    history.push(`/goods/new?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }


  render() {
    const { isShowModal, isShowAttrMOdal, otherAttrsFiled } = this.state;
    const { good, loading } = this.props;
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

    console.log('商品详情页:', this.props.good);

    return (
      <PageHeaderLayout title="新增商品信息" >
        <Card bordered={false} className={styles['new-good-wrap']}>

          <ModifyGoodForm
            loading={loading.models.good}
            data={good.detail}
            onChange={this.handleFormChange}
          />
          <SectionHeader
            title="产品其他属性"
          />
          <Form style={{ width: 700, maxWidth: '70%' }} >
            {
              good.product ? (good.product.detail.map((val, idx) => (
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
              ))) : <span>无</span>
            }
          </Form>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.push('/goods/list'); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

