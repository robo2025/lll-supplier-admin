import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { URL, LOGIN_URL, LOGOUT_URL, REGISTER_URL, VERIFY_PAGE, HOME_PAGE } from '../constant/config';

export async function query() {
  return lyRequest('/api/users');
}

export async function queryCurrent() {
  return lyRequest('/api/currentUser');
}

// 获取用户信息
export async function getUserInfo() {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${URL}/server/verify`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

// 注册操作
export function register() {
  window.location.href = `${REGISTER_URL}?next=${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}
// 登出
export function logout() {
  const accessToken = Cookies.get('access_tokT');
  if (accessToken) {
    Cookies.remove('access_token');
    Cookies.remove('userinfo');
    window.location.href = `${LOGOUT_URL}?access_token=${accessToken}&next=${HOME_PAGE}`;
  } else {
    window.location.href = `${LOGOUT_URL}`;
  }
}

// 登录操作
export function login() {
  // console.log("登录URL--------------",LOGIN_URL + `?next=${encodeURIComponent(VERIFY_PAGE)}`);
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}


export function jumpToLogin() {
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}&disable_redirect=1`;
}
