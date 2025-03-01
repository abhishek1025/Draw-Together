import {ToolType} from "@/iterfaces";
import {IconButton} from "@/components/draw/IconButton";
import {Circle, Eraser, Minus, Pencil, Square} from "lucide-react";
import React from "react";

export default function TopBarCanvas(params: { selectedTool: ToolType, setSelectedTool: (s: ToolType) => void }) {

    const {selectedTool, setSelectedTool} = params;

    return (<div className="fixed top-[5%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div className="text-white flex gap-4 bg-gray-700 p-1 rounded">
            <IconButton
                icon={<Pencil height="20px"/>}
                onClick={() => {
                    setSelectedTool('pencil')
                }}
                activated={selectedTool === 'pencil'}
            />

            <IconButton icon={<Square  height="20px"/>} onClick={() => {
                setSelectedTool('rect')
            }} activated={selectedTool === 'rect'}/>

            <IconButton icon={<Circle height="20px"/>}  onClick={() => {
                setSelectedTool('circle')
            }} activated={selectedTool === 'circle'}/>

            <IconButton icon={<Minus height="20px"/>}  onClick={() => {
                setSelectedTool('line')
            }} activated={selectedTool === 'line'}/>

            <IconButton icon={<Eraser height="20px"/>}  onClick={() => {
                setSelectedTool('eraser')
            }} activated={selectedTool === 'eraser'}/>
        </div>
    </div>)
}