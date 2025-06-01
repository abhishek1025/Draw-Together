import { ShapeType } from "@/interfaces";
import {
  arrowShape,
  canvasText,
  circleShape,
  diamondShape,
  lineShape,
  pencilShape,
  rectShape,
} from "./shape";
import {ShapeManager} from "@/draw/ShapeManager";

export class CanvasManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly shapeManager: ShapeManager;

  constructor(canvas: HTMLCanvasElement, shapeManager: ShapeManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.shapeManager = shapeManager;
  }

  clearCanvas(shapes: ShapeType[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    shapes.forEach((shape) => {
      this.drawShape(shape);
    });
  }

  drawShape(shape: ShapeType, isPencilActive: boolean = false) {
    const commonProps = {
      ctx: this.ctx,
      shape,
    };

    switch (shape.type) {
      case "circle":
        circleShape.drawCircle(commonProps);
        break;
      case "rect":
        rectShape.drawRect(commonProps);
        break;
      case "line":
        lineShape.drawLine(commonProps);
        break;
      case "arrow":
        arrowShape.drawArrow(commonProps);
        break;
      case "pencil":
        pencilShape.drawPencilStrokes({ ...commonProps, isActive: isPencilActive });
        break;
      case "diamond":
        diamondShape.drawDiamondShape(commonProps);
        break;
      case "text":
        canvasText.writeTextInCanvas(commonProps);
        break;
    }
  }

  setCursor(cursor: string) {
    this.canvas.style.cursor = cursor;
  }

  getContext() {
    return this.ctx;
  }
}
