import {Scene} from "../gfx/Scene";
import {Sprite} from "../gfx/Sprite";
import {Vec2} from "../gfx/Vec2";

export class IntroScene extends Scene {
    initialize(): void {
        super.initialize();

        let sqr = new Sprite();
        let tex = new OffscreenCanvas(16, 16);
        let ctx = tex.getContext('2d');
        ctx.fillRect(0, 0, 16, 16);
        sqr.graphic = tex.transferToImageBitmap();
        sqr.pos = new Vec2(10, 10);

        console.log('yee');
        console.log(sqr.graphic);

        this.addSprite(sqr);
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }
}