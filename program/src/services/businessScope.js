import lyRequest from '../utils/lyRequest';
import { OPERATION_URL, API_URL } from '../constant/config';


export async function queryList(params) {
  const { offset = 0, limit = 10, ...others } = params;
  return lyRequest(`${OPERATION_URL}/supplier/scope`, {
    params: {
      offset,
      limit,
      ...others,
    },
  });
}
export async function queryDetail() {
  return lyRequest(`${OPERATION_URL}/supplier/scope`);
}

// 获取级联目录
export async function queryCatalogLevel({ pid = 0 }) {
  return lyRequest(`${API_URL}/supplier/product_categories/level_selection?pid=${pid}`);  
}
