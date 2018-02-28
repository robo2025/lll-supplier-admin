import React from 'react';
import './tip-panel.less';

const TipPanel = ({ tip, component }) => (
  <div className="tip-panel">
    {tip}
    {component}
  </div>
);

export default TipPanel;
