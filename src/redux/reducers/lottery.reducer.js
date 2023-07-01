
import {
    REQUEST_LOTTERY_TICKET,
    SUCCESS_LOTTERY_TICKET,
    FAILURE_LOTTERY_TICKET,
    REQUEST_LOTTERY_ID_TICKET,
    SUCCESS_LOTTERY_BY_ID,
    REQUEST_CUSTOMER_LOTTERIES,
    SUCCESS_CUSTOMER_LOTTERIES,
    REQUEST_LOTTERY_RESULTS,
    GET_LOTTERY_RESULTS,
    DYNAMIC_CONTENT
} from '../types'

// Define your state here
const initialState = {
    lotteryListLoading: false,
    lotteries: null,
    errorMessage: '',
    lotteryIdLoading: false,
    lotteryById: null,
    customerTicketLoading: false,
    customerLotteries: [],
    lotteriesResultLoading: false,
    lotteriesResult: [],
    dynamicContent: null
}

// This export default will control your state for your application
const LotteryReducer = (state = initialState, action) => {
    switch (action?.type) {
        // lottery state
        case REQUEST_LOTTERY_TICKET: return { ...state, lotteryListLoading: true }
        case SUCCESS_LOTTERY_TICKET: return { ...state, lotteryListLoading: false, lotteries: action?.lottery }
        case FAILURE_LOTTERY_TICKET: return { ...state, lotteryListLoading: false, errorMessage: action?.errorMessage }

        // lottery by id 
        case REQUEST_LOTTERY_ID_TICKET: return { ...state, lotteryIdLoading: true, lotteryById: action?.lotteryById }
        case SUCCESS_LOTTERY_BY_ID: return { ...state, lotteryIdLoading: false, lotteryById: action?.lotteryById }

        // customer lotteries
        case REQUEST_CUSTOMER_LOTTERIES: return { ...state, customerTicketLoading: true }
        case SUCCESS_CUSTOMER_LOTTERIES: return { ...state, customerTicketLoading: false, customerLotteries: action?.customerLotteries }

        // ḷottery result
        case REQUEST_LOTTERY_RESULTS: return { ...state, lotteriesResultLoading: true, }
        case GET_LOTTERY_RESULTS: return { ...state, lotteriesResultLoading: false, lotteriesResult: action?.lotteriesResult }

        // dynamic data
        case DYNAMIC_CONTENT: return { ...state, dynamicContent: action?.content }
        default:
            return state
    }
}

export default LotteryReducer;
