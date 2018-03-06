import React, { Component } from 'react';

import styles from './richEditorShow.less';

export default class RichEditorShow extends Component {
  render() {
    console.log('html片段', this.props.content);
    return (
      <div className={styles['rich-text']} dangerouslySetInnerHTML={{ __html: this.props.content }} />
    );
  }
}
