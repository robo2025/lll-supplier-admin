import { queryPage1, queryPage2 } from '../services/api';

export default {
  namespace: 'newpage',

  state: {
    test: ['testContent'],
    test2: ['kong'],
  },

  effects: {
    *testFetch(_, { call, put }) {
      // 异步请求 1
      const response = yield call(queryPage1);
      console.log('page1 response:', response);
      yield put({
        type: 'test',
        payload: response.msg,
      });
    },
    *testFetch2({ data }, { call, put }) {
      // 异步请求 1
      const response = yield call(queryPage2, data);
      console.log('page2 response:', response);
      yield put({
        type: 'test2',
        payload: response.msg,
      });
    },
  },

  reducers: {
    test(state, { payload }) {
      return {
        ...state,
        test: [...state.test, 'newContent', payload],
      };
    },
    test2(state, { payload }) {
      return {
        ...state,
        test2: [...state.test2, payload],
      };
    },
  },
};
