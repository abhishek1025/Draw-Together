export function drawCircle(params: {ctx: CanvasRenderingContext2D ,centerX: number, centerY: number, radiusX: number, radiusY: number}) {
    params.ctx.beginPath();

    params.ctx.ellipse(params.centerX, params.centerY, params.radiusX, params.radiusY, 0, 0, Math.PI * 2)
    params.ctx.stroke()

    params.ctx.closePath();
}

export function eraseCircle(
    xStart: number,
    yStart: number,
    radiusX: number,
    radiusY: number,
    px: number,
    py: number
) {
    return ((px - xStart) ** 2) / (radiusX ** 2) + ((py - yStart) ** 2) / (radiusY ** 2) <= 1;
}
