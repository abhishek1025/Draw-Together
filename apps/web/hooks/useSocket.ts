import { useEffect, useState } from 'react';
import { WS_SERVER_URL } from '../app/config';

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_SERVER_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYzgyNThmYS1lNGMyLTRjNWUtYTczZS1lZGIxZGY2MzQ4M2YiLCJpYXQiOjE3Mzk4MTU1OTMsImV4cCI6MTc0MDQyMDM5M30.KzGKs8yc7l3uwoPblSn4HALscE0oHf2KnBWAnIpBrYA`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}

