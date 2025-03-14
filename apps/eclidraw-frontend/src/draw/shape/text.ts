
type paramsType = {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    text: string;
}

export const writeTextInCanvas = (params: paramsType) => {

    const textArr = params.text.split('\n')

    params.ctx.font = "16px Arial";
    params.ctx.fillStyle = "white";
    params.ctx.textBaseline = "top";

    for(let i = 0; i < textArr.length; i++) {
        params.ctx.fillText(textArr[i], params.x, params.y + 20 * i);
    }

}