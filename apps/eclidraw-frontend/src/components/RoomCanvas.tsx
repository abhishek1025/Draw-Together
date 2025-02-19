'use client';

import { useEffect, useState } from 'react';
import { WS_SERVER_URL } from '../../config';
import Canvas from './Canvas';

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_SERVER_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMmYxYmI5NC01MTA2LTRlMzUtYjUwNC1mNWI2ZjFjMDdiNmUiLCJpYXQiOjE3Mzk5ODkzOTAsImV4cCI6MTc0MDU5NDE5MH0.H8GThwE8TCbAaaOwkOEbYgF7zRC6fcBO8jspv3ELUlY`
    );

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: 'join_room',
          roomId,
        })
      );
    };
  }, []);

  if (!socket) return <div> Connecting to the server..... </div>;

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}


