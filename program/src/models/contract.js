import {
    queryContractList,
    queryContractDetail,
  } from "../services/contract";
  import { SUCCESS_STATUS } from "../constant/config";
  export default {
    namespace: "contract",
    state: {
      contractList: [],
      contractTotal: 0,
      contractDetail: {}
    },
    effects: {
      *fetch({ params, offset, limit, success, error }, { call, put }) {
        const res = yield call(queryContractList, { params, offset, limit });
        if (res.rescode >> 0 === SUCCESS_STATUS) {
          if (typeof success === "function") {
            success(res);
          }
        } else if (typeof error === "function") {
          error(res);
          return;
        }
        const { headers } = res;
        yield put({
          type: "save",
          payload: res.data,
          headers
        });
      },
      *fetchContractDetail({ id, success, error }, { call, put }) {
        const res = yield call(queryContractDetail, { id });
        if (res.rescode >> 0 === SUCCESS_STATUS) {
          if (typeof success === "function") {
            success(res);
          }
        } else if (typeof error === "function") {
          error(res);
          return;
        }
        yield put({
          type: "saveDetail",
          payload: res.data
        });
      },
    },
    reducers: {
      save(state, action) {
        return {
          ...state,
          contractList: action.payload,
          contractTotal: action.headers["x-content-total"] >> 0
        };
      },
      saveDetail(state, action) {
        return {
          ...state,
          contractDetail: action.payload
        };
      }
    }
  };
  