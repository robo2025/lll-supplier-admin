import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';
import { HOME_PAGE } from '../../constant/config';

@connect(state => ({
  ...state,
}))
class Test extends React.Component {
  componentDidMount() {
    verifyLogin();
  }

  render() {
    return (
      <div>跳转中...</div>
    );
  }
}
export default Test;
