import React, { Component } from 'react';

import styles from './richEditorShow.less';

export default class RichEditorShow extends Component {
  render() {
    return (
      <div className={styles['rich-text']} dangerouslySetInnerHTML={{ __html: this.props.content }} />
    );
  }
}
