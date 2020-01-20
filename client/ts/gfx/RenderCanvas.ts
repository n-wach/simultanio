export class RenderCanvas {
    el: HTMLCanvasElement;
    ctx2: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.el = document.createElement("canvas") as HTMLCanvasElement;
        this.el.width = width;
        this.el.height = height;
        this.ctx2 = this.el.getContext("2d");
    }

    get2dContext(): CanvasRenderingContext2D {
        return this.ctx2;
    }

    toBitmap(): ImageData {
        return this.ctx2.getImageData(0, 0, this.el.width, this.el.height);
    }
}