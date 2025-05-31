import { ShapeType } from "@/interfaces";
import { selectShape, setLineType } from "@/draw/shape/common";

export const drawPencilStrokes = (params: {
  ctx: CanvasRenderingContext2D;
  shape: ShapeType;
  isActive: boolean;
}) => {
  const { ctx, shape, isActive } = params;

  if (shape.type !== "pencil") return;

  ctx.strokeStyle = shape.stroke; // Border color

  ctx.lineCap = "round";

  setLineType({
    ctx,
    strokeStyle: shape.strokeStyle,
  });

  ctx.lineWidth = shape.strokeWidth;

  if (!isActive) {
    ctx.moveTo(shape.x, shape.y);
  }

  shape.pencilStrokes.map(([x, y]) => {
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(shape.x, shape.y);

  if (shape.selected) {
    selectShape({
      ctx,
      ...getBoundingBoxFromStrokes(shape.pencilStrokes),
    });
  }
};

export function getBoundingBoxFromStrokes(strokes: number[][]) {
  const xs = strokes.map((p) => p[0]);
  const ys = strokes.map((p) => p[1]);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function isNearLine(
  lineStrokes: number[][],
  px: number,
  py: number,
  threshold: number = 5,
): boolean {
  for (let i = 0; i < lineStrokes.length - 1; i++) {
    const [x1, y1] = lineStrokes[i];
    const [x2, y2] = lineStrokes[i + 1];

    if (
      calculateDistanceBetweenPointAndLineSegment(px, py, x1, y1, x2, y2) <=
      threshold
    ) {
      return true; // Point is close enough to one of the segments
    }

    // Function to calculate distance from point (px, py) to a line segment (x1, y1) -> (x2, y2)
    function calculateDistanceBetweenPointAndLineSegment(
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ): number {
      const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

      if (lengthSquared === 0) return Math.hypot(px - x1, py - y1); // Single point case

      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lengthSquared;
      t = Math.max(0, Math.min(1, t)); // Clamp t between 0 and 1

      const closestX = x1 + t * (x2 - x1);
      const closestY = y1 + t * (y2 - y1);

      return Math.hypot(px - closestX, py - closestY); // Euclidean distance
    }
  }

  return false;
}
