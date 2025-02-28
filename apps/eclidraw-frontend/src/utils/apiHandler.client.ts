// src/lib/api.client.ts
"use client"
import { getAuthTokenFromCookie } from '@/utils/cookieHandler';
import AxiosInstanceNew from "@/config/axiosConfig";
import {ApiHandlerParams} from "@/iterfaces";


export const clientGetRequest = (params: ApiHandlerParams) => {
    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", getAuthTokenFromCookie() ?? '')
    return axiosInstance.createRequest("get", params.endpoint);
};

export const clientPostRequest = (params: ApiHandlerParams) => {
    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", getAuthTokenFromCookie() ?? '')
    return axiosInstance.createRequest("post", params.endpoint, params.data);

};

export const clientPatchRequest = (params: ApiHandlerParams) => {
    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", getAuthTokenFromCookie() ?? '')
    return axiosInstance.createRequest("patch", params.endpoint, params.data);

};

export const clientDeleteRequest = (params: ApiHandlerParams) => {
    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", getAuthTokenFromCookie() ?? '')
    return axiosInstance.createRequest("get", params.endpoint, params.data);
};

export const clientPutRequest = (params: ApiHandlerParams) => {
    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", getAuthTokenFromCookie() ?? '')
    return axiosInstance.createRequest("get", params.endpoint, params.data);
};