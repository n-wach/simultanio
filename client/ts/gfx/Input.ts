import Game from "./Game";
import Vec2 from "./Vec2";

type InputHandlers = {
    [event: string]: ((event) => boolean)[],
}

type KeyStates = {
    [key: string]: KeyState,
}

export default class Input {
    public mousePos: Vec2 = Vec2.zero;
    public mouseDown: boolean = false;
    private keyStates: KeyStates = {};
    private handlers: InputHandlers = {};
    private static supportedEvents: string[] = ["mousemove", "mousedown", "mouseup", "touchdown", "touchup", "touchmove", "wheel", "click"];

    constructor() {
        // mouse events
        Game.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = new Vec2(event.offsetX, event.offsetY);
        });

        Game.canvas.addEventListener("mousedown", (event) => {
            this.mouseDown = true;
        });

        Game.canvas.addEventListener("mouseup", (event) => {
            this.mouseDown = false;
        });

        for(let supportedEvent of Input.supportedEvents) {
            Game.canvas.addEventListener(supportedEvent, this.handle.bind(this));
        }

        // keyboard events
        Game.canvas.addEventListener("keydown", (event) => {
            if (!this.keyStates[event.key]) {
                this.keyStates[event.key] = new KeyState();
            }
            if (!event.repeat) {
                this.keyStates[event.key].down = true;
                this.keyStates[event.key].pressFrame = Game.frame;
            }
        });
        Game.canvas.addEventListener("keyup", (event) => {
            if (!this.keyStates[event.key]) {
                this.keyStates[event.key] = new KeyState();
            }
            this.keyStates[event.key].down = false;
        });
    }

    handle(event) {
        let handlers = this.handlers[event.type];
        if(!handlers) return;
        for(let handler of handlers) {
            if(handler(event)) return;
        }
    }

    clearHandlers() {
        this.handlers = {};
    }

    addHandler(handler: (event) => boolean, ...events: string[]) {
        for(let event of events) {
            if (!this.handlers[event]) {
                this.handlers[event] = [handler];
            } else {
                this.handlers[event].unshift(handler);
            }
        }
    }

    update() {

    }

    isKeyDown(key: string): boolean {
        if (!this.keyStates[key]) {
            this.keyStates[key] = new KeyState();
        }
        return this.keyStates[key].down;
    }

    isKeyPressed(key: string): boolean {
        if (!this.keyStates[key]) {
            this.keyStates[key] = new KeyState();
        }
        let ks = this.keyStates[key];
        return ks.pressFrame == Game.frame;
    }
}

class KeyState {
    public down: boolean;
    public pressFrame: number;
}