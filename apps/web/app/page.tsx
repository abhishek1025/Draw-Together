'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='p-8 rounded-lg shadow-md'>
        <input
          type='text'
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder='Enter Room ID'
          className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <button
          onClick={() => router.push(`/room/${roomId}`)}
          className='w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          Join Room
        </button>
      </div>
    </div>
  );
}

