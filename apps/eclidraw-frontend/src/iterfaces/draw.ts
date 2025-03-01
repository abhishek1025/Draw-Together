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
    radius: number;
}

export interface LineType {
    id?: string;
    type: 'line';
    x: number;
    y: number;
    endX: number;
    endY: number;
}

export type ShapeType = RectType | CircleType | LineType | PencilType ;

export type ToolType = 'circle' | 'rect' | 'pencil' | 'line' | 'eraser'
