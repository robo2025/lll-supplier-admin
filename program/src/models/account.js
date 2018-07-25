import {
    queryAccountList,
    queryAccountDetail
} from "../services/account"

export default {
    namespace:"account",
    state:{
        accountList:[],
        accountTotal:0
    },
    effects:{
        *fetchAccountList({params,offset,limit,success,error},{call,put}) {
            const res = yield call(queryAccountList,{params,offset,limit});
            const {rescode} = res.rescode;
            if(rescode >> 0 === 10000) {
                if(success){
                    success(res)
                }
            } else if(error) {
                error(res)
            }
            yield put({
                type:"saveAccountList"
            })
        }
    }
}