import axios from "axios";
import { useHistory } from 'react-router-dom';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../store/actions";
import config from "../config";

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_BASE_URL || "http://localhost:5000/api/"

const Axios = axios.create({
    baseURL: config.API_SERVER,
});

const AxiosInterceptor = ({ children }) => {

    // const navigate = useNavigate();
    // const router = useRouter()
    const history = useHistory();
    const dispatcher = useDispatch();
    // const toast = useToast()

    useEffect(() => {

        const resInterceptor = response => {
            return response;
        }

        const errInterceptor = error => {

            if (error.response.status === 401) {
                // toast({
                //     title: 'Kindly Login',
                //     description: "Redirecting you to Login Page",
                //     status: 'error',
                //     duration: 2500,
                //     isClosable: true,
                //   })
                dispatcher({ type: LOGOUT });
                //   setTimeout(() => {  history.push("/login");}, 3000);
                
                
            } else if(error.response.status === 403) {
                console.log("hello")
                // toast({
                //     title: 'Token Expired',
                //     description: "Kindly upgrade your plan",
                //     status: 'error',
                //     duration: 2500,
                //     isClosable: true,
                //   })
                
                dispatcher({ type: LOGOUT });
                // setTimeout(() => {  history.push("/login");}, 3000);
            }

            return Promise.reject(error);
        }


        const interceptor = Axios.interceptors.response.use(resInterceptor, errInterceptor);

        return () => Axios.interceptors.response.eject(interceptor);

    }, [history])

    return children;
}

export default Axios;
export { AxiosInterceptor };