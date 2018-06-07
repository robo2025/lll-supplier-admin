import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { Card, Form, Steps } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Step } = Steps;
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
const style = {
  marginBottom: 10,
};
const COMPANY_TYPE = {
  supplier: '供应商',
  integrator: '集成商',
  agency: '代理商',
  other: '其他',
};

@connect(({ user }) => ({
  user,
}))
export default class SupplierInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log(Cookies.getJSON('userinfo').id);
    const userId = Cookies.getJSON('userinfo').id;
    if (userId) {
      dispatch({
        type: 'user/fetchSupplierInfo',
        supplierId: userId,
      });
    }
  }

  render() {
    const { supplierInfo } = this.props.user;
    const qualifies = supplierInfo.profile ? supplierInfo.profile.qualifies : [];
    const companyType = supplierInfo.profile ? supplierInfo.profile.company_type : '';
    const license = qualifies.find(val => (val.qualifi_name === 'license'));
    const companyTypeLicense = companyType ?
      qualifies.find(val => (val.qualifi_name === companyType)) : {};
    // console.log('公司性质证书', companyTypeLicense);

    return (
      <PageHeaderLayout
        title="企业信息"
      >
        <Card
          bordered
          hoverable
          title={(
            <div>
              审核进度<a style={{ fontSize: 14, marginLeft: 10 }}>您的资料正在审核中，我们将来1-3个工作日内完成审核。</a>
            </div>)}
          style={{ marginTop: 35 }}
        >
          <Steps current={supplierInfo.profile ? supplierInfo.profile.audit_status + 1 : 0}>
            <Step key={-1} title="创建账号" />
            <Step key={0} title="平台审核" />
            <Step key={1} title="审核通过" />
          </Steps>
        </Card>
        <Card title="基本信息" bordered style={{ marginTop: 35 }} hoverable>
          <FormItem {...formItemLayout} label="用户名" style={style}>
            <span>{supplierInfo.username}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="手机号" style={style}>
            <span>{supplierInfo.mobile}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="联系邮箱" style={style}>
            <span>{supplierInfo.email || '无'}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业名称" style={style}>
            <span>{supplierInfo.profile && supplierInfo.profile.company}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业法人" style={style}>
            <span>{supplierInfo.profile && supplierInfo.profile.legal}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业地址" style={style}>
            <span>{supplierInfo.profile && supplierInfo.profile.address}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="固定电话" style={style}>
            <span>{supplierInfo.profile && supplierInfo.profile.telphone}</span>
          </FormItem>
        </Card>
        <Card title="资质信息" bordered={false} style={{ marginTop: 35 }} hoverable>
          <FormItem {...formItemLayout} label="营业执照号" style={style}>
            <span>{license && license.qualifi_code}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="营业执照照片" style={style}>
            <div>
              <img width={500} src={license ? license.qualifi_url : ''} alt="营业执照" />
              <div>有效期：{license && license.effective_date}~{license && license.expire_date}</div>
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="企业性质" style={style}>
            <span>{supplierInfo.profile && COMPANY_TYPE[companyType]}</span>
          </FormItem>
          <FormItem {...formItemLayout} label={`${COMPANY_TYPE[companyType]}证书`} style={style}>
            <div>
              <img width={500} src={companyTypeLicense ? companyTypeLicense.qualifi_url : ''} alt={`${COMPANY_TYPE[companyType]}证书`} />
              <div>
                有效期：
                {companyTypeLicense && companyTypeLicense.effective_date}
                ~
                {companyTypeLicense && companyTypeLicense.expire_date}
              </div>
            </div>
          </FormItem>
        </Card>
      </PageHeaderLayout>
    );
  }
}
