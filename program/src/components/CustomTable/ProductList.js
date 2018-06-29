import React, { Fragment } from 'react';
import { Table } from 'antd';

const mapHasGoods = ['否', '已关联'];

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'idx',
        key: 'idx',
        width: 60,
        fixed: 'left',
        render: (text, record, idx) => (<span>{idx + 1}</span>),
      },
      {
        title: '产品型号ID',
        dataIndex: 'mno',
        key: 'mno',
        width: 150,
        fixed: 'left',
      },
      {
        title: '产品图片',
        dataIndex: 'product',
        key: 'pics',
        render: val => val.pics.map((item, idx) =>
          (<img alt="缩略图" width={10} height={10} style={{ display: 'inline' }} key={`key${idx}`} src={item.img_url} />)
        ),
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'product',
        key: 'product_name',
        width: 300,
        render: val => (<span>{val.product_name}</span>),
      },
      {
        title: '型号',
        dataIndex: 'partnumber',
        align: 'partnumber',
        render: val => `${val}`,
      },
      {
        title: '一级类目',
        dataIndex: 'product',
        key: 'menu1',
        render: val => (val.category.category_name),
        width: 100,
      },
      {
        title: '二级类目',
        dataIndex: 'product',
        render: val => (val.category.children.category_name),
        key: 'menu2',
        width: 100,
      },
      {
        title: '三级类目',
        dataIndex: 'product',
        key: 'menu3',
        width: 100,
        render: val => (val.category.children.children.category_name),

      },
      {
        title: '品牌',
        dataIndex: 'product',
        key: 'brand_name',
        width: 100,
        render: val => (<span>{val.brand.brand_name}</span>),
      },
      {
        title: '是否已关联',
        dataIndex: 'has_goods',
        width: 120,
        fixed: 'right',
        render: text => (<span>{mapHasGoods[text >> 0]}</span>),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Fragment>
            <a
              onClick={() => { this.props.onAssociate(record.mno); }}
              disabled={record.has_goods}
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
    const { data, total, loading} = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 6,
      total,
    //   current
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
