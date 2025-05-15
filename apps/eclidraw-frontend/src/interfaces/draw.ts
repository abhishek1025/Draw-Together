export type StrokeStyleType = 'dashed' | 'dotted' | 'solid';

interface CommonShapeTypes {
  id: string | undefined;
  x: number;
  y: number;
  stroke: string;
  bgColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyleType;
  selected: boolean;
}

export interface PencilType extends CommonShapeTypes {
  type: 'pencil';
  pencilStrokes: number[][];
}

export interface RectType extends CommonShapeTypes {
  type: 'rect';
  width: number;
  height: number;
}

export interface CircleType extends CommonShapeTypes {
  type: 'circle';
  radiusX: number;
  radiusY: number;
}

export interface LineType extends CommonShapeTypes {
  type: 'line';
  endX: number;
  endY: number;
}

export interface ArrowType extends CommonShapeTypes {
  type: 'arrow';
  endX: number;
  endY: number;
}

export interface DiamondType extends CommonShapeTypes {
  type: 'diamond';
  width: number;
  height: number;
}

export interface CanvasTextType extends CommonShapeTypes {
  type: 'text';
  text: string;
  height: number;
  width: number;
}

export type ShapeType =
  | RectType
  | CircleType
  | LineType
  | PencilType
  | ArrowType
  | DiamondType
  | CanvasTextType;

export type ToolType =
  | 'circle'
  | 'rect'
  | 'pencil'
  | 'line'
  | 'eraser'
  | 'select'
  | 'diamond'
  | 'arrow'
  | 'text'
  | 'image';

