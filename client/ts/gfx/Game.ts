import {Scene} from './Scene'
import {Input} from './Input';


import * as io from 'socket.io-client';

export class Game {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static scene: Scene;
    static input: Input;
    static frame: number;
    static socketio: SocketIOClient.Socket;
    static clearColor: string = "black";

    static initialize(): void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvas.setAttribute("tabindex", "0");
        this.ctx = this.canvas.getContext("2d");
        this.input = new Input();
        this.socketio = io();
    }

    static update(dt: number) {
        if (this.scene) {
            this.scene.update(dt);
        }
        this.input.update();
        this.frame++;
    }

    static render(): void {
        this.ctx.fillStyle = this.clearColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.scene) {
            this.scene.render(this.ctx);
        }
    }

    static setScene(scene: Scene) {
        if (this.scene != null) {
            this.scene.destroy();
            this.socketio.removeAllListeners();
            this.input.clearHandlers();
        }
        this.scene = scene;
        scene.initialize();
        scene.resize();
    }
}