import { ShapeType } from '@/interfaces';
import { CanvasManager } from './CanvasManager';
import { ShapeManager } from './ShapeManager';
import {MessageType} from "@repo/common/messageTypeConstant";

export class SocketHandler {
  private socket: WebSocket;
  private roomId: string;
  private canvasManager: CanvasManager;
  private shapeManager: ShapeManager;

  constructor(
    socket: WebSocket,
    roomId: string,
    canvasManager: CanvasManager,
    shapeManager: ShapeManager
  ) {
    this.socket = socket;
    this.roomId = roomId;
    this.canvasManager = canvasManager;
    this.shapeManager = shapeManager;
    this.init();
  }

  private init() {
    this.socket.addEventListener('message', event => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case MessageType.CHAT_DRAW:
          const shape: ShapeType = JSON.parse(data.message);
          this.shapeManager.addShape(shape);
          this.canvasManager.clearCanvas(this.shapeManager.getShapes());
          break;

        case MessageType.ERASE_DRAW:
          this.shapeManager.deleteShape(data.chatId);
          this.canvasManager.clearCanvas(this.shapeManager.getShapes());
          break;

        case MessageType.UPDATE_SHAPE:
          const updatedShape: ShapeType = JSON.parse(data.message);
          this.shapeManager.updateShape({
            ...updatedShape,
            selected: updatedShape.id === this.shapeManager.getSelectedShape()?.id
          });
          this.canvasManager.clearCanvas(this.shapeManager.getShapes());
          break;

        case MessageType.DELETE_DRAWS:
          this.shapeManager.clearShapes();
          this.canvasManager.clearCanvas(this.shapeManager.getShapes());
          break;

        default:
          break
      }
    });
  }

  sendShape(shape: ShapeType) {
    this.socket.send(
      JSON.stringify({
        type: MessageType.CHAT_DRAW,
        roomId: this.roomId,
        message: JSON.stringify(shape),
      })
    );
  }

  sendDeleteShape(chatId: string) {
    if (!chatId) return;
    this.socket.send(
      JSON.stringify({
        type: MessageType.ERASE_DRAW,
        roomId: this.roomId,
        chatId,
      })
    );
  }

  sendUpdateShape(shape: ShapeType) {
    if (!shape) return;
    this.socket.send(JSON.stringify({
      type: MessageType.UPDATE_SHAPE,
      roomId: this.roomId,
      message: JSON.stringify(shape),
    }));
  }


}
