import {Scene} from './Scene'

export class Game {
    static canvas: HTMLCanvasElement;
    static ctx: CanvasRenderingContext2D;
    static scene: Scene;

    static initialize(): void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
    }

    static update() {
        if (this.scene) {
            this.scene.update();
        }
    }

    static render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.scene) {
            this.scene.render(this.ctx);
        }
    }

    static setScene(scene: Scene) {
        this.scene = scene;
        scene.initialize();
    }
}