export interface PencilType {
    id?: string;
    type: 'pencil';
    x: number;
    y: number;
    pencilCoordinates: number[][];
}

export interface RectType {
    id?: string;
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CircleType {
    id?: string;
    type: 'circle';
    centerY: number;
    centerX: number;
    radiusX: number;
    radiusY: number;
}

export interface LineType {
    id?: string;
    type: 'line';
    x: number;
    y: number;
    endX: number;
    endY: number;
}

export interface ArrowType {
    id?: string;
    type: 'arrow';
    x: number;
    y: number;
    endX: number;
    endY: number;
}

export interface DiamondType {
    id?: string;
    type: 'diamond';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CanvasTextType {
    id?: string;
    type: 'text';
    x: number;
    y: number;
    text: string;
    height: number;
    width: number;
}

export type ShapeType = RectType | CircleType | LineType | PencilType | ArrowType | DiamondType | CanvasTextType;

export type ToolType = 'circle' | 'rect' | 'pencil' | 'line' | 'eraser' | 'select' | 'diamond' | 'arrow' | 'text' | 'image'
