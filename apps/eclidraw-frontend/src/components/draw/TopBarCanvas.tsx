import { ToolType } from '@/interfaces';
import { IconButton } from '@/components/draw/IconButton';
import {
  ArrowRightIcon,
  Circle,
  DiamondIcon,
  Eraser,
  Minus,
  MousePointer,
  Pencil,
  Square,
  TypeIcon,
} from 'lucide-react';
import React from 'react';

export default function TopBarCanvas(params: {
  selectedTool: ToolType;
  setSelectedTool: (s: ToolType) => void;
}) {
  const { selectedTool, setSelectedTool } = params;

  return (
    <div className='fixed top-[5%] left-[50%] -translate-x-[50%] -translate-y-[50%]'>
      <div className='text-white flex gap-4 bg-gray-700 px-2 py-1 rounded'>
        <IconButton
          icon={<MousePointer height='15px' />}
          onClick={() => {
            setSelectedTool('select');
          }}
          activated={selectedTool === 'select'}
        />

        <IconButton
          icon={<Square height='15px' />}
          onClick={() => {
            setSelectedTool('rect');
          }}
          activated={selectedTool === 'rect'}
        />

        {/* TODO: Not Implemented */}
        <IconButton
          icon={<DiamondIcon height='15px' />}
          onClick={() => {
            setSelectedTool('diamond');
          }}
          activated={selectedTool === 'diamond'}
        />

        <IconButton
          icon={<Circle height='15px' />}
          onClick={() => {
            setSelectedTool('circle');
          }}
          activated={selectedTool === 'circle'}
        />

        <IconButton
          icon={<ArrowRightIcon height='15px' />}
          onClick={() => {
            setSelectedTool('arrow');
          }}
          activated={selectedTool === 'arrow'}
        />

        <IconButton
          icon={<Minus height='15px' />}
          onClick={() => {
            setSelectedTool('line');
          }}
          activated={selectedTool === 'line'}
        />

        <IconButton
          icon={<Pencil height='15px' />}
          onClick={() => {
            setSelectedTool('pencil');
          }}
          activated={selectedTool === 'pencil'}
        />

        <IconButton
          icon={<TypeIcon height='15px' />}
          onClick={() => {
            setSelectedTool('text');
          }}
          activated={selectedTool === 'text'}
        />

        <IconButton
          icon={<Eraser height='15px' />}
          onClick={() => {
            setSelectedTool('eraser');
          }}
          activated={selectedTool === 'eraser'}
        />
      </div>
    </div>
  );
}

