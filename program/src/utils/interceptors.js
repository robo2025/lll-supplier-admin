import axios from 'axios';
import { Modal, notification } from 'antd';
import { login, jumpToLogin } from '../services/user';


const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
// Create an instance using the config defaults provided by the library
// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create({ timeout: 1000 });

// Override timeout default for the library
// Now all requests will wait 2.5 seconds before timing out
instance.defaults.timeout = 1000;

// Add a request interceptor
axios.interceptors.request.use((config) => {
  // Do something before request is sent
  // console.log("--每次请求配置：", config);
  // message.loading('加载中数据中...');
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use((response) => {
  // Do something with response data
  // message.destroy();
  return response;
}, (error) => {
  // 请求错误服务器返回的信息
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      Modal.warning({
        title: '提示',
        content: '请求超时，请稍后刷新页面再试...',
      });
    }
    return Promise.reject(error);
  }
  const { response } = error;
  /*
   * 如果响应头是以200开头，则是登录验证出了问题，跳转到登录页面
   *   20001  token不存在
   *   20002  token过期
   *   20003  token非法
   *   20004  登录超时
   *   30001  无管理员权限
   * */
  if ((response.data.rescode >> 0) === 30001) {
    // 没有权限
    alert('非管理员账号,没有此系统权限');
    jumpToLogin();
    return;
  }
  if ((response.data.rescode >> 0) > 20000) {
    // 登录过期或者token非法
    login();
  }

  if (response.status === 500) {
    console.log('服务器错误：', response);
    Modal.error({
      title: `${response.status}错误`,
      content: '很不幸，这是一个坏消息，他表示服务器挂掉了...',
    });
    return;
  }
  notification.error({
    message: `${response.status}错误`,
    description: codeMessage[response.status],
  });

  return Promise.reject(error);
});
