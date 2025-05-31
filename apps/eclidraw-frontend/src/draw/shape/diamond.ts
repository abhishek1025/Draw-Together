import { ShapeType } from "@/interfaces";
import { selectShape, setLineType } from "@/draw/shape/common";

export const drawDiamondShape = (params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) => {
  const { ctx, shape } = params;

  if (shape.type !== "diamond") return;

  ctx.fillStyle = shape.bgColor; // Transparent fill
  ctx.strokeStyle = shape.stroke; // Border color
  setLineType({
    ctx,
    strokeStyle: shape.strokeStyle,
  });
  ctx.lineWidth = shape.strokeWidth;

  ctx.beginPath();

  ctx.moveTo(shape.x, shape.y - shape.height / 2);

  // Right Edge
  ctx.lineTo(shape.x + shape.width / 2, shape.y);

  // bottom edge
  ctx.lineTo(shape.x, shape.y + shape.height / 2);

  // left edge
  ctx.lineTo(shape.x - shape.width / 2, shape.y);

  // closing the path automatically creates
  ctx.closePath();

  ctx.stroke();
  ctx.fill();

  if (shape.selected) {
    selectShape({
      x: shape.x - shape.width / 2,
      y: shape.y - shape.height / 2,
      ctx,
      height: shape.height,
      width: shape.width,
    });
  }
};

export const isNearDiamond = (
  px: number,
  py: number,
  x: number,
  y: number,
  width: number,
  height: number,
  threshold: number = 5, // Margin for detecting near clicks
): boolean => {
  const dx = Math.abs(px - x) / (width / 2);
  const dy = Math.abs(py - y) / (height / 2);

  return dx + dy <= 1 + threshold / Math.min(width, height);
};
