import { Game } from "./Game";
import { Vec2 } from "./Vec2";

export class Input {
    public mousePos: Vec2 = Vec2.zero;
    public mouseDown: boolean;
    public keys: Record<string, boolean>;

    constructor() {
        // mouse events
        Game.canvas.addEventListener("mousedown", (event) => {
            this.mouseDown = true;
        });
        Game.canvas.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });
        Game.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = new Vec2(event.offsetX, event.offsetY);
        });

        // keyboard events
        Game.canvas.addEventListener("keydown", (event) => {
            this.keys[event.key] = true;
        });
        Game.canvas.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }
}