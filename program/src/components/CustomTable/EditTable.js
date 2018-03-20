import React, { Component } from 'react';
import { Table, InputNumber, Radio, Divider, message } from 'antd';
import { addKeyValToArr } from '../../utils/tools';

const RadioGroup = Radio.Group;

const data = [{
  id: '0',
  min_quantity: '',
  max_quantity: '',
  price: '',
  lead_time: '',
  shipping_fee_type: 0,
  editable: true,
}];

const EditableCell = ({ editable, value, onChange, minVal }) => (
  <span style={{ display: 'inline-block' }}>
    {editable
      ?
      (
        <InputNumber
          style={{ margin: '-5px 0' }}
          value={value}
          onChange={valueText => onChange(valueText)}
          min={minVal}
        />
      )
      : value
    }
  </span>
);

const RadioGroupCell = ({ value, onChange }) => (
  <RadioGroup onChange={onChange} value={value}>
    <Radio value={0}>包邮</Radio>
    <Radio value={1}>到付</Radio>
  </RadioGroup>
);

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [{
      title: '采购数量',
      dataIndex: 'name',
      render: (text, record, idx) => (
        <div style={{ display: 'flex' }}>
          {this.renderColumns(record.min_quantity, record, 'min_quantity', idx === 0 ? 1 : this.state.data[idx - 1].max_quantity + 1)}
          <span style={{ display: 'inlie-block', width: 50, textAlign: 'center' }}>至</span>
          {this.renderColumns(record.max_quantity, record, 'max_quantity', record.min_quantity)}
        </div>),
    }, {
      title: '销售单价(含税)',
      dataIndex: 'price',
      render: (text, record) => this.renderColumns(text, record, 'price', 1),
    }, {
      title: '发货期(天)',
      dataIndex: 'lead_time',
      render: (text, record) => this.renderColumns(text, record, 'lead_time', 1),
    }, {
      title: '运费',
      dataIndex: 'shipping_fee_type',
      render: (text, record) => this.renderRadioColumns(text, record, 'shipping_fee_type', 1),
    }, {
      title: '操作',
      dataIndex: '操作',
      width: 120,
      render: (text, record, idx) => {
        // console.log(this.state);
        return (idx + 1 === this.state.data.length ?
          (
            <span>
              <a onClick={this.removeLastRow}>删除</a>
              <Divider type="vertical" />
              <a onClick={this.addLastRow}>增加</a>
            </span>
          )
          : null);
      },
    }];
    const propsData = this.props.data;
    console.log('价格设置构造函数', propsData);
    this.state = {
      data: propsData ? addKeyValToArr(propsData, { shipping_fee_type: 0, editable: true }) : data,
    };
    this.cacheData = data.map(item => ({ ...item }));
  }

  componentWillReceiveProps(nextProps) {
    const nextPropsData = nextProps.data;
    if (Array.isArray(nextPropsData)) {
      this.setState({
        data: addKeyValToArr(nextPropsData, { shipping_fee_type: 0, editable: true }),
      });
    }
  }

  handleChange(value, key, column) {
    // console.log('handleChange', this.props, value, key, column);
    const { onChange } = this.props;
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
      // 把改变数据传给母组件
      onChange({ prices: newData });
    }
  }

  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }

  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }

  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  // 删除最后一条区间
  removeLastRow = () => {
    const newData = [...this.state.data];
    newData.pop();
    this.setState({ data: newData });
  }

  // 增加一条区间
  addLastRow = () => {
    const newData = [...this.state.data];
    if (newData.length < 4) {
      newData.push({
        id: (newData.length - 100).toString(),
        min_quantity: '',
        max_quantity: '',
        price: '',
        lead_time: '',
        shipping_fee_type: 0,
        editable: true,
      });
      this.setState({ data: newData });
    } else {
      message.info('最多只能增加四个区间');
    }
  }

  renderColumns(text, record, column, minVal) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        minVal={minVal}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  renderRadioColumns(text, record, column) {
    return (
      <RadioGroupCell
        value={text}
        onChange={e => this.handleChange(e.target.value, record.id, column)}
      />
    );
  }


  render() {
    console.log('可修改table', this.props.data);
    return (
      <Table
        bordered
        pagination={false}
        dataSource={this.state.data}
        columns={this.columns}
      />
    );
  }
}

