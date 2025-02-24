import axios, {AxiosError} from 'axios';
import {HTTP_SERVER_URL} from "../../config";
import {getAuthTokenFromCookie} from "@/utils/cookieHandler";

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
    baseURL: HTTP_SERVER_URL,
});

type ApiRequestParams = {
    // eslint-disable-next-line
    data?: any;
    endpoint: string;
}

// Request interceptor to attach token and modify config
axiosInstance.interceptors.request.use(
    async function (config) {
        // Retrieve token from cookies or any other storage
        const token = await getAuthTokenFromCookie();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // config.headers['Access-Control-Allow-Credentials'] = true;
        }

        // config.credentials = 'same-origin'; // Include credentials for cross-origin requests

        return config; // Return modified config
    },
    function (error) {
        return Promise.reject(error); // Handle request errors
    }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response, // Return response if successful
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            error.message =
                'Server is temporarily unavailable. Please try again in a few minutes.';
        }

        return Promise.reject(error); // Propagate error for further handling
    }
);

// Generic request handler
const request = async (method: 'post' | 'get' | 'patch' | 'delete' | 'put', endpoint: string, data = {}) => {
    try {
        const response = await axiosInstance.request({
            method,
            url: endpoint,
            data,
        });
        return { ...response.data, ok: true }; // Add an 'ok' property for easier handling
    } catch (error: unknown) {

        if ((error as AxiosError).response) {
            return (error as AxiosError)?.response?.data; // Return error response data
        }

        const message = error instanceof Error ? error.message : 'An unknown error occurred';

        throw new Error(message); // Throw error for further handling
    }
};

// Exported API request methods
export const getRequest = ({ endpoint }:ApiRequestParams) => request('get', endpoint);
export const postRequest = ({ endpoint, data }: ApiRequestParams) => {
    return request('post', endpoint, data);
};
export const patchRequest = ({ endpoint, data } : ApiRequestParams) =>
    request('patch', endpoint, data);
export const deleteRequest = ({ endpoint }: ApiRequestParams) => request('delete', endpoint);
export const putRquest = ({ endpoint, data } : ApiRequestParams) =>
    request('put', endpoint, data);
