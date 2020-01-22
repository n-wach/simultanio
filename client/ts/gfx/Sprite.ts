import {Vec2} from "./Vec2";
import {Renderable} from "./Renderable";

export class Sprite extends Renderable {
    public graphic: ImageData;
    public pos: Vec2;

    update() {
        // ...
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.putImageData(this.graphic, this.pos.x, this.pos.y);
    }
}