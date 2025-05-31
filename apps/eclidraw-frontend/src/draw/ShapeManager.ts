import { getExistingShapes } from "@/draw/utils/http";
import { ShapeType } from "@/interfaces";
import { circleShape, diamondShape, pencilShape, rectShape } from "./shape";


export class ShapeManager {
  private shapes: ShapeType[] = [];
  private selectedShape: ShapeType | null = null;
  private readonly roomId: string;
  private totalPanX: number = 0;
  private totalPanY: number = 0;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  async init() {
    this.shapes = await getExistingShapes(this.roomId);
  }

  setTotalPan(panX: number, panY: number) {
    this.totalPanX += panX;
    this.totalPanY += panY;
  }

  getTotalPan() {
    return {totalPanX: this.totalPanX, totalPanY: this.totalPanY};
  }

  getShapes() {
    return this.shapes;
  }

  clearShapes() {
    this.shapes = [];
  }

  addShape(shape: ShapeType) {

    const panX = this.totalPanX;
    const panY = this.totalPanY;

    const x = shape.x - panX;
    const y = shape.y - panY;

    switch (shape.type) {
      case "arrow":
      case "line":
        shape = {
          ...shape,
          x,
          y,
          endX: shape.endX - panX,
          endY: shape.endY - panY
        }
        break;

      case 'pencil':
        shape = {
          ...shape,
          x,y,
          pencilStrokes: shape.pencilStrokes.map(([x,y]) => [x - panX, y - panY]),
        }
        break

      default:
        shape = {
          ...shape,
          x,
          y,
        }

    }



    this.shapes.push(shape);
  }

  updateShape(updatedShape: ShapeType) {
    this.shapes = this.shapes.map((shape) =>
      shape.id === updatedShape.id ? { ...shape, ...updatedShape } : shape,
    );
  }

  deleteShape(chatId: string) {
    this.shapes = this.shapes.filter((shape) => shape.id !== chatId);
  }

  setSelectedShape(shape: ShapeType | null) {
    this.selectedShape = shape;
    this.shapes = this.shapes.map((s) => ({
      ...s,
      selected: s.id === shape?.id,
    }));
  }

  getSelectedShape() {
    return this.selectedShape;
  }

  resetSelectedShape() {
    this.selectedShape = null;
    this.shapes = this.shapes.map((shape) => ({ ...shape, selected: false }));
  }

  findShapeAtPoint(px: number, py: number) {
    return [...this.shapes].reverse().find((shape) => {
      if (shape.type === "rect" || shape.type === "text") {
        return rectShape.isNearRect(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          px,
          py,
        );
      }
      if (shape.type === "circle") {
        return circleShape.isNearCircle(
          shape.x,
          shape.y,
          shape.radiusX,
          shape.radiusY,
          px,
          py,
        );
      }
      if (shape.type === "pencil") {
        return pencilShape.isNearLine(shape.pencilStrokes, px, py);
      }
      if (shape.type === "line" || shape.type === "arrow") {
        return pencilShape.isNearLine(
          [
            [shape.x, shape.y],
            [shape.endX, shape.endY],
          ],
          px,
          py,
        );
      }
      if (shape.type === "diamond") {
        return diamondShape.isNearDiamond(
          px,
          py,
          shape.x,
          shape.y,
          shape.width,
          shape.height,
        );
      }
      return false;
    });
  }
}
