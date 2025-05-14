import { WebSocket } from 'ws';
import { joinRoom, leaveRoom } from './room';
import { deleteChat, sendChatMessage } from './chat';
import { MessageType } from '@repo/common/messageTypeConstant';

export function messageRouter(ws: WebSocket, userId: string, raw: any) {
  const parsedData = JSON.parse(raw);

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

    default:
      console.error('Unknown message type:', parsedData.type);
      break;
  }
}

