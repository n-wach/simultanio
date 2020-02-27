import Component from "./Component";

export default class Icon extends Component {
    static IMGS: { [key: string]: [boolean, HTMLImageElement] } = {};
    img: HTMLImageElement;
    src: string;
    ready: boolean = false;

    constructor(src: string) {
        super();
        if (!Icon.IMGS[src]) {
            let img = document.createElement("img");
            img.onload = () => {
                Icon.IMGS[src][0] = true
            };
            img.src = src;
            Icon.IMGS[src] = [false, img];
        }
        this.src = src;
        this.img = Icon.IMGS[src][1];
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.ready) this.ready = Icon.IMGS[this.src][0];
        if(this.ready) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}