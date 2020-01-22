import { Sprite } from "../gfx/Sprite";
import { RenderCanvas } from "../gfx/RenderCanvas";

export class Block extends Sprite {
    constructor() {
        super();
        let tex = new RenderCanvas(16, 16);
        let ctx = tex.get2dContext();
        ctx.fillRect(0, 0, 16, 16);
        this.graphic = tex.toBitmap();
    }
}