import React from 'react';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { getFileSuffix } from '../../utils/tools';
import styles from './rich-editor.less';

const UPLOAD_URL = '//up.qiniu.com'; // 文件上传地址
const IMG_SERVER = 'http://imgcdn.robo2025.com/'; ;
export default class RichEditor extends React.Component {
  state = {
    htmlContent: '',
  }

  handleChange = (content) => {
    // this.setState({ content });    
    // console.log('content', content);
    if (this.props.onChange) {
      this.props.onChange(content);
    }
  }

  handleHTMLChange = (html) => {
    this.setState({ htmlContent: html });
    // console.log('html', html);
  }

  render() {
    const { token } = this.props;
    const uploadFn = (param) => {
      console.log('富文本上传参数', param);
      const serverURL = UPLOAD_URL;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
    
      // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
      console.log(param.libraryId);
    
      const successFn = (response) => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        console.log('上传成功返参', response, IMG_SERVER + JSON.parse(xhr.response).key);
        param.success({
          url: IMG_SERVER + JSON.parse(xhr.response).key,
        });
      };
    
      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };
    
      const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.',
        });
      };
    
      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);
    
      fd.append('file', param.file);
      fd.append('token', token); // 七牛云上传token
      fd.append('key', `/product/${param.libraryId}.${getFileSuffix(param.file.name)}`);// 七牛云上传文件名
    
      xhr.open('POST', serverURL, true);
      xhr.send(fd);
    };

    // 编辑器的初始内容,raw字符串
    const rawContent = this.props.defaultValue ? this.props.defaultValue : '';
    const editorProps = {
      height: 500,
      placeholder: '请输入内容...',
      initialContent: rawContent.replace(/^("?)|("?)$/g, ''),
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      contentFormat: 'html',
      viewWrapper: '.demo',
      disabled: this.props.disabled ? this.props.disabled : false,
      media: {
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        uploadFn,
      },
      // 增加自定义预览按钮
      extendControls: [
        {
          type: 'split',
        },
        {
          type: 'button',
          text: '预览',
          className: 'preview-button',
          onClick: () => {
            window.open().document.write(this.state.htmlContent);
          },
        },
      ],
    };

    return (
      <div className={`demo ${styles.demo}`}>
        <BraftEditor {...editorProps} />
      </div>
    );
  }
}
