import {getExistingShapes} from "@/draw/http";
import {ShapeType, ToolType} from "@/iterfaces";
import {isPointInsideRect, isPointIntersectCircle, isPointNearLine} from "@/draw/eraseUtils";


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
    private pencilCoordinates:number[][] = [];

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

            if (message.type === 'chat') {
                const parsedData = JSON.parse(message.message);
                this.existingShapes.push(parsedData);

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
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2)
                this.ctx.stroke()
                this.ctx.closePath();
            } else if (shape.type === 'line') {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x, shape.y);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke()
            } else if (shape.type === 'pencil') {
                this.ctx.lineCap = "round";
                this.ctx.moveTo(shape.x, shape.y);

                shape.pencilCoordinates.map(([x, y]) => {
                    this.ctx.lineTo(x, y);
                })

                this.ctx.stroke();
                this.ctx.beginPath();
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

                const centerX = this.startX + radius;
                const centerY = this.startY + radius;

                this.ctx.beginPath();

                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
                this.ctx.stroke()

                this.ctx.closePath();

            } else if (selectedTool === 'rect') {
                this.clearCanvas();

                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === 'line') {
                this.clearCanvas();

                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.closePath();

                this.ctx.stroke()

            } else if (selectedTool === 'pencil') {
                this.ctx.lineCap = "round";
                this.pencilCoordinates.push([e.clientX, e.clientY])
                this.ctx.lineTo(e.clientX, e.clientY);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(e.clientX, e.clientY);
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
            shape = {
                type: selectedTool,
                x: this.startX,
                y: this.startY,
                pencilCoordinates: this.pencilCoordinates,
            }
        }

        if (!shape) return;

        this.existingShapes.push(shape);

        this.socket.send(
            JSON.stringify({
                type: 'chat',
                roomId: this.roomId,
                message: JSON.stringify(shape),
            })
        );

        // Empty the pencil coordinates
        this.pencilCoordinates = [];
    }

    clickHandler = (e: MouseEvent) => {

        if(this.selectedTool !== 'eraser') return;

        const px = e.clientX, py = e.clientY;

        this.existingShapes = this.existingShapes.filter((shape: ShapeType) => {
            if(shape.type === 'rect') {
                 return !isPointInsideRect(shape.x, shape.y, shape.width, shape.height, px, py)
            }

            if(shape.type === 'circle') {
                return !isPointIntersectCircle(shape.centerX, shape.centerY, shape.radius, px, py)
            }

            if(shape.type === 'pencil') {
                return !isPointNearLine(shape.pencilCoordinates,px,py)
            }

            if(shape.type === 'line') {
                return !isPointNearLine([[shape.x, shape.y], [shape.endX, shape.endY]],px,py)
            }

            return true;
        })

        this.clearCanvas();
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