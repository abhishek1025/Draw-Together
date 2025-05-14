import { WebSocket } from 'ws';
import { userManager } from '../state/userManager';

export function joinRoom(roomId: string, ws: WebSocket) {
  userManager.joinRoom({
    ws,
    roomId,
  });
}

export function leaveRoom(roomId: string, ws: WebSocket) {
  userManager.leaveRoom({
    ws,
    roomId,
  });
}

