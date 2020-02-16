import TransformableLayer from "../../gfx/TransformableLayer";
import Game from "../../gfx/Game";
import Renderable from "../../gfx/Renderable";
import Simul from "../../Simul";
import Res from "../Res";
import Vec2 from "../../gfx/Vec2";

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
        ctx.beginPath();
        for (let e of Simul.selectedEntities) {
            ctx.ellipse(e.x, e.y, 0.5, 0.5, 0, 0, Math.PI * 2);
        }
        ctx.fill();
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

export class GameTransformationLayer extends TransformableLayer {
    static PAN_SPEED = 5;
    static FAST_PAN_MULT = 5;
    static KBD_ZOOM_DELTA = 48;
    static EDGE_PAN_PROX = 8;
    static ACTION_MAX_LIFETIME = 0.2;
    static ACTION_MAX_RADIUS = 80;
    minZoom: number;
    topLeftGrid: Vec2 = new Vec2(0, 0);
    topRightGrid: Vec2 = new Vec2(0, 0);
    bottomLeftGrid: Vec2 = new Vec2(0, 0);
    bottomRightGrid: Vec2 = new Vec2(0, 0);
    center: Vec2 = new Vec2(0, 0);
    actionLocation: Vec2 = null;
    actionLifetime: number = 0;
    selectionStart: Vec2 = null;

    constructor() {
        super();

        let minH = (window.innerWidth - 250) / Simul.match.terrainView.width;
        let minV = (window.innerHeight - 40) / Simul.match.terrainView.height;
        this.minZoom = Math.max(minH, minV);

        Game.input.addHandler((event) => {
            let g = this.transformToCanvas(event);
            if (event.button == 2) {
                this.actionLocation = g;
                this.actionLifetime = 0;
                if (Simul.selectedEntityAction) Simul.selectedEntityAction.onuse(new Vec2(g.x + 0.5, g.y + 0.5));
                return true;
            } else if (event.button == 0) {
                this.selectionStart = g;
                return true;
            }
            return false;
        }, "mousedown");
        Game.input.addHandler((event) => {
            this.selectionStart = null;
            return false;
        }, "mouseup");
        Game.input.addHandler((event) => {
            let delta = event.deltaY;
            //convert delta into pixels...
            if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                delta *= 16; // just a guess--depends on inaccessible user settings
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                delta *= 800;  // also just a guess--no good way to predict these...
            }
            // console.log('zm delta', delta);
            this.zoomOnPoint(delta, this.transformToCanvas(event), this.minZoom);
            return true;
        }, "wheel");
        this.add(new GameRenderable());
    }

    update(dt: number) {
        super.update(dt);

        // - view navigation
        this.updateNavigationInput();

        let p = Game.input.mousePos;
        let s = GameTransformationLayer.PAN_SPEED;
        let prox = GameTransformationLayer.EDGE_PAN_PROX;
        if (p.x < prox) {
            this.ctxOrigin.x += s;
        }
        if (p.y < prox) {
            this.ctxOrigin.y += s;
        }
        if (p.x > window.innerWidth - prox) {
            this.ctxOrigin.x -= s;
        }
        if (p.y > window.innerHeight - prox) {
            this.ctxOrigin.y -= s;
        }

        let o = 0.5 * this.ctxScale;
        if (this.ctxOrigin.x > 250 + o) {
            this.ctxOrigin.x = 250 + o;
        }
        if (this.ctxOrigin.x < o - Simul.match.terrainView.width * this.ctxScale + window.innerWidth) {
            this.ctxOrigin.x = o - Simul.match.terrainView.width * this.ctxScale + window.innerWidth;
        }
        if (this.ctxOrigin.y > 40 + o) {
            this.ctxOrigin.y = 40 + o;
        }
        if (this.ctxOrigin.y < o - Simul.match.terrainView.height * this.ctxScale + window.innerHeight) {
            this.ctxOrigin.y = o - Simul.match.terrainView.height * this.ctxScale + window.innerHeight;
        }

        let topLeft = new Vec2(250, 40);
        let topRight = new Vec2(window.innerWidth, 40);
        let bottomLeft = new Vec2(250, window.innerHeight);
        let bottomRight = new Vec2(window.innerWidth, window.innerHeight);
        let center = new Vec2((window.innerWidth + 250) / 2, (window.innerHeight + 40) / 2);

        this.topLeftGrid = this.transformVToCanvas(topLeft);
        this.topRightGrid = this.transformVToCanvas(topRight);
        this.bottomLeftGrid = this.transformVToCanvas(bottomLeft);
        this.bottomRightGrid = this.transformVToCanvas(bottomRight);
        this.center = this.transformVToCanvas(center);

        this.actionLifetime += dt;

        let px = this.transformVToCanvas(p);
        if (this.selectionStart) {
            let s = [];
            for (let o in Simul.match.you.entities) {
                let e = Simul.match.you.entities[o];
                if (this.selectionStart) {
                    let left = Math.min(this.selectionStart.x, px.x);
                    let right = Math.max(this.selectionStart.x, px.x);
                    let top = Math.min(this.selectionStart.y, px.y);
                    let bot = Math.max(this.selectionStart.y, px.y);
                    if (left < e.x && e.x < right && top < e.y && e.y < bot) {
                        s.push(e);
                    }
                }
            }
            Simul.selectedEntities = s;
        }

        this.actionLifetime += dt;
    }
    updateNavigationInput() {
        var panSpeed = GameTransformationLayer.PAN_SPEED;
        if (Game.input.isKeyDown('Shift')) {
            panSpeed *= GameTransformationLayer.FAST_PAN_MULT;
        }
        if (Game.input.isKeyDown('ArrowRight', 'd')) {
            this.ctxOrigin.x -= panSpeed;
        }
        if (Game.input.isKeyDown('ArrowLeft', 'a')) {
            this.ctxOrigin.x += panSpeed;
        }
        if (Game.input.isKeyDown('ArrowUp', 'w')) {
            this.ctxOrigin.y += panSpeed;
        }
        if (Game.input.isKeyDown('ArrowDown', 's')) {
            this.ctxOrigin.y -= panSpeed;
        }

        // keyboard zoom
        if (Game.input.isKeyPressed('-')) {
            this.zoomOnPoint(GameTransformationLayer.KBD_ZOOM_DELTA, this.center, this.minZoom);
        }
        if (Game.input.isKeyPressed('=')) {
            this.zoomOnPoint(-GameTransformationLayer.KBD_ZOOM_DELTA, this.center, this.minZoom);
        }
    }

    centerOnGrid(x: number, y: number) {
        let dx = this.center.x - x;
        let dy = this.center.y - y;
        this.ctxOrigin.x += dx * this.ctxScale;
        this.ctxOrigin.y += dy * this.ctxScale;
        this.update(0);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.actionLocation && this.actionLifetime < GameTransformationLayer.ACTION_MAX_LIFETIME) {
            ctx.fillStyle = Res.map_action;
            let l = this.actionLifetime / GameTransformationLayer.ACTION_MAX_LIFETIME;
            ctx.globalAlpha = l / 2;
            let x = this.actionLocation.x;
            let y = this.actionLocation.y;
            let r = GameTransformationLayer.ACTION_MAX_RADIUS * (1 - l) / this.ctxScale;
            ctx.beginPath();
            ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.selectionStart) {
            ctx.fillStyle = Res.map_action;
            ctx.strokeStyle = Res.map_action;
            let p = this.transformVToCanvas(Game.input.mousePos);
            let w = p.x - this.selectionStart.x;
            let h = p.y - this.selectionStart.y;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2 / this.ctxScale;
            ctx.strokeRect(this.selectionStart.x, this.selectionStart.y, w, h);
            ctx.globalAlpha = 0.5;
            ctx.fillRect(this.selectionStart.x, this.selectionStart.y, w, h);
        }
        ctx.globalAlpha = 1;
    }
}