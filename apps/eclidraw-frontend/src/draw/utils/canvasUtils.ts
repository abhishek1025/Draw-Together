

export const calculateBounds = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);

  return { width, height, x, y };
};

export const fillBackground = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  color = 'rgb(0, 0, 0)'
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};




