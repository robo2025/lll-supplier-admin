import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

@Form.create({
  onValuesChange: (props, fields) => {
    if (fields.expect_date_of_delivery) {
      // console.log(fields.expect_date_of_delivery.format('YYYY-MM-DD'));
      const ExpectTime = fields.expect_date_of_delivery.format('YYYY-MM-DD');
      props.onChange({ expect_date_of_delivery: ExpectTime });             
    } else {
    props.onChange(fields);      
    }
  },
})
class ExceptionContent extends Component {
  state = {
    isHaveGoods: false,
  }
  handleSelected = (value) => {
    console.log(`selected ${value}`);
    if (value >> 0 === 1) {
      this.setState({ isHaveGoods: true });
    } else {
      this.setState({ isHaveGoods: false });
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { isHaveGoods } = this.state;
    const { data } = this.props;

    return (
      <div className="exception-content">
        <Form>
          <FormItem
            label="原发货时间"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 4 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 8 },
            }}
          >
            <span>{moment(data * 1000).format('YYYY-MM-DD')}</span>
          </FormItem>
          <FormItem
            label="异常情况"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 4 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 8 },
            }}
          >
            {
              getFieldDecorator('abnormal_type', {
                rules: [{
                  required: true,
                  message: '请选择异常情况',
                }],
              })(
                <Select onChange={this.handleSelected}>
                  <Option value="1">无货</Option>
                  <Option value="2">延期</Option>
                </Select>
              )
            }
          </FormItem>
          <FormItem
            label="预计发货时间"
            {...formItemLayout}
            style={{ display: isHaveGoods ? 'none' : 'block' }}
          >
            {
              getFieldDecorator('expect_date_of_delivery', {
                rules: [{
                  required: true,
                  message: '请选择预计发货时间',
                }],
              })(
                <DatePicker 
                  allowClear={false}
                  disabledDate={disabledDate}
                />
              )
            }
          </FormItem>
          <FormItem
            label="说明"
            {...formItemLayout}
          >
            {
              getFieldDecorator('remarks', {
                rules: [{
                  required: true,
                  message: '请填写说明原因',
                }],
              })(
                <TextArea rows={4} />
              )
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default ExceptionContent;
