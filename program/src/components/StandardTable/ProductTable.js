import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Modal } from 'antd';
import SupplyInformation from '../../components/SupplyInformation/SupplyInformation';
import styles from './product-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 上下架状态
const GoodsStatusMap = ['default', 'success'];// 商品状态


class ProductTable extends React.Component {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    isShowModal: false,
    productId: '',
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


  // 关闭供货信息弹窗
  onCancel = () => {
    this.setState({ isShowModal: false });
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

  // 点击供货信息
  handleSupplyInfoBtnClick = (productId) => {
    this.setState({ isShowModal: true, productId });
    this.props.querySupplyInfo(productId);
  }

  render() {
    const { selectedRowKeys, totalCallNo, isShowModal } = this.state;
    const { data, loading } = this.props;

    const audit_status = ['待审核', '审核通过', '审核不通过'];
    const status = ['下架中', '已上架'];

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        fixed: 'left',
      },
      {
        title: 'ID编号',
        dataIndex: 'pno',
        key: 'pno',
        width: 110,
        fixed: 'left',
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        render: val => val.map((item, idx) => {
          if (idx < 3) {
            return (
              <img
                className="product-thumb"
                alt={item.img_tyle}
                key={idx}
                src={item.img_url}
              />);
          }
        }),
        width: 150,
        fixed: 'left',
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        fixed: 'left',
      },
      {
        title: '型号',
        dataIndex: 'partnumber',
        align: 'partnumber',
        render: val => `${val}`,
      },
      {
        title: '一级类目',
        dataIndex: 'category',
        render: val => (val.category_name),
        key: 'menu-1',
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        render: val => (val.children.category_name),
        key: 'menu-2',
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        render: val => (val.children.children.category_name),
        key: 'menu-3',
      },
      {
        title: '四级类目',
        dataIndex: 'category',
        render: val => (val.children.children.children.category_name),
        key: 'menu-4',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',

      },
      {
        title: '已有供应商条数',
        dataIndex: 'goods_count',

      },
      {
        title: '创建人',
        dataIndex: 'staff_name',

      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        sorter: true,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.props.editProduct(record.id); }}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => { this.handleSupplyInfoBtnClick(record.id); }}>供货信息</a>
          </Fragment>
        ),
        width: 135,
        fixed: 'right',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
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
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
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
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1800 }}
        />
        {/* 供货信息 */}
        <Modal
          width="60%"
          visible={isShowModal}
          title="供货信息"
          okText=""
          cancelText=""
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <SupplyInformation productId={this.state.productId} />
        </Modal>
      </div>
    );
  }
}

export default ProductTable;
