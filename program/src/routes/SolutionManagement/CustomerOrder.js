import React, { Fragment } from 'react';
import { Card, Spin, Table, Divider, Button } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import styles from './SolutionOrderDetail.less';
import { getAreaBycode } from '../../utils/cascader-address-options';
import { sln_config } from '../../utils/solutionConfig';

const { Description } = DescriptionList;

const columns = [
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

class CustomerOrder extends React.Component {
  render() {
    const { profile, hideBuuton } = this.props;
    const { customer, userInfo } = profile;
    if (!customer || !userInfo) {
      return <Spin />;
    }
    const {
      sln_user_info,
      sln_device,
      welding_info,
      sewage_info,
      sln_file,
    } = customer;
    const sln_info = welding_info || sewage_info;
    const deviceMoney = () => {
      let money = 0;
      sln_device.forEach((item) => {
        money += item.device_num * item.device_price;
      });
      return money;
    };
    console.log(sln_info);
    return (
      <Fragment>
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
                {sln_info.welding_business || sln_info.sewage_business}
              </Description>
              <Description term="应用场景">
                {sln_info.welding_scenario || sln_info.sewage_scenario}
              </Description>
            </DescriptionList>
            <Divider />
            <DescriptionList size="small" col="3">
              {Object.keys(sln_info).map((key) => {
                if (sln_config[key]) {
                  return (
                    <Description term={sln_config[key]}>
                      {sln_info[key]}
                    </Description>
                  );
                }
                return <div style={{ display: 'none' }} />;
              })}
            </DescriptionList>
            <Divider />
            <DescriptionList size="small" col="1">
              {sln_user_info.welding_name ? (
                <Description term="工件名称">
                  {sln_user_info.welding_name}
                </Description>
              ) : (
                <div style={{ display: 'none' }} />
              )}
              {sln_file.map((item) => {
                if (item.file_type === 'cad') {
                  return (
                    <Description term="工件CAD图">
                      <a href={item.file_url} key={item.id} target="_blank">
                        {item.file_name}
                      </a>
                    </Description>
                  );
                }
                return <div style={{ display: 'none' }} />;
              })}
              <Description term="工件图片">
                {sln_file.map((item) => {
                  if (item.file_type === 'img') {
                    return (
                      <a href={item.file_url} key={item.id} target="_blank">
                        <img src={item.file_url} alt={item.file_name} />
                      </a>
                    );
                  }
                  return <div style={{ display: 'none' }} />;
                })}
              </Description>
            </DescriptionList>
          </Card>
        </Card>
        <Card title="核心设备清单" style={{ marginTop: 30 }}>
          <Table
            columns={columns}
            dataSource={sln_device.map((item) => {
              return { ...item, key: item.device_id };
            })}
          />
          <div className={styles.tabelFooter}>
            核心设备价格：
            <span>
              {deviceMoney()}
              元
            </span>
          </div>
          {hideBuuton ? null : (
            <Button
              type="primary"
              size="large"
              className={styles.footerBotton}
              href={`${
                location.href.split('detail')[0]
              }solutionPriceQuotation?sln_no=${location.href.split('=').pop()}`}
            >
              立即报价
            </Button>
          )}
        </Card>
      </Fragment>
    );
  }
}

export default CustomerOrder;
