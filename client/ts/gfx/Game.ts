import Scene from './Scene'
import Input from './Input';

import {io, Socket} from 'socket.io-client';

export default class Game {
    static window: Window;
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static scene: Scene;
    static input: Input;
    static frame: number = 0;
    static socketio: Socket;
    static clearColor: string = "black";
    static pixelRatio: number = 1;
    static width: number = 1;
    static height: number = 1;
    static debug: boolean = false;

    static initialize(): void {
        this.window = window;
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas.setAttribute("tabindex", "1");
        this.ctx = this.canvas.getContext("2d");
        this.input = new Input();
        this.socketio = io({
            path: window.location.pathname + "socket.io",
        });
    }

    static update(dt: number) {
        if (this.scene) {
            this.scene.update(dt);
        }
        this.input.update();
        this.frame++;
    }

    static render(): void {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = this.clearColor;
        this.ctx.fillRect(0, 0, Game.width, Game.height);
        if (this.scene) {
            this.scene.render(this.ctx);
        }
    }

    static setScene(scene: Scene) {
        if (this.scene != null) {
            this.scene.destroy();
            this.socketio.off();
            this.input.clearHandlers();
        }
        this.scene = scene;
        scene.initialize();
        scene.resize();
    }

    static enterFullscreen() {
        if (!this.debug) document.body.requestFullscreen().catch();
    }
}