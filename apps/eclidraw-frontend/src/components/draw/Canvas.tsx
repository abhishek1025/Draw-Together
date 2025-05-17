'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Game } from '@/draw/Game';
import { ToolType } from '@/interfaces';
import TopBarCanvas from '@/components/draw/TopBarCanvas';
import { Chat, ActiveUsersList} from '@/components/chat';
import CanvasSidebar from '@/components/draw/CanvasSidebar';
import { useAppSelector } from '@/store/hooks';
import {MessageType} from "@repo/common/messageTypeConstant";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputBoxRef = useRef<HTMLTextAreaElement>(null);

  const [selectedTool, setSelectedTool] = useState<ToolType>('select');
  const [game, setGame] = useState<Game>();
  const [text, setText] = useState('');
  const { stroke, bgColor, strokeWidth, strokeStyle } = useAppSelector(
    state => state.canvas
  );

  const handleClickEventForTextBox = (e: MouseEvent) => {
    if (selectedTool !== 'text') {
      if (inputBoxRef.current) {
        inputBoxRef.current.style.display = 'none';
      }
      return;
    }

    if (inputBoxRef.current) {
      inputBoxRef.current.style.display = 'block';
      inputBoxRef.current.style.top = e.clientY.toString() + 'px';
      inputBoxRef.current.style.left = e.clientX.toString() + 'px';
      inputBoxRef.current.focus();

      setSelectedTool('select');
    }
  };

  const textInputFocusOutHandler = (e: FocusEvent) => {
    const { height, width, top, left } = (
      e.target as HTMLElement
    ).getBoundingClientRect();

    socket.send(
      JSON.stringify({
        type: MessageType.CHAT_DRAW,
        roomId: roomId,
        message: JSON.stringify({
          type: 'text',
          x: left,
          y: top + 6,
          height: height - 10,
          width: width,
          text,
          stroke,
        }),
      })
    );

    setText('');
  };

  const clearCanvas = () => {
    socket.send(JSON.stringify({
      type: MessageType.DELETE_DRAWS,
      roomId: roomId,
    }))
  }

  useEffect(() => {
    if (canvasRef.current && inputBoxRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroyMouseHandlers();
      };
    }
  }, [canvasRef]);

  useEffect(() => {
    game?.setTool(selectedTool);

    const canvas = canvasRef.current;

    if (!canvas) return;

    game?.resetSelectedShape();

    switch (selectedTool) {
      case 'eraser':
        canvas.style.cursor = `url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='10'%20height='10'%20viewBox='0%200%2040%2040'%3E%3Ccircle%20cx='20'%20cy='20'%20r='18'%20fill='none'%20stroke='white'%20stroke-width='4'/%3E%3C/svg%3E") 20 20, auto`;
        break;
      case 'select':
        canvas.style.cursor = 'auto';
        break;

      case 'text':
        canvas.style.cursor = 'text';
        break;

      default:
        canvas.style.cursor = 'crosshair'; // Default cursor for other tools
    }
  }, [selectedTool, game]);

  useEffect(() => {
    canvasRef?.current?.addEventListener('click', handleClickEventForTextBox);
    canvasRef?.current?.addEventListener('focusout', textInputFocusOutHandler);

    return () => {
      canvasRef?.current?.removeEventListener(
        'click',
        handleClickEventForTextBox
      );
      canvasRef?.current?.removeEventListener(
        'focusout',
        textInputFocusOutHandler
      );
    };
  }, [canvasRef, selectedTool]);

  useEffect(() => {
    if (inputBoxRef.current) {
      inputBoxRef.current.style.height =
        Math.max(50, inputBoxRef.current.scrollHeight).toString() + 'px';
      inputBoxRef.current.style.width =
        Math.max(50, inputBoxRef.current.scrollWidth).toString() + 'px';
    }

    inputBoxRef?.current?.addEventListener(
      'focusout',
      textInputFocusOutHandler
    );

    return () => {
      inputBoxRef?.current?.removeEventListener(
        'focusout',
        textInputFocusOutHandler
      );
    };
  }, [text]);

  useEffect(() => {
   game?.setStyle({
     stroke,
     bgColor,
     strokeStyle,
     strokeWidth
   })
  }, [stroke, bgColor, strokeWidth, strokeStyle, game]);

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <TopBarCanvas
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        clearCanvas={clearCanvas}
      />

      <textarea
        className={`bg-transparent border-none absolute caret-white resize-none focus:outline-none overflow-hidden hidden`}
        style={{
          color: stroke,
        }}
        ref={inputBoxRef}
        value={text}
        onChange={e => {
          setText(e.target.value);
        }}
        wrap='off'
      />

      <ActiveUsersList ws={socket} roomId={roomId} />

      <CanvasSidebar />

      <Chat socket={socket} roomId={roomId} />
    </div>
  );
}

