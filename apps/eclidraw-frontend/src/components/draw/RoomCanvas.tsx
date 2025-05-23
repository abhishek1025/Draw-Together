"use client";

import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { getAuthTokenFromCookie } from "@/utils";

export default function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_SERVER_URL}?token=${getAuthTokenFromCookie()}`,
    );

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
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
