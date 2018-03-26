import React, { Fragment } from 'react';
import { Table } from 'antd';

const mapHasGoods = ['否', '已关联'];

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        fixed: 'left',
      },
      {
        title: '产品ID编号',
        dataIndex: 'pno',
        key: 'pno',
        width: 120,
        fixed: 'left',
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        render: val => val.map((item, idx) =>
          (<img alt="缩略图" width={10} height={10} style={{ display: 'inline' }} key={`key${idx}`} src={item.img_url} />)
        ),
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
        width: 300,
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
        key: 'menu1',
        width: 100,
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        render: val => (val.children.category_name),
        key: 'menu2',
        width: 100,
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        render: val => (val.children.children.category_name),
        key: 'menu3',
        width: 100,

      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        width: 100,
      },
      {
        title: '是否已关联',
        dataIndex: 'is_has_goods',
        render: text => (<span>{mapHasGoods[text >> 0]}</span>),
        width: 120,
        fixed: 'right',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Fragment disabled={!record.is_has_goods}>
            <a
              onClick={() => { this.props.onAssociate(record.id); }}
              disabled={record.is_has_goods}
            >关联
            </a>
          </Fragment>
        ),
        fixed: 'right',
      },
    ];
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data, total, loading } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 6,
      total,
    };

    console.log('产品列表props', this.props);
    return (
      <div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={data}
          total={total}
          onChange={this.handleTableChange}
          pagination={paginationProps}
          rowKey={record => record.id}
          scroll={{ x: 1300 }}
        />
      </div>
    );
  }
}

export default ProductList;
