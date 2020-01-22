import { Renderable } from "../Renderable";
import {PlayScene} from "../../scenes/PlayScene";

export class HUD extends Renderable {
    playScene: PlayScene;

    constructor(playScene: PlayScene) {
        super();
        this.playScene = playScene;
    }

    update(): void {

    }

    render(ctx: CanvasRenderingContext2D): void {
        let w = ctx.canvas.width;
        let h = ctx.canvas.height;

        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, w, 30);

        let time = this.playScene.match.duration.toFixed(0);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Time: " + time + " seconds", w / 2, 15);

        let energy = this.playScene.match.you.stored_energy.toFixed(0);

        ctx.fillStyle = "cyan";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Energy: " + energy, w - 210, 15, 100);

        let matter = this.playScene.match.you.stored_matter.toFixed(0);
        ctx.fillStyle = "pink";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Matter: " + matter, w - 105, 15, 100);

    }
}