import axios from 'axios';
import { UPLOAD_URL } from '../constant/config';

export async function query() {
  return axios({
    method: 'get',
    url: UPLOAD_URL + '/qiniu/upload_token',
  }).then((response) => {
    const { status, statusText } = response;
    // console.log("获取token服务器返回数据：",response);
    return Promise.resolve({
      status,
      statusText,
      upload_token: response.data,
    });
  });
}
