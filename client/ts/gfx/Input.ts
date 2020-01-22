import { Game } from "./Game";
import { Vec2 } from "./Vec2";

export class Input {
    public mousePos: Vec2 = Vec2.zero;
    public mouseDown: boolean;
    public mousePressed: boolean;
    private mousePressFrame: number = -1;
    private keyStates: Record<string, KeyState>;

    constructor() {
        // mouse events
        Game.canvas.addEventListener("mousedown", (event) => {
            this.mouseDown = true;
        });
        Game.canvas.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });
        Game.canvas.addEventListener("click", (event) => {
            this.mousePressed = true;
            this.mousePressFrame = Game.frame;
        });
        Game.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = new Vec2(event.offsetX, event.offsetY);
        });

        // keyboard events
        Game.canvas.addEventListener("keydown", (event) => {
            if (!event.repeat) {
                this.keyStates[event.key].down = true;
                this.keyStates[event.key].pressFrame = Game.frame;
            }
        });
        Game.canvas.addEventListener("keyup", (event) => {
            this.keyStates[event.key].down = false;
        });
    }

    update() {
        // unset pressed
        if (this.mousePressed && this.mousePressFrame != Game.frame) {
            this.mousePressed = false;
        }
    }

    isKeyDown(key: string): boolean {
        return this.keyStates[key].down;
    }

    isKeyPressed(key: string): boolean {
        let ks = this.keyStates[key];
        return ks.pressFrame == Game.frame;
    }
}

class KeyState {
    public down: boolean;
    public pressFrame: number;
}