import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prismaClient } from '@repo/db/prismaClient';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

const validateJwtToken = (token: string): string | null => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');

  if (typeof decoded === 'string') return null;

  return (decoded as JwtPayload).userId;
};

// TODO: Add rate restriction, Queue, and Optimize state management

wss.on('connection', function connection(ws, request) {
  const url = request.url;

  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const userId = validateJwtToken(queryParams.get('token') ?? '');

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === 'join_room') {
      const user = users.find(x => x.ws === ws);

      // TODO: check if room exists or not

      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === 'leave_room') {
      const user = users.find(x => x.ws === ws);

      if (!user) return;

      user.rooms = user.rooms.filter(x => x === parsedData.roomId);
    }

    if (parsedData.type === 'chat') {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: 'chat',
              message,
              roomId,
            })
          );
        }
      });
    }
  });
});

