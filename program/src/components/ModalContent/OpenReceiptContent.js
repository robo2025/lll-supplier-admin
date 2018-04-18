import React, { Component } from 'react';
import { Table, Form, Input, Upload, message, Icon } from 'antd';
import moment from 'moment';
import { getFileSuffix } from '../../utils/tools';

import styles from './OpenReceiptContent.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const UPLOAD_URL = '//up.qiniu.com';

const receiptColumns = [{
  title: '发票编号',
  dataIndex: 'receipt_sn',
  key: 'receipt_sn',
}, {
  title: '发票照片',
  dataIndex: 'images',
  key: 'images',
  render: text => (<img src={text} alt="发票图片" width={20} height={20} />),
}, {
  title: '更新日期',
  dataIndex: 'add_time',
  key: 'add_time',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD hh:mm')}</span>),
}, {
  title: '操作人员',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '备注',
  dataIndex: 'remarks',
  key: 'remarks',
}];

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@Form.create({
  onValuesChange: (props, fields) => {
    if (fields.images) {
      if (fields.images.file.response) {
        props.onChange({ images: fields.images.file.response.key });
      }
      return;
    }
    props.onChange(fields);
  },
})
export default class OpenReceiptContent extends Component {
  state = {
    loading: false,
    file: {
      uid: '',
      name: '',
    },
  };

  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  beforeUpload = (file) => {
    this.setState({ file });
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('你只能上传 JPG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于 2MB!');
    }
    return isJPG && isLt2M;
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  render() {
    const { uploadToken, list } = this.props;
    const { imageUrl, file } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className={styles['open-receipt']}>
        <Table
          dataSource={list}
          columns={receiptColumns}
          pagination={{
            defaultPageSize: 3,
          }}
          key="order_sn"
        />
        <Form className="receipt-form" ref={(node) => { this.myForm = node; }}>
          <FormItem
            {...formItemLayout}
            label="发票编号"
          >
            {getFieldDecorator('receiptId', {
              rules: [{
                required: true,
                message: '请输入发票编号',
              }],
            })(
              <Input placeholder="请输入发票编号" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发票照片上传"
          >
            {
              getFieldDecorator('images')(
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={UPLOAD_URL}
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                  data={
                    {
                      token: uploadToken,
                      key: `supplier/others/images/${file.uid}.${getFileSuffix(file.name)}`,
                    }
                  }
                >
                  {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
                </Upload>
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {
              getFieldDecorator('remarks')(
                <TextArea />
              )
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}
