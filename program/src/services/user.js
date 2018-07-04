import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { setAuthority } from '../utils/authority';
import { URL, LOGIN_URL, LOGOUT_URL, REGISTER_URL, USERS_SERVER, VERIFY_PAGE, MAIN_URL, HOME_PAGE } from '../constant/config';

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

// 获取供应商详细信息
export async function getSupplierInfo({ supplierId }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${USERS_SERVER}/supplier/profiles/${supplierId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

// 注册用户
export async function registerUser({ data }) {
  return lyRequest(`${USERS_SERVER}/supplier/register`, {
    method: 'post',
    data,
  });
}

// 获取手机验证码
export async function getSMSCode({ mobile }) {
  return lyRequest(`${MAIN_URL}/common/sms?mobile=${mobile}`);
}

// 注册操作
export function register() {
  window.location.href = `${REGISTER_URL}?next=${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}
// 登出
export function logout() {
  const accessToken = Cookies.get('access_token');
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
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}&from=supplier`;
}


export function jumpToLogin() {
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}&disable_redirect=1&from=supplier`;
}
