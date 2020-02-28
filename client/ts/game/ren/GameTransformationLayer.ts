import TransformableLayer from "../../gfx/TransformableLayer";
import Vec2 from "../../gfx/Vec2";
import Game from "../../gfx/Game";
import Simul from "../../Simul";
import Res from "../Res";
import GameRenderable from "./GameRenderable";
import Unit from "../interpolation/entity/Unit";
import {TargetAction} from "../ui/EntityAction";

export default class GameTransformationLayer extends TransformableLayer {
    static PAN_SPEED = 5;
    static FAST_PAN_MULT = 5;
    static KBD_ZOOM_DELTA = 48;
    static EDGE_PAN_PROX = 15;
    minZoom: number;
    maxZoom: number;
    topLeftGrid: Vec2 = new Vec2(0, 0);
    topRightGrid: Vec2 = new Vec2(0, 0);
    bottomLeftGrid: Vec2 = new Vec2(0, 0);
    bottomRightGrid: Vec2 = new Vec2(0, 0);
    center: Vec2 = new Vec2(0, 0);
    selectionStart: Vec2 = null;

    constructor() {
        super();
        Game.input.addHandler((event) => {
            if(event.button == 0 && Simul.selectedEntities.length == 0) {
                let p = this.transformToCanvas(event);
                let closest = null;
                let closestDist = 0;
                for(let e in Simul.match.you.entities) {
                    let en = Simul.match.you.entities[e];
                    let dx = en.x - p.x;
                    let dy = en.y - p.y;
                    let dd2 = dx * dx + dy * dy;
                    if(dd2 < 0.3) {
                        if(!closest || (closest && closestDist > dd2)) {
                            closest = en;
                            closestDist = dd2;
                        }
                    }
                }
                if(closest) {
                    Simul.selectedEntities = [closest];
                } else {
                    Simul.selectedEntities = [];
                }
                return true;
            }
            return false;
        }, "click");

        Game.input.addHandler((event) => {
            let g = this.transformToCanvas(event);
            let q = new Vec2(Math.floor(g.x + 0.5), Math.floor(g.y + 0.5));
            if (event.button == 2) {
                if (Simul.selectedEntityAction) Simul.selectedEntityAction.onuse(q);
                return true;
            } else if (event.button == 0) {
                this.selectionStart = g;
                return true;
            }
            return false;
        }, "mousedown");
        Game.input.addHandler((event) => {
            if(event.button == 0) {
                this.selectionStart = null;
            }
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

        let minH = (Game.width - 250) / Simul.match.terrainView.width;
        let minV = (Game.height - 40) / Simul.match.terrainView.height;
        this.minZoom = Math.max(minH, minV);
        this.maxZoom = this.minZoom * Simul.match.terrainView.width / 2;

        // - view navigation
        this.updateNavigationInput();

        let p = Game.input.mousePos;
        let s = GameTransformationLayer.PAN_SPEED;

        if (Game.input.mouseOnScreen) {
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

        let px = this.transformVToCanvas(p);
        if (this.selectionStart) {
            // reset entity action to default
            Simul.selectedEntityAction = new TargetAction();
            let s = [];
            for (let o in Simul.match.you.entities) {
                let e = Simul.match.you.entities[o];
                if (e instanceof Unit) {
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

        if (Simul.selectedEntityAction) Simul.selectedEntityAction.update(dt);
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
            this.zoomOnPoint(GameTransformationLayer.KBD_ZOOM_DELTA, this.center, this.minZoom, this.maxZoom);
        }
        if (Game.input.isKeyPressed('=')) {
            this.zoomOnPoint(-GameTransformationLayer.KBD_ZOOM_DELTA, this.center, this.minZoom, this.maxZoom);
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
        let p = this.transformVToCanvas(Game.input.mousePos);
        let q = new Vec2(Math.floor(p.x + 0.5), Math.floor(p.y + 0.5));

        if (Simul.selectedEntityAction) Simul.selectedEntityAction.render(ctx, this.ctxScale, q);

        if (this.selectionStart) {
            ctx.fillStyle = Res.map_action;
            ctx.strokeStyle = Res.map_action;
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