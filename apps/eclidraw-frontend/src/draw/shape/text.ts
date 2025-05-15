import { ShapeType } from '@/interfaces';
import {selectShape} from "@/draw/shape/common";

type paramsType = {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
};

export const writeTextInCanvas = (params: paramsType) => {
  const { ctx, shape } = params;

  if (shape.type !== 'text') return;

  const textArr = shape.text.split('\n');

  ctx.lineWidth = shape.strokeWidth;

  ctx.font = '16px Arial';
  ctx.fillStyle = shape.stroke;
  ctx.textBaseline = 'top';

  for (let i = 0; i < textArr.length; i++) {
    ctx.fillText(textArr[i], shape.x, shape.y + 23 * i);
  }

  if (shape.selected) {
    selectShape({
      x: shape.x ,
      y: shape.y,
      ctx,
      height: shape.height,
      width: shape.width,
    });
  }
};

