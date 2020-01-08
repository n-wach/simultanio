import {Sprite} from "./Sprite";

export class Scene {
    sprites: Sprite[];

    initialize() {
        this.sprites = [];
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (let sprite of this.sprites) {
            ctx.drawImage(sprite.graphic, sprite.pos.x, sprite.pos.y);
        }
    }

    addSprite(spr: Sprite): void {
        this.sprites.push(spr);
    }

    removeSprite(spr: Sprite): void {
        this.sprites.splice(this.sprites.indexOf(spr), 1);
    }
}