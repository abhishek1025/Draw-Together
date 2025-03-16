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
