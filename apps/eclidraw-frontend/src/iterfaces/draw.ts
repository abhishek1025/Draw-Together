export type ShapeType =
    {
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
    } | {
    type: 'circle';
    centerY: number;
    centerX: number;
    radius: number;
} | {
    type: 'pencil';
    x: number;
    y: number;
    pencilCoordinates: number[][];
} | {
    type: 'line';
    x: number;
    y: number;
    endX: number;
    endY: number;
};

export type ToolType = 'circle' | 'rect' | 'pencil' | 'line' | 'eraser'
