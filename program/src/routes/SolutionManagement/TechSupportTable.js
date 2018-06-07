import React from 'react';
import { Form, Checkbox, Input, Table } from 'antd';

const FormItem = Form.Item;
@Form.create()
class TechSupportTable extends React.Component {
  state = {
    installChecked: false,
    technologyChecked: false,
    trainChecked: false,
  };
  onChange = (key) => {
    const isChecked = this.state[`${key}Checked`];
    this.setState({ [`${key}Checked`]: !isChecked });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '项目名称',
        key: 'project_name',
        render: row => (
          <Checkbox
            checked={this.state[`${row.key}Checked`]}
            onChange={() => this.onChange(row.key)}
          >
            {row.project_name}
          </Checkbox>
        ),
      },
      {
        title: '价格（元）',
        key: 'price',
        align: 'center',
        width: '200px',
        render: row =>
          getFieldDecorator(`${row.key}_price`, {
            getValueFromEvent: (e) => {
              if (!e || !e.target) {
                return e;
              }
              const { target } = e;
              const { value } = target;
              const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
              if (reg.test(value)) {
                return value;
              } 
            },
          })(<Input disabled={!this.state[`${row.key}Checked`]} />),
      },
      {
        title: '备注',
        key: 'remarks',
        align: 'center',
        render: row => <Input disabled={!this.state[`${row.key}Checked`]} />,
      },
    ];
    const dataSource = [
      { project_name: '安装', key: 'install' },
      { project_name: '工艺编码调试', key: 'technology' },
      { project_name: '培训', key: 'train' },
    ];
    return (
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    );
  }
}
export default TechSupportTable;
