import { serverGetRequest } from "@/utils";
import { Room } from "@/iterfaces";

export async function fetchAllRooms(): Promise<Room[]> {
  const response = await serverGetRequest({
    endpoint: "/rooms",
  });

  return response.data;
}
