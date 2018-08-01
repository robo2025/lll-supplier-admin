import Cookies from 'js-cookie';
import Services from '../utils/customerService';

import {
  audit,
  getUserInfo,
  registerUser,
  getSMSCode,
  getSupplierInfo,
} from '../services/user';
import { setAuthority } from '../utils/authority';
import {
  SUCCESS_STATUS,
  USER_INFO,
  HOME_PAGE,
  LOGIN_URL,
  VERIFY_PAGE,
  TOKEN_NAME,
} from '../constant/config.js';
import { queryString } from '../utils/tools';

export default {
  namespace: 'user',

  state: {
    list: [],
    info: {},
    loading: false,
    currentUser: {},
    supplierInfo: {},
  },

  effects: {
    // *fetch({ success, error }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(getUserInfo);
    //   if (response.rescode >> 0 === SUCCESS_STATUS) {
    //     if (typeof success === 'function') {
    //       success(response);
    //     }
    //   } else if (typeof error === 'function') {
    //     error(response);
    //     return;
    //   }

    //   yield put({
    //     type: 'save',
    //     payload: response.data,
    //   });
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      Cookies.set('userinfo', JSON.stringify(response.data), { expires: 7 });
      // 注册客服;
      Services.service.initService({
        username: response.data.username,
        mobile: response.data.mobile,
        email: response.data.email,
      });
    },
    *register({ data, success, error }, { call }) {
      const response = yield call(registerUser, { data });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') {
          success(response);
        }
      } else if (typeof error === 'function') {
        error(response);
      }
    },
    *fectchSMS({ mobile, success, error }, { call }) {
      const response = yield call(getSMSCode, { mobile });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') {
          success(response);
        }
      } else if (typeof error === 'function') {
        error(response);
      }
    },
    *fetchSupplierInfo({ supplierId, success, error }, { call, put }) {
      const response = yield call(getSupplierInfo, { supplierId });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') {
          success(response);
        }
      } else if (typeof error === 'function') {
        error(response);
        return;
      }
      yield put({
        type: 'saveSupplier',
        payload: response.data,
      });
    },
    *changeAuthorityUrl(_, { call }) {
      const userinfo = yield call(getUserInfo);
      const {
        data: { id, main_user_id },
      } = userinfo;
      // 判断是子账号还是主账号
      if (id === main_user_id) {
        // TODO：在本地token与线上token同名冲突的时候报403
        const response = yield call(getSupplierInfo, { supplierId: id });
        const supplier = response.data;
        if (supplier.profile.audit_status !== 1) {
          setAuthority('1'); // 1为账号未通过审核的权限
        } else {
          setAuthority('2'); // 2为账号未通过审核的权限
        }
      } else {
        setAuthority('3'); // 2为子账号通过审核的权限
      }
      location.href = `${USER_INFO}`;
    },
    *verify(_, { call, put }) {
      const { href } = window.location;
      const paramas = queryString.parse(href);
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        yield put({ type: 'changeAuthorityUrl' });
      } else if (paramas.access_token) {
        /* 判断url是否有access_token,如果有则将其存储到cookie */
        const accessToken = paramas.access_token.split('#/')[0];
        if (location.host.indexOf('robo2025') !== -1) {
          Cookies.set(TOKEN_NAME, accessToken, {
            expires: 7,
            path: '/',
            domain: '.robo2025.com',
          });
        } else {
          Cookies.set(TOKEN_NAME, accessToken);
        }
        yield put({ type: 'changeAuthorityUrl' });
      } else {
        window.location.href = `${LOGIN_URL}?next=${VERIFY_PAGE}&from=supplier`;
      }
    },
    // 提交审核
    *audit({ payload, callback }, { call, put }) {
      const response = yield call(audit, { ...payload });
      const { rescode, data, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, data);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
  },

  reducers: {
    save(state, action) {
      setAuthority(action.payload.user_type);
      return {
        ...state,
        info: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveSupplier(state, action) {
      return {
        ...state,
        supplierInfo: action.payload,
      };
    },
  },
};
