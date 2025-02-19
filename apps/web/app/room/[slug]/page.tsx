import React from 'react';
import { HTTP_SERVER_URL } from '../../config';
import axios from 'axios';
import { ChatRoom } from '../../../components/ChatRoom';

async function getRoomId(slug: string) {
  const response = await axios.get(`${HTTP_SERVER_URL}/rooms/slug/${slug}`);
  console.log(response);
  return response.data.data.id;
}

const ChatRoom1 = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  return (
    <div>
      <ChatRoom roomId={roomId}></ChatRoom>
    </div>
  );
};

export default ChatRoom1;

