import { toast } from 'react-toastify';
import Services from '../../services/services';
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
import { HttpService } from '../../services';
import { api_base_url } from '../../utils/urls';

export const handleLoginAction = (loginUser) => {
  return async function (dispatch) {
    dispatch({ type: REQUEST_USER_LOGIN })
    try {
      const result = await Services.login(loginUser)
      if (result.data && result.data.token) {
        if (result?.data?.customer?.isActive) {
          localStorage.setItem("token", result.data.token);
          dispatch({ type: SUCCESS_USER_LOGIN, loginInfo: result.data })
          toast['success']('User logged in successfully!')
          dispatch(getUserAction())
        } else {
          toast.warn('Please verify your email.')
          dispatch({ type: FAILURE_USER_LOGIN })
        }
      }
    } catch (e) {
      dispatch({ type: FAILURE_USER_LOGIN })
    }
  }
}

export const getUserAction = () => {
  return async function (dispatch) {
    const result = await Services.userGet();
    if (result) {
      dispatch({ type: GET_USER_INFO, user: result.data })
    }
  }
}

export const logoutAction = () => {
  return async function (dispatch) {
    localStorage.removeItem('token')
    dispatch({ type: LOGOUT })
  }
}

export const settingsAction = () => {
  return async function (dispatch) {
    dispatch({ type: SETTINGS_REQUEST })
    try {
      const result = await HttpService.get(api_base_url + '/setting');
      if (result?.status < 400) {
        dispatch({ type: SETTINGS_SUCCESS, settings: result?.data })
      }
    } catch (err) {
      dispatch({ type: SETTINGS_FAILURE })
    }
  }
}

export const couponAction = (payload) => {
  return async function (dispatch) {
    dispatch({ type: COUPON_REQUEST })
    try {
      if (payload !== '') {
        const result = await HttpService.get(api_base_url + `/coupon/validate-coupon/${payload?.coupon}`);
        if (!result.data?.coupon && result.data.message !== '') {
          toast.warn(result?.data?.message);
          dispatch({ type: COUPON_FAILURE })
        } else {
          toast.success('Coupon Applied!');
          dispatch({ type: COUPON_SUCCESS, coupon: result?.data?.coupon })
        }
      } else { dispatch({ type: COUPON_SUCCESS, coupon: null }) }
    } catch (err) {
      dispatch({ type: COUPON_FAILURE })
    }
  }
}
