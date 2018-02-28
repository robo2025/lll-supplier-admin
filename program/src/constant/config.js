/*
* 后台管理系统常量：
* sso：      https://login.robo2025.com
* 后台管理API：http://139.199.96.235:9002
* */

// 单点登录URL
export const URL = 'https://login.robo2025.com';
// export const URL = 'http://120.27.46.167:8011';

// 网站内容接口URL
export const API_URL = 'http://139.199.96.235:9005/api/admin';

// 上传文件获取token URL
export const UPLOAD_URL = 'http://139.199.96.235:9002';

// 用户管理系统API URL
export const USERS_URL = 'http://139.199.96.235:9006';

// 验证登录接口URL
export const LOGIN_URL = `${URL}/server/authorize`;

// 注册接口URL
export const REGISTER_URL = `${URL}/register`;

// 登录接口URL
export const LOGOUT_URL = `${URL}/logout`;

// 静态web服务器地址,端口和地址必须要写，80端口可不写
const myHost = `${window.location.protocol}/${window.location.host}`;

// 前端登录验证URL
export const NEXT_URL = `${myHost}/#/test`;

// 前端首页URL
export const HOME_PAGE = `${myHost}/#/goods/list`;

// 前端验证URL
export const VERIFY_PAGE = `${myHost}/#/test`;

// 文件服务器URL
export const FILE_SERVER = '//imgcdn.robo2025.com/';

// 分页：每页显示多少记录
export const PAGE_SIZE = 10;
