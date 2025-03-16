import { clientGetRequest } from "@/utils";
import { ShapeType } from "@/iterfaces";

export async function getExistingShapes(
  roomId: string,
  chatType: "draw" | "message" = "draw",
) {
  const res = await clientGetRequest({
    endpoint: `/chats/room/${roomId}?chatType=${chatType}`,
  });

  const messages = res.data;

  if (chatType === "draw") {
    // @ts-ignore
    const shapes: ShapeType[] = messages?.map((x) => {
      const messageData: ShapeType = JSON.parse(x.message);
      return { id: x.id, ...messageData };
    });

    return shapes ?? [];
  }

  // @ts-ignore
  return messages;
}
