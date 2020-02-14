import TransformableLayer from "../../gfx/TransformableLayer";
import Game from "../../gfx/Game";
import Renderable from "../../gfx/Renderable";
import Simul from "../../Simul";
import Res from "../Res";
import Vec2 from "../../gfx/Vec2";

export default class GameRenderable implements Renderable {
    static TILE_SIZE = 100;

    render(ctx: CanvasRenderingContext2D): void {
        let t = GameRenderable.TILE_SIZE;
        let w = Simul.match.terrainView.width * t;
        let h = Simul.match.terrainView.height * t;
        let smoothing = ctx.imageSmoothingEnabled;

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
    topLeftGrid: Vec2 = new Vec2(0, 0);
    topRightGrid: Vec2 = new Vec2(0, 0);
    bottomLeftGrid: Vec2 = new Vec2(0, 0);
    bottomRightGrid: Vec2 = new Vec2(0, 0);
    center: Vec2 = new Vec2(0, 0);

    constructor() {
        super();
        Game.input.addHandler((event) => {
            let delta = event.deltaY;
            //convert delta into pixels...
            if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                delta *= 16; // just a guess--depends on inaccessible user settings
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                delta *= 800;  // also just a guess--no good way to predict these...
            }
            let minH = (window.innerWidth - 250) / (Simul.match.terrainView.width * GameRenderable.TILE_SIZE);
            let minV = (window.innerHeight - 40) / (Simul.match.terrainView.height * GameRenderable.TILE_SIZE);
            let minZoom = Math.max(minH, minV);
            this.zoomOnPoint(delta, this.transformToCanvas(event), minZoom);
            return true;
        }, "wheel");
        this.add(new GameRenderable());
    }

    transformToGrid(event): Vec2 {
        let c = this.transformToCanvas(event);
        return new Vec2(c.x / GameRenderable.TILE_SIZE, c.y / GameRenderable.TILE_SIZE);
    }

    transformVToGrid(v: Vec2) {
        let c = this.transformVToCanvas(v);
        return new Vec2(c.x / GameRenderable.TILE_SIZE, c.y / GameRenderable.TILE_SIZE);
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

        if(this.ctxOrigin.x > 250) {
            this.ctxOrigin.x = 250;
        }
        if(this.ctxOrigin.x < -Simul.match.terrainView.width * GameRenderable.TILE_SIZE  * this.ctxScale + window.innerWidth) {
            this.ctxOrigin.x = -Simul.match.terrainView.width * GameRenderable.TILE_SIZE * this.ctxScale + window.innerWidth;
        }
        if(this.ctxOrigin.y > 40) {
            this.ctxOrigin.y = 40;
        }
        if(this.ctxOrigin.y < -Simul.match.terrainView.height * GameRenderable.TILE_SIZE  * this.ctxScale + window.innerHeight) {
            this.ctxOrigin.y = -Simul.match.terrainView.height * GameRenderable.TILE_SIZE * this.ctxScale + window.innerHeight;
        }

        let topLeft = new Vec2(250, 40);
        let topRight = new Vec2(window.innerWidth, 40);
        let bottomLeft = new Vec2(250, window.innerHeight);
        let bottomRight = new Vec2(window.innerWidth, window.innerHeight);
        let center = new Vec2((window.innerWidth + 250) / 2, (window.innerHeight + 40) / 2);

        this.topLeftGrid = this.transformVToGrid(topLeft);
        this.topRightGrid = this.transformVToGrid(topRight);
        this.bottomLeftGrid = this.transformVToGrid(bottomLeft);
        this.bottomRightGrid = this.transformVToGrid(bottomRight);
        this.center = this.transformVToCanvas(center);
    }

    centerOnGrid(x: number, y: number) {
        let g = new Vec2(x * GameRenderable.TILE_SIZE, y * GameRenderable.TILE_SIZE);
        let dx = this.center.x - g.x;
        let dy = this.center.y - g.y;
        this.ctxOrigin.x += dx * this.ctxScale;
        this.ctxOrigin.y += dy * this.ctxScale;
        this.update(0);
    }
}