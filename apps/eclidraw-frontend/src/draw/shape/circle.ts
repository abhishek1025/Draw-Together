export function drawCircle(params: {ctx: CanvasRenderingContext2D ,centerX: number, centerY: number, radius: number}) {
    params.ctx.beginPath();

    params.ctx.arc(params.centerX, params.centerY, Math.abs(params.radius), 0, Math.PI * 2)
    params.ctx.stroke()

    params.ctx.closePath();
}

export function eraseCircle(xStart: number, yStart: number, radius:number, px:number, py:number) {
    return Math.sqrt((px-xStart) ** 2 + (py - yStart) ** 2) < radius;
}
