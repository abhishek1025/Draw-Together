"use server"

import {ApiHandlerParams} from "@/iterfaces";
import AxiosInstanceNew from "@/config/axiosConfig";
import {cookies} from "next/headers";


export const serverGetRequest = async (params: ApiHandlerParams) => {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value || "";

    const axiosInstance = new AxiosInstanceNew(process.env?.NEXT_PUBLIC_HTTP_SERVER_URL || "", token)

    return axiosInstance.createRequest("get", params.endpoint);
};

