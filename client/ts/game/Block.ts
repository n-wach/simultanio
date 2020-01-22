import { Sprite } from "../gfx/Sprite";
import { RenderCanvas } from "../gfx/RenderCanvas";
import { Game } from "../gfx/Game";

export class Block extends Sprite {
    public moveSpeed: number;

    constructor() {
        super();
        let tex = new RenderCanvas(16, 16);
        let ctx = tex.get2dContext();
        ctx.fillRect(0, 0, 16, 16);
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