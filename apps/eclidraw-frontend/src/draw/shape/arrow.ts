import { ShapeType } from "@/iterfaces";
import { setLineType } from "@/draw/shape/common";

export const drawArrow = (params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) => {
  const { ctx, shape } = params;

  if (shape.type !== "arrow") return;

  ctx.strokeStyle = shape.stroke; // Border color

  setLineType({
    ctx,
    strokeStyle: shape.strokeStyle,
  });

  ctx.lineWidth = shape.strokeWidth;

  const headLength = shape.strokeWidth * 10; // length of head in pixels
  const dx = shape.endX - shape.x;
  const dy = shape.endY - shape.y;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.lineTo(
    shape.endX - headLength * Math.cos(angle - Math.PI / 6),
    shape.endY - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.moveTo(shape.endX, shape.endY);
  ctx.lineTo(
    shape.endX - headLength * Math.cos(angle + Math.PI / 6),
    shape.endY - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.stroke();
};
