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
import HttpService from '../../services/http.service';
import { api_base_url } from '../../utils/urls';

// handle all lotteries
export const handleLotteryAction = () => {
    return async function (dispatch) {
        dispatch({ type: REQUEST_LOTTERY_TICKET })
        try {
            const result = await HttpService.get(api_base_url + '/lottery');
            if (result?.data) { dispatch({ type: SUCCESS_LOTTERY_TICKET, lottery: result?.data }) }
        } catch (err) {
            dispatch({ type: FAILURE_LOTTERY_TICKET, errorMessage: err })
        }
    }
}

// handle single lotteries
export const handleSingleLotteryAction = (id) => {
    return async function (dispatch) {
        dispatch({ type: REQUEST_LOTTERY_ID_TICKET })
        try {
            const result = await HttpService.get(api_base_url + `/lottery/${id}`);
            if (result?.data) { dispatch({ type: SUCCESS_LOTTERY_BY_ID, lotteryById: result.data }) }
        } catch (err) {
            dispatch({ type: FAILURE_LOTTERY_TICKET, errorMessage: err })
        }
    }
}

// handle customer lotteries
export const handleCustomerLotteriesAction = (id) => {
    return async function (dispatch) {
        dispatch({ type: REQUEST_CUSTOMER_LOTTERIES })
        try {
            const result = await HttpService.get(api_base_url + `/customer-ticket`);
            if (result?.data) { dispatch({ type: SUCCESS_CUSTOMER_LOTTERIES, customerLotteries: result.data }) }
        } catch (err) {
            dispatch({ type: FAILURE_LOTTERY_TICKET, errorMessage: err })
        }
    }
}

// ḥandle lotteries result
export const handleLotteryResultAction = () => {
    return async function (dispatch) {
        dispatch({ type: REQUEST_LOTTERY_RESULTS })
        try {
            const result = await HttpService.get(api_base_url + '/lottery/history');
            if (result?.data) { dispatch({ type: GET_LOTTERY_RESULTS, lotteriesResult: result?.data }) }
        } catch (err) {
            dispatch({ type: FAILURE_LOTTERY_TICKET, errorMessage: err })
        }
    }
}

// HANDLE CONTENT 
export const handleDynamicContent = (slug) => {
    return async function (dispatch) {
        try {
            const result = await HttpService.get(api_base_url + `/page-content/${slug}`)
            if (result?.status < 400) {
                dispatch({ type: DYNAMIC_CONTENT, content: result?.data })
            }
        } catch (err) { console.log(err) }
    }
}
