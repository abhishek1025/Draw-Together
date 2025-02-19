'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string; id: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const [currentMsg, setCurrentMsg] = useState('');

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: 'join_room',
          roomId: id,
        })
      );

      socket.onmessage = event => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === 'chat') {
          setChats(c => [
            ...c,
            { message: parsedData.message, id: parsedData.senderId },
          ]);
        }
      };
    }

    return () => {
      socket?.close();
    };
  }, [socket, loading, id]);

  return (
    <div className='flex flex-col h-screen  p-4'>
      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto mb-4'>
        {chats.map((m, index) => (
          <div
            key={index}
            className='mb-2 p-3 rounded-lg shadow-sm max-w-[80%] break-words'>
            <span className='text-sm text-gray-700'>{m.message}</span>
          </div>
        ))}
      </div>

      {/* Input and Send Button */}
      <div className='flex gap-2'>
        <input
          type='text'
          value={currentMsg}
          onChange={e => setCurrentMsg(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={() => {
            if (currentMsg.trim() && socket) {
              socket.send(
                JSON.stringify({
                  type: 'chat',
                  roomId: id,
                  message: currentMsg,
                })
              );
              setCurrentMsg('');
            }
          }}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          Send
        </button>
      </div>
    </div>
  );
}

