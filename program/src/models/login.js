import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        window.sessionStorage.setItem('userid', '008');
        console.log('redux登录ok响应', response);
        yield put(routerRedux.push('/'));
        yield put({
          type: 'saveCurrentUser',
          payload: response.userinfo,
        });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    saveCurrentUser(state, action) {
      console.log('我是处理登录的,当前state：', state);
      const userinfo = JSON.stringify(action.payload);
      window.sessionStorage.setItem('userinfo', userinfo);
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
