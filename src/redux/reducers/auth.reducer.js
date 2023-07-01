
import {
    REQUEST_USER_LOGIN,
    SUCCESS_USER_LOGIN,
    FAILURE_USER_LOGIN,
    GET_USER_INFO,
    LOGOUT,
    SETTINGS_REQUEST,
    SETTINGS_SUCCESS,
    SETTINGS_FAILURE,
    COUPON_REQUEST,
    COUPON_SUCCESS,
    COUPON_FAILURE
} from '../types'

// Define your state here
const initialState = {
    loading: false,
    loginUserDetails: null,
    errorMessage: '',
    userData: null,
    settingLoading: false,
    settings: null,
    coupon: null,
    couponLoading: false
}

// This export default will control your state for your application
const AuthReducer = (state = initialState, action) => {
    switch (action?.type) {
        case REQUEST_USER_LOGIN: return { ...state, loading: true }
        case SUCCESS_USER_LOGIN: return { ...state, loading: false, loginUserDetails: action?.loginInfo }
        case FAILURE_USER_LOGIN: return { ...state, loading: false, loginUserDetails: null, errorMessage: action?.errorMessage }

        case GET_USER_INFO: return { ...state, userData: action?.user.customer, loginUserDetails: null };
        case LOGOUT: return { ...state, loginUserDetails: null, userData: null }

        case SETTINGS_REQUEST: return { ...state, settingLoading: true }
        case SETTINGS_SUCCESS: return { ...state, settingLoading: false, settings: action?.settings }
        case SETTINGS_FAILURE: return { ...state, settingLoading: false, settings: null }

        case COUPON_REQUEST: return { ...state, couponLoading: true }
        case COUPON_SUCCESS: return { ...state, couponLoading: false, coupon: action?.coupon }
        case COUPON_FAILURE: return { ...state, couponLoading: false, coupon: null }

        default:
            return state
    }
}

export default AuthReducer;
