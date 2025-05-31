"use server";

import { ApiHandlerParams } from "@/interfaces";
import AxiosInstanceNew from "@/config/axiosConfig";
import { cookies } from "next/headers";

export const serverGetRequest = async (params: ApiHandlerParams) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const axiosInstance = new AxiosInstanceNew(token);

  return axiosInstance.createRequest("get", params.endpoint);
};
