import {Scene} from "../gfx/Scene";
import {Sprite} from "../gfx/Sprite";
import {Vec2} from "../gfx/Vec2";
import { RenderCanvas } from "../gfx/RenderCanvas";

export class LobbyScene extends Scene {
    initialize(): void {
        super.initialize();

        let sqr = new Sprite();
        let tex = new RenderCanvas(16, 16);
        let ctx = tex.get2dContext();
        ctx.fillRect(0, 0, 16, 16);
        sqr.graphic = tex.toBitmap();
        sqr.pos = new Vec2(10, 10);

        console.log('yee');
        console.log(sqr.graphic);

        this.add(sqr);
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }
}