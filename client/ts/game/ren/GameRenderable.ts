import Renderable from "../../gfx/Renderable";
import Simul from "../../Simul";
import Res from "../Res";

export default class GameRenderable implements Renderable {
    render(ctx: CanvasRenderingContext2D): void {
        let w = Simul.match.terrainView.width;
        let h = Simul.match.terrainView.height;
        let smoothing = ctx.imageSmoothingEnabled;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(Simul.mapImage.terrainCanvas, -0.5, -0.5, w, h);
        ctx.imageSmoothingEnabled = smoothing;

        ctx.fillStyle = Res.map_action;
        ctx.globalAlpha = 0.5;
        for(let e of Simul.selectedEntities) {
            ctx.beginPath();
            ctx.ellipse(e.x, e.y, 0.5, 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        for (let player of Simul.match.allPlayers()) {
            ctx.fillStyle = Res.player_colors[player.color].style;
            for (let e in player.entities) {
                ctx.beginPath();
                player.entities[e].render(ctx);
                ctx.fill();
            }
        }

    }

    update(dt: number): void {
        for (let player of Simul.match.allPlayers()) {
            for (let o in player.entities) {
                player.entities[o].update(dt);
            }
        }
    }
}
