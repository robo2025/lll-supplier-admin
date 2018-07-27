import React from 'react';
import { Table, Badge, Divider } from 'antd';
import { AUDIT_STATUS, PUBLISH_STATUS } from '../../constant/statusList';

const AuditStatusMap = ['processing', 'success', 'error']; // 审核状态
const GoodsStatusMap = ['default', 'success', 'default']; // 上下架状态
export default class GoodsStockListTable extends React.Component {
  render() {
    const {
      data,
      loading,
      current,
      pageSize,
      total,
      onTableChange,
      onviewRecord,
      onInOutOperation,
    } = this.props;
    const columns = [
      {
        title: '序号',
        width: 60,
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '商品ID',
        width: 160,
        dataIndex: 'gno',
        key: 'gno',
      },
      {
        title: '商品名称',
        width: 200,
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: '型号',
        width: 180,
        dataIndex: 'partnumber',
        key: 'partnumber',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '产地',
        dataIndex: 'registration_place',
        key: 'registration_place',
      },
      {
        title: '审核状态',
        dataIndex: 'audit_status',
        key: 'audit_status',
        render: val => (
          <Badge status={AuditStatusMap[val]} text={AUDIT_STATUS[val]} />
        ),
      },
      {
        title: '上下架状态',
        dataIndex: 'publish_status',
        key: 'publish_status',
        render: val => (
          <Badge status={GoodsStatusMap[val]} text={PUBLISH_STATUS[val]} />
        ),
      },
      {
        title: '库存数量',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '操作',
        key: 'operation',
        width: 200,
        fixed: 'right',
        render: record => (
          <span>
            <a
              href=" javascript:;"
              disabled={record.audit_status !== 1}
              style={{ textDecoration: 'none' }}
              onClick={() => onInOutOperation(record, 'I')}
            >
              入库
            </a>
            <Divider type="vertical" />
            <a
              href=" javascript:;"
              disabled={record.audit_status !== 1}
              style={{ textDecoration: 'none' }}
              onClick={() => onInOutOperation(record, 'O')}
            >
              调拨
            </a>
            <Divider type="vertical" />
            <a
              href=" javascript:;"
              style={{ textDecoration: 'none' }}
              onClick={() => onviewRecord(record)}
            >
              查看记录
            </a>
          </span>
        ),
      },
    ];
    const paginationOptions = {
      current,
      pageSize,
      total,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    return (
      <Table
        dataSource={data.map((ele) => { return { ...ele, key: ele.gno }; })}
        columns={columns}
        loading={loading}
        pagination={paginationOptions}
        scroll={{ x: 1300 }}
        onChange={onTableChange}
      />
    );
  }
}
