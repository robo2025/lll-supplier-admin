import React, { Component } from 'react';
import { Table, Input, Radio, Divider, message } from 'antd';
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
      width: 56,
      render: (text, record) => this.renderColumns(text, record, 'lead_time'),
    }, {
      title: '运费',
      dataIndex: 'shipping_fee_type',
      width: 120,
      render: (text, record) => this.renderRadioColumns(text, record, 'shipping_fee_type'),
    }, {
      title: '操作',
      dataIndex: '操作',
      width: 65,
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
      // render: (text, record) => {
      //   const { editable } = record;
      //   return (
      //     <div className="editable-row-operations">
      //       {
      //         editable ?
      //           (
      //             <span>
      //               <a onClick={() => this.save(record.key)}>Save</a>
      //               <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
      //                 <a>Cancel</a>
      //               </Popconfirm>
      //             </span>
      //           )
      //           : <a onClick={() => this.edit(record.key)}>Edit</a>
      //       }
      //     </div>
      //   );
      // },
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

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
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

