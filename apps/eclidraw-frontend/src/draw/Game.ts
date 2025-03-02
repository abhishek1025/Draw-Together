import {getExistingShapes} from "@/draw/http";
import {ShapeType, ToolType} from "@/iterfaces";
import {rectShape, circleShape, pencilShape, lineShape} from './shape'

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
    private pencilStokes:number[][] = [];

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!; // TODO: Figureout the use of !
        this.roomId = roomId;
        this.socket = socket;
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

            if(message.type === 'erase_draw') {

                this.existingShapes = this.existingShapes.filter((s) => {
                    return message.chatId !== s.id;
                })

                this.clearCanvas();
            }
        };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(0, 0, 0);';

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
                    radius: shape.radius,
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
            }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if(this.selectedTool === 'pencil'){
            this.ctx.moveTo(this.startX, this.startY);
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.ctx.strokeStyle = 'rgba(255, 255, 255)';

            const selectedTool = this.selectedTool;

            if (selectedTool === 'circle') {
                this.clearCanvas();

                const radius = Math.max(width, height) / 2

                circleShape.drawCircle({
                    ctx: this.ctx,
                    centerX: this.startX + radius,
                    centerY: this.startY + radius,
                    radius,
                })


            } else if (selectedTool === 'rect') {
                this.clearCanvas();

                rectShape.drawRect({
                    x: this.startX,
                    y: this.startY,
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
            }

        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        if(this.selectedTool === 'pencil') {
            this.ctx.beginPath();
        }

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        let shape: ShapeType | null = null;

        const selectedTool = this.selectedTool

        if (selectedTool === 'rect') {
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                height,
                width,
            };
        }

        if (selectedTool === 'circle') {

            const radius = Math.max(width, height) / 2;

            shape = {
                type: selectedTool,
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            };

        }

        if (selectedTool === 'line') {
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                endX: e.clientX,
                endY: e.clientY,
            }
        }

        if (selectedTool === 'pencil') {
            if(this.pencilStokes.length < 20) return;
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                pencilCoordinates: this.pencilStokes,
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

        if(this.selectedTool !== 'eraser') return;

        const px = e.clientX, py = e.clientY;

        this.existingShapes = this.existingShapes.filter((shape: ShapeType) => {
            if(shape.type === 'rect') {

                const erase = rectShape.eraseRect(shape.x, shape.y, shape.width, shape.height, px, py)

                if(erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }

            }

            if(shape.type === 'circle') {
                const erase = circleShape.eraseCircle(shape.centerX, shape.centerY, shape.radius, px, py)

                if(erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            if(shape.type === 'pencil') {
                const erase = pencilShape.eraseLineStorkes(shape.pencilCoordinates,px,py)

                if(erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            if(shape.type === 'line') {
                const erase = !pencilShape.eraseLineStorkes([[shape.x, shape.y], [shape.endX, shape.endY]],px,py)

                if(erase) {
                    this.sendDeleteDrawShape(shape.id ?? null)
                    return false;
                }
            }

            return true;
        })

        this.clearCanvas();
    }

    sendDeleteDrawShape(chatId:string | null) {

        if(!chatId) return;

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