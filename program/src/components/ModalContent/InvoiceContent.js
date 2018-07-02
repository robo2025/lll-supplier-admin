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

  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  handleChange = (value) => {
    // console.log(`selected ${value}`);
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
    const { data } = this.props;
    console.log('props---', data);
    return (
      <div className="invoice-content">
        <div>
          <p>收货单位：{data.guest_company_name}</p>
          <p>收货方式：配送</p>
        </div>

        <div className="">
          <p>收货人：{data.receiver}</p>
          <p>联系电话：{data.mobile}</p>
          <p>地址：{data.address}</p>
        </div>

        {/* <Table
          bordered
          title={() => (<span>发货商品明细</span>)}
          columns={goodColumns}
          dataSource={[]}
          size="small"
        /> */}
        <h3>填写物流信息</h3>
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
        {
          isShowDetail ?
            (
              <Form>
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
                            message: '请填写手机号码',
                          }, {
                            len: 11,
                            message: '请输入11位手机号码',
                          }, {
                            pattern: /^[0-9]+$/,
                            message: '手机号只能为数字',
                          }],
                        })(
                          <Input type="tel" />
                        )
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            )
            :
            null
        }

      </div>
    );
  }
}

export default InvoiceContent;
