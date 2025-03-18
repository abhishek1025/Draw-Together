import { StrokeStyleType } from "@/iterfaces";

export const setLineType = ({
  ctx,
  strokeStyle,
}: {
  ctx: CanvasRenderingContext2D;
  strokeStyle: StrokeStyleType;
}) => {
  if (strokeStyle === "dashed") {
    ctx.setLineDash([10, 5]); // Dashed line (10px dash, 5px gap)
  } else if (strokeStyle === "dotted") {
    ctx.setLineDash([2, 5]); // Dotted line (2px dot, 5px gap)
  } else {
    ctx.setLineDash([]); // Solid line (no dash)
  }
};

export const selectShape = ({
  x,
  y,
  height,
  width,
  ctx,
}: {
  x: number;
  y: number;
  height: number;
  width: number;
  ctx: CanvasRenderingContext2D;
}) => {
  x = x - 10;
  y = y - 10;
  width = width + 20;
  height = height + 20;

  ctx.setLineDash([5, 4]); // Dotted line (2px dot, 5px gap)

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#4F45E4";
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "#4F45E4";

  const radius = 7;

  // Left Top Corner Circle
  drawCircle({
    x,
    y,
    radius,
    ctx,
  });

  // Right Top Corner Circle
  drawCircle({
    x: x + width,
    y,
    radius,
    ctx,
  });

  // Right Bottom Corner Circle
  drawCircle({
    x: x + width,
    y: y + height,
    radius,
    ctx,
  });

  // Left Bottom Corner Circle
  drawCircle({
    x: x,
    y: y + height,
    radius,
    ctx,
  });
};

const drawCircle = ({
  x,
  y,
  radius,
  ctx,
}: {
  x: number;
  y: number;
  radius: number;
  ctx: CanvasRenderingContext2D;
}) => {
  ctx.beginPath();

  ctx.setLineDash([]); // Solid line (no dash)

  ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
};
