import React from 'react';
import { Checkbox, Input, Table } from 'antd';

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
              if (
                (!isNaN(value) && reg.test(value)) ||
                value === '' ||
                value === '-'
              ) {
                return value;
              } else {
                return form.getFieldValue(`${row.key}_price`);
              }
            },
          })(<Input disabled={!this.state[`${row.key}Checked`]} />), // TODO 当值为空的时候提交的BUG
      },
      {
        title: '备注',
        key: 'remarks',
        align: 'center',
        render: row =>
          getFieldDecorator(`${row.key}_note`)(<Input disabled={!this.state[`${row.key}Checked`]} />),
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
