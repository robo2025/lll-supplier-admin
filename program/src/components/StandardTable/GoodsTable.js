/*
 * @Author: lll
 * @Date: 2018-01-26 14:08:45
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-15 13:46:22
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import { PUBLISH_STATUS } from '../../constant/statusList';
import styles from './goods-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const auditStatus = ['待审核', '已通过', '未通过'];
const GoodsStatusMap = ['default', 'success', 'default'];// 上下架状态
class GoodsTable extends PureComponent {
    state = {
        selectedRowKeys: [],
        totalCallNo: 0,
    };

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
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }

    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    }

    render() {
        const { selectedRowKeys, totalCallNo } = this.state;
        const { data, loading, onPublish, onPriceSetting, total, current, pageSize } = this.props;

        const columns = [{
            title: '商品名称',
            dataIndex: 'product',
            render: val => (<span className="td-col">{val.product_name}</span>),
            key: 'product_name',
            width: 200,
        }, {
            title: '型号',
            dataIndex: 'product_model',
            key: 'partnumber',
            render: val => (<span >{val.partnumber}</span>),
        }, {
            title: '商品ID',
            dataIndex: 'gno',
            width: 160,
        }, {
            title: '品牌',
            dataIndex: 'product',
            key: 'brand_name',
            render: val => (<span >{val.brand.brand_name}</span>),
        }, {
            title: '产地',
            dataIndex: 'product',
            key: 'registration_place',
            render: val => (<span >{val.brand.registration_place}</span>),
        }, {
            title: '一级类目',
            dataIndex: 'product',
            render: val => (<span >{val.category ? val.category.category_name : ''}</span>),
            key: 'category_name_1',
        }, {
            title: '二级类目',
            dataIndex: 'product',
            render: val => (<span >{val.category ? val.category.children.category_name : ''}</span>),
            key: 'category_name_2',
        }, {
            title: '三级类目',
            dataIndex: 'product',
            render: val => (<span >{val.category ? val.category.children.children.category_name : ''}</span>),
            key: 'category_name_3',
        }, {
            title: '销售单价',
            dataIndex: 'prices',
            key: 'price',
            render: val => (<span >{val.length > 1 ? `${val.slice(0)[0].price}-${val.slice(-1)[0].price}` : `${val.slice(0)[0].price}`}</span>),
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            filters: [
                {
                    text: auditStatus[0],
                    value: 0,
                },
                {
                    text: auditStatus[1],
                    value: 1,
                },
                {
                    text: auditStatus[2],
                    value: 2,
                },
            ],
            render: val => (<Badge status={AuditStatusMap[val]} text={auditStatus[val]} />),
        }, {
            title: '上下架状态',
            dataIndex: 'publish_status',
            render(val) {
                return <Badge status={GoodsStatusMap[val]} text={PUBLISH_STATUS[val]} />;
            },
        }, {
            title: '创建时间',
            dataIndex: 'created_time',
            sorter: true,
            render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }, {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a href={`#/goods/list/detail?gno=${record.gno}`}>查看</a>
                    <Divider type="vertical" />
                    <a
                        href={`#/goods/list/modify?gno=${record.gno}`}
                        disabled={record.audit_status === 0}
                        title={record.audit_status === 0 ? '待审核商品不可修改' : ''}
                    >修改
          </a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => onPublish(record.gno, (record.publish_status === 1) ? 0 : 1)}
                        disabled={record.audit_status !== 1}
                    >
                        {(record.publish_status === 1) ? '申请下架' : '申请上架'}
                    </a>
                    <Divider type="vertical" />
                    <a onClick={() => { onPriceSetting(record.gno); }}>价格设置</a>
                </Fragment>
            ),
            width: 260,
            fixed: 'right',
        },
        ];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            total,
            current,
            pageSize
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };

        return (
            <div className={styles.standardTable}>
                <div className={styles.tableAlert}>
                    <Alert
                        message={(
                            <div>
                                查询到
                <a style={{ fontWeight: 600 }}>
                                    {/* {selectedRowKeys.length} */}
                                    {total}
                                </a>
                                条资源
              </div>
                        )}
                        type="info"
                        showIcon
                    />
                </div>
                <Table
                    loading={loading}
                    rowKey="gno"
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    scroll={{ x: 2000 }}
                />
            </div>
        );
    }
}

export default GoodsTable;
