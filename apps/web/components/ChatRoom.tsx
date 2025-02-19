import axios from 'axios';
import { HTTP_SERVER_URL } from '../app/config';
import { ChatRoomClient } from './ChatRoomClient';

async function getChats(roomId: string) {
  const response = await axios.get(`${HTTP_SERVER_URL}/chats/room/${roomId}`);
  return response.data.data;
}

export async function ChatRoom({ roomId }: { roomId: string }) {
  const messages = await getChats(roomId);

  return <ChatRoomClient messages={messages} id={roomId}></ChatRoomClient>;
}

