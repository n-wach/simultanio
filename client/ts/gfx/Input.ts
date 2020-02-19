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
    private static supportedEvents: string[] = ["mousemove", "mousedown", "mouseup", "wheel", "click", "contextmenu"];

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
        Game.window.addEventListener("keydown", (event) => {
            let k = event.key.toLowerCase();
            if (!this.keyStates[k]) {
                this.keyStates[k] = new KeyState();
            }
            if (!event.repeat) {
                this.keyStates[k].down = true;
                this.keyStates[k].pressFrame = Game.frame;
            }
        }, true);
        Game.window.addEventListener("keyup", (event) => {
            let k = event.key.toLowerCase();
            if (!this.keyStates[k]) {
                this.keyStates[k] = new KeyState();
            }
            this.keyStates[k].down = false;
        }, true);
    }

    handle(event) {
        event.preventDefault();
        event.stopPropagation();
        let handlers = this.handlers[event.type];
        if(!handlers) return false;
        for(let handler of handlers) {
            if(handler(event)) return false;
        }
        return false;
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

    // whether the key is down
    isKeyDown(...keys: string[]): boolean {
        for(let key of keys) {
            let k = key.toLowerCase();
            if (!this.keyStates[k]) {
                this.keyStates[k] = new KeyState();
            }
            if(this.keyStates[k].down) return true;
        }
        return false;
    }

    // whether the key was pressed this frame
    isKeyPressed(key: string): boolean {
        let k = key.toLowerCase();
        if (!this.keyStates[k]) {
            this.keyStates[k] = new KeyState();
        }
        let ks = this.keyStates[k];
        return ks.pressFrame == Game.frame;
    }
}

class KeyState {
    public down: boolean = false;
    public pressFrame: number = -1;
}