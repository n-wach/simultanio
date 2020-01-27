import { Scene } from './Scene'
import { Input } from './Input';


import * as io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
export class Game {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static scene: Scene;
    static input: Input;
    static frame: number;
    static socketio: SocketIOClient.Socket;

    static initialize(): void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.input = new Input();
        this.socketio = io();
    }

    static update() {
        if (this.scene) {
            this.scene.update();
        }
        this.input.update();
        this.frame++;
    }

    static render(): void {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.scene) {
            this.scene.render(this.ctx);
        }
    }

    static setScene(scene: Scene) {
        if (this.scene != null) {
            this.scene.destroy();
            this.socketio.removeAllListeners();
        }
        this.scene = scene;
        scene.initialize();
    }
}