import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Spin, Table, Divider, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './SolutionOrderDetail.less';
import { getAreaBycode } from '../../utils/cascader-address-options';
import solutionImg from '../../assets/solution.jpg';

const { Description } = DescriptionList;
const extra = (
  <Row>
    <Col xs={24} sm={15}>
      <div>状态</div>
      <div style={{ fontSize: 20, color: 'red' }}>未报价</div>
    </Col>
  </Row>
);
const columns = [
  {
    title: '商品类型',
    dataIndex: 'device_type',
    key: 'device_type',
  },
  {
    title: '商品名称',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: '型号',
    dataIndex: 'device_model',
    key: 'device_model',
  },
  {
    title: '品牌',
    dataIndex: 'brand_name',
    key: 'brand_name',
  },
  {
    title: '数量',
    dataIndex: 'device_num',
    key: 'device_num',
  },
  {
    title: '单价（元）',
    dataIndex: 'device_price',
    key: 'device_price',
  },
  {
    title: '小计（元）',
    key: 'total_price',
    render: row => <span>{row.device_num * row.device_price}</span>,
  },
  {
    title: '备注',
    key: 'device_note',
    dataIndex: 'device_note',
    render: text => (text === '' ? '无' : text),
  },
];
@connect(({ solution, loading }) => ({
  profile: solution.profile,
  loading: loading.models.solution,
}))
class SolutionOrderDetail extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  render() {
    const { profile, loading } = this.props;
    const { customer, userInfo } = profile;
    if (!customer || !userInfo) {
      return <Spin />;
    }
    const {
      sln_basic_info,
      sln_user_info,
      welding_device,
      welding_info,
      welding_file,
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
    const deviceMoney = () => {
      let money = 0;
      welding_device.forEach((item) => {
        money += item.device_num * item.device_price;
      });
      return money;
    };
    return (
      <PageHeaderLayout
        title={`单号：${sln_basic_info.sln_no}`}
        logo={<img alt="logo" src={solutionImg} />}
        content={headContent}
        extraContent={extra}
      >
        <Card title="用户信息">
          <DescriptionList size="small" col="3">
            <Description term="公司名称">
              {userInfo.profile.company}
            </Description>
            <Description term="联系人">{userInfo.username}</Description>
            <Description term="联系电话">{userInfo.mobile}</Description>
            <Description term="公司所在地">
              {getAreaBycode(`${userInfo.profile.district_id}`)}
            </Description>
          </DescriptionList>
        </Card>
        <Card title="用户需求" className={styles.requirement}>
          <Card title="用户需求信息">
            <DescriptionList size="small" col="3">
              <Description term="行业">
                {welding_info.welding_business}
              </Description>
              <Description term="应用场景">
                {welding_info.welding_scenario}
              </Description>
            </DescriptionList>
            <Divider />
            <DescriptionList size="small" col="3">
              <Description term="母材">
                {welding_info.welding_metal}
              </Description>
              <Description term="焊接气体">
                {welding_info.welding_gas}
              </Description>
              <Description term="焊接工艺">
                {welding_info.welding_method}
              </Description>
              <Description term="板厚">{welding_info.max_height}mm</Description>
              <Description term="生产效率">
                {welding_info.welding_efficiency}
              </Description>
              <Description term="飞溅">
                {welding_info.welding_splash}
              </Description>
              <Description term="成型">
                {welding_info.welding_model}
              </Description>
            </DescriptionList>
            <Divider />
            <DescriptionList size="small" col="2">
              <Description term="工件名称">
                {sln_user_info.welding_name}
              </Description>
              <Description term="工件CAD图">
                <div>{welding_file.map((item) => {
                  if (item.file_type === 'cad') {
                    return <a href={item.file_url} key={item.id}>{item.file_name}</a>;
                  }
                  return null;
                })}
                </div>
              </Description>
              <Description term="工件图片">
                {welding_file.map((item) => {
                  if (item.file_type === 'img') {
                    return (
                      <a href={item.file_url} key={item.id}>
                        <img src={item.file_url} alt={item.file_name} />
                      </a>
                    );
                  }
                  return null;
                })}
              </Description>
            </DescriptionList>
          </Card>
        </Card>
        <Card title="核心设备清单" style={{ marginTop: 30 }}>
          <Table
            columns={columns}
            dataSource={welding_device.map((item) => {
              return { ...item, key: item.id };
            })}
          />
          <div className={styles.tabelFooter}>
            核心设备价格：
            <span>
              {deviceMoney()}
              元
            </span>
          </div>
          <Button
            type="primary"
            size="large"
            className={styles.footerBotton}
            href={`${location.href.split('detail')[0]}solutionPriceQuotation?sln_no=${location.href.split('=').pop()}`}
          >
            立即报价
          </Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default SolutionOrderDetail;
