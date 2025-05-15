import { WebSocketServer } from 'ws';
import { userManager } from './state/userManager';
import { validateJwtToken } from './utils';
import { messageRouter } from './handlers/messageHandler';

const wss = new WebSocketServer({ port: 8080 });

// TODO: Add rate restriction, Queue, and Optimize state management

wss.on('connection', function connection(ws, request) {
  const url = request.url;

  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);

  const userId = validateJwtToken(queryParams.get('token') ?? '');

  console.log(userId)

  if (!userId) {
    ws.close();
    return;
  }

  // Adding user to the user manager
  userManager.addUser({ userId, ws });

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    messageRouter(ws, userId, data);
  });
});

