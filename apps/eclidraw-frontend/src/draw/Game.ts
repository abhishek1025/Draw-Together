import { getExistingShapes } from '@/draw/http';
import { ShapeType, StrokeStyleType, ToolType } from '@/interfaces';
import {
  destroyMouseHandlers,
  initMouseHandlers,
} from './handlers/mouseHandlers';
import { setupSocketHandlers } from './handlers/socketHandler';
import {
  arrowShape,
  circleShape,
  diamondShape,
  lineShape,
  pencilShape,
  rectShape,
} from './shape';
import { calculateBounds, clearCanvasUtilFunc } from './utils/canvasUtils';

export class Game {
  public canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  public existingShapes: ShapeType[] = [];
  private readonly roomId: string;
  public socket: WebSocket;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private selectedTool: ToolType = 'select';
  private pencilStokes: number[][] = [];
  private stroke: string = '#ffffff';
  private bgColor: string = 'transparent';
  private strokeWidth: number = 1;
  private strokeStyle: StrokeStyleType = 'solid';
  private selectedShape: ShapeType | null = null;
  private offSetX: number = 0;
  private offSetY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!; // TODO: Figureout the use of !
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    setupSocketHandlers(this);
    initMouseHandlers(this);
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  clearCanvas() {
    clearCanvasUtilFunc(this.ctx, this.canvas, this.existingShapes);
  }

  mouseDownHandler(e: MouseEvent) {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === 'pencil') {
      this.ctx.moveTo(this.startX, this.startY);
    }

    if (this.selectedShape && this.selectedTool === 'select') {
      this.offSetX = this.startX - this.selectedShape.x;
      this.offSetY = this.startY - this.selectedShape.y;

      let isMovingPointNearShape: boolean = false;

      if (this.selectedShape?.type === 'rect') {
        isMovingPointNearShape = rectShape.isNearRect(
          this.selectedShape.x,
          this.selectedShape.y,
          this.selectedShape.width,
          this.selectedShape.height,
          this.startX,
          this.startY
        );
      }

      if (this.selectedShape?.type === 'circle') {
        isMovingPointNearShape = circleShape.isNearCircle(
          this.selectedShape.x,
          this.selectedShape.y,
          this.selectedShape.radiusX,
          this.selectedShape.radiusY,
          this.startX,
          this.startY
        );
      }

      if (isMovingPointNearShape) {
        this.canvas.style.cursor = 'move';
      }
    }
  }

  mouseMoveHandler = (e: MouseEvent) => {
    const { width, height, x, y } = calculateBounds(
      this.startX,
      this.startY,
      e.clientX,
      e.clientY
    );

    if (this.clicked && this.existingShapes && this.selectedTool === 'select') {
      if (
        this.selectedShape?.type == 'circle' ||
        this.selectedShape?.type === 'rect'
      ) {
        this.selectedShape = {
          ...this.selectedShape,
          x: e.clientX - this.offSetX,
          y: e.clientY - this.offSetY,
        };
      }

      this.existingShapes = this.existingShapes.map(shape => {
        if (shape.id === this.selectedShape?.id) {
          return { ...shape, ...this.selectedShape };
        }
        return shape;
      });

      this.clearCanvas();

      return;
    }

    if (this.clicked) {
      const commonProps = {
        id: undefined,
        stroke: this.stroke,
        bgColor: this.bgColor,
        strokeWidth: this.strokeWidth,
        strokeStyle: this.strokeStyle,
        selected: false,
      };

      this.ctx.strokeStyle = this.stroke;

      const selectedTool = this.selectedTool;

      if (selectedTool === 'circle') {
        this.clearCanvas();

        const radiusX = Math.floor(width / 2);
        const radiusY = Math.floor(height / 2);

        circleShape.drawCircle({
          ctx: this.ctx,
          shape: {
            type: selectedTool,
            x,
            y,
            radiusX,
            radiusY,
            ...commonProps,
          },
        });
      } else if (selectedTool === 'rect') {
        this.clearCanvas();
        rectShape.drawRect({
          shape: {
            x,
            y,
            width,
            height,
            type: selectedTool,
            ...commonProps,
          },
          ctx: this.ctx,
        });
      } else if (selectedTool === 'line') {
        this.clearCanvas();

        lineShape.drawLine({
          ctx: this.ctx,
          shape: {
            x: this.startX,
            y: this.startY,
            endX: e.clientX,
            endY: e.clientY,
            type: selectedTool,
            ...commonProps,
          },
        });
      } else if (selectedTool === 'pencil') {
        const pencilStoke = [e.clientX, e.clientY];
        this.pencilStokes.push(pencilStoke);

        pencilShape.drawPencilStrokes({
          shape: {
            type: selectedTool,
            x: e.clientX,
            y: e.clientY,
            pencilStrokes: [pencilStoke],
            ...commonProps,
          },
          isActive: true,
          ctx: this.ctx,
        });
      } else if (selectedTool === 'arrow') {
        this.clearCanvas();
        arrowShape.drawArrow({
          ctx: this.ctx,
          shape: {
            type: selectedTool,
            x: this.startX,
            y: this.startY,
            endX: e.clientX,
            endY: e.clientY,
            ...commonProps,
          },
        });
      } else if (selectedTool === 'diamond') {
        this.clearCanvas();
        diamondShape.drawDiamondShape({
          ctx: this.ctx,
          shape: {
            type: selectedTool,
            x,
            y,
            height,
            width,
            ...commonProps,
          },
        });
      }
    }
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    if (this.selectedTool === 'select') {
      this.existingShapes = this.existingShapes.map(shape => {
        if (shape.id === this.selectedShape?.id) {
          return { ...shape, ...this.selectedShape };
        }

        return shape;
      });

      this.clearCanvas();

      this.canvas.style.cursor = 'auto';

      return;
    }

    if (this.selectedTool === 'pencil') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
    }

    const { width, height, x, y } = calculateBounds(
      this.startX,
      this.startY,
      e.clientX,
      e.clientY
    );

    let shape: ShapeType | null = null;

    const commonProps = {
      id: undefined,
      stroke: this.stroke,
      bgColor: this.bgColor,
      strokeWidth: this.strokeWidth,
      strokeStyle: this.strokeStyle,
      selected: false,
    };

    const selectedTool = this.selectedTool;

    if (selectedTool === 'rect') {
      shape = {
        type: selectedTool,
        x,
        y,
        height,
        width,
        ...commonProps,
      };
    }

    if (selectedTool === 'circle') {
      const radiusX = Math.floor(width / 2);
      const radiusY = Math.floor(height / 2);

      shape = {
        type: selectedTool,
        radiusX: radiusX,
        radiusY: radiusY,
        x,
        y,
        ...commonProps,
      };
    }

    if (selectedTool === 'line' || selectedTool === 'arrow') {
      shape = {
        type: selectedTool,
        x: this.startX,
        y: this.startY,
        endX: e.clientX,
        endY: e.clientY,
        ...commonProps,
      };
    }

    if (selectedTool === 'pencil') {
      if (this.pencilStokes.length < 20) return;
      shape = {
        type: selectedTool,
        x: this.startX,
        y: this.startY,
        pencilStrokes: this.pencilStokes,
        ...commonProps,
      };
    }

    if (selectedTool === 'diamond') {
      shape = {
        type: selectedTool,
        x: this.startX,
        y: this.startY,
        height,
        width,
        ...commonProps,
      };
    }

    if (!shape) return;

    this.socket.send(
      JSON.stringify({
        type: 'chat_draw',
        roomId: this.roomId,
        message: JSON.stringify(shape),
      })
    );

    // Empty the pencil coordinates
    this.pencilStokes = [];
  };

  clickHandler = (e: MouseEvent) => {
    const px = e.clientX,
      py = e.clientY;

    const existingShape = [...this.existingShapes]
      .reverse()
      .find((shape: ShapeType) => {
        if (shape.type === 'rect' || shape.type === 'text') {
          return rectShape.isNearRect(
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            px,
            py
          );
        }

        if (shape.type === 'circle') {
          return circleShape.isNearCircle(
            shape.x,
            shape.y,
            shape.radiusX,
            shape.radiusY,
            px,
            py
          );
        }

        if (shape.type === 'pencil') {
          return pencilShape.isNearLine(shape.pencilStrokes, px, py);
        }

        if (shape.type === 'line' || shape.type === 'arrow') {
          return pencilShape.isNearLine(
            [
              [shape.x, shape.y],
              [shape.endX, shape.endY],
            ],
            px,
            py
          );
        }

        if (shape.type === 'diamond') {
          return diamondShape.isNearDiamond(
            px,
            py,
            shape.x,
            shape.y,
            shape.width,
            shape.height
          );
        }

        return false;
      });

    if (existingShape && this.selectedTool === 'select') {
      this.selectedShape = { ...existingShape, selected: true };

      this.existingShapes = this.existingShapes.map((shape: ShapeType) => {
        if (shape.id === existingShape.id) {
          return { ...shape, selected: true };
        }
        return { ...shape, selected: false };
      });

      this.clearCanvas();

      return;
    }

    if (existingShape && this.selectedTool === 'eraser') {
      this.sendDeleteDrawShape(existingShape.id ?? '');
    }
  };

  sendDeleteDrawShape(chatId: string | null) {
    if (!chatId) return;

    this.socket.send(
      JSON.stringify({
        type: 'erase_draw',
        roomId: this.roomId,
        chatId,
      })
    );
  }

  destroyMouseHandlers() {
    destroyMouseHandlers(this);
  }

  setTool(tool: ToolType) {
    this.selectedTool = tool;
  }

  setStroke(stroke: string) {
    this.stroke = stroke;
  }

  setBgColor(bgColor: string) {
    this.bgColor = bgColor;
  }

  setStrokeWidth(strokeWidth: number) {
    this.strokeWidth = strokeWidth;
  }

  setStrokeStyle(strokeStyle: StrokeStyleType) {
    this.strokeStyle = strokeStyle;
  }

  resetSelectedShape() {
    this.selectedShape = null;
    this.existingShapes = this.existingShapes.map(el => ({
      ...el,
      selected: false,
    }));
    this.clearCanvas();
  }
}

