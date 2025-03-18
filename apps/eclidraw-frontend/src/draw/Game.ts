import { getExistingShapes } from "@/draw/http";
import { ShapeType, StrokeStyleType, ToolType } from "@/iterfaces";
import {
  rectShape,
  circleShape,
  pencilShape,
  lineShape,
  arrowShape,
  diamondShape,
  canvasText,
} from "./shape";

export class Game {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private existingShapes: ShapeType[] = [];
  private readonly roomId: string;
  private socket: WebSocket;
  private startX: number = 0;
  private startY: number = 0;
  private clicked: boolean = false;
  private selectedTool: ToolType = "select";
  private pencilStokes: number[][] = [];
  private stroke: string = "#ffffff";
  private bgColor: string = "transparent";
  private strokeWidth: number = 1;
  private strokeStyle: StrokeStyleType = "solid";
  private selectedShape: ShapeType | null = null;
  private offSetX: number = 0;
  private offSetY: number = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!; // TODO: Figureout the use of !
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat_draw") {
        const parsedData = JSON.parse(message.message);
        this.existingShapes.push(parsedData);

        this.clearCanvas();
      }

      if (message.type === "erase_draw") {
        this.existingShapes = this.existingShapes.filter((s) => {
          return message.chatId !== s.id;
        });

        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        rectShape.drawRect({
          shape,
          ctx: this.ctx,
        });
      } else if (shape.type === "circle") {
        circleShape.drawCircle({
          ctx: this.ctx,
          shape,
        });
      } else if (shape.type === "line") {
        lineShape.drawLine({
          ctx: this.ctx,
          shape,
        });
      } else if (shape.type === "pencil") {
        pencilShape.drawPencilStrokes({
          shape,
          ctx: this.ctx,
          isActive: false,
        });
      } else if (shape.type === "arrow") {
        arrowShape.drawArrow({
          ctx: this.ctx,
          shape,
        });
      } else if (shape.type === "diamond") {
        diamondShape.drawDiamondShape({
          ctx: this.ctx,
          shape,
        });
      } else if (shape.type === "text") {
        canvasText.writeTextInCanvas({
          ctx: this.ctx,
          shape,
        });
      }
    });
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.selectedTool === "pencil") {
      this.ctx.moveTo(this.startX, this.startY);
    }

    if (this.selectedShape && this.selectedTool === "select") {

      this.offSetX = this.startX - this.selectedShape.x;
      this.offSetY = this.startY - this.selectedShape.y;

      let isMovingPointNearShape: boolean = false;

      if (this.selectedShape?.type === "rect") {
        isMovingPointNearShape = rectShape.isNearRect(
          this.selectedShape.x,
          this.selectedShape.y,
          this.selectedShape.width,
          this.selectedShape.height,
          this.startX,
          this.startY,
        );
      }

      if (this.selectedShape?.type === "circle") {
        isMovingPointNearShape = circleShape.isNearCircle(
            this.selectedShape.x,
            this.selectedShape.y,
            this.selectedShape.radiusX,
            this.selectedShape.radiusY,
            this.startX,
            this.startY,
        );
      }

      if (isMovingPointNearShape) {
        this.canvas.style.cursor = "move";
      }
    }
  };

  mouseMoveHandler = (e: MouseEvent) => {

    const width = Math.abs(e.clientX - this.startX);
    const height = Math.abs(e.clientY - this.startY);

    const x = Math.min(e.clientX, this.startX),
        y = Math.min(e.clientY, this.startY);

    if(this.clicked && this.existingShapes && this.selectedTool === "select") {

      if(this.selectedShape?.type == "circle" || this.selectedShape?.type === "rect") {
          this.selectedShape = {
            ...this.selectedShape,
            x: e.clientX - this.offSetX,
            y: e.clientY - this.offSetY,
          }
      }

      this.existingShapes = this.existingShapes.map((shape) => {
        if(shape.id === this.selectedShape?.id){
          return {...shape, ...this.selectedShape}
        }
        return shape;
      })

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

      if (selectedTool === "circle") {
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
      } else if (selectedTool === "rect") {
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
      } else if (selectedTool === "line") {
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
      } else if (selectedTool === "pencil") {
        const pencilStoke = [e.clientX, e.clientY];
        this.pencilStokes.push(pencilStoke);

        pencilShape.drawPencilStrokes({
          shape: {
            type: selectedTool,
            x: e.clientX,
            y: e.clientY,
            pencilCoordinates: [pencilStoke],
            ...commonProps,
          },
          isActive: true,
          ctx: this.ctx,
        });
      } else if (selectedTool === "arrow") {
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
      } else if (selectedTool === "diamond") {
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

    if (this.selectedTool === "select") {

      this.existingShapes = this.existingShapes.map((shape) => {

        if(shape.id === this.selectedShape?.id){
          return {...shape, ...this.selectedShape}
        }

        return shape;
      })

      this.clearCanvas();

      this.canvas.style.cursor = "auto";

      return;
    }

    if (this.selectedTool === "pencil") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
    }

    const width = Math.abs(e.clientX - this.startX);
    const height = Math.abs(e.clientY - this.startY);

    const x = Math.min(e.clientX, this.startX),
      y = Math.min(e.clientY, this.startY);

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

    if (selectedTool === "rect") {
      shape = {
        type: selectedTool,
        x,
        y,
        height,
        width,
        ...commonProps,
      };
    }

    if (selectedTool === "circle") {
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

    if (selectedTool === "line" || selectedTool === "arrow") {
      shape = {
        type: selectedTool,
        x: this.startX,
        y: this.startY,
        endX: e.clientX,
        endY: e.clientY,
        ...commonProps,
      };
    }

    if (selectedTool === "pencil") {
      if (this.pencilStokes.length < 20) return;
      shape = {
        type: selectedTool,
        x: this.startX,
        y: this.startY,
        pencilCoordinates: this.pencilStokes,
        ...commonProps,
      };
    }

    if (selectedTool === "diamond") {
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
        type: "chat_draw",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
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
          return pencilShape.isNearLine(shape.pencilCoordinates, px, py);
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

    if (existingShape && this.selectedTool === "select") {
      this.selectedShape = {...existingShape, selected: true};

      this.existingShapes = this.existingShapes.map((shape: ShapeType) => {
        if (shape.id === existingShape.id) {
          return { ...shape, selected: true };
        }
        return { ...shape, selected: false };
      });

      this.clearCanvas();

      return;
    }

    if (existingShape && this.selectedTool === "eraser") {
      this.sendDeleteDrawShape(existingShape.id ?? "");
    }
  };

  sendDeleteDrawShape(chatId: string | null) {
    if (!chatId) return;

    this.socket.send(
      JSON.stringify({
        type: "erase_draw",
        roomId: this.roomId,
        chatId,
      }),
    );
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("click", this.clickHandler);
  }

  destroyMouseHandlers() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("click", this.clickHandler);
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
    this.selectedShape = null
    this.existingShapes = this.existingShapes.map((el) => ({
      ...el, selected: false
    }))
    this.clearCanvas();
  }
}
