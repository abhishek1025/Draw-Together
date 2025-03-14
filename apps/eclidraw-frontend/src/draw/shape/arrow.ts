
export const drawArrow = (params: {ctx: CanvasRenderingContext2D, x:number, y: number, endX: number, endY: number})=> {
    const headLength = 10; // length of head in pixels
    const dx = params.endX - params.x;
    const dy = params.endY - params.y;
    const angle = Math.atan2(dy, dx);

    params.ctx.beginPath();
    params.ctx.moveTo(params.x, params.y);
    params.ctx.lineTo(params.endX, params.endY);
    params.ctx.lineTo(params.endX - headLength * Math.cos(angle - Math.PI / 6), params.endY - headLength * Math.sin(angle - Math.PI / 6));
    params.ctx.moveTo(params.endX, params.endY);
    params.ctx.lineTo(params.endX - headLength * Math.cos(angle + Math.PI / 6), params.endY - headLength * Math.sin(angle + Math.PI / 6));
    params.ctx.closePath()
    params.ctx.stroke()
}