import React from "react";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { connect } from "dva";
import { Card, Button, Form, Row, Col ,Input} from "antd";
import styles from "./account.less";
const FormItem = Form.Item;
@Form.create()
@connect(({account,loading}) =>({
    account,
    loading
}))
export default class AccountList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
      const {dispatch} = this.props;
      dispatch({
          type:"account/fetchAccountList",
      })
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} className={styles.tableListForm} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="帐号">
              {getFieldDecorator("account")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator("contract_type")(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator("contract_type")(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: "hidden" }}>
          <span style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    return (
      <PageHeaderLayout title="账号列表">
        <Card title="搜索条件">{this.renderForm()}</Card>
      </PageHeaderLayout>
    );
  }
}
