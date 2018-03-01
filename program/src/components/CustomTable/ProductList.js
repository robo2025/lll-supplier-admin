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
      },
      {
        title: '产品ID编号',
        dataIndex: 'pno',
        key: 'pno',
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        render: val => val.map((item, idx) => (<img alt="缩略图" width={10} height={10} style={{ display: 'inline' }} key={`key${idx}`} src={item.img_url} />)),
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
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
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        render: val => (val.children.category_name),
        key: 'menu2',
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        render: val => (val.children.children.category_name),
        key: 'menu3',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
      },
      {
        title: '是否已关联',
        dataIndex: 'is_has_goods',
        render: text => (<span>{mapHasGoods[text >> 0]}</span>),
      },
      {
        title: '操作',
        dataIndex: 'is_has_goods',
        render: (text, record) => (
          text ?
            (
              null
            ) : (
              <Fragment>
                <a onClick={() => { this.props.onAssociate(record.id); }}>关联</a>
              </Fragment>
            )
        ),
      },
    ];
  }
  render() {
    const dataSource = this.props.data;
    console.log('产品列表props', this.props);
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey={record => (`${record.pno}-${record.id}`)}
        />
      </div>
    );
  }
}

export default ProductList;
