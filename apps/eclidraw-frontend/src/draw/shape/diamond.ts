

export const drawDiamondShape = (params: {ctx: CanvasRenderingContext2D, x:number, y: number, width: number, height: number})=> {

    params.ctx.beginPath();

    params.ctx.moveTo(params.x, params.y - params.height / 2);

    // Right Edge
    params.ctx.lineTo(params.x + params.width / 2, params.y);

    // bottom edge
    params.ctx.lineTo(params.x, params.y + params.height / 2);

    // left edge
    params.ctx.lineTo(params.x - params.width / 2, params.y);

    // closing the path automatically creates
    params.ctx.closePath();

    params.ctx.stroke();
}

export const eraseDiamondShape  = (
    px: number,
    py: number,
    x: number,
    y: number,
    width: number,
    height: number,
    threshold: number = 5 // Margin for detecting near clicks
): boolean => {
    const dx = Math.abs(px - x) / (width / 2);
    const dy = Math.abs(py - y) / (height / 2);

    return dx + dy <= 1 + threshold / Math.min(width, height);
};
