import { ShapeType } from "@/interfaces";
import { CanvasManager } from "./CanvasManager";
import { ShapeManager } from "./ShapeManager";
import { SocketHandler } from "./SocketHandler";
import { ToolManager } from "./ToolManager";
import { calculateBounds } from "./utils/canvasUtils";

export class MouseHandler {
  private canvasManager: CanvasManager;
  private shapeManager: ShapeManager;
  private toolManager: ToolManager;
  private socketHandler: SocketHandler;

  private clicked = false;
  private startX = 0;
  private startY = 0;
  private offSetX = 0;
  private offSetY = 0;
  private offSetEndX = 0;
  private offSetEndY = 0;
  private pencilStokesOffSet: number[][] = [];
  private pencilStrokes: number[][] = [];


  // Store bound handlers as properties
  private readonly boundMouseDownHandler: (e: MouseEvent) => void;
  private readonly boundMouseMoveHandler: (e: MouseEvent) => void;
  private readonly boundMouseUpHandler: (e: MouseEvent) => void;
  private readonly boundClickHandler: (e: MouseEvent) => void;
  private readonly boundWheelHandler: (e: WheelEvent) => void;

  constructor(
    canvasManager: CanvasManager,
    shapeManager: ShapeManager,
    toolManager: ToolManager,
    socketHandler: SocketHandler,
  ) {
    this.canvasManager = canvasManager;
    this.shapeManager = shapeManager;
    this.toolManager = toolManager;
    this.socketHandler = socketHandler;

    // Bind once and reuse
    this.boundMouseDownHandler = this.mouseDownHandler.bind(this);
    this.boundMouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.boundMouseUpHandler = this.mouseUpHandler.bind(this);
    this.boundClickHandler = this.clickHandler.bind(this);
    this.boundWheelHandler = this.wheelHandler.bind(this);

    this.init();
  }

  private init() {
    const canvas = this.canvasManager.getContext().canvas;
    canvas.addEventListener("mousedown", this.boundMouseDownHandler);
    canvas.addEventListener("mousemove", this.boundMouseMoveHandler);
    canvas.addEventListener("mouseup", this.boundMouseUpHandler);
    canvas.addEventListener("click", this.boundClickHandler);
    canvas.addEventListener("wheel", this.boundWheelHandler);
  }

  destroy() {
    const canvas = this.canvasManager.getContext().canvas;
    canvas.removeEventListener("mousedown", this.boundMouseDownHandler);
    canvas.removeEventListener("mousemove", this.boundMouseMoveHandler);
    canvas.removeEventListener("mouseup", this.boundMouseUpHandler);
    canvas.removeEventListener("click", this.boundClickHandler);
    canvas.removeEventListener("wheel", this.boundWheelHandler);
  }

  private mouseDownHandler(e: MouseEvent) {

    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.toolManager.getTool() === "pencil") {
      this.canvasManager.getContext().moveTo(this.startX, this.startY);
    }


    if (this.toolManager.getTool() === "select") {
      this.selectShapeAndMoveMouseDownHandler()
    }
  }

  private mouseMoveHandler(e: MouseEvent) {
    const { width, height, x, y } = calculateBounds(
      this.startX,
      this.startY,
      e.clientX,
      e.clientY,
    );


    if (this.clicked && this.toolManager.getTool() === "select") {
      this.selectShapeAndMouseMoveHandler(e);
      return;
    }

    if (this.clicked) {
      const commonProps = this.toolManager.getCommonProps();
      this.canvasManager.getContext().strokeStyle = commonProps.stroke;

      const selectedTool = this.toolManager.getTool();

      if (selectedTool !== "pencil") {
        this.canvasManager.clearCanvas(this.shapeManager.getShapes());
      }

      switch (selectedTool) {
        case "circle": {
          this.canvasManager.drawShape({
              type: selectedTool,
              x,
              y,
              radiusX:  Math.floor(width / 2),
              radiusY: Math.floor(height / 2),
              ...commonProps,
          })
          break;
        }

        case "diamond":
        case "rect": {
          this.canvasManager.drawShape({
            x,
            y,
            width,
            height,
            type: selectedTool,
            ...commonProps,
          })
          break;
        }

        case "arrow":
        case "line": {
          this.canvasManager.drawShape({
            x: this.startX,
            y: this.startY,
            endX: e.clientX,
            endY: e.clientY,
            type: selectedTool,
            ...commonProps,
          })
          break;
        }

        case "pencil": {
          const pencilStroke = [e.clientX, e.clientY];
          this.pencilStrokes.push(pencilStroke);

          this.canvasManager.drawShape({
            type: selectedTool,
            x: e.clientX,
            y: e.clientY,
            pencilStrokes: [pencilStroke],
            ...commonProps,
          }, true)
          break;
        }

        default:
          break;
      }
    }
  }

  private mouseUpHandler(e: MouseEvent) {

    this.clicked = false;

    const selectedShape = this.shapeManager.getSelectedShape();

    if (selectedShape && this.toolManager.getTool() === "select") {

      if (selectedShape) {
        this.socketHandler.sendUpdateShape({
          ...selectedShape,
          selected: false,
        });
      }

      this.shapeManager.resetSelectedShape();
      this.canvasManager.clearCanvas(this.shapeManager.getShapes());

      this.canvasManager.setCursor("auto");
      return;
    }

    if (this.toolManager.getTool() === "pencil") {
      this.canvasManager.getContext().beginPath();
      this.canvasManager.getContext().moveTo(this.startX, this.startY);
    }

    const {totalPanX, totalPanY} = this.shapeManager.getTotalPan();

    // eslint-disable-next-line prefer-const
    let { width, height, x, y } = calculateBounds(
      this.startX,
      this.startY,
      e.clientX,
      e.clientY,
    );

    x = x + totalPanX;
    y = y + totalPanY;

    let shape: ShapeType | null = null;

    const commonProps = this.toolManager.getCommonProps();
    const selectedTool = this.toolManager.getTool();

    switch (selectedTool) {
      case "rect":
        shape = { type: selectedTool, x, y, height, width, ...commonProps };
        break;

      case "circle":
        const radiusX = Math.floor(width / 2);
        const radiusY = Math.floor(height / 2);

        shape = { type: selectedTool, radiusX, radiusY, x, y, ...commonProps };
        break;

      case "line":
      case "arrow":
        shape = {
          type: selectedTool,
          x: this.startX + totalPanX,
          y: this.startY + totalPanY,
          endX: e.clientX + totalPanX,
          endY: e.clientY + totalPanY,
          ...commonProps,
        };
        break;

      case "pencil":
        if (this.pencilStrokes.length < 20) return;

        shape = {
          type: selectedTool,
          x: this.startX + totalPanX,
          y: this.startY + totalPanY,
          pencilStrokes: this.pencilStrokes.map(([x, y]) => [x + totalPanX, y + totalPanY]),
          ...commonProps,
        };
        break;

      case "diamond":
        shape = {
          type: selectedTool,
          x,
          y,
          height,
          width,
          ...commonProps,
        };
        break;

      default:
        break;
    }

    if (selectedTool !== "pencil" && width < 10 && height < 10) return;

    if (shape) {
      this.socketHandler.sendShape(shape);
      this.pencilStrokes = [];
    }
  }

  private clickHandler(e: MouseEvent) {

    const px = e.clientX;
    const py = e.clientY;
    const currentTool = this.toolManager.getTool(); // Capture tool state at the start
    const existingShape = this.shapeManager.findShapeAtPoint(px, py);

    if (existingShape && currentTool === "eraser") {
      this.socketHandler.sendDeleteShape(existingShape.id ?? "");
      return;
    }

    if (existingShape && existingShape.id && currentTool === "select") {
      this.shapeManager.setSelectedShape({ ...existingShape, selected: true });
      this.canvasManager.clearCanvas(this.shapeManager.getShapes());
    } else if (currentTool === "select" && !existingShape) {
      this.shapeManager.resetSelectedShape();
      this.canvasManager.clearCanvas(this.shapeManager.getShapes());
    }
  }

  private wheelHandler(e: WheelEvent) {
    e.preventDefault();

    const panX = e.deltaX;
    const panY = e.deltaY;

    this.shapeManager.setTotalPan(panX, panY);

    this.shapeManager.getShapes().forEach((shape) => {

      if (shape.type === 'pencil') {
       shape.pencilStrokes = shape.pencilStrokes.map(([x,y]) => {
          return [x - panX, y - panY];
        })
        this.shapeManager.updateShape({
          ...shape,
          x: shape.x - panX,
          y: shape.y - panY,
        });
        return;
      }

      if (shape.type === 'line' || shape.type === 'arrow') {
        this.shapeManager.updateShape({
          ...shape,
          x: shape.x - panX,
          y: shape.y - panY,
          endX: shape.endX - panX,
          endY: shape.endY - panY
        });

        return;
      }

      this.shapeManager.updateShape({
        ...shape,
        x: shape.x - panX,
        y: shape.y - panY
      });

    });

    this.canvasManager.clearCanvas(this.shapeManager.getShapes());

  }

  private selectShapeAndMoveMouseDownHandler(){
    const selectedShape = this.shapeManager.getSelectedShape();

    if (!selectedShape) return;

    this.canvasManager.setCursor("move");

    this.offSetX = this.startX  - selectedShape.x;
    this.offSetY = this.startY - selectedShape.y;

    if (selectedShape.type === "pencil") {
      this.pencilStokesOffSet = selectedShape.pencilStrokes.map(([x, y]) => {
        return [this.startX - x, this.startY - y];
      });
    }

    if (selectedShape.type === "line" || selectedShape.type === "arrow") {
      this.offSetEndX = this.startX  - selectedShape.endX;
      this.offSetEndY = this.startY - selectedShape.endY;
    }
  }

  private selectShapeAndMouseMoveHandler(e: MouseEvent){
    const {totalPanX, totalPanY} = this.shapeManager.getTotalPan();

    let selectedShape = this.shapeManager.getSelectedShape();

    if (!selectedShape) return;

    const x = e.clientX + totalPanX - this.offSetX
    const y = e.clientY + totalPanY - this.offSetY

    if (selectedShape.type === "pencil") {
      selectedShape = {
        ...selectedShape,
        x,
        y,
        pencilStrokes: this.pencilStokesOffSet.map(([offSetX, offSetY]) => {
          return [e.clientX + totalPanX  - offSetX , e.clientY + totalPanY  - offSetY];
        }),
      };
    }

    if (
        selectedShape.type === "circle" ||
        selectedShape.type === "rect" ||
        selectedShape.type === "text" ||
        selectedShape.type === "diamond"
    ) {
      selectedShape = {
        ...selectedShape,
        x,
        y
      };
    }

    if (selectedShape.type === "line" || selectedShape.type === "arrow") {
      selectedShape = {
        ...selectedShape,
        x,
        y,
        endX: e.clientX + totalPanX - this.offSetEndX,
        endY: e.clientY + totalPanY - this.offSetEndY,
      };
    }

    this.shapeManager.setSelectedShape(selectedShape);
    this.shapeManager.updateShape(selectedShape, true);
    this.canvasManager.clearCanvas(this.shapeManager.getShapes());
  }

}
