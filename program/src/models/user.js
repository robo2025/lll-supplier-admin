import Cookies from 'js-cookie';
import { query as queryUsers, queryCurrent, getUserInfo } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    info: {},
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getUserInfo);
      console.log('当前用户数据：', response);
      window.sessionStorage.setItem('userinfo', JSON.stringify(response.data));
      Cookies.set('userinfo', JSON.stringify(response.data), { expires: 7 });
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
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
  },
};
