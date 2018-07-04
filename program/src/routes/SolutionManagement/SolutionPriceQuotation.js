import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
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
  message,
  Spin,
  Input,
  InputNumber,
  Select,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import TechSupportTable from './TechSupportTable';
import styles from './SolutionPriceQuotation.less';

// 手动控制添加列表数据吧
const dataSource = [
  { project_name: '安装', key: 'install' },
  { project_name: '工艺编码调试', key: 'technology' },
  { project_name: '培训', key: 'train' },
];
const { TextArea } = Input;
const getValueFromEvent = (e, preValue) => {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  const { value } = target;
  const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
    return value;
  } else {
    return preValue;
  }
};
const DeviceListModal = Form.create({
  mapPropsToFields(props) {
    const { rowSelected } = props;
    if (Object.keys(rowSelected).length === 0) {
      return {}; // 如果为空,返回false
    }
    let formData = {};
    Object.keys(rowSelected).map((item) => {
      formData = {
        ...formData,
        [item]: Form.createFormField({ value: rowSelected[item] }),
      };
      return null;
    });
    return formData;
  },
})((props) => {
  const {
    title, // 核心设备||辅助设备
    visible,
    handleDeviceListAdd,
    handleDeviceListModify,
    handleDeviceListModalVisibal,
    modalType, // add||modify
    sln_type, // welding||sewage
    form,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (modalType === 'add') {
        handleDeviceListAdd(fieldsValue);
      } else if (modalType === 'modify') {
        handleDeviceListModify(fieldsValue);
      }
      form.resetFields();
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={okHandle}
      okText="确定"
      onCancel={() => {
        handleDeviceListModalVisibal(false);
        form.resetFields();
      }}
    >
      <FormItem style={{ display: 'none' }}>
        {form.getFieldDecorator('key')(<Input placeholder="请输入" disabled />)}
      </FormItem>
      {title === '核心设备' ? (
        <Fragment>
          <FormItem
            label="产品类型"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {form.getFieldDecorator('device_type', {
              initialValue: '核心设备',
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="组成部分" {...formItemLayout}>
            {form.getFieldDecorator('device_component', {
              rules: [
                {
                  required: true,
                  message: '该字段为必填项!',
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                {sln_type === 'welding' ? (
                  <OptGroup>
                    <Option value="机器人部分">机器人部分</Option>
                    <Option value="焊机部分">焊机部分</Option>
                  </OptGroup>
                ) : (
                  <OptGroup>
                    <Option value="控制柜">控制柜</Option>
                    <Option value="传感器">传感器</Option>
                  </OptGroup>
                )}
              </Select>
            )}
          </FormItem>
        </Fragment>
      ) : (
        <Fragment>
          <FormItem
            label="产品类型"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {form.getFieldDecorator('device_type', {
              initialValue: '辅助设备',
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="组成部分" {...formItemLayout}>
            {form.getFieldDecorator('device_component', {
              rules: [
                {
                  required: true,
                  message: '该字段为必填项!',
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                {sln_type === 'welding' ? (
                  // 这里用Fragment会报错，尼玛。。没时间提issues，直接用OptGroup display=none代替了
                  <OptGroup> 
                    <Option value="设备">设备</Option>
                    <Option value="耗材">耗材</Option>
                  </OptGroup>
                ) : (
                  <OptGroup>
                    <Option value="现场设备">现场设备</Option>
                  </OptGroup>
                )}
              </Select>
            )}
          </FormItem>
        </Fragment>
      )}
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
              message: '请输入数字!',
            },
          ],
        })(
          <InputNumber placeholder="请输入" style={{ width: '100%' }} min={1} />
        )}
      </FormItem>
      <FormItem label="单价（元）" {...formItemLayout}>
        {form.getFieldDecorator('device_price', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(
          <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} />
        )}
      </FormItem>
      <FormItem label="备注" {...formItemLayout}>
        {form.getFieldDecorator('device_note')(
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
const { Option, OptGroup } = Select;
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
  state = {
    coreDeviceListData: [],
    aidDeviceListData: [],
    deviceListModalVisibal: false,
    modalType: 'add',
    title: '核心设备',
    rowSelected: {},
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetchDetail',
      payload: location.href.split('=').pop(),
      callback: (data) => {
        this.setState({
          coreDeviceListData: data.customer.sln_device
            .filter(item => item.device_type === '核心设备')
            .map((item) => {
              return { ...item, key: item.device_id };
            }),
          aidDeviceListData: data.customer.sln_device
            .filter(item => item.device_type === '辅助设备')
            .map((item) => {
              return { ...item, key: item.device_id };
            }),
        });
      },
    });
  }

  handleDeviceListModalVisibal = (flag) => {
    this.setState({
      deviceListModalVisibal: flag,
    });
  };
  handleDeviceListAdd = (fieldsValue) => {
    const { coreDeviceListData, aidDeviceListData, title } = this.state;
    const { device_name, device_model } = fieldsValue; // 暂时不知道用什么做KEY。
    if (title === '核心设备') {
      this.setState({
        coreDeviceListData: [
          ...coreDeviceListData,
          { ...fieldsValue, key: device_name + device_model },
        ],
        deviceListModalVisibal: false,
      });
    } else if (title === '辅助设备') {
      this.setState({
        aidDeviceListData: [
          ...aidDeviceListData,
          { ...fieldsValue, key: device_name + device_model },
        ],
        deviceListModalVisibal: false,
      });
    }
  };
  handleDeviceListModify = (fieldsValue) => {
    const { coreDeviceListData, aidDeviceListData } = this.state;
    const { key } = fieldsValue; // 暂时不知道用什么做KEY。
    // 将state里面的数据替换
    this.setState({
      coreDeviceListData: coreDeviceListData.map((item) => {
        if (item.key === key) {
          return {
            ...fieldsValue,
          };
        } else {
          return item;
        }
      }),
      aidDeviceListData: aidDeviceListData.map((item) => {
        if (item.key === key) {
          return {
            ...fieldsValue,
          };
        } else {
          return item;
        }
      }),
      deviceListModalVisibal: false,
      rowSelected: {},
    });
  };
  handleRowModify = (row, title) => {
    this.setState({
      title,
      rowSelected: row,
      modalType: 'modify',
      deviceListModalVisibal: true,
    });
  };
  handleRowDelete = (row) => {
    const { coreDeviceListData, aidDeviceListData } = this.state;
    const setState = () => {
      this.setState({
        coreDeviceListData: coreDeviceListData.filter(
          item => item.key !== row.key
        ),
        aidDeviceListData: aidDeviceListData.filter(
          item => item.key !== row.key
        ),
      });
    };
    Modal.confirm({
      title: '确定删除这个设备？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        setState();
      },
    });
  };
  handleFormSubmit = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { coreDeviceListData, aidDeviceListData } = this.state;
      // 安装、工艺、培训 备注和价格   welding_electric焊接电流
      const {
        welding_electric,
        total_price,
        freight_price,
        delivery_date,
        ...others
      } = fieldsValue;
      const sln_support = dataSource
        .map((item) => {
          return {
            name: item.project_name,
            price: fieldsValue[`${item.key}_price`],
            note: fieldsValue[`${item.key}_note`],
          };
        })
        .filter(item => item.price !== undefined)
        .map((item) => {
          return { ...item, price: parseInt(item.price, 10) };
        });
      // TODO 优化
      const welding_tech_param = [
        { name: '焊接电流', value: welding_electric, unit_name: 'A' },
      ];

      const sln_device = coreDeviceListData.concat(aidDeviceListData);
      // string转为int
      const sln_supplier_info = {
        ...others,
        total_price: parseInt(total_price, 10),
        freight_price: parseInt(freight_price, 10),
        delivery_date: parseInt(delivery_date, 10),
      };
      const formData = {
        sln_no: location.href.split('=').pop(),
        sln_supplier_info,
        sln_device,
        sln_support,
      };
      this.props.dispatch({
        type: 'solution/handleFormSubmit',
        payload: !welding_electric
          ? formData
          : { ...formData, welding_tech_param },
        callback: (success, data) => {
          if (success && success === true) {
            message.success(data);
            location.href = location.href.replace(
              'solutionPriceQuotation',
              'solutionDetail'
            );
          } else {
            message.error(data);
          }
        },
      });
    });
  };
  render() {
    const {
      profile,
      form,
      form: { getFieldDecorator },
    } = this.props;
    const { customer } = profile;
    if (!customer) {
      return <Spin />;
    }
    const { sln_basic_info, sln_user_info, sewage_info } = customer;
    const {
      deviceListModalVisibal,
      coreDeviceListData,
      aidDeviceListData,
      modalType,
      title,
      rowSelected,
    } = this.state;
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 18 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案询价单号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format('YYYY-MM-DD HH:mm')}
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
        title: '组成部分',
        dataIndex: 'device_component',
        key: 'device_component',
      },
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
            <a onClick={() => this.handleRowModify(row, '核心设备')}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleRowDelete(row)}>删除</a>
          </div>
        ),
      },
    ];
    const aidDeviceTableColumns = [
      {
        title: '所属类型',
        dataIndex: 'device_component',
        key: 'device_component',
      },
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
        key: 'option',
        render: row => (
          <div>
            <a onClick={() => this.handleRowModify(row, '辅助设备')}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleRowDelete(row)}>删除</a>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={`方案询价单号：${sln_basic_info.sln_no}`}
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
                this.setState({
                  title: '核心设备',
                  modalType: 'add',
                  rowSelected: {},
                });
                this.handleDeviceListModalVisibal(true);
              }}
            />
          }
        >
          <Table
            columns={coreDeviceTableColumns}
            dataSource={coreDeviceListData}
            pagination={false}
            footer={() => (sewage_info ? <span style={{ color: 'red' }}>注（常规指标）：{sewage_info.general_norm}</span> : null)}
          />
        </Card>
        <Card
          style={{ marginTop: 30 }}
          title={
            <CardHeader
              title="辅助设备"
              description="若方案需要时请务必详情填写清楚，以便客户查阅，无需技术支持项时，则无需添加！"
              onButtonClick={() => {
                this.setState({
                  title: '辅助设备',
                  modalType: 'add',
                  rowSelected: {},
                });
                this.handleDeviceListModalVisibal(true);
              }}
            />
          }
        >
          <Table
            columns={aidDeviceTableColumns}
            dataSource={aidDeviceListData}
            pagination={false}
          />
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
          <TechSupportTable form={form} list={dataSource} />
        </Card>
        {sln_basic_info.sln_type === 'welding' ? (
          <Card
            style={{ marginTop: 30 }}
            title={<CardHeader title="技术参数" description="" hideButton />}
            className={styles.techForm}
          >
            <FormItem {...formItemLayout} label="焊接电流">
              {getFieldDecorator('welding_electric', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
                getValueFromEvent: e =>
                  getValueFromEvent(e, form.getFieldValue('welding_electric')),
              })(<Input placeholder="请输入" />)}{' '}
              <span> (A)</span>
            </FormItem>
          </Card>
        ) : null}

        <Card
          style={{ marginTop: 30 }}
          title={<CardHeader title="报价信息" description="" hideButton />}
          className={styles.priceForm}
        >
          <Form layout="horizontal">
            <FormItem {...formItemLayout} label="付款比例">
              <span>首款：</span>
              {getFieldDecorator('pay_ratio', {
                rules: [
                  {
                    required: true,
                    message: '请选择！',
                  },
                ],
                initialValue: 30,
              })(
                <Select style={{ width: 100 }} placeholder="首款">
                  <Option value={30}>30%</Option>
                  <Option value={35}>35%</Option>
                  <Option value={40}>40%</Option>
                  <Option value={45}>45%</Option>
                  <Option value={50}>50%</Option>
                </Select>
              )}
              <span style={{ marginLeft: 8 }}>尾款：</span>
              <Select
                style={{ width: 100 }}
                placeholder="尾款"
                value={100 - form.getFieldValue('pay_ratio')}
                onChange={value =>
                  form.setFieldsValue({ pay_ratio: 100 - value })
                }
              >
                <Option value={70}>70%</Option>
                <Option value={65}>65%</Option>
                <Option value={60}>60%</Option>
                <Option value={55}>55%</Option>
                <Option value={50}>50%</Option>
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="运费">
              {getFieldDecorator('freight_price', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入"
                  style={{ width: '66%' }}
                  min={0}
                />
              )}
              <span> 元</span>
            </FormItem>
            <FormItem {...formItemLayout} label="方案总价">
              {getFieldDecorator('total_price', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入"
                  style={{ width: '66%' }}
                  min={0}
                />
              )}
              <span> 元（含运费）</span>
            </FormItem>
            <FormItem {...formItemLayout} label="方案发货期">
              {getFieldDecorator('delivery_date', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(
                <InputNumber
                  placeholder="请输入"
                  style={{ width: '66%' }}
                  min={0}
                />
              )}
              <span> 天</span>
            </FormItem>
            <FormItem {...formItemLayout} label="方案介绍">
              {getFieldDecorator('sln_desc', {
                rules: [
                  {
                    required: true,
                    message: '该字段为必填项！',
                  },
                ],
              })(
                <TextArea
                  placeholder="请输入"
                  autosize={{ minRows: 4, maxRows: 6 }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('sln_note')(<Input placeholder="请输入" />)}
            </FormItem>
          </Form>
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              size="large"
              onClick={() => {
                this.props.dispatch(routerRedux.goBack());
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              size="large"
              onClick={this.handleFormSubmit}
            >
              提交
            </Button>
          </div>
        </Card>
        <DeviceListModal
          visible={deviceListModalVisibal}
          handleDeviceListModalVisibal={this.handleDeviceListModalVisibal}
          handleDeviceListAdd={this.handleDeviceListAdd}
          handleDeviceListModify={this.handleDeviceListModify}
          modalType={modalType}
          title={title}
          rowSelected={rowSelected}
          sln_type={sln_basic_info.sln_type}
        />
      </PageHeaderLayout>
    );
  }
}

export default SolutionPriceQuotation;
