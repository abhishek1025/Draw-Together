import {getExistingShapes} from "@/draw/http";
import {Tool} from "@/components/Canvas";

type Shape = {
        type: 'rect';
        x: number;
        y: number;
        width: number;
        height: number;
    }
    | {
    type: 'circle';
    centerY: number;
    centerX: number;
    radius: number;
} | {
    type: 'pencil';
    centerY: number;
    centerX: number;
    radius: number;
};

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private roomId: string;
    private socket: WebSocket;
    private startX: number = 0
    private startY: number = 0
    private clicked: boolean = false;
    private selectedTool: Tool = "circle";

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
            }
        });
    }


    mouseDownHandler = (e:MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e:MouseEvent)=>  {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        let shape: Shape | null = null;

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

        if (!shape) return;

        this.existingShapes.push(shape);

        this.socket.send(
            JSON.stringify({
                type: 'chat',
                roomId: this.roomId,
                message: JSON.stringify(shape),
            })
        );
    }

    mouseMoveHandler = (e:MouseEvent)=>  {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas();

            this.ctx.strokeStyle = 'rgba(255, 255, 255)';

            const selectedTool = this.selectedTool;

            if (selectedTool === 'circle') {

                const radius = Math.max(width, height) / 2

                const centerX = this.startX + radius;
                const centerY = this.startY + radius;

                this.ctx.beginPath();

                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2)
                this.ctx.stroke()

                this.ctx.closePath();

            } else if (selectedTool === 'rect') {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === 'pencil') {
            }

        }
    }

    initMouseHandlers() {

        this.canvas.addEventListener('mousedown', this.mouseDownHandler);

        this.canvas.addEventListener('mouseup', this.mouseUpHandler);

        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    }

    destroyMouseHandlers() {
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler);

        this.canvas.removeEventListener('mouseup', this.mouseUpHandler);

        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }
}