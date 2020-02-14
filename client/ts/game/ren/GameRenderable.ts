import TransformableLayer from "../../gfx/TransformableLayer";
import Game from "../../gfx/Game";
import {PlayerCommand} from "../../comms";
import Renderable from "../../gfx/Renderable";
import Simul from "../../Simul";
import Res from "../Res";

export default class GameRenderable implements Renderable {
    static TILE_SIZE = 100;

    render(ctx: CanvasRenderingContext2D): void {
        let t = GameRenderable.TILE_SIZE;
        let w = Simul.match.terrainView.width * t;
        let h = Simul.match.terrainView.height * t;
        let smoothing = ctx.imageSmoothingEnabled;

        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(-t, -t, w + 2*t, h + 2*t);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(Simul.mapImage.terrainCanvas, 0, 0, w, h);
        ctx.imageSmoothingEnabled = smoothing;

        for(let player of Simul.match.allPlayers()) {
            ctx.fillStyle = Res.player_colors[player.color].style;
            for(let e in player.entities) {
                ctx.beginPath();
                player.entities[e].render(ctx);
                ctx.fill();
            }
        }
    }

    update(dt: number): void {
        for(let player of Simul.match.allPlayers()) {
            for(let o in player.entities) {
                player.entities[o].update(dt);
            }
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
        let w = Simul.match.terrainView.width * MapImage.TILE_SIZE;
        let h = Simul.match.terrainView.height * MapImage.TILE_SIZE;
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