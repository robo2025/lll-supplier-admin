import React from 'react';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';

@connect()
class Test extends React.Component {
  componentDidMount() {
    console.log('测试页面加载好了!');
    verifyLogin();
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  render() {
    return (
      <div>跳转中...</div>
    );
  }
}
export default Test;
