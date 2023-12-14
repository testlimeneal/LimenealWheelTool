import axios from "axios";
import { useHistory } from 'react-router-dom';

import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import { LOGOUT } from "../store/actions";
import config from "../config";

const Axios = axios.create({
    baseURL: config.API_SERVER,
});

const AxiosInterceptor = ({ children }) => {
    const history = useHistory();
    const dispatcher = useDispatch();
    const account = useSelector((state) => state.account);

    useEffect(() => {
        const resInterceptor = response => {
            return response;
        }

        const errInterceptor = error => {
            if (error.response.status === 401) {
                dispatcher({ type: LOGOUT });
            } else if (error.response.status === 403) {
                dispatcher({ type: LOGOUT });
            }
            return Promise.reject(error);
        }

        const requestInterceptor = config => {
            // Check if the token is available in the account.user object
            if (account.token) {
                config.headers.Authorization = `${account.token}`;
            }
            return config;
        }

        const interceptor = Axios.interceptors.response.use(resInterceptor, errInterceptor);
        const requestInterceptorId = Axios.interceptors.request.use(requestInterceptor);

        return () => {
            Axios.interceptors.response.eject(interceptor);
            Axios.interceptors.request.eject(requestInterceptorId);
        };

    }, [history, account.token, dispatcher]);

    return children;
}

export default Axios;
export { AxiosInterceptor };