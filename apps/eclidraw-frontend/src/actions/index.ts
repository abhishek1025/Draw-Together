import {serverGetRequest} from "@/utils";

export async function fetchRooms(): Promise<void> {


    const response = await serverGetRequest({
        endpoint: '/rooms',
    })

    return  response.data;
}