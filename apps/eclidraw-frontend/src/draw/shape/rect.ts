
export function drawRect(params: {ctx: CanvasRenderingContext2D, x: number; y: number; width: number; height: number}) {
    params.ctx.strokeRect(params.x, params.y, params.width, params.height);
}

export function eraseRect(
    xStart: number,
    yStart: number,
    width: number,
    height: number,
    px: number,
    py: number
): boolean {
    return px >= xStart &&
        px <= xStart + width &&
        py >= yStart &&
        py <= yStart + height;
}