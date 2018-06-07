import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Modal,
  Table,
  Divider,
  Button,
  Form,
  Spin,
  Input,
  Select,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import TechSupportTable from './TechSupportTable';
import styles from './SolutionPriceQuotation.less';

const { TextArea } = Input;
const CoreDeviceListModal = Form.create()((props) => {
  const {
    visible,
    handleCoreDeviceListConfirm,
    handleCoreDeviceListModalVisibal,
    form,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleCoreDeviceListConfirm(fieldsValue);
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };
  return (
    <Modal
      title="添加核心设备"
      visible={visible}
      onOk={okHandle}
      okText="确定"
      onCancel={() => {
        handleCoreDeviceListModalVisibal(false);
        form.resetFields();
      }}
    >
      <FormItem
        label="产品类型"
        {...formItemLayout}
        style={{ display: 'none' }}
      >
        {form.getFieldDecorator('device_type', {
          initialValue: '核心设备',
        })(<Input placeholder="请输入" disabled />)}
      </FormItem>
      <FormItem label="所属组成部分" {...formItemLayout}>
        {form.getFieldDecorator('device_name', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(
          <Select>
            <Option>机器人部分</Option>
            <Option>焊机部分</Option>
          </Select>
        )}
      </FormItem>
      <FormItem label="产品名称" {...formItemLayout}>
        {form.getFieldDecorator('device_name', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="型号" {...formItemLayout}>
        {form.getFieldDecorator('device_model', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="品牌" {...formItemLayout}>
        {form.getFieldDecorator('brand_name', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="数量" {...formItemLayout}>
        {form.getFieldDecorator('device_num', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="单价" {...formItemLayout}>
        {form.getFieldDecorator('device_price', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="备注" {...formItemLayout}>
        {form.getFieldDecorator('device_note', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(
          <TextArea
            placeholder="请输入"
            autosize={{ minRows: 4, maxRows: 6 }}
          />
        )}
      </FormItem>
    </Modal>
  );
});
const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const extra = (
  <Row>
    <Col xs={24} sm={15}>
      <div>状态</div>
      <div style={{ fontSize: 20, color: 'red' }}>未报价</div>
    </Col>
  </Row>
);
const CardHeader = ({ onButtonClick, description, title, hideButton }) => {
  return (
    <Fragment>
      <span style={{ fontSize: 16 }}>{title}</span>
      {!hideButton ? (
        <Button
          type="dashed"
          icon="plus"
          style={{ color: '#0096FA', borderColor: '#0096FA', marginLeft: 18 }}
          onClick={onButtonClick}
        >
          添加
        </Button>
      ) : null}
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          color: '#C9C9C9',
          marginLeft: 18,
        }}
      >
        {description}
      </span>
    </Fragment>
  );
};

@connect(({ solution, loading }) => ({
  profile: solution.profile,
  loading: loading.models.solution,
}))
@Form.create()
class SolutionPriceQuotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // coreDeviceListData: [],
      coreDeviceListModalVisibal: false,
      // aidDeviceListModalVisibal: false,
    };
  }
  handleCoreDeviceListModalVisibal = (flag) => {
    this.setState({
      coreDeviceListModalVisibal: flag,
    });
  };
  render() {
    const {
      profile,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { customer } = profile;
    if (!customer) {
      return <Spin />;
    }
    const {
      sln_basic_info,
      sln_user_info,
      welding_device,
      welding_info,
      welding_file,
    } = customer;
    const { coreDeviceListModalVisibal } = this.state;
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 18 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案编号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format('YYYY-MM-DD HH:MM')}
        </Description>
        <Description term="客户备注">
          {sln_user_info.welding_note === ''
            ? '无'
            : sln_user_info.welding_note}
        </Description>
      </DescriptionList>
    );
    const coreDeviceTableColumns = [
      {
        title: '商品名称',
        dataIndex: 'device_name',
        key: 'device_name',
      },
      {
        title: '型号',
        dataIndex: 'device_model',
        key: 'device_model',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '数量',
        dataIndex: 'device_num',
        key: 'device_num',
      },
      {
        title: '单价（元）',
        dataIndex: 'device_price',
        key: 'device_price',
      },
      {
        title: '小计（元）',
        key: 'total_price',
        render: row => <span>{row.device_num * row.device_price}</span>,
      },
      {
        title: '备注',
        key: 'device_note',
        dataIndex: 'device_note',
        render: text => (text === '' ? '无' : text),
      },
      {
        title: '操作',
        key: 'opreation',
        render: row => (
          <div>
            <a onClick={() => this.addCart(row)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(row)}>删除</a>
          </div>
        ),
      },
    ];
    const adiDeviceTableColumns = [
      {
        title: '所属类型',
        dataIndex: 'son_order_sn',
        key: 'son_order_sn',
      },
      {
        title: '商品名称',
        dataIndex: 'goods_name',
        key: 'goods_name',
      },
      {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      },
      {
        title: '单位',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '数量',
        dataIndex: 'max_delivery_time',
        key: 'max_delivery_time',
        render: text => <span>{text}天</span>,
      },
      {
        title: '单价（元）',
        dataIndex: 'univalent',
        key: 'univalent',
      },
      {
        title: '小计（元）',
        dataIndex: 'price_discount',
        key: 'price_discount',
        rener: () => <span>无</span>,
      },
      {
        title: '备注',
        key: 'sold_price',
        render: text => <span>{text.univalent - 0}</span>,
      },
      {
        title: '操作',
        key: 'option',
        render: row => (
          <div>
            <a onClick={() => this.addCart(row)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(row)}>删除</a>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title="方案询价单号：FAXJ201805121021001"
        // title={`单号：${subOrder.son_order_sn}`}
        logo={
          <img
            alt="logo"
            src="https://imgcdn.robo2025.com/login/robotImg.jpg"
          />
        }
        content={headContent}
        extraContent={extra}
      >
        <Card
          title={
            <CardHeader
              title="核心设备清单"
              description="若当前核心设备需添加或删除设备时，可自行操作，但该项不能为空！"
              onButtonClick={() => {
                this.handleCoreDeviceListModalVisibal(true);
              }}
            />
          }
        >
          <Table
            columns={coreDeviceTableColumns}
            dataSource={welding_device}
            pagination={false}
          />
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={
            <CardHeader
              title="辅助设备"
              description="若方案需要时请务必详情填写清楚，以便客户查阅，无需技术支持项时，则无需添加！"
              onButtonClick={() => {
                this.handleCoreDeviceListModalVisibal(true);
              }}
            />
          }
        >
          <Table columns={adiDeviceTableColumns} />
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={
            <CardHeader
              title="技术支持"
              description="若方案需要时请务必详情填写清楚，以便客户查阅，无需技术支持项时，则无需添加！"
              hideButton
            />
          }
        >
          <TechSupportTable />
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={<CardHeader title="技术参数" description="" hideButton />}
        >
          <FormItem {...formItemLayout} label="焊接电流">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '该字段为必填项！',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={<CardHeader title="报价信息" description="" hideButton />}
          className={styles.priceForm}
        >
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="付款比例">
              <span style={{ marginLeft: 20 }}>首款：</span>
              {getFieldDecorator('residence', {
                rules: [
                  {
                    required: true,
                    message: '请选择首款！',
                  },
                ],
              })(
                // TOTO: 添加自动赋值
                <Select style={{ width: 120 }} onChange={this.onSelectChange}>
                  <Option value="30">30%</Option>
                  <Option value="35">35%</Option>
                  <Option value="40">40%</Option>
                  <Option value="45">45%</Option>
                  <Option value="50">50%</Option>
                </Select>
              )}
              <span style={{ marginLeft: 20 }}>尾款：</span>
              <Select style={{ width: 120 }}>
                <Option value="70">70%</Option>
                <Option value="65">65%</Option>
                <Option value="60">60%</Option>
                <Option value="55">55%</Option>
                <Option value="50">50%</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="运费">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(<Input placeholder="请输入" />)}
              <span> 元</span>
            </FormItem>
            <FormItem {...formItemLayout} label="方案总价（含运费）">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(<Input placeholder="请输入" />)}
              <span> 元</span>
            </FormItem>
            <FormItem {...formItemLayout} label="报价有效期">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="方案发货期">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(<Input placeholder="请输入" />)}
              <span> 天</span>
            </FormItem>
            <FormItem {...formItemLayout} label="方案介绍">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('eeee')(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button size="large">取消</Button>
            <Button type="primary" style={{ marginLeft: 8 }} size="large">
              提交
            </Button>
          </div>
        </Card>
        <CoreDeviceListModal
          visible={coreDeviceListModalVisibal}
          handleCoreDeviceListModalVisibal={
            this.handleCoreDeviceListModalVisibal
          }
        />
      </PageHeaderLayout>
    );
  }
}

export default SolutionPriceQuotation;
