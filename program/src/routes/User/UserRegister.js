import React, { Component } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Radio,
  Icon,
  Upload,
  Modal,
  message,
  Checkbox,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './UserRegister.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
export default class UserRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: true,
    };
  }

  handleModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  }

  handleModalCanle = () => {
    message.warning('不同意就注册不了哦');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('校验出错', err);
        return;
      }
      console.log('校验通过', values);
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };


    return (
      <PageHeaderLayout
        title="企业用户注册"
      // content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
      >
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="用户名">
              {
                getFieldDecorator('username', {
                  rules: [{
                    required: true,
                    message: '请输入用户名',
                  }],
                })(<Input placeholder="请输入用户名" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="密码" help="6到16位数字、字母">
              {
                getFieldDecorator('password', {
                  rules: [{
                    required: true,
                    message: '密码',
                  }],
                })(<Input placeholder="输入密码" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码" help="6到16位数字、字母">
              {
                getFieldDecorator('password2', {
                  rules: [{
                    required: true,
                    message: '请输入标题',
                  }],
                })(<Input placeholder="重复输入密码" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="联系邮箱">
              {
                getFieldDecorator('email', {
                  rules: [{
                    required: true,
                    message: '请输入联系邮箱',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {
                getFieldDecorator('mobile', {
                  rules: [{
                    required: true,
                    message: '请输入手机号',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="短信验证码">
              {
                getFieldDecorator('captcha', {
                  rules: [{
                    required: true,
                    message: '请输入短信验证码',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="企业名称" help="请填写与企业营业执照或三证合一证件保持一致">
              {
                getFieldDecorator('company', {
                  rules: [{
                    required: true,
                    message: '请输入企业名称',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="企业地址">
              {
                getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    message: '请输入企业地址',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="法人" help="请填写与企业营业执照或三证合一证件保持一致">
              {
                getFieldDecorator('legal', {
                  rules: [{
                    required: true,
                    message: '请输入公司法人',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="固定电话">
              {
                getFieldDecorator('telphone', {
                  rules: [{
                    required: true,
                    message: '请输入固定电话',
                  }],
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Card>
        <Card title="资质信息" bordered={false} style={{ marginTop: 35 }}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="营业执照注册号">
              {
                getFieldDecorator('qualifi_code', {
                  rules: [{
                    required: true,
                    message: '请输入营业执照注册号',
                  }],
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="营业执照照片">
              {
                getFieldDecorator('qualifications', {
                  rules: [{
                    required: true,
                    message: '请上传营业执照照片',
                  }],
                })(
                  <div>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="//jsonplaceholder.typicode.com/posts/"
                      onChange={this.handleChange}
                    >
                      {uploadButton}
                    </Upload>
                    <FormItem label="有效期">
                      {getFieldDecorator('date', {
                        rules: [{
                          required: true,
                          message: '请选择起止日期',
                        }],
                      })(<RangePicker style={{ width: '350px' }} placeholder={['开始日期', '结束日期']} />)}
                    </FormItem>
                  </div>
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="企业性质">
              {getFieldDecorator('company_type', {
                rules: [{
                  required: true,
                  message: '请选择企业性质',
                }],
                initialValue: 'supplier',
              })(
                <Radio.Group>
                  <Radio value="supplier">厂家</Radio>
                  <Radio value="agency">代理商</Radio>
                  <Radio value="integrator">集成商</Radio>
                  <Radio value="other">其他</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="一般纳税人">
              {getFieldDecorator('is_general_taxpayer', {
                initialValue: '1',
              })(
                <Radio.Group>
                  <Radio value="0">否</Radio>
                  <Radio value="1">是</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="产品资质" help="完善产品资质信息将有利于您的账号优先审核，加快入驻合作">
              {getFieldDecorator('public', {
                initialValue: false,
                valuePropName: 'checked',
              })(
                <Checkbox>立即上传</Checkbox>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
          {/* 用户协议 */}
          <Modal
            title="注册协议"
            onOk={() => this.handleModalVisible(false)}
            onCancel={this.handleModalCanle}
            visible={this.state.modalVisible}
            okText="同意协议"
            cancelText="不同意"
          >
            <p style={{ lineHeight: 2 }}>
              <b>【审慎阅读】</b>您在申请注册流程中点击同意前，应当认真阅读以下协议。请您务必审慎阅读、充分理解协议中相关条款内容，其中包括：<br />
              1、与您约定免除或限制责任的条款；<br />
              2、与您约定法律适用和管辖的条款；<br />
              3、其他以粗体下划线标识的重要条款。<br />
              如您对协议有任何疑问，可向工业魔方服务中心咨询<br />
              <b>【特别提示】 </b>您已充分理解，当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。
              阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。<br />
              <a>《工业魔方服务条款》</a><br />
              <a>《隐私政策》</a><br />
            </p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
