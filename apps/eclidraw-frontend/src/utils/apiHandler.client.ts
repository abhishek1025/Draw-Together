// src/lib/api.client.ts
"use client"

import { getAuthTokenFromCookie } from '@/utils/cookieHandler';
import AxiosInstanceNew from "@/config/axiosConfig";
import {ApiHandlerParams} from "@/iterfaces";

const axiosInstance = new AxiosInstanceNew(getAuthTokenFromCookie() ?? '')

export const clientGetRequest = (params: ApiHandlerParams) => {
    return axiosInstance.createRequest("get", params.endpoint);
};

export const clientPostRequest = (params: ApiHandlerParams) => {
    return axiosInstance.createRequest("post", params.endpoint, params.data);

};

export const clientPatchRequest = (params: ApiHandlerParams) => {
    return axiosInstance.createRequest("patch", params.endpoint, params.data);

};

export const clientDeleteRequest = (params: ApiHandlerParams) => {
    return axiosInstance.createRequest("get", params.endpoint, params.data);
};

export const clientPutRequest = (params: ApiHandlerParams) => {
    return axiosInstance.createRequest("get", params.endpoint, params.data);
};