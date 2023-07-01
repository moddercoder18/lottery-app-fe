import { combineReducers } from 'redux'

// Reducers
import AuthReducer from './auth.reducer';
import LotteryReducer from './lottery.reducer'

export default combineReducers({
    AuthReducer,
    LotteryReducer
})
