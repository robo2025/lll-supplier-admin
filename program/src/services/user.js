import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { setAuthority } from '../utils/authority';
import { URL, LOGIN_URL, LOGOUT_URL, REGISTER_URL, USERS_SERVER, VERIFY_PAGE, MAIN_URL, TOKEN_NAME } from '../constant/config';

export async function query() {
  return lyRequest('/api/users');
}

export async function queryCurrent() {
  return lyRequest('/api/currentUser');
}

// 获取用户信息
export async function getUserInfo() {
  return lyRequest(`${URL}/server/verify`);
}

// 获取供应商详细信息
export async function getSupplierInfo({ supplierId }) {
  return lyRequest(`${USERS_SERVER}/supplier/profiles/${supplierId}`);
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
  localStorage.removeItem('antd-pro-authority');
  Cookies.remove('userinfo');
  const accessToken = Cookies.get(TOKEN_NAME);
  if (accessToken) {
    Cookies.remove(TOKEN_NAME);
    window.location.href = `${LOGOUT_URL}?access_token=${accessToken}&next=${encodeURIComponent(
      VERIFY_PAGE
    )}`;
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
// 提交审核
export function audit({ formData, supplierId }) {
  return lyRequest(`${USERS_SERVER}/supplier/profiles/${supplierId}`, {
    method: 'put',
    data: formData,
  });
}
