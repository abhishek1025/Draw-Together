import { ShapeType } from "@/iterfaces";
import {selectShape, setLineType} from "@/draw/shape/common";

export function drawCircle(params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) {
  const { ctx, shape } = params;

  if (shape.type !== "circle") return;

  ctx.fillStyle = shape.bgColor; // Transparent fill
  ctx.strokeStyle = shape.stroke; // Border color
  setLineType({
    ctx,
    strokeStyle: shape.strokeStyle,
  });
  ctx.lineWidth = shape.strokeWidth;

  ctx.beginPath();

  ctx.ellipse(
    shape.x + shape.radiusX,
    shape.y + shape.radiusY,
    shape.radiusX,
    shape.radiusY,
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  if(shape.selected){
    selectShape({
      x: shape.x,
      y: shape.y,
      ctx,
      width: shape.radiusX * 2,
      height: shape.radiusY * 2,
    })
  }
}

export function isNearCircle(
  xStart: number,
  yStart: number,
  radiusX: number,
  radiusY: number,
  px: number,
  py: number,
) {

  xStart = xStart + radiusX;
  yStart = yStart + radiusY;

  return (
    (px - xStart) ** 2 / radiusX ** 2 + (py - yStart) ** 2 / radiusY ** 2 <= 1
  );
}
