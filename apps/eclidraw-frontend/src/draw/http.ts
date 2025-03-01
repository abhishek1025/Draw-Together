import {clientGetRequest} from "@/utils";
import {ShapeType} from "@/iterfaces";

export async function getExistingShapes(roomId: string) {
    const res = await clientGetRequest({
        endpoint: `/chats/room/${roomId}?chatType=draw`
    })

    const message = res.data;

    // @ts-ignore
    const shapes: ShapeType[] = message?.map(x => {
        const messageData = JSON.parse(x.message);
        return {id: x.id, ...messageData};
    });

    return shapes ?? [];
}
