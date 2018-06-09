import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import solutionImg from '../../assets/solution.jpg';
import CustomerOrder from './CustomerOrder';

const { Description } = DescriptionList;
const extra = (
  <Row>
    <Col xs={24} sm={15}>
      <div>状态</div>
      <div style={{ fontSize: 20, color: 'red' }}>未报价</div>
    </Col>
  </Row>
);
@connect(({ solution, loading }) => ({
  profile: solution.profile,
  loading: loading.models.solution,
}))
class SolutionOrderDetail extends React.Component {
  componentDidMount() {
    if (!this.props.profile.customer) {
      this.props.dispatch({
        type: 'solution/fetchDetail',
        payload: location.href.split('=').pop(),
      });
    }
  }
  render() {
    const { profile } = this.props;
    const { customer, userInfo } = profile;
    if (!customer || !userInfo) {
      return <Spin />;
    }
    const {
      sln_basic_info,
      sln_user_info,
    } = customer;
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 18 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案编号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format('YYYY-MM-DD HH:MM')}
        </Description>
        <Description term="客户备注">
          {sln_user_info.welding_note === ''
            ? '无'
            : sln_user_info.welding_note}
        </Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`方案询价单号：${sln_basic_info.sln_no}`}
        logo={<img alt="logo" src={solutionImg} />}
        content={headContent}
        extraContent={extra}
      >
        <CustomerOrder profile={profile} />
      </PageHeaderLayout>
    );
  }
}

export default SolutionOrderDetail;
