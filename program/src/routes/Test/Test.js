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
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      success: (res) => {
        Cookies.set('userinfo', JSON.stringify(res.data), { expires: 7 });
        window.location.href = HOME_PAGE;
      },
    });
  }

  render() {
    return (
      <div>跳转中...</div>
    );
  }
}
export default Test;
