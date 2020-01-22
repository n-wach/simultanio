import { Game } from "./Game";
import { Vec2 } from "./Vec2";

export class Input {
    public mousePos: Vec2;
    public mouseDown: boolean;

    constructor() {
        Game.canvas.addEventListener("mousedown", (event) => {
            this.mouseDown = true;
        });
        Game.canvas.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });
        Game.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = new Vec2(event.offsetX, event.offsetY);
        });
    }
}