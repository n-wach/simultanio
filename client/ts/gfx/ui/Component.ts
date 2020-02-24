import Renderable from "../Renderable";
import Game from "../Game";

export default abstract class Component implements Renderable {
    x: number;
    y: number;
    width: number;
    height: number;
    hovered: boolean;
    visible: boolean = true;

    resize(): void {}

    abstract render(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void {
        let ox = Game.input.mousePos.x - this.x;
        let oy = Game.input.mousePos.y - this.y;
        this.hovered = this.visible && (ox >= 0 && ox <= this.width && oy >= 0 && oy <= this.height);
    }
}