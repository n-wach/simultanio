import Component from "./Component";

export default class Icon extends Component {
    img: HTMLImageElement;
    ready: boolean = false;

    constructor(src: string) {
        super();
        this.img = document.createElement("img");
        this.img.onload = () => {this.ready = true};
        this.img.src = src;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(this.ready) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}