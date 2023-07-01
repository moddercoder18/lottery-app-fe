import axios from "axios";
import { toast } from "react-toastify";

const HttpService = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        Accept: "application/json",
        // language: window.localStorage.getItem('language')
    },
});

/*** Interceptor ***/

HttpService.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem("token");
        if (token) request.headers.Authorization = `Bearer ${token}`;
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

HttpService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
            // window.location.href = '/lottery-ticket'
        } else if (!!error.response && error.response.data && error.response.data.error) {
            const errArray = error.response && error.response.data && error.response.data.message
            if (typeof (errArray) == 'string') {
                toast['error'](errArray)
            } else {
                for (let error of errArray) {
                    toast['error'](error)
                }
            }
        }
        return Promise.reject(error);
    }
);

export default HttpService;
