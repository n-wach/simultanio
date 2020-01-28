import { Scene } from "../gfx/Scene";
import { Button } from "../gfx/ui/Button";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/HUD";
import {Entity, EntityVariation, Match, PlayerCommand, TerrainTile, TerrainView} from "../comms";
import { RenderableGroup } from "../gfx/RenderableGroup";
import { Vec2 } from "../gfx/Vec2";
import { Renderable } from "../gfx/Renderable";
import { Res } from "../game/Res";
import {Sprite} from "../gfx/Sprite";
import {RenderCanvas} from "../gfx/RenderCanvas";

export class PlayScene extends Scene {
    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new RenderableGroup(new HUD(this),
            new Button("Leave", 5, 5, 100, 20, () => {
                Game.socketio.emit("leave match");
            }));
        this.stage = new GameRenderable();
        Game.socketio.on("game update", (match: Match) => {
            Game.match = match;
        });
        Game.socketio.on("leave match", () => {
            Game.setScene(new LobbyScene());
        });
    }

    destroy() {

    }

}


class TerrainRenderable extends Renderable {
    static GRID_CELL_SIZE = 10;
    
    render(ctx: CanvasRenderingContext2D): void {
        let s = TerrainRenderable.GRID_CELL_SIZE;
        let c = s * 0.2;
        let hs = s / 2;
        let w = Game.match.terrain_view.width;
        let h = Game.match.terrain_view.height;
        let g = Game.match.terrain_view.grid;

        //fill fog first
        ctx.fillStyle = Res.col_fog;
        ctx.fillRect(0, 0, w * s, h * s);

        /*
           TODO so this kinda speeds things up, but it's nowhere near fast enough for a large,
            explored grid (say 500x500)...
            i also tried rendering to a RenderCanvas and drawing that,
            but normal putImageData doesn't respect transformation matrix
            using drawImage instead (passing the canvas) works but is jittery for large
            terrains any ideas would be welcome
         */
        for(let v in TerrainTile) {
            let t = TerrainTile[v];
            if(t == TerrainTile.UNKNOWN) continue;
            if(t == TerrainTile.LAND) ctx.fillStyle = Res.col_land;
            if(t == TerrainTile.WATER) ctx.fillStyle = Res.col_water;
            if(t == TerrainTile.MATTER_SOURCE) ctx.fillStyle = Res.col_matter;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y];
                    if(tile == t) {
                        ctx.rect(x * s, y * s, s, s);
                    } else {
                        let left = t;
                        let right = t;
                        let top = t;
                        let bot = t;
                        if (x > 0) left = g[x - 1][y];
                        if (x < w - 1) right = g[x + 1][y];
                        if (y > 0) top = g[x][y - 1];
                        if (y < h - 1) bot = g[x][y + 1];

                        if(left == t && top == t) {
                            ctx.moveTo(x * s, y * s);
                            ctx.lineTo(x * s + c, y * s);
                            ctx.lineTo(x * s, y * s + c);
                            ctx.closePath();
                        }
                        if(top == t && right == t) {
                            ctx.moveTo((x + 1) * s, y * s);
                            ctx.lineTo((x + 1) * s - c, y * s);
                            ctx.lineTo((x + 1) * s, y * s + c);
                            ctx.closePath();
                        }
                        if(right == t && bot == t) {
                            ctx.moveTo((x + 1) * s, (y + 1) * s);
                            ctx.lineTo((x + 1) * s - c, (y + 1) * s);
                            ctx.lineTo((x + 1) * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                        if(bot == t && left == t) {
                            ctx.moveTo(x * s, (y + 1) * s);
                            ctx.lineTo(x * s + c, (y + 1) * s);
                            ctx.lineTo(x * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                    }
                }
            }
            ctx.fill();
        }

        for(let v in TerrainTile) {
            let t = TerrainTile[v];
            if(t == TerrainTile.UNKNOWN) ctx.fillStyle = Res.col_fog;
            if(t == TerrainTile.LAND) ctx.fillStyle = Res.col_land;
            if(t == TerrainTile.WATER) ctx.fillStyle = Res.col_water;
            if(t == TerrainTile.MATTER_SOURCE) ctx.fillStyle = Res.col_matter;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y];
                    if(tile != t) {
                        let left = t;
                        let right = t;
                        let top = t;
                        let bot = t;
                        if (x > 0) left = g[x - 1][y];
                        if (x < w - 1) right = g[x + 1][y];
                        if (y > 0) top = g[x][y - 1];
                        if (y < h - 1) bot = g[x][y + 1];

                        if(left == t && top == t) {
                            ctx.moveTo(x * s, y * s);
                            ctx.lineTo(x * s + c, y * s);
                            ctx.lineTo(x * s, y * s + c);
                            ctx.closePath();
                        }
                        if(top == t && right == t) {
                            ctx.moveTo((x + 1) * s, y * s);
                            ctx.lineTo((x + 1) * s - c, y * s);
                            ctx.lineTo((x + 1) * s, y * s + c);
                            ctx.closePath();
                        }
                        if(right == t && bot == t) {
                            ctx.moveTo((x + 1) * s, (y + 1) * s);
                            ctx.lineTo((x + 1) * s - c, (y + 1) * s);
                            ctx.lineTo((x + 1) * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                        if(bot == t && left == t) {
                            ctx.moveTo(x * s, (y + 1) * s);
                            ctx.lineTo(x * s + c, (y + 1) * s);
                            ctx.lineTo(x * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                    }
                }
            }
            ctx.fill();
        }


        //border
        ctx.strokeStyle = Res.col_uibg;
        ctx.lineWidth = 10;
        ctx.strokeRect(-hs, -hs,
            Game.match.terrain_view.width * s + s,
            Game.match.terrain_view.height * s + s);

    }

    update(): void {

    }
}

class EntitiesRenderable extends Renderable {
    update(): void {
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Game.match.you.color;
        EntitiesRenderable.drawEntities(ctx, Game.match.you.entities);
        for (let player of Game.match.other_players) {
            ctx.fillStyle = player.color;
            EntitiesRenderable.drawEntities(ctx, player.entities);
        }
    }

    static drawEntities(ctx: CanvasRenderingContext2D, entities: Entity[]) {
        for (let entity of entities) {
            ctx.moveTo(entity.x, entity.y);
            ctx.beginPath();
            switch (entity.variation) {
                case EntityVariation.UNKNOWN:
                    console.error("tried to draw unknown entity:", entity);
                    break;
                case EntityVariation.CITY:
                    // TODO replace with draw sprite
                    ctx.arc(5 + entity.x * 10, 5 + entity.y * 10, 7, 0, Math.PI * 2);
                    break;
                case EntityVariation.UNIT:
                    ctx.rect(2 + entity.x * 10, 2 + entity.y * 10, 6, 6);
                    break;
            }
            ctx.fill();
        }
    }
}

class GameRenderable extends RenderableGroup {
    constructor() {
        super();
        Game.input.addHandler((event) => {
            let p = this.transformToCanvas(event);
            Game.socketio.emit("player command", ({
                command: "set target",
                x: p.x / 10,
                y: p.y / 10,
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

