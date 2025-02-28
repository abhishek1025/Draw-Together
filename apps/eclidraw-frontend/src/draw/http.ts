import axios from "axios";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_SERVER_URL}/chats/room/${roomId}`);

    const message = res.data.data;

    // @ts-ignore
    const shapes = message.map(x => {
        const messageData = JSON.parse(x.message);

        return messageData;
    });

    return shapes;
}
