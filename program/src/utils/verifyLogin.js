import { LOGIN_URL, REGISTER_URL, NEXT_URL } from '../constant/config';
import Cookies from 'js-cookie';

// 验证是否登录
export function verifyLogin() {
  if (!Cookies.get('access_token')) {
    console.log('用户未登录');
    window.location.href = `${LOGIN_URL}?next=${NEXT_URL}`;
  } else {
    console.log('用户已登录', Cookies.get('access_token'));
  }
}

// 解析url
export const queryString = {
  parse(url) {
    if (!url) {
      return false;
    }
    let argStr = '';
    if (url.split('?').length > 1) {
      argStr = url.split('?')[1];
    }
    const argArr = argStr.split('&');
    argArr.for;
  },
};
