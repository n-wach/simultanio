import { Sprite } from "../../gfx/Sprite";
import { RenderCanvas } from "../../gfx/RenderCanvas";
import { Game } from "../../gfx/Game";
import { Vec2 } from "../../gfx/Vec2";
import { Res } from "../Res";

export class Block extends Sprite {
    public moveSpeed: number;

    constructor(pos: Vec2, size: Vec2) {
        super();
        this.pos = pos;
        let tex = new RenderCanvas(size.x, size.y);
        let ctx = tex.get2dContext();
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(0, 0, size.x, size.y);
        this.graphic = tex.toBitmap();
    }

    update() {
        if (Game.input.isKeyDown('up')) {
            this.pos.y -= this.moveSpeed;
        }
        if (Game.input.isKeyDown('down')) {
            this.pos.y += this.moveSpeed;
        }
        if (Game.input.isKeyDown('right')) {
            this.pos.x += this.moveSpeed;
        }
        if (Game.input.isKeyDown('left')) {
            this.pos.x -= this.moveSpeed;
        }
    }
}