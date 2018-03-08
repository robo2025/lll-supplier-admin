import React from 'react';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';

@connect(state => ({
  ...state,
}))
class Test extends React.Component {
  componentDidMount() {
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
