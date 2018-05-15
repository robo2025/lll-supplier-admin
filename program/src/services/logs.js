import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { OPERATION_URL } from '../constant/config';


/**
 * 产品操作日志
 *
 * @param {array} module 模块
*/
export async function queryLogs({ module, objectId, offset = 0, limit = 10 }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${OPERATION_URL}/operationlogs?offset=${offset}&limit=${limit}&module=${module}&object_id=${objectId}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}
