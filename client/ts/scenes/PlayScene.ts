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
        let hs = s / 2;

        //fill fog first
        ctx.fillStyle = Res.col_fog;
        ctx.fillRect(0, 0,
            Game.match.terrain_view.width * s,
            Game.match.terrain_view.height * s);

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
            for (let x = 0; x < Game.match.terrain_view.width; x++) {
                for (let y = 0; y < Game.match.terrain_view.height; y++) {
                    let tile = Game.match.terrain_view.grid[x][y];
                    if(tile == t) {
                        ctx.rect(x * s, y * s, s * 1.2, s * 1.2);
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

