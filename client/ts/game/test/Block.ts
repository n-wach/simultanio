import Renderable from "../../gfx/Renderable";
import Component from "../../gfx/ui/Component";
import Res from "../Res";
import Vec2 from "../../gfx/Vec2";

export default class Block implements Renderable {
    size: number;
    pos: Vec2;

    constructor(pos: Vec2, size: number) {
        this.pos = pos;
        this.size = size;
        console.log('created block: ', size);
    }

    update(dt: number) {}

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uifg;
        ctx.rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}