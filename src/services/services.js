import HttpService from "./http.service";
import { api_base_url } from "../utils/urls";

const Services = {}

Services.signup = async (payload) => {
    return await HttpService.post(api_base_url + '/customer/signup', payload)
}

Services.login = async (payload) => {
    return await HttpService.post(api_base_url + '/customer/login', payload)
}

Services.forgotPassword = async (payload) => {
    return await HttpService.post(api_base_url + '/customer/forgotten-password', payload)
}

Services.resetPassword = async (payload) => {
    return await HttpService.post(api_base_url + '/customer/reset-password', payload)
}

Services.changePassword = async (payload) => {
    return await HttpService.put(api_base_url + '/customer/change-password', payload)
}

Services.userGet = async () => {
    return await HttpService.get(api_base_url + '/customer/me')
}

Services.userUpdate = async (payload) => {
    return await HttpService.put(api_base_url + '/customer', payload)
}

Services.userProfilePicture = async (payload) => {
    return await HttpService.put(api_base_url + '/customer/profile-picture', payload)
}


export default Services;