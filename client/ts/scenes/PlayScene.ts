import { Scene } from "../gfx/Scene";
import { Button } from "../gfx/ui/Button";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/ui/HUD";
import { Entity, EntityVariation, Match, PlayerCommand, TerrainTile } from "../comms";
import { RenderableGroup } from "../gfx/RenderableGroup";
import { Vec2 } from "../gfx/Vec2";
import { Renderable } from "../gfx/Renderable";
import { Thing } from "../game/sprites/Thing";
import { Res } from "../game/Res";
import { MatchInterpolator } from "../game/MatchInterpolator";

export class PlayScene extends Scene {
    public things: Thing[];
    public knowledge: MatchInterpolator;

    initialize() {
        Game.clearColor = Res.col_bg;
        this.knowledge = new MatchInterpolator();
        this.ui = new RenderableGroup(new HUD(this),
            new Button("Leave", 5, 5, 100, 20, () => {
                Game.socketio.emit("leave match");
            }));
        this.stage = new GameRenderable();
        Game.socketio.on("game update", (match: Match) => {
            this.knowledge.update(match);
        });
        Game.socketio.on("leave match", () => {
            Game.setScene(new LobbyScene());
        });
    }

    update() {
        
    }

    destroy() {

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
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.ctxOrigin.x, this.ctxOrigin.y);
        ctx.scale(this.ctxScale, this.ctxScale);

        ctx.strokeStyle = Res.col_uibg;
        ctx.lineWidth = 10;
        ctx.strokeRect(-5, -5, this.knowledge.terrain_view.width * 10 + 10, this.knowledge.terrain_view.height * 10 + 10);
        for (let x = 0; x < this.knowledge.terrain_view.width; x++) {
            for (let y = 0; y < this.knowledge.terrain_view.height; y++) {
                let tile = this.knowledge.terrain_view.grid[x][y];
                switch (tile) {
                    case TerrainTile.LAND:
                        ctx.fillStyle = Res.col_land;
                        break;
                    case TerrainTile.WATER:
                        ctx.fillStyle = Res.col_water;
                        break;
                    case TerrainTile.MATTER_SOURCE:
                        ctx.fillStyle = Res.col_matter;
                        break;
                    case TerrainTile.UNKNOWN:
                        ctx.fillStyle = Res.col_fog;
                        break;
                }
                ctx.fillRect(x * 10, y * 10, 11, 11);
            }
        }

        ctx.fillStyle = Game.match.you.color;
        GameRenderable.drawEntities(ctx, Game.match.you.entities);
        for (let player of Game.match.other_players) {
            ctx.fillStyle = player.color;
            GameRenderable.drawEntities(ctx, player.entities);
        }
        ctx.restore();
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

