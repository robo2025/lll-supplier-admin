import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Cookies from 'js-cookie';
import { Card, Row, Col, Spin, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { getAreaBycode } from '../../utils/cascader-address-options';
import CustomerOrder from './CustomerOrder';
import solutionImg from '../../assets/solution.jpg';

const { Description } = DescriptionList;

const tabList = [
  {
    key: 'supplier',
    tab: '我的报价',
  },
  {
    key: 'customer',
    tab: '询价单详情',
  },
];

const coreDeviceTableColumns = [
  {
    title: '组成部分',
    dataIndex: 'device_component',
    key: 'device_component',
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
const adiDeviceTableColumns = [
  {
    title: '所属类型',
    dataIndex: 'device_component',
    key: 'device_component',
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
@connect(({ solution, user, loading }) => ({
  profile: solution.profile,
  supplierInfo: user.supplierInfo,
  loading: loading.models.solution,
}))
class SolutionDetail extends React.Component {
  state = {
    key: 'supplier',
  };
  componentDidMount() {
    const userId = Cookies.getJSON('userinfo').main_user_id;
    if (userId) {
      this.props.dispatch({
        type: 'user/fetchSupplierInfo',
        supplierId: userId,
      });
    }
    this.props.dispatch({
      type: 'solution/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  onTabChange = (key) => {
    this.setState({ key });
  };
  render() {
    const { profile, supplierInfo } = this.props;
    const { customer, supplier } = profile;
    if (!customer || !supplier || !supplierInfo.profile) {
      return <Spin />;
    }
    const { sln_basic_info, sln_user_info, sewage_info } = customer;
    const {
      sln_supplier_info,
      sln_device,
      welding_tech_param,
      sln_support,
    } = supplier;
    const coreDeviceTableData = sln_device.filter(
      item => item.device_type === '核心设备'
    );
    const aidDeviceTableData = sln_device.filter(
      item => item.device_type === '辅助设备'
    );
    const contentList = {
      supplier: (
        <div>
          <Card title="我的信息">
            <DescriptionList size="small" col="3">
              <Description term="公司名称">
                {supplierInfo.profile.company}
              </Description>
              <Description term="联系人">{supplierInfo.username}</Description>
              <Description term="联系电话">{supplierInfo.mobile}</Description>
              <Description term="公司所在地">
                {getAreaBycode(`${supplierInfo.profile.district_id}`)}
              </Description>
            </DescriptionList>
          </Card>
          <Card title="核心设备清单" style={{ marginTop: 30 }}>
            <Table
              columns={coreDeviceTableColumns}
              dataSource={coreDeviceTableData.map((item) => {
                return { ...item, key: item.device_id };
              })}
              pagination={false}
            />
          </Card>
          <Card title="辅助设备" style={{ marginTop: 30 }}>
            <Table
              columns={adiDeviceTableColumns}
              dataSource={aidDeviceTableData.map((item) => {
                return { ...item, key: item.device_id };
              })}
              pagination={false}
            />
          </Card>
          <Card style={{ marginTop: 30 }} title="技术支持">
            <DescriptionList size="small" col="2">
              {sln_support
                ? sln_support.map((item) => {
                    return (
                      <Description term={item.name}>
                        ￥{item.price}元<span style={{ marginLeft: 35 }}>
                          备注：{item.note}
                                      </span>
                      </Description>
                    );
                  })
                : null}
            </DescriptionList>
          </Card>
          {welding_tech_param.length ? (
            <Card style={{ marginTop: 30 }} title="技术参数">
              <DescriptionList size="small" col="2">
                {welding_tech_param.map((item) => {
                  return (
                    <Description term={item.name}>
                      {item.value}
                      <span style={{ marginLeft: 5 }}>{item.unit_name}</span>
                    </Description>
                  );
                })}
              </DescriptionList>
            </Card>
          ) : null}
          <Card style={{ marginTop: 30 }} title="报价信息">
            <DescriptionList size="small" col="3">
              <Description term="付款比例">
                <span>首付：{sln_supplier_info.pay_ratio}% </span>
                <span>尾款：{100 - sln_supplier_info.pay_ratio}%</span>
              </Description>
              <Description term="运费">
                ￥{sln_supplier_info.freight_price}元
              </Description>
              <Description term="方案总价">
                ￥{sln_supplier_info.total_price}元（含运费）
              </Description>
              <Description term="报价有效期">
                {moment
                  .unix(sln_supplier_info.expired_date)
                  .format('YYYY年MM月DD日')}
              </Description>
              <Description term="方案发货期">
                {sln_supplier_info.delivery_date}
              </Description>
              <Description term="方案介绍">
                {sln_supplier_info.sln_desc}
              </Description>
              <Description term="备注">
                {sln_supplier_info.sln_note}
              </Description>
            </DescriptionList>
          </Card>
        </div>
      ),
      customer: <CustomerOrder profile={profile} hideBuuton />,
    };
    const extra = (
      <Row style={{ marginRight: 20 }}>
        <Col xs={24} sm={12}>
          <div>报价金额</div>
          <div style={{ fontSize: 25, color: 'green' }}>
            ￥{sln_supplier_info.total_price}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>状态</div>
          <div style={{ fontSize: 25, color: 'green' }}>已报价</div>
        </Col>
      </Row>
    );
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 20 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案询价单号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format('YYYY-MM-DD HH:mm')}
        </Description>
        <Description term="客户备注">
          {sln_user_info.sln_note === '' ? '无' : sln_user_info.sln_note}
        </Description>
      </DescriptionList>
    );
    return (
      <PageHeaderLayout
        title={`单号：${sln_basic_info.sln_no}`}
        logo={<img alt="logo" src={solutionImg} />}
        content={headContent}
        extraContent={extra}
        tabList={tabList}
        activeTabKey={this.state.key}
        onTabChange={this.onTabChange} //  TODO:选中的TAB 没有高亮
      >
        {contentList[this.state.key]}
      </PageHeaderLayout>
    );
  }
}

export default SolutionDetail;
