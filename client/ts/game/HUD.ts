import { Renderable } from "../gfx/Renderable";
import {PlayScene} from "../scenes/PlayScene";
import {Game} from "../gfx/Game";

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

        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, w, 30);

        let time = Game.match.info.duration.toFixed(0);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Time: " + time + " seconds", w / 2, 15);

        let energy = Game.match.you.stored_energy.toFixed(0);

        ctx.fillStyle = "cyan";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Energy: " + energy, w - 210, 15, 100);

        let matter = Game.match.you.stored_matter.toFixed(0);
        ctx.fillStyle = "pink";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Matter: " + matter, w - 105, 15, 100);

        let your_color = Game.match.you.color;
        ctx.fillStyle = your_color;
        ctx.font = "20px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(your_color + " (you)", w - 5, 30 + 20, 100);

        for(let i = 0; i < Game.match.other_players.length; i++) {
            let y = 50 + 25 + i * 25;
            let other_player = Game.match.other_players[i];
            ctx.fillStyle = other_player.color;
            ctx.fillText(other_player.color, w - 5, y, 100);
        }
    }
}