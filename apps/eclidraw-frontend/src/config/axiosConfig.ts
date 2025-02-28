// src/lib/api.ts
import axios, { AxiosInstance } from 'axios';
import {HTTP_SERVER_URL} from "@/config/config";

export default class AxiosInstanceNew {
    private axiosInstance: AxiosInstance | null = null;

    constructor(baseUrl: string, token?: string) {

        if (!this.axiosInstance && baseUrl) {
            this.axiosInstance = this.createAxiosInstance(token);
        }
    }

    private createAxiosInstance(token?: string): AxiosInstance {

        const instance = axios.create({
            baseURL: HTTP_SERVER_URL,
            withCredentials: true,
        });

        // Request interceptor
        instance.interceptors.request.use(
            async function (config) {
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    config.headers['Access-Control-Allow-Credentials'] = true;
                }
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.code === 'ERR_NETWORK') {
                    error.message = 'Server unavailable. Please try again later.';
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }

    createRequest = async (
        method: 'get' | 'post' | 'patch' | 'delete' | 'put',
        endpoint: string,
        data = {}
    ) => {

        try {
            const response = await this.axiosInstance?.request({
                method,
                url: endpoint,
                data,
            });

            if (!response) {
                throw new Error('Unable to retrieve the response from the server.');
            }

            return { ...response.data, ok: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(message);
        }
    };
}