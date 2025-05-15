import { ShapeType } from '@/interfaces';
import { CanvasManager } from './CanvasManager';
import {
  arrowShape,
  circleShape,
  diamondShape,
  lineShape,
  pencilShape,
  rectShape,
} from './shape';
import { ShapeManager } from './ShapeManager';
import { SocketHandler } from './SocketHandler';
import { ToolManager } from './ToolManager';
import { calculateBounds } from './utils/canvasUtils';

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
  private pencilStokesOffSet: number[][];
  private pencilStrokes: number[][] = [];

  // Store bound handlers as properties
  private readonly boundMouseDownHandler: (e: MouseEvent) => void;
  private readonly boundMouseMoveHandler: (e: MouseEvent) => void;
  private readonly boundMouseUpHandler: (e: MouseEvent) => void;
  private readonly boundClickHandler: (e: MouseEvent) => void;

  constructor(
      canvasManager: CanvasManager,
      shapeManager: ShapeManager,
      toolManager: ToolManager,
      socketHandler: SocketHandler
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

    this.init();
  }

  private init() {
    const canvas = this.canvasManager.getContext().canvas;
    canvas.addEventListener('mousedown', this.boundMouseDownHandler);
    canvas.addEventListener('mousemove', this.boundMouseMoveHandler);
    canvas.addEventListener('mouseup', this.boundMouseUpHandler);
    canvas.addEventListener('click', this.boundClickHandler);
  }

  destroy() {
    const canvas = this.canvasManager.getContext().canvas;
    canvas.removeEventListener('mousedown', this.boundMouseDownHandler);
    canvas.removeEventListener('mousemove', this.boundMouseMoveHandler);
    canvas.removeEventListener('mouseup', this.boundMouseUpHandler);
    canvas.removeEventListener('click', this.boundClickHandler);
  }

  private mouseDownHandler(e: MouseEvent) {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.toolManager.getTool() === 'pencil') {
      this.canvasManager.getContext().moveTo(this.startX, this.startY);
    }

    const selectedShape = this.shapeManager.getSelectedShape();

    if (selectedShape && this.toolManager.getTool() === 'select') {

      this.canvasManager.setCursor('move');

      this.offSetX = this.startX - selectedShape.x;
      this.offSetY = this.startY - selectedShape.y;

      if(selectedShape.type === 'pencil'){
        this.pencilStokesOffSet = selectedShape.pencilStrokes.map(([x, y]) => {
          return [this.startX - x, this.startY - y];
        })
      }

      if(selectedShape.type === 'line' || selectedShape.type === 'arrow') {
        this.offSetEndX = this.startX - selectedShape.endX;
        this.offSetEndY = this.startY - selectedShape.endY;
      }


    }
  }

  private mouseMoveHandler(e: MouseEvent) {
    const {width, height, x, y} = calculateBounds(
        this.startX,
        this.startY,
        e.clientX,
        e.clientY
    );

    if (this.clicked && this.toolManager.getTool() === 'select') {
      const selectedShape = this.shapeManager.getSelectedShape();

      if (!selectedShape) return;

      let updatedShape;

      if(selectedShape.type === 'pencil'){
        updatedShape = {
          ...selectedShape,
          x: e.clientX - this.offSetX,
          y: e.clientY - this.offSetY,
          pencilStrokes: this.pencilStokesOffSet.map(([offSetX, offSetY]) => {
            return [e.clientX - offSetX, e.clientY - offSetY];
          })
        }
      }

      if (
          selectedShape.type === 'circle' || selectedShape.type === 'rect' || selectedShape.type === 'text' || selectedShape.type === 'diamond'
      ) {
        updatedShape = {
          ...selectedShape,
          x: e.clientX - this.offSetX,
          y: e.clientY - this.offSetY,
        };
      }


      if (
          selectedShape.type === 'line' || selectedShape.type === 'arrow'
      ) {
        updatedShape = {
          ...selectedShape,
          x: e.clientX - this.offSetX,
          y: e.clientY - this.offSetY,
          endX: e.clientX - this.offSetEndX,
          endY: e.clientY - this.offSetEndY,
        };
      }

      if (updatedShape) {
        this.shapeManager.setSelectedShape(updatedShape);
        this.shapeManager.updateShape(updatedShape)
        this.canvasManager.clearCanvas(this.shapeManager.getShapes());
      }

      return;
    }

    if (this.clicked) {
      const commonProps = this.toolManager.getCommonProps();
      this.canvasManager.getContext().strokeStyle = commonProps.stroke;

      const selectedTool = this.toolManager.getTool();

      if (selectedTool !== "pencil") {
        this.canvasManager.clearCanvas(this.shapeManager.getShapes());
      }

      const ctx = this.canvasManager.getContext();

      switch (selectedTool) {
        case 'circle': {
          const radiusX = Math.floor(width / 2);
          const radiusY = Math.floor(height / 2);
          circleShape.drawCircle({
            ctx,
            shape: {
              type: selectedTool,
              x,
              y,
              radiusX,
              radiusY,
              ...commonProps,
            },
          });
          break;
        }

        case 'rect': {
          rectShape.drawRect({
            ctx,
            shape: {
              x,
              y,
              width,
              height,
              type: selectedTool,
              ...commonProps,
            },
          });
          break;
        }

        case 'line': {
          lineShape.drawLine({
            ctx,
            shape: {
              x: this.startX,
              y: this.startY,
              endX: e.clientX,
              endY: e.clientY,
              type: selectedTool,
              ...commonProps,
            },
          });
          break;
        }

        case 'pencil': {
          const pencilStroke = [e.clientX, e.clientY];
          this.pencilStrokes.push(pencilStroke);

          pencilShape.drawPencilStrokes({
            ctx,
            shape: {
              type: selectedTool,
              x: e.clientX,
              y: e.clientY,
              pencilStrokes: [pencilStroke],
              ...commonProps,
            },
            isActive: true,
          });
          break;
        }

        case 'arrow': {
          arrowShape.drawArrow({
            ctx,
            shape: {
              type: selectedTool,
              x: this.startX,
              y: this.startY,
              endX: e.clientX,
              endY: e.clientY,
              ...commonProps,
            },
          });
          break;
        }

        case 'diamond': {
          diamondShape.drawDiamondShape({
            ctx,
            shape: {
              type: selectedTool,
              x,
              y,
              width,
              height,
              ...commonProps,
            },
          });
          break;
        }

        default:
          break;
      }

    }
  }

  private mouseUpHandler(e: MouseEvent) {
    this.clicked = false;

    if (this.toolManager.getTool() === 'select') {

      const selectedShape = this.shapeManager.getSelectedShape()

      if(selectedShape){
        this.socketHandler.sendUpdateShape({...selectedShape, selected: false})
      }
      this.canvasManager.setCursor('auto');
      return;
    }

    if (this.toolManager.getTool() === 'pencil') {
      this.canvasManager.getContext().beginPath();
      this.canvasManager.getContext().moveTo(this.startX, this.startY);
    }

    const { width, height, x, y } = calculateBounds(
      this.startX,
      this.startY,
      e.clientX,
      e.clientY
    );

    let shape: ShapeType | null = null;

    const commonProps = this.toolManager.getCommonProps();
    const selectedTool = this.toolManager.getTool();

    switch (selectedTool){
      case 'rect':

        shape = { type: selectedTool, x, y, height, width, ...commonProps };
        break;

      case 'circle':

        const radiusX = Math.floor(width / 2);
        const radiusY = Math.floor(height / 2);

        shape = { type: selectedTool, radiusX, radiusY, x, y, ...commonProps };
        break

      case 'line':
      case 'arrow':

        shape = {
          type: selectedTool,
          x: this.startX,
          y: this.startY,
          endX: e.clientX,
          endY: e.clientY,
          ...commonProps,
        };
        break

      case 'pencil':
        if (this.pencilStrokes.length < 20) return;

        shape = {
          type: selectedTool,
          x: this.startX,
          y: this.startY,
          pencilStrokes: this.pencilStrokes,
          ...commonProps,
        };
        break

      case 'diamond':

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

    if(selectedTool !== 'pencil' && width < 10 && height < 10) return;


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

    if (existingShape && currentTool === 'eraser') {
      this.socketHandler.sendDeleteShape(existingShape.id ?? '');
      return;
    }

    if (existingShape && existingShape.id && currentTool === 'select') {
      this.shapeManager.setSelectedShape({ ...existingShape, selected: true });
      this.canvasManager.clearCanvas(this.shapeManager.getShapes());

    } else if (currentTool === 'select' && !existingShape) {
      this.shapeManager.resetSelectedShape();
      this.canvasManager.clearCanvas(this.shapeManager.getShapes());
    }
  }
}

