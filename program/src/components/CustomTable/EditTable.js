import React, { Component } from 'react';
import { Table, Input, Popconfirm, Radio } from 'antd';

const RadioGroup = Radio.Group;

const data = [];
for (let i = 0; i < 4; i++) {
  data.push({
    key: i.toString(),
    min_quantity: 10,
    max_quantity: 200,
    price: '550.00',
    lead_time: '1天',
    shipping_fee_type: 0,
    editable: true,
  });
}
const mapFreightTypes = ['包邮', '到付'];

const EditableCell = ({ editable, value, onChange }) => (
  <span style={{ display: 'inline-block' }}>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
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
    this.columns = [{
      title: '采购数量',
      dataIndex: 'name',
      width: 60,
      render: (text, record) => (
        <div style={{ display: 'flex' }}>
          {this.renderColumns(record.min_quantity, record, 'min_quantity')}
          <span style={{ display: 'inlie-block', width: 50, textAlign: 'center' }}>至</span>
          {this.renderColumns(record.max_quantity, record, 'max_quantity')}
        </div>),
    }, {
      title: '销售单价(含税)',
      dataIndex: 'price',
      width: 95,
      render: (text, record) => this.renderColumns(text, record, 'price'),
    }, {
      title: '发货期(天)',
      dataIndex: 'lead_time',
      width: 50,
      render: (text, record) => this.renderColumns(text, record, 'lead_time'),
    }, {
      title: '运费',
      dataIndex: 'shipping_fee_type',
      width: 120,
      render: (text, record) => this.renderRadioColumns(text, record, 'shipping_fee_type'),
    }, {
      title: 'operation',
      dataIndex: 'operation',
      width: 90,
      render: (text, record) => {
        const { editable } = record;
        return (
          <div className="editable-row-operations">
            {
              editable ?
                (
                  <span>
                    <a onClick={() => this.save(record.key)}>Save</a>
                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
                )
                : <a onClick={() => this.edit(record.key)}>Edit</a>
            }
          </div>
        );
      },
    }];
    this.state = { data };
    this.cacheData = data.map(item => ({ ...item }));
  }

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }

  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }

  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }

  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  renderRadioColumns(text, record, column) {
    return (
      <RadioGroupCell
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}        
      />
    );
  }


  render() {
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

