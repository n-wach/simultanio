import { RenderableGroup } from "../../gfx/RenderableGroup";
import { Game } from "../../gfx/Game";
import { PlayerCommand } from "../../comms";
import { TerrainRenderable } from "./TerrainRenderable";
import {Renderable} from "../../gfx/Renderable";
import {Simul} from "../../Simul";
import {BasePlayerInterpolator} from "../interpolation/PlayerInterpolator";

class EntitiesRenderable implements Renderable {
    render(ctx: CanvasRenderingContext2D): void {
        this.renderPlayer(ctx, Simul.match.you);

        for(let o in Simul.match.otherPlayers) {
            this.renderPlayer(ctx, Simul.match.otherPlayers[o]);
        }
    }

    renderPlayer(ctx: CanvasRenderingContext2D, player: BasePlayerInterpolator) {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        for(let o in player.entities) {
            player.entities[o].render(ctx);
        }
        ctx.fill();
    }

    update(): void {
    }
}

export class GameRenderable extends RenderableGroup {
    constructor() {
        super();
        Game.input.addHandler((event) => {
            let p = this.transformToCanvas(event);
            Game.socketio.emit("player command", ({
                command: "set target",
                x: p.x / TerrainRenderable.GRID_CELL_SIZE,
                y: p.y / TerrainRenderable.GRID_CELL_SIZE,
            } as PlayerCommand));
            return true;
        }, "mousedown", "touchstart");
        Game.input.addHandler((event) => {
            let delta = event.deltaY;
            //convert delta into pixels...
            if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                delta *= 16; // just a guess--depends on inaccessible user settings
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                delta *= 800;  // also just a guess--no good way to predict these...
            }
            this.zoomOnPoint(delta, this.transformToCanvas(event));
            return true;
        }, "wheel");
        this.add(new TerrainRenderable(), new EntitiesRenderable());
    }
}