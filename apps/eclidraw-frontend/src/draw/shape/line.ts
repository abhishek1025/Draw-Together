import { ShapeType } from "@/iterfaces";
import { setLineType } from "@/draw/shape/common";

export function drawLine(params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) {
  const { ctx, shape } = params;

  if (shape.type !== "line") return;

  ctx.strokeStyle = shape.stroke; // Border color
  setLineType({
    ctx,
    strokeStyle: shape.strokeStyle,
  });

  ctx.lineWidth = shape.strokeWidth;

  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.stroke();
}
