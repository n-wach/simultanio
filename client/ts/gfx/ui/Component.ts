import Renderable from "../Renderable";
import Game from "../Game";

export default abstract class Component implements Renderable {
    x: number;
    y: number;
    width: number;
    height: number;
    hovered: boolean;
    handlers: ((event: any) => boolean)[] = [];

    resize(): void {}

    abstract render(ctx: CanvasRenderingContext2D): void;

    removeHandlers() {
        for (let handler of this.handlers) {
            Game.input.removeHandler(handler)
        }
    }

    update(dt: number): void {
        let ox = Game.input.mousePos.x - this.x;
        let oy = Game.input.mousePos.y - this.y;
        this.hovered = (ox >= 0 && ox <= this.width && oy >= 0 && oy <= this.height);
    }
}