import axios from "axios";
import { serverUrl } from "../../url";
import { useLoader } from "../context/LoaderContext";

let setLoadingRef = null;

export const injectLoader = (setLoading) => {
    setLoadingRef = setLoading;
};

const api = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
});

// axiosInstance.js
api.interceptors.request.use((config) => {
    if (config.showLoader) {
        setLoadingRef?.(true, "Processing...");
    }
    return config;
});

api.interceptors.response.use(
    (res) => {
        setLoadingRef?.(false);
        return res;
    },
    (err) => {
        setLoadingRef?.(false);
        return Promise.reject(err);
    }
);



export default api;
