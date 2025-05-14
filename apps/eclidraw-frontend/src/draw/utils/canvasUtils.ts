import { ShapeType } from '@/interfaces';

import {
  rectShape,
  circleShape,
  pencilShape,
  lineShape,
  arrowShape,
  diamondShape,
  canvasText,
} from '../shape';

export function clearCanvasUtilFunc(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: ShapeType[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach(shape => {
    switch (shape.type) {
      case 'rect':
        rectShape.drawRect({ ctx, shape });
        break;
      case 'circle':
        circleShape.drawCircle({ ctx, shape });
        break;
      case 'line':
        lineShape.drawLine({ ctx, shape });
        break;
      case 'pencil':
        pencilShape.drawPencilStrokes({ ctx, shape, isActive: false });
        break;
      case 'arrow':
        arrowShape.drawArrow({ ctx, shape });
        break;
      case 'diamond':
        diamondShape.drawDiamondShape({ ctx, shape });
        break;
      case 'text':
        canvasText.writeTextInCanvas({ ctx, shape });
        break;
    }
  });
}

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




