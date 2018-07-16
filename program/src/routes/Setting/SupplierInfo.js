import React, { Component, Fragment } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { Card, Form, Steps, Spin } from 'antd';
import { getAreaBycode } from '../../utils/cascader-address-options';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import UserRegister from '../User/UserRegister';

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
    const { profile, ...others } = supplierInfo;
    if (!profile) {
      return <Spin />;
    } 
    const qualifies = supplierInfo.profile
      ? supplierInfo.profile.qualifies
      : [];
    const companyType = supplierInfo.profile
      ? supplierInfo.profile.company_type
      : '';
    const license = qualifies.find(val => val.qualifi_name === 'license');
    const companyTypeLicense = companyType
      ? qualifies.find(val => val.qualifi_name === companyType)
      : {};
    const areaAddress = getAreaBycode(
      supplierInfo.profile ? supplierInfo.profile.district_id.toString() : ''
    );
    
    return (
      <PageHeaderLayout title="企业信息">
        <Card
          bordered
          hoverable
          title={
            <div>
              审核进度<a style={{ fontSize: 14, marginLeft: 10 }}>
                {supplierInfo.profile.audit_status !== 2 ? (
                  <span style={{ color: '#1890ff' }}>
                    您的资料正在审核中，我们将来1-3个工作日内完成审核。
                  </span>
                ) : (
                  <span style={{ color: 'red' }}>审核不通过，请重新提交资料或联系客服</span>
                )}
                  </a>
            </div>
          }
          style={{ marginTop: 35 }}
        >
          <Steps current={supplierInfo.profile.audit_status === 2 ? 2 : 1}>
            <Step key={0} title="创建账号" />
            <Step key={1} title="平台审核" />
            {supplierInfo.profile.audit_status === 2 ? (
              <Step key={2} title="审核不通过" />
            ) : (
              <Step key={2} title="审核通过" />
            )}
            <Step key={3} title="完成" />
          </Steps>
        </Card>
        {supplierInfo.profile.audit_status === 2 ? (
          <UserRegister type="update" modalVisible={false} style={{ marginTop: 35 }} data={{ ...profile, ...others }} />
        ) : (
          <Fragment>
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
                <span>
                  {supplierInfo.profile && supplierInfo.profile.company}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label="企业法人" style={style}>
                <span>
                  {supplierInfo.profile && supplierInfo.profile.legal}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label="企业地址" style={style}>
                <span>
                  {areaAddress.join('')}
                  {supplierInfo.profile && supplierInfo.profile.address}
                </span>
              </FormItem>
              <FormItem {...formItemLayout} label="固定电话" style={style}>
                <span>
                  {supplierInfo.profile && supplierInfo.profile.telphone}
                </span>
              </FormItem>
            </Card>
            <Card
              title="资质信息"
              bordered={false}
              style={{ marginTop: 35 }}
              hoverable
            >
              <FormItem {...formItemLayout} label="营业执照号" style={style}>
                <span>{license && license.qualifi_code}</span>
              </FormItem>
              <FormItem {...formItemLayout} label="营业执照照片" style={style}>
                <div>
                  <img
                    width={500}
                    src={license ? license.qualifi_url : ''}
                    alt="营业执照"
                  />
                  <div>
                    有效期：{license && license.effective_date}~{license &&
                      license.expire_date}
                  </div>
                </div>
              </FormItem>
              <FormItem {...formItemLayout} label="企业性质" style={style}>
                <span>{supplierInfo.profile && COMPANY_TYPE[companyType]}</span>
              </FormItem>
              {companyTypeLicense &&
              Object.keys(companyTypeLicense).length > 0 ? (
                <FormItem
                  {...formItemLayout}
                  label={`${COMPANY_TYPE[companyType]}证书`}
                  style={style}
                >
                  <div>
                    <img
                      width={500}
                      src={
                        companyTypeLicense ? companyTypeLicense.qualifi_url : ''
                      }
                      alt={`${COMPANY_TYPE[companyType]}证书`}
                    />
                    <div>
                      有效期：
                      {companyTypeLicense && companyTypeLicense.effective_date}
                      ~
                      {companyTypeLicense && companyTypeLicense.expire_date}
                    </div>
                  </div>
                </FormItem>
              ) : null}
            </Card>
          </Fragment>
        )}
      </PageHeaderLayout>
    );
  }
}
