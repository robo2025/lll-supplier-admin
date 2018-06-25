import lyRequest from '../utils/lyRequest';
import { USERS_SERVER, SOLUTION_URL } from '../constant/config';

export async function queryList(params) {
  const { offset = 0, limit = 10, is_type = 'all', ...others } = params;
  return lyRequest(`${SOLUTION_URL}/v1/sln`, {
    params: {
      offset,
      limit,
      is_type,
      role: 'supplier',
      ...others,
    },
  });
}

export async function queryDetail({ sln_no }) {
  return lyRequest(`${SOLUTION_URL}/v1/sln/${sln_no}?role=supplier`);
}


export async function queryUserInfo({ id }) {
  return lyRequest(USERS_SERVER + '/service/customers/' + id);
}

export async function handleQuotation({ sln_no, sln_supplier_info, sln_device, welding_tech_param, sln_support }) {
  return lyRequest(`${SOLUTION_URL}/v1/offer/${sln_no}`, {
    method: 'post',
    data: {
      sln_supplier_info,
      sln_device,
      welding_tech_param,
      sln_support,
    },
  });
}
