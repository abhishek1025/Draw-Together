import {getExistingShapes} from "@/draw/http";
import {ShapeType, ToolType} from "@/iterfaces";
import {rectShape, circleShape, pencilShape, lineShape, arrowShape, diamondShape, canvasText} from './shape'

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: ShapeType[] = [];
    private readonly roomId: string;
    private socket: WebSocket;
    private startX: number = 0
    private startY: number = 0
    private clicked: boolean = false;
    private selectedTool: ToolType = "circle";
    private pencilStokes: number[][] = [];
    private textInputEl: HTMLTextAreaElement;
    private text: string = "";

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, textInputEl: HTMLTextAreaElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!; // TODO: Figureout the use of !
        this.roomId = roomId;
        this.socket = socket;
        this.textInputEl = textInputEl;
        this.init()
        this.initHandlers()
        this.initMouseHandlers()
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();

    }

    initHandlers() {
        this.socket.onmessage = event => {
            const message = JSON.parse(event.data);

            if (message.type === 'chat_draw') {

                const parsedData = JSON.parse(message.message);
                this.existingShapes.push(parsedData);

                this.clearCanvas();
            }

            if (message.type === 'erase_draw') {

                this.existingShapes = this.existingShapes.filter((s) => {
                    return message.chatId !== s.id;
                })

                this.clearCanvas();
            }
        };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(0, 0, 0)';

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map(shape => {
            if (shape.type === 'rect') {
                this.ctx.strokeStyle = 'rgba(255, 255, 255)';
                rectShape.drawRect({
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height,
                    ctx: this.ctx,
                });

            } else if (shape.type === 'circle') {

                circleShape.drawCircle({
                    ctx: this.ctx,
                    centerX: shape.centerX,
                    centerY: shape.centerY,
                    radiusX: shape.radiusX,
                    radiusY: shape.radiusY,
                })

            } else if (shape.type === 'line') {

                lineShape.drawLine({
                    ctx: this.ctx,
                    x: shape.x,
                    y: shape.y,
                    endX: shape.endX,
                    endY: shape.endY,
                })

            } else if (shape.type === 'pencil') {
                pencilShape.drawPencilStrokes({
                    x: shape.x,
                    y: shape.y,
                    ctx: this.ctx,
                    pencilStrokes: shape.pencilCoordinates,
                    isActive: false,
                })
            } else if (shape.type === 'arrow') {
                arrowShape.drawArrow({
                    ctx: this.ctx,
                    x: shape.x,
                    y: shape.y,
                    endX: shape.endX,
                    endY: shape.endY,
                })
            } else if (shape.type === 'diamond') {
                diamondShape.drawDiamondShape({
                    ctx: this.ctx,
                    x: shape.x,
                    y: shape.y,
                    height: shape.height,
                    width: shape.width,
                })
            } else if (shape.type === 'text') {

                canvasText.writeTextInCanvas({
                    ctx: this.ctx,
                    x: shape.x,
                    y: shape.y,
                    text: shape.text,
                })
            }

        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if (this.selectedTool === 'pencil') {
            this.ctx.moveTo(this.startX, this.startY);
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = Math.abs(e.clientX - this.startX);
            const height = Math.abs(e.clientY - this.startY);

            this.ctx.strokeStyle = 'rgba(255, 255, 255)';

            const selectedTool = this.selectedTool;

            const x = Math.min(e.clientX, this.startX),
                y = Math.min(e.clientY, this.startY)

            if (selectedTool === 'circle') {
                this.clearCanvas();

                const radiusX = Math.floor(width / 2);
                const radiusY = Math.floor(height / 2);

                circleShape.drawCircle({
                    ctx: this.ctx,
                    centerX: x + radiusX,
                    centerY: y + radiusY,
                    radiusX,
                    radiusY,
                })


            } else if (selectedTool === 'rect') {
                this.clearCanvas();
                rectShape.drawRect({
                    x,
                    y,
                    width,
                    height,
                    ctx: this.ctx,
                });

            } else if (selectedTool === 'line') {
                this.clearCanvas();

                lineShape.drawLine({
                    ctx: this.ctx,
                    x: this.startX,
                    y: this.startY,
                    endX: e.clientX,
                    endY: e.clientY,
                })

            } else if (selectedTool === 'pencil') {
                const pencilStoke = [e.clientX, e.clientY]
                this.pencilStokes.push(pencilStoke)

                pencilShape.drawPencilStrokes({
                    x: e.clientX,
                    y: e.clientY,
                    isActive: true,
                    ctx: this.ctx,
                    pencilStrokes: [pencilStoke]
                })
            } else if (selectedTool === 'arrow') {
                this.clearCanvas();
                arrowShape.drawArrow({
                    ctx: this.ctx,
                    x: this.startX,
                    y: this.startY,
                    endX: e.clientX,
                    endY: e.clientY,
                })
            } else if (selectedTool === 'diamond') {
                this.clearCanvas();
                diamondShape.drawDiamondShape({
                    ctx: this.ctx,
                    x,
                    y,
                    height,
                    width
                })
            }

        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        if (this.selectedTool === 'pencil') {
            this.ctx.beginPath();
        }

        const width = Math.abs(e.clientX - this.startX);
        const height = Math.abs(e.clientY - this.startY);

        const x = Math.min(e.clientX, this.startX),
            y = Math.min(e.clientY, this.startY)

        let shape: ShapeType | null = null;

        const selectedTool = this.selectedTool

        if (selectedTool === 'rect') {
            shape = {
                type: selectedTool,
                x,
                y,
                height,
                width,
            };
        }

        if (selectedTool === 'circle') {

            const radiusX = Math.floor(width / 2);
            const radiusY = Math.floor(height / 2);

            shape = {
                type: selectedTool,
                radiusX: radiusX,
                radiusY: radiusY,
                centerX: x + radiusX,
                centerY: y + radiusY,
            };

        }

        if (selectedTool === 'line' || selectedTool === 'arrow') {
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                endX: e.clientX,
                endY: e.clientY,
            }
        }

        if (selectedTool === 'pencil') {
            if (this.pencilStokes.length < 20) return;
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                pencilCoordinates: this.pencilStokes,
            }
        }

        if (selectedTool === 'diamond') {
            shape = {
                type: selectedTool,
                x,
                y,
                height,
                width,
            }
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
    }



    clickHandler = (e: MouseEvent) => {

        if (this.selectedTool !== 'eraser') {
            return;
        }

        const px = e.clientX, py = e.clientY;

        this.existingShapes = this.existingShapes.filter((shape: ShapeType) => {
            if (shape.type === 'rect' || shape.type === 'text') {

                const erase = rectShape.eraseRect(shape.x, shape.y, shape.width, shape.height, px, py)

                if (erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }

            }

            if (shape.type === 'circle') {
                const erase = circleShape.eraseCircle(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, px, py)

                if (erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            if (shape.type === 'pencil') {
                const erase = pencilShape.eraseLineStorkes(shape.pencilCoordinates, px, py)

                if (erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            if (shape.type === 'line' || shape.type === 'arrow') {
                const erase = pencilShape.eraseLineStorkes([[shape.x, shape.y], [shape.endX, shape.endY]], px, py)

                if (erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            if (shape.type === 'diamond') {
                const erase = diamondShape.eraseDiamondShape(px, py, shape.x, shape.y, shape.width, shape.height)

                if (erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            return true;
        })

        this.clearCanvas();
    }

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

    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        this.canvas.addEventListener('mouseup', this.mouseUpHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.addEventListener('click', this.clickHandler)
    }

    destroyMouseHandlers() {
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
        this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('click', this.clickHandler);
    }

    setTool(tool: ToolType) {
        this.selectedTool = tool;
    }

}