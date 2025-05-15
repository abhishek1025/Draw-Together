import { StrokeStyleType, ToolType } from '@/interfaces';
import { CanvasManager } from './CanvasManager';
import { MouseHandler } from './MouseHandler';
import { ShapeManager } from './ShapeManager';
import { SocketHandler } from './SocketHandler';
import { ToolManager } from './ToolManager';

export class Game {
  private readonly canvasManager: CanvasManager;
  private readonly shapeManager: ShapeManager;
  private readonly toolManager: ToolManager;
  private mouseHandler: MouseHandler;
  private readonly socketHandler: SocketHandler;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvasManager = new CanvasManager(canvas);
    this.shapeManager = new ShapeManager(roomId);
    this.toolManager = new ToolManager();
    this.socketHandler = new SocketHandler(
      socket,
      roomId,
      this.canvasManager,
      this.shapeManager
    );
    this.mouseHandler = new MouseHandler(
      this.canvasManager,
      this.shapeManager,
      this.toolManager,
      this.socketHandler
    );
    this.init();
  }

  private async init() {
    await this.shapeManager.init();
    this.canvasManager.clearCanvas(this.shapeManager.getShapes());
  }

  setTool(tool: ToolType) {
    this.toolManager.setTool(tool);
  }

  setStroke(stroke: string) {
    this.toolManager.setStroke(stroke);
  }

  setBgColor(bgColor: string) {
    this.toolManager.setBgColor(bgColor);
  }

  setStrokeWidth(strokeWidth: number) {
    this.toolManager.setStrokeWidth(strokeWidth);
  }

  setStrokeStyle(strokeStyle: StrokeStyleType) {
    this.toolManager.setStrokeStyle(strokeStyle);
  }

  resetSelectedShape() {
    this.shapeManager.resetSelectedShape();
    this.canvasManager.clearCanvas(this.shapeManager.getShapes());
  }

  destroyMouseHandlers() {
    this.mouseHandler.destroy();
  }
}
