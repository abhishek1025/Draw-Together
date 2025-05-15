import { ShapeType } from '@/interfaces';
import {selectShape, setLineType} from '@/draw/shape/common';
import {calculateBounds} from "@/draw/utils/canvasUtils";

export function drawLine(params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
}) {
  const { ctx, shape } = params;

  if (shape.type !== 'line') return;

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

  const { height, width, x, y } = calculateBounds(shape.x, shape.y, shape.endX, shape.endY);

  if (shape.selected) {

    selectShape({
      ctx,
      height,
      width,
      x: x-2,
      y:y-2
    })

  }
}

