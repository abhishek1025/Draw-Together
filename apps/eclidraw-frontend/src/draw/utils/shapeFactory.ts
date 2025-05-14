// src/shapes/shapeFactory.ts

import { ShapeType, ToolType, StrokeStyleType } from '@/interfaces';

interface ShapeFactoryProps {
  tool: ToolType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pencilStrokes?: number[][];
  style: {
    stroke: string;
    bgColor: string;
    strokeWidth: number;
    strokeStyle: StrokeStyleType;
  };
}

export function createShape({
  tool,
  startX,
  startY,
  endX,
  endY,
  pencilStrokes = [],
  style,
}: ShapeFactoryProps): ShapeType | null {
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  const common = {
    id: undefined,
    stroke: style.stroke,
    bgColor: style.bgColor,
    strokeWidth: style.strokeWidth,
    strokeStyle: style.strokeStyle,
    selected: false,
  };

  switch (tool) {
    case 'rect':
      return {
        type: 'rect',
        x,
        y,
        width,
        height,
        ...common,
      };

    case 'circle':
      return {
        type: 'circle',
        x,
        y,
        radiusX: Math.floor(width / 2),
        radiusY: Math.floor(height / 2),
        ...common,
      };

    case 'line':
    case 'arrow':
      return {
        type: tool,
        x: startX,
        y: startY,
        endX,
        endY,
        ...common,
      };

    case 'pencil':
      if (pencilStrokes.length < 20) return null;
      return {
        type: 'pencil',
        x: startX,
        y: startY,
        pencilCoordinates: pencilStrokes,
        ...common,
      };

    case 'diamond':
      return {
        type: 'diamond',
        x,
        y,
        width,
        height,
        ...common,
      };

    default:
      return null;
  }
}

