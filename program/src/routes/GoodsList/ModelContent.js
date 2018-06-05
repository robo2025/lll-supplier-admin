import React, { Component } from 'react';
import { Table, Form, Row, Col, Input, Button, Icon } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;

@Form.create()
export default class ModelContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [],
    };
  }

  componentDidMount() {
    const { bindModelThis } = this.props;
    if (bindModelThis) {
      bindModelThis(this);
    }
  }

  // 添加产品到模板
  addProductToModel = (record) => {
    const { modelList } = this.state;
    this.setState({ modelList: [...modelList, record] });
  }

  // 从模板删除产品
  deleteProductFromModel = (record) => {
    const { modelList } = this.state;
    this.setState({ modelList: modelList.filter(val => val.mno !== record.mno) });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { form, onSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const createTime = {};
      if (fieldsValue.create_time) {
        createTime.created_start = fieldsValue.create_time[0].format('YYYY-MM-DD');
        createTime.created_end = fieldsValue.create_time[1].format('YYYY-MM-DD');
      }
      const values = {
        ...fieldsValue,
        ...createTime,
      };

      this.setState({
        formValues: values,
      });

      onSearch({ params: values });
    });
  }


  // 搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem >
              {getFieldDecorator('mno')(
                <Input placeholder="产品型号ID" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem >
              {getFieldDecorator('product_name')(
                <Input placeholder="产品名称" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem >
              {getFieldDecorator('catalog')(
                <Input placeholder="产品类目（暂时无法提供筛选）" />
              )}
            </FormItem>
          </Col>
          <div style={{ overflow: 'hidden' }}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit"><Icon type="search" />搜索</Button>
            </span>
          </div>
        </Row>
      </Form>
    );
  }

  render() {
    const { modelList } = this.state;
    const { dataSource, onModelTableChange, total, loading } = this.props;
    // --------------- 给数据添加选中属性，防止重复选择 -------------------------
    const resDataSource = dataSource.map((val) => {
      const res = modelList.find(val2 => val2.mno === val.mno);
      if (res) {
        return { ...val, selected: true };
      } else {
        return { ...val, selected: false };
      }
    });
    // ----------------------------------------

    const columns = [{
      title: '产品型号ID',
      dataIndex: 'mno',
      key: 'mno',
    }, {
      title: '型号',
      dataIndex: 'partnumber',
      key: 'partnumber',
    }, {
      title: '所属类目',
      dataIndex: 'product',
      key: 'category_name',
      render: val => (
        <span>
          {val && `${val.category.category_name}-${val.category.children.category_name}-${val.category.children.children.category_name}`}
        </span>
      ),
    }, {
      title: '品牌',
      dataIndex: 'product',
      key: 'brand_name',
      render: val => (<span>{val && val.brand.brand_name}</span>),
    }, {
      title: '产地',
      dataIndex: 'product',
      key: 'registration_place',
      render: val => (<span>{val && val.brand.registration_place}</span>),
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <a onClick={() => { this.addProductToModel(record); }} disabled={record.selected}>选择</a>
      ),
    }];
    const columns2 = [{
      title: '产品型号ID',
      dataIndex: 'mno',
      key: 'mno',
    }, {
      title: '型号',
      dataIndex: 'partnumber',
      key: 'partnumber',
    }, {
      title: '所属类目',
      dataIndex: 'product',
      key: 'category_name',
      render: val => (
        <span>
          {val && `${val.category.category_name}-${val.category.children.category_name}-${val.category.children.children.category_name}`}
        </span>
      ),
    }, {
      title: '品牌',
      dataIndex: 'product',
      key: 'brand_name',
      render: val => (<span>{val.brand && val.brand.brand_name}</span>),
    }, {
      title: '产地',
      dataIndex: 'product',
      key: 'registration_place',
      render: val => (<span>{val && val.brand.registration_place}</span>),
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <a onClick={() => { this.deleteProductFromModel(record); }}>取消</a>
      ),
    }];

    return (
      <div>
        <h3>可选产品列表</h3>
        <div className={styles.tableListForm}>
          {this.renderSimpleForm()}
        </div>
        <Table
          bordered
          loading={loading}
          dataSource={resDataSource}
          columns={columns}
          rowKey="mno"
          onChange={onModelTableChange}
          pagination={{
            defaultPageSize: 6,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['6', '12', '18', '24'],
          }}
        />
        <h3>已选产品列表</h3>
        <Table
          bordered
          dataSource={modelList}
          columns={columns2}
          rowKey="mno"
          pagination={{
            defaultPageSize: 6,
            pageSize: 6,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['6', '12', '18', '24'],
          }}
        />
      </div>
    );
  }
}
