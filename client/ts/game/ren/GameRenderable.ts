import TransformableLayer from "../../gfx/TransformableLayer";
import Game from "../../gfx/Game";
import {PlayerCommand} from "../../comms";
import Renderable from "../../gfx/Renderable";
import Simul from "../../Simul";
import BasePlayerInterpolator from "../interpolation/PlayerInterpolator";

export default class GameRenderable implements Renderable {
    static TILE_SIZE = 100;

    render(ctx: CanvasRenderingContext2D): void {
        let w = Simul.match.terrainView.width * GameRenderable.TILE_SIZE;
        let h = Simul.match.terrainView.height * GameRenderable.TILE_SIZE;
        ctx.drawImage(Simul.terrainImage.terrainCanvas, 0, 0, w, h);

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

export class GameTransformationLayer extends TransformableLayer {
    static EDGE_PAN_SPEED = 5;
    static EDGE_PAN_PROX = 8;

    constructor() {
        super();
        Game.input.addHandler((event) => {
            let p = this.transformToCanvas(event);
            Game.socketio.emit("player command", ({
                command: "set target",
                x: p.x / GameRenderable.TILE_SIZE,
                y: p.y / GameRenderable.TILE_SIZE,
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
        this.add(new GameRenderable());
    }

    update(dt: number) {
        super.update(dt);
        let p = Game.input.mousePos;
        let s = GameTransformationLayer.EDGE_PAN_SPEED;
        let prox = GameTransformationLayer.EDGE_PAN_PROX;
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
        let w = Simul.match.terrainView.width * TerrainImage.TILE_SIZE;
        let h = Simul.match.terrainView.height * TerrainImage.TILE_SIZE;
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