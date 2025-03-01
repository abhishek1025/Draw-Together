'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Game} from "@/draw/Game";
import {ToolType} from "@/iterfaces";
import TopBarCanvas from "@/components/draw/TopBarCanvas";

export default function Canvas({
                                   roomId,
                                   socket,
                               }: {
    roomId: string;
    socket: WebSocket;
}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<ToolType>('circle');
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g)

            return () => {
                g.destroyMouseHandlers();
            }
        }


    }, [canvasRef]);

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);


    return (
        <div style={{
            height: '100vh',
            overflow: 'hidden',
        }}>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />

            <TopBarCanvas selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>

        </div>
    );
}


