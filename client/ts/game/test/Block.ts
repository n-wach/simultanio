import Renderable from "../../gfx/Renderable";
import Vec2 from "../../gfx/Vec2";
import Game from "../../gfx/Game";

export default class Block implements Renderable {
    pos: Vec2;
    size: number;
    color: string;

    constructor(pos: Vec2, size: number) {
        this.pos = pos;
        this.size = size;
        console.log('created block: ', size);
    }

    update(dt: number) {
        if (Game.input.isKeyDown('a')) {
            this.color = 'red';
        } else {
            this.color = 'black';
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
}