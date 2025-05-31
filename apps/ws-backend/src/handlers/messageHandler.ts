import { WebSocket } from "ws";
import { joinRoom, leaveRoom } from "./room";
import {
  deleteAllDraws,
  deleteChat,
  sendChatMessage,
  updateDraw,
} from "./chat";
// @ts-ignore
import { MessageType } from "@repo/common/messageTypeConstant";

export function messageRouter(ws: WebSocket, userId: string, raw: any) {
  const parsedData = JSON.parse(raw);

  console.log(parsedData);

  switch (parsedData.type) {
    case MessageType.JOIN_ROOM:
      joinRoom(parsedData.roomId, ws);
      break;

    case MessageType.LEAVE_ROOM:
      leaveRoom(parsedData.roomId, ws);
      break;

    case MessageType.ERASE_DRAW:
      deleteChat(parsedData);
      break;

    case MessageType.CHAT_DRAW:
      sendChatMessage(parsedData, userId);
      break;

    case MessageType.CHAT_MESSAGE:
      sendChatMessage(parsedData, userId);
      break;

    case MessageType.UPDATE_SHAPE:
      updateDraw(parsedData);
      break;

    case MessageType.DELETE_DRAWS:
      deleteAllDraws(parsedData);
      break;

    default:
      console.error("Unknown message type:", parsedData.type);
      break;
  }
}
