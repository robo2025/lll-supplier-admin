import { queryAllSolutions, checkSolution, deleteSolution, getSolutionDetail } from '../services/solution';

export default {
  namespace: 'solution',

  state: {
    list: [],
    loading: false,
    offset: 0,
    limit: 10,
    total: 0,
    detail: {},
  },

  effects: {
    * fetch({ offset, limit }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAllSolutions, offset, limit);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'saveAll',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchSolutionDetail({ solutionId }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getSolutionDetail, solutionId);
      // console.log('获取方案详情响应：', response);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *setSolutionStatus({ solutionId, status }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(checkSolution, solutionId, status);
      yield put({
        type: 'changeStatus',
        solutionId,
        status,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *setDetailStatus({ solutionId, status }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(checkSolution, solutionId, status);
      yield put({
        type: 'changeStatus2',
        solutionId,
        status,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *removeSolution({ solutionId }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(deleteSolution, solutionId);
      // console.log('获取需求响应：：', response);
      yield put({
        type: 'remove',
        solutionId,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveAll(state, action) {
      return {
        ...state,
        list: action.payload.data,
        total: action.payload.headers['x-content-total'] >> 0,
        offset: action.offset >> 0,
        limit: action.limit >> 0,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    changeStatus(state, action) {
      return {
        ...state,
        list: state.list.map((val) => {
          // console.log("遍历方案ID:",val.id,action.solutionId);
          if (val.id === (action.solutionId >> 0)) {
            val.status = action.status;
            return val;
          } else {
            return val;
          }
        }),
      };
    },
    changeStatus2(state, action) {
      return {
        ...state,
        detail: {
          ...state.detail,
          solution: { ...state.detail.solution, status: action.status },
        },
      };
    },
    remove(state, action) {
      return {
        ...state,
        list: state.list.map(val => (
          val.id !== action.solutionId >> 0
        )),
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
