import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Table, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductForm from './ProductForm';
import { queryString } from '../../utils/tools';

import styles from './ProductDetail.less';

const FormItem = Form.Item;
@connect(({ businessScope, loading }) => ({
  detail: businessScope.profile,
  loading: loading.models.businessScope,
}))
@Form.create()
export default class ProductDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取商品详情
    dispatch({
      type: 'businessScope/fetchDetail',
      payload: { pno: location.href.split('=').pop() },
    });
  }

  render() {
    const { detail, loading } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout title="产品详情" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          <SectionHeader
            title="产品基础信息"
          />
          <ProductForm
            loading={loading}
            data={detail}
          />
          <SectionHeader
            title="规格参数"
          />
            <Form layout="inline">
              {
                detail.specs && detail.specs.map(val => (
                  <FormItem
                   colon={false}
                    label={val.spec_name}
                    key={val.id}
                  >
                    {getFieldDecorator(`spec_${val.spec_name}`, {
                    })(
                      <span>{val.spec_unit ? `(${val.spec_unit})` : null}</span>
                    )}
                  </FormItem>
                ))
              }
            </Form>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}