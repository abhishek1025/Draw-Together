
export function drawLine (params: {ctx: CanvasRenderingContext2D, x:number, y: number, endX: number, endY: number}) {
    params.ctx.beginPath();
    params.ctx.moveTo(params.x, params.y);
    params.ctx.lineTo(params.endX, params.endY);
    params.ctx.stroke()
}
