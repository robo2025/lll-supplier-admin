import Cookies from 'js-cookie';
import { LOGIN_URL, NEXT_URL } from '../constant/config';

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
    const parseObj = {};
    if (!url) {
      return false;
    }
    let argStr = '';
    if (url.split('?').length > 1) {
      argStr = url.split('?')[1];
      const argArr = argStr.split('&');
      argArr.forEach((val) => {
        const args = val.split('=');
        if (args.length > 1) {
          parseObj[args[0]] = args[1];
        }
      });
    }
    return parseObj;
  },
};
