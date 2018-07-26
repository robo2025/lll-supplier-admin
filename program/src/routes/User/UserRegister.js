import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { sha256 } from 'js-sha256';
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
  Popover,
  Progress,
  Cascader,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Agreement from './Agreement';
import { QINIU_SERVER, IMAGE_TYPES } from '../../constant/config';
import {
  checkFile,
  getFileSuffix,
  handleServerMsgObj,
} from '../../utils/tools';
import options from '../../utils/cascader-address-options';
import { jumpToLogin } from '../../services/user';

import styles from './UserRegister.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ upload, user }) => ({
  upload,
  user,
}))
@Form.create({
  mapPropsToFields(props) {
    const { user } = props;
    const { supplierInfo } = user;
    const { profile, ...others } = supplierInfo;
    if (!profile) {
      return {};
    }
    const { qualifies, ...basic_info } = profile;
    let formData = {};
    Object.keys(profile).map((item) => {
      formData = {
        ...formData,
        [item]: Form.createFormField({ value: profile[item] }),
      };
      return null;
    });
    Object.keys(others).map((item) => {
      formData = {
        ...formData,
        [item]: Form.createFormField({ value: others[item] }),
      };
      return null;
    });
    // 日期
    let dateData = {};
    qualifies.map((item) => {
      dateData = {
        ...dateData,
        [`${item.qualifi_name}_date`]: Form.createFormField({
          value: [moment(item.effective_date), moment(item.expire_date)],
        }),
        [item.qualifi_name]: Form.createFormField({
          value: item.qualifi_url,
        }),
      };
      return null;
    });
    formData = {
      ...formData,
      ...dateData,
      place: Form.createFormField({
        value: [
          `${basic_info.province_id}`,
          `${basic_info.city_id}`,
          `${basic_info.district_id}`,
        ],
      }),
    };
    const licenseData = qualifies.filter(
      item => item.qualifi_name === 'license'
    );
    if (!licenseData.length) {
      return {
        ...formData,
      };
    }
    return {
      ...formData,
      ...dateData,
      qualifi_code: Form.createFormField({
        value: licenseData[0].qualifi_code,
      }),
      date: Form.createFormField({
        value: [
          moment(licenseData[0].effective_date),
          moment(licenseData[0].expire_date),
        ],
      }),
    };
  },
})
export default class UserRegister extends Component {
  constructor(props) {
    super(props);
    const { modalVisible, user, type } = props;
    const { supplierInfo } = user;
    const { profile } = supplierInfo;
    const initState = {
      count: 0,
      loading: false,
      visible: false,
      modalVisible: modalVisible !== undefined ? modalVisible : true,
      previewVisible: false,
      help: '6到16位数字、字母',
      file: { uid: '', name: '' },
      previewImage: '',
      photos: [],
      isFlag: false, // 是否立即上传产品资质
      isShowAgreement: false,
      companyType: '', // 公司性质
      isGeneralTaxpayer: false,
    };
    // 注册
    if (!profile) {
      this.state = initState;
    } else {
      const { qualifies } = profile;
      const flagArray = qualifies.filter(
        item =>
          item.qualifi_name === 'production' ||
          item.qualifi_name === 'certification' ||
          item.qualifi_name === 'other'
      );
      // 一般纳税人照片
      const isGeneralTaxpayerArray = qualifies.filter(
        item => item.qualifi_name === 'taxpayer'
      );
      let licenseData = [];
      // 其他照片
      let otherDatata = [];
      if (qualifies) {
        licenseData = qualifies.filter(item => item.qualifi_name === 'license');
        qualifies.map((item) => {
          otherDatata = {
            ...otherDatata,
            [item.qualifi_name]: [
              {
                uid: item.effective_date + item.qualifi_url, // 时间+url做为ID
                status: 'done',
                url: item.qualifi_url,
                response: {
                  key: item.qualifi_url,
                },
              },
            ],
          };
          return null;
        });
      }
      this.state = {
        ...initState,
        photos:
          licenseData.length > 0
            ? [
                {
                  uid: licenseData[0].effective_date + licenseData[0].qualifi_url, // 时间+url做为ID
                  status: 'done',
                  url: licenseData[0].qualifi_url,
                  response: {
                    key: licenseData[0].qualifi_url,
                  },
                },
              ]
            : [],
        isFlag: flagArray.length > 0, // 是否立即上传产品资质
        companyType: profile.company_type, // 公司性质
        isGeneralTaxpayer: isGeneralTaxpayerArray.length > 0,
        ...otherDatata,
      };
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upload/fetch',
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { form } = this.props;

    let count = 59;

    // 发送手机验证码
    const mobile = form.getFieldValue('mobile');
    if (mobile && mobile.length === 11) {
      this.setState({ count });
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
          clearInterval(this.interval);
        }
      }, 1000);

      this.dispatchSMSCode(mobile);
    }
  };

  onCheckboxChange = (key, e) => {
    this.setState({ [key]: e.target.checked });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  // 文件上传时处理
  handleBeforeUpload = (key, file) => {
    this.setState({ file });
    if (!checkFile(file.name, IMAGE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      return false;
    }
  };

  // 文件上传状态改变时处理
  handleUploadChange = (key, fileList) => {
    this.setState({ [key]: fileList });
    // 删除license的值触发表单校验
    if (key === 'photos' && !fileList.length) {
      this.props.form.setFieldsValue({ license: undefined });
    }
  };

  // 图片预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  handleModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };

  handleModalCanle = () => {
    message.warning('不同意就注册不了哦');
    this.props.history.go(-1);
  };

  // 提交注册
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      photos,
      production,
      certification,
      other,
      agency,
      integrator,
      taxpayer,
      isFlag,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('校验出错:', err, values);
        return;
      }
      const qualifications = []; // 资质证书
      // 营业执照
      const license = {
        qualifi_name: 'license', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
        qualifi_code: values.qualifi_code, // 证书编码
        qualifi_url: photos[0].status === 'done' ? photos[0].response.key : '', // url
        effective_date: values.date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
        expire_date: values.date[0].format('YYYY-MM-DD'), // 失效期
      };
      const place = {
        province_id: values.place[0],
        city_id: values.place[1],
        district_id: values.place[2], // 区 (可选)
      };
      qualifications.push(license);
      if (values.agency) {
        // 代理商相关证明
        const agencyObj = {
          qualifi_name: 'agency',
          qualifi_code: null, // 证书编码
          qualifi_url:
            agency[0].status === 'done' ? agency[0].response.key : '', // url
          effective_date: values.agency_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.agency_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(agencyObj);
      }
      if (values.integrator) {
        // 集成商相关证明
        const integratorObj = {
          qualifi_name: 'integrator',
          qualifi_code: null, // 证书编码
          qualifi_url:
            integrator[0].status === 'done' ? integrator[0].response.key : '', // url
          effective_date: values.integrator_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.integrator_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(integratorObj);
      }
      if (values.taxpayer) {
        // 一般纳税人相关证明
        const taxpayerObj = {
          qualifi_name: 'taxpayer',
          qualifi_code: null, // 证书编码
          qualifi_url:
            taxpayer[0].status === 'done' ? taxpayer[0].response.key : '', // url
          effective_date: values.taxpayer_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.taxpayer_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(taxpayerObj);
      }
      if (isFlag) {
        // 如果立即上传产品资质
        if (values.production) {
          // 生产许可证
          const productionObj = {
            qualifi_name: 'production', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              production[0].status === 'done' ? production[0].response.key : '', // url
            effective_date: values.production_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
            expire_date: values.production_date[1].format('YYYY-MM-DD'), // 失效期
          };
          qualifications.push(productionObj);
        }
        if (values.certification) {
          // 产品合格证
          const certificationObj = {
            qualifi_name: 'certification', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              certification[0].status === 'done'
                ? certification[0].response.key
                : '', // url
            effective_date: values.certification_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
            expire_date: values.certification_date[1].format('YYYY-MM-DD'), // 失效期
          };
          qualifications.push(certificationObj);
        }
        if (values.other) {
          // 其他证书
          const otherObj = {
            qualifi_name: 'other', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              other[0].status === 'done' ? other[0].response.key : '', // url
            effective_date: null, // 有效期 （格式：2018-04-02）
            expire_date: null, // 失效期
          };
          qualifications.push(otherObj);
        }
      }
      console.log(
        '校验通过:',
        {
          ...values,
          qualifications,
          ...place,
          password: sha256(values.password),
          confirm: sha256(values.confirm),
        },
        qualifications
      );
      if (
        this.props.handleSubmit &&
        typeof this.props.handleSubmit === 'function'
      ) {
        this.props.handleSubmit({
          // 发起注册操作
          ...values,
          qualifications,
          ...place,
          password: sha256(values.password),
          confirm: sha256(values.confirm),
        });
      } else {
        this.dispatchRegister({
          // 发起注册操作
          ...values,
          qualifications,
          ...place,
          password: sha256(values.password),
          confirm: sha256(values.confirm),
        });
      }
    });
  };

  // 发起注册操作
  dispatchRegister = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/register',
      data,
      success: () => {
        message.success('注册成功');
        jumpToLogin();
      },
      error: (res) => {
        message.error(handleServerMsgObj(res.msg));
      },
    });
  };

  // 发起获取验证码操作
  dispatchSMSCode = (mobile) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fectchSMS',
      mobile,
      success: () => {
        message.success('验证码已发送');
      },
      error: (res) => {
        message.error(handleServerMsgObj(res.msg));
      },
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handlePasswordBlur = () => {
    this.setState({ visible: false });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  // 检验密码
  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  showAgreement = () => {
    const { isShowAgreement } = this.state;
    this.setState({ isShowAgreement: !isShowAgreement });
  };

  // 公司性质单选框改变时
  handleCompanyTypeChange = (e) => {
    this.setState({ companyType: e.target.value });
  };

  // 是否为一般纳税人改变
  handleTaxpayerChange = (e) => {
    this.setState({ isGeneralTaxpayer: Boolean(e.target.value) });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { upload, type } = this.props;
    const {
      count,
      previewVisible,
      previewImage,
      isFlag,
      file,
      photos,
      production,
      certification,
      other,
      agency,
      integrator,
      taxpayer,
      companyType,
      isGeneralTaxpayer,
    } = this.state;
    // console.log('用户注册state', this.state);

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const sendCaptchaButton = (
      <Button
        disabled={count}
        type="primary"
        className={styles.getCaptcha}
        onClick={this.onGetCaptcha}
        style={{ width: 120 }}
      >
        {count ? `${count} s` : '获取验证码'}
      </Button>
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
    const content = (
      <Fragment>
        <Card
          title="基本信息"
          bordered={false}
          className={styles['register-wrap']}
        >
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="帐户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入帐户名',
                  },
                ],
              })(
                <Input
                  placeholder="请输入帐户名"
                  disabled={type === 'update'}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="密码" help={this.state.help}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                visible={this.state.visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '密码',
                    },
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder="输入密码"
                    onBlur={this.handlePasswordBlur}
                  />
                )}
              </Popover>
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder="重复输入密码"
                  onBlur={this.handleConfirmBlur}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="联系邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系邮箱',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误！',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                  {
                    len: 11,
                    message: '请输入正确的手机号码',
                  },
                ],
              })(<Input disabled={type === 'update'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="短信验证码">
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: '请输入短信验证码',
                  },
                ],
              })(<Input size="large" addonAfter={sendCaptchaButton} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="企业名称"
              help="请填写与企业营业执照或三证合一证件保持一致"
            >
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="企业地址">
              {getFieldDecorator('place', {
                rules: [{ required: true, message: '请选择省市区' }],
              })(
                <Cascader
                  options={options}
                  changeOnSelect
                  style={{ width: '100%' }}
                  placeholder="请选择省市区"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业地址',
                  },
                ],
              })(<Input placeholder="请填写详细地址" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人"
              help="请填写与企业营业执照或三证合一证件保持一致"
            >
              {getFieldDecorator('legal', {
                rules: [
                  {
                    required: true,
                    message: '请输入公司法人',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="固定电话">
              {getFieldDecorator('telphone', {
                rules: [
                  {
                    required: true,
                    message: '请输入固定电话',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Form>
        </Card>
        <Card title="资质信息" bordered={false} style={{ marginTop: 35 }}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="营业执照注册号">
              {getFieldDecorator('qualifi_code', {
                rules: [
                  {
                    required: true,
                    message: '请输入营业执照注册号',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="营业执照照片">
              {getFieldDecorator('license', {
                rules: [
                  {
                    required: true,
                    message: '请上传营业执照照片',
                  },
                ],
              })(
                <div>
                  <Upload
                    name="file"
                    action={QINIU_SERVER}
                    listType="picture-card"
                    fileList={this.state.photos}
                    className="avatar-uploader"
                    beforeUpload={currFile =>
                      this.handleBeforeUpload('photos', currFile)
                    }
                    onChange={({ fileList }) => {
                      this.handleUploadChange('photos', fileList);
                    }}
                    onPreview={this.handlePreview}
                    data={{
                      token: upload.upload_token,
                      key: `supplier/qualification/images/${
                        file.uid
                      }.${getFileSuffix(file.name)}`,
                    }}
                  >
                    {photos && photos.length >= 1 ? null : uploadButton}
                  </Upload>
                  <FormItem label="有效期">
                    {getFieldDecorator('date', {
                      rules: [
                        {
                          required: true,
                          message: '请选择起止日期',
                        },
                      ],
                    })(
                      <RangePicker
                        style={{ width: '350px' }}
                        placeholder={['开始日期', '结束日期']}
                      />
                    )}
                  </FormItem>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="企业性质">
              {getFieldDecorator('company_type', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业性质',
                  },
                ],
                initialValue: 'supplier',
              })(
                <Radio.Group onChange={this.handleCompanyTypeChange}>
                  <Radio value="supplier">厂家</Radio>
                  <Radio value="agency">代理商</Radio>
                  <Radio value="integrator">集成商</Radio>
                  <Radio value="other">其他</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {companyType === 'agency' ? (
              <FormItem
                {...formItemLayout}
                label="代理商相关证书"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('agency', {
                  rules: [
                    {
                      required: false,
                      message: '请上传代理商相关证书照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={this.state.agency}
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('agency', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('agency', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {agency && agency.length >= 1 ? null : uploadButton}
                    </Upload>
                    <FormItem label="有效期">
                      {getFieldDecorator('agency_date', {
                        rules: [
                          {
                            required: agency && agency.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            ) : null}
            {companyType === 'integrator' ? (
              <FormItem
                {...formItemLayout}
                label="集成商相关证书"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('integrator', {
                  rules: [
                    {
                      required: false,
                      message: '请上传集成商相关证书照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={this.state.integrator}
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('integrator', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('integrator', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {integrator && integrator.length >= 1
                        ? null
                        : uploadButton}
                    </Upload>
                    <FormItem label="有效期">
                      {getFieldDecorator('integrator_date', {
                        rules: [
                          {
                            required: integrator && integrator.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="一般纳税人">
              {getFieldDecorator('is_general_taxpayer', {
                initialValue: 0,
              })(
                <Radio.Group onChange={this.handleTaxpayerChange}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {isGeneralTaxpayer ? (
              <FormItem
                {...formItemLayout}
                label="一般纳税人证明"
                help="照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('taxpayer', {
                  rules: [
                    {
                      required: false,
                      message: '请上传一般纳税人证明照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={this.state.taxpayer}
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('taxpayer', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('taxpayer', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {taxpayer && taxpayer.length >= 1 ? null : uploadButton}
                    </Upload>
                    <FormItem label="有效期">
                      {getFieldDecorator('taxpayer_date', {
                        rules: [
                          {
                            required: integrator && integrator.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            ) : null}
            <FormItem
              {...formItemLayout}
              label="产品资质"
              help="完善产品资质信息将有利于您的账号优先审核，加快入驻合作"
            >
              {getFieldDecorator('public', {
                initialValue: false,
                valuePropName: 'checked',
              })(
                <Checkbox
                  onChange={(e) => {
                    this.onCheckboxChange('isFlag', e);
                  }}
                >
                  立即上传
                </Checkbox>
              )}
            </FormItem>
            {isFlag ? (
              <div>
                <FormItem
                  style={{ marginBottom: 30 }}
                  {...formItemLayout}
                  label="产品生产许可证"
                  help="证书照片(图片小于1M，支持格式jpg\png)"
                >
                  {getFieldDecorator('production', {
                    rules: [
                      {
                        required: false,
                        message: '请上传产品生产许可证照片',
                      },
                    ],
                  })(
                    <div>
                      <Upload
                        name="file"
                        action={QINIU_SERVER}
                        listType="picture-card"
                        fileList={this.state.production}
                        className="avatar-uploader"
                        beforeUpload={currFile =>
                          this.handleBeforeUpload('production', currFile)
                        }
                        onChange={({ fileList }) => {
                          this.handleUploadChange('production', fileList);
                        }}
                        onPreview={this.handlePreview}
                        data={{
                          token: upload.upload_token,
                          key: `supplier/qualification/images/${
                            file.uid
                          }.${getFileSuffix(file.name)}`,
                        }}
                      >
                        {production && production.length >= 1
                          ? null
                          : uploadButton}
                      </Upload>
                      <FormItem label="有效期">
                        {getFieldDecorator('production_date', {
                          rules: [
                            {
                              required: production && production.length > 0,
                              message: '请选择起止日期',
                            },
                          ],
                        })(
                          <RangePicker
                            style={{ width: '350px' }}
                            placeholder={['开始日期', '结束日期']}
                          />
                        )}
                      </FormItem>
                    </div>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 30 }}
                  label="产品合格证"
                  help="证书照片(图片小于1M，支持格式jpg\png)"
                >
                  {getFieldDecorator('certification', {
                    rules: [
                      {
                        required: false,
                        message: '请上传产品合格证照片',
                      },
                    ],
                  })(
                    <div>
                      <Upload
                        name="file"
                        action={QINIU_SERVER}
                        listType="picture-card"
                        fileList={this.state.certification}
                        className="avatar-uploader"
                        beforeUpload={currFile =>
                          this.handleBeforeUpload('certification', currFile)
                        }
                        onChange={({ fileList }) => {
                          this.handleUploadChange('certification', fileList);
                        }}
                        onPreview={this.handlePreview}
                        data={{
                          token: upload.upload_token,
                          key: `supplier/qualification/images/${
                            file.uid
                          }.${getFileSuffix(file.name)}`,
                        }}
                      >
                        {certification && certification.length >= 1
                          ? null
                          : uploadButton}
                      </Upload>
                      <FormItem label="有效期">
                        {getFieldDecorator('certification_date', {
                          rules: [
                            {
                              required:
                                certification && certification.length > 0,
                              message: '请选择起止日期',
                            },
                          ],
                        })(
                          <RangePicker
                            style={{ width: '350px' }}
                            placeholder={['开始日期', '结束日期']}
                          />
                        )}
                      </FormItem>
                    </div>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  style={{ marginBottom: 30 }}
                  label="其他证书"
                  help="证书照片(图片小于1M，支持格式jpg\png)"
                >
                  {getFieldDecorator('other', {
                    rules: [
                      {
                        required: false,
                        message: '请上传营业执照照片',
                      },
                    ],
                  })(
                    <div>
                      <Upload
                        name="file"
                        action={QINIU_SERVER}
                        listType="picture-card"
                        fileList={this.state.other}
                        className="avatar-uploader"
                        beforeUpload={currFile =>
                          this.handleBeforeUpload('other', currFile)
                        }
                        onChange={({ fileList }) => {
                          this.handleUploadChange('other', fileList);
                        }}
                        onPreview={this.handlePreview}
                        data={{
                          token: upload.upload_token,
                          key: `supplier/qualification/images/${
                            file.uid
                          }.${getFileSuffix(file.name)}`,
                        }}
                      >
                        {other && other.length >= 3 ? null : uploadButton}
                      </Upload>
                    </div>
                  )}
                </FormItem>
              </div>
            ) : null}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                {this.props.buttonText || '提交'}
              </Button>
              {/* <Button style={{ marginLeft: 8 }}>保存</Button> */}
            </FormItem>
          </Form>
          {/* 用户协议 */}
          <Modal
            title="注册协议"
            visible={this.state.modalVisible}
            footer={
              <Button
                type="primary"
                onClick={() => this.handleModalVisible(false)}
              >
                同意协议
              </Button>
            }
            className={styles['register-modal']}
          >
            <p style={{ lineHeight: 2 }}>
              <b>【审慎阅读】</b>您在申请注册流程中点击同意前，应当认真阅读以下协议。请您务必审慎阅读、充分理解协议中相关条款内容，其中包括：<br />
              1、与您约定免除或限制责任的条款；<br />
              2、与您约定法律适用和管辖的条款；<br />
              3、其他以粗体下划线标识的重要条款。<br />
              如您对协议有任何疑问，可向工业魔方服务中心咨询<br />
              <b>
                【特别提示】{' '}
              </b>您已充分理解，当您按照注册页面提示填写信息、阅读并同意协议且完成全部注册程序后，即表示您已充分阅读、理解并接受协议的全部内容。
              阅读协议的过程中，如果您不同意相关协议或其中任何条款约定，您应立即停止注册程序。<br />
              <a onClick={this.showAgreement}>《工业魔方服务条款》</a>
              <br />
              {/* <a>《隐私政策》</a><br /> */}
              {this.state.isShowAgreement ? <Agreement /> : null}
            </p>
          </Modal>
          {/* 图片预览 */}
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Card>
      </Fragment>
    );
    if (type === 'update') {
      return content;
    }
    return <PageHeaderLayout title="企业用户注册">{content}</PageHeaderLayout>;
  }
}
