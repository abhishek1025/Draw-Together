import { WebSocket } from 'ws';
import { joinRoom, leaveRoom } from './room';
import { deleteChat, sendChatMessage } from './chat';

export function messageRouter(ws: WebSocket, userId: string, raw: any) {
  const parsedData = JSON.parse(raw);

  switch (parsedData.type) {
    case 'join_room':
      joinRoom(parsedData.roomId, ws);
      break;

    case 'leave_room':
      leaveRoom(parsedData.roomId, ws);
      break;

    case 'erase_draw':
      deleteChat(parsedData);
      break;

    case 'chat_draw':
      sendChatMessage(parsedData, userId);
      break;

    case 'chat_message':
      sendChatMessage(parsedData, userId);
      break;

    default:
      console.error('Unknown message type:', parsedData.type);
      break;
  }
}

