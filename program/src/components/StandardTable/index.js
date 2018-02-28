import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';
import { PAGE_SIZE } from '../../constant/config';

const statusMap = ['default', 'success', 'error'];

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      totalCallNo: 0,
      filteredInfo: null,
      sortedInfo: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  };

  handleTableChange = (pagination, filters, sorter) => {
    console.log('处理tab变化：', pagination, filters, sorter, PAGE_SIZE);
    this.props.pagingFun((pagination.current - 1) * PAGE_SIZE, PAGE_SIZE);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    // this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    let { selectedRowKeys, totalCallNo, sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    // const { data: { list, pagination }, loading } = this.props;
    const list = this.props.data;
    const totalSize = this.props.totalSize;// 需求总条数
    list.forEach((val) => {
      val.desc = val.desc ? val.desc.substr(0, 10) : '';
    });
    const loading = this.props.loading;


    const status = ['未审核', '已审核', '未通过'];
    const types = {
      si: '系统集成',
      purchase: '产品购买',
      tech: '技术支持',
      other: '其他',
    };

    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '类型',
        dataIndex: 'req_type',
        key: 'req_type',
        filters: [
          {
            text: types.si,
            value: 'si',
          },
          {
            text: types.purchase,
            value: 'purchase',
          },
          {
            text: types.tech,
            value: 'tech',
          },
          {
            text: types.other,
            value: 'other',
          },
        ],
        filteredValue: filteredInfo.req_type || null,
        onFilter: (value, record) => (record.req_type.includes(value)),
        sortOrder: sortedInfo.columnKey === 'req_type' && sortedInfo.order,
        render(val) {
          return <span> {types[val]} </span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => (record.status === value >> 0),
        sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '报价',
        dataIndex: 'budget',
        key: 'budget',
        sorter: (a, b) => a.budget - b.budget,
        sortOrder: sortedInfo.columnKey === 'budget' && sortedInfo.order,
      },
      {
        title: '查看',
        render: val => <a onClick={this.props.jumpFunc.bind(this, val.id)}>查看</a>,
      },
      {
        title: '发布时间',
        dataIndex: 'created_time',
        key: 'created_time',
        sorter: (a, b) => a.created_time - b.created_time,
        sortOrder: sortedInfo.columnKey === 'created_time' && sortedInfo.order,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '审核',
        render: (val, record) => (
          <div>
            <a onClick={this.props.examine.bind(this, val.id, 1)}>通过</a>
            <Divider type="vertical" />
            <a onClick={this.props.examine.bind(this, val.id, 2)}>驳回</a>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent: 1,
      total: totalSize,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    console.log('表单', this.props);

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {/* 服务调用总计 <span style={{fontWeight: 600}}>{totalCallNo}</span> 万 */}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
