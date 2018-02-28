import React from 'react';

import styles from './section-header.less';

const SectionHeader = ({ title, extra }) => (
  <div className={styles['section-header']}>
    <h2>{title}</h2>
    {extra}
  </div>
);


export default SectionHeader;
