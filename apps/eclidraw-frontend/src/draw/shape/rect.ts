import { ShapeType } from "@/iterfaces";
import { setLineType } from "@/draw/shape/common";

export function drawRect(params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) {
  const { ctx, shape } = params;

  if (shape.type === "rect") {
    ctx.fillStyle = shape.bgColor; // Transparent fill
    ctx.strokeStyle = shape.stroke; // Border color

    setLineType({
      ctx,
      strokeStyle: shape.strokeStyle,
    });
    ctx.lineWidth = shape.strokeWidth;

    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  }
}

export function eraseRect(
  xStart: number,
  yStart: number,
  width: number,
  height: number,
  px: number,
  py: number,
): boolean {
  return (
    px >= xStart &&
    px <= xStart + width &&
    py >= yStart &&
    py <= yStart + height
  );
}
