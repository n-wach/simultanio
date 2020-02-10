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
        for(let o in player.entities) {
            ctx.beginPath();
            player.entities[o].render(ctx);
            ctx.fill();
        }
    }

    updatePlayerEntities(dt: number, player: BasePlayerInterpolator) {
        for(let o in player.entities) {
            player.entities[o].update(dt);
        }
    }

    update(dt: number): void {
        this.updatePlayerEntities(dt, Simul.match.you);
        for(let o in Simul.match.otherPlayers) {
            this.updatePlayerEntities(dt, Simul.match.otherPlayers[o]);
        }
    }
}

export class GameRenderable extends RenderableGroup {
    static EDGE_PAN_SPEED = 5;
    static EDGE_PAN_PROX = 8;

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

    update(dt: number) {
        super.update(dt);
        let p = Game.input.mousePos;
        let s = GameRenderable.EDGE_PAN_SPEED;
        let prox = GameRenderable.EDGE_PAN_PROX;
        if(p.x < prox) {
            this.ctxOrigin.x += s;
        }
        if(p.y < prox) {
            this.ctxOrigin.y += s;
        }
        if(p.x > window.innerWidth - prox) {
            this.ctxOrigin.x -= s;
        }
        if(p.y > window.innerHeight - prox) {
            this.ctxOrigin.y -= s;
        }
        /* todo: keep center of screen within terrain view
        if(this.ctxOrigin.x > 0) {
            this.ctxOrigin.x = 0;
        }
        if(this.ctxOrigin.y > 40) {
            this.ctxOrigin.y = 40;
        }
        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight - 290;
        let w = Simul.match.terrainView.width * TerrainRenderable.GRID_CELL_SIZE;
        let h = Simul.match.terrainView.height * TerrainRenderable.GRID_CELL_SIZE;
        if(this.ctxOrigin.x < -w * this.ctxScale + viewportWidth) {
            this.ctxOrigin.x = -w * this.ctxScale + viewportWidth;
        }
        if(this.ctxOrigin.y < -h * this.ctxScale + viewportHeight) {
            this.ctxOrigin.y = -h * this.ctxScale + viewportHeight;
        }
        console.log(this.ctxOrigin);
        */
    }
}