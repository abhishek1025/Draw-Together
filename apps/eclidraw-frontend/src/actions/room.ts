import { serverGetRequest } from "@/utils";
import { Room } from "@/interfaces";

export async function fetchAllRooms(): Promise<Room[]> {
  const response = await serverGetRequest({
    endpoint: "/rooms",
  });

  return response.data;
}
