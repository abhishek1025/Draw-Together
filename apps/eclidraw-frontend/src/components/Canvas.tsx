'use client';

import { useEffect, useRef, useState} from 'react';
import {Circle, Pencil, RectangleHorizontalIcon} from "lucide-react";
import {Game} from "@/draw/Game";

export type Tool = 'circle' | 'rect' | 'pencil'

export default function Canvas({
                                   roomId,
                                   socket,
                               }: {
    roomId: string;
    socket: WebSocket;
}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>('circle');
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

            <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

        </div>
    );
}

function TopBar(params: { selectedTool: Tool, setSelectedTool: (s: Tool) => void }) {

    const {selectedTool, setSelectedTool} = params;

    return (<div style={{
        position: 'fixed',
        top: 0,
        left: 0,
    }}>
        <div className="text-white flex gap-4">
            <IconButton icon={<Pencil/>} onClick={() => {
                setSelectedTool('pencil')
            }} activated={selectedTool === 'pencil'}/>

            <IconButton icon={<RectangleHorizontalIcon/>} onClick={() => {
                setSelectedTool('rect')
            }} activated={selectedTool === 'rect'}/>

            <IconButton icon={<Circle/>} onClick={() => {
                setSelectedTool('circle')
            }} activated={selectedTool === 'circle'}/>
        </div>
    </div>)
}

// @ts-ignore
export function IconButton({icon, onClick, activated}: {
    icon: React.ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return <div
        className={`pointer rounded full border p-2 bg-black hover:bg-gray ${activated ? 'text-red-600' : 'text-white'}`} onClick={onClick}>
        {icon}
    </div>
}