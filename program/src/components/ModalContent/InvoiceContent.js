import React, { Component } from 'react';
import { Table, Form, Select, Input, Row, Col } from 'antd';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;

const goodColumns = [{
  title: '商品名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '单价',
  dataIndex: 'price',
  key: 'price',
}, {
  title: '发货日',
  dataIndex: 'delivery',
  key: 'delivery',
}];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
};
const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

@Form.create({
  onValuesChange: (props, fields) => {
    props.onChange(fields);
  },
})
class InvoiceContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: false,
    };
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  handleDeliveryTypeChange = (value) => {
    console.log(value);
    if (value === '其它物流') {
      this.setState({ isShowDetail: true });
    } else {
      this.setState({ isShowDetail: false });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isShowDetail } = this.state;

    return (
      <div className="invoice-content">
        <div>
          <p>收货单位：湖南化工贸易有限公司</p>
          <p>收货方式：配送</p>
        </div>

        <div className="">
          <p>收货人：张三</p>
          <p>联系电话：18888888888</p>
          <p>地址：湖南长沙岳麓区桃子湖路口</p>
        </div>

        <Table
          bordered
          title={() => (<span>发货商品明细</span>)}
          columns={goodColumns}
          dataSource={[]}
          size="small"
        />
        <h2>填写物流信息</h2>
        <Form>
          <FormItem
            label="物流公司名称"
            onChange={this.handleChange}
            {...formItemLayout}
          >
            {
              getFieldDecorator('logistics_company', {
                rules: [{
                  required: true,
                  message: '请选择物流公司',
                }],
              })(
                <Select onSelect={this.handleDeliveryTypeChange}>
                  <Option value="顺丰速运">顺丰速运</Option>
                  <Option value="圆通物流">圆通物流</Option>
                  <Option value="申通物流">申通物流</Option>
                  <Option value="中通物流">中通物流</Option>
                  <Option value="韵达物流">韵达物流</Option>
                  <Option value="其它物流">其他物流</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            label="物流单号"
            onChange={this.handleChange}
            {...formItemLayout}
            style={{ display: isShowDetail ? 'none' : 'block' }}
          >
            {
              getFieldDecorator('logistics_number', {
                rules: [{
                  required: true,
                  message: '请选择物流公司',
                }],
              })(
                <Input />
              )
            }
          </FormItem>
        </Form>
        <Form style={{ display: isShowDetail ? 'block' : 'none' }}>
          <Row>
            <Col span={12}>
              <FormItem
                label="物流公司名称"
                onChange={this.handleChange}
                {...formItemLayout2}
              >
                {
                  getFieldDecorator('logistics_company', {
                    rules: [{
                      required: true,
                      message: '请填写物流公司名称',
                    }],
                  })(
                    <Input />
                  )
                }
              </FormItem>

            </Col>
            <Col span={12} >
              <FormItem
                label="送货人"
                onChange={this.handleChange}
                {...formItemLayout2}
              >
                {
                  getFieldDecorator('sender', {
                    rules: [{
                      required: true,
                      message: '送货人',
                    }],
                  })(
                    <Input />
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="物流单号"
                onChange={this.handleChange}
                {...formItemLayout2}
              >
                {
                  getFieldDecorator('logistics_number', {
                    rules: [{
                      required: true,
                      message: '物流单号',
                    }],
                  })(
                    <Input />
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="联系号码"
                onChange={this.handleChange}
                {...formItemLayout2}
              >
                {
                  getFieldDecorator('mobile', {
                    rules: [{
                      required: true,
                      message: '物流单号',
                    }],
                  })(
                    <Input />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default InvoiceContent;
