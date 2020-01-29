import { Renderable } from "../../gfx/Renderable";
import { Entity, EntityVariation, Match } from "../../comms";
import { Game } from "../../gfx/Game";
import { MatchInterpolator } from "../MatchInterpolator";
import { Simul } from "../../Simul";
import {TerrainRenderable} from "./TerrainRenderable";

export class EntitiesRenderable extends Renderable {
    update(): void {
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Simul.match.you.color;
        EntitiesRenderable.drawEntities(ctx, Simul.match.you.entities);
        for (let player of Simul.match.others) {
            ctx.fillStyle = player.color;
            EntitiesRenderable.drawEntities(ctx, player.entities);
        }
    }

    static drawEntities(ctx: CanvasRenderingContext2D, entities: Entity[]) {
        let s = TerrainRenderable.GRID_CELL_SIZE;
        let hs = s / 2;
        for (let entity of entities) {
            ctx.moveTo(entity.x, entity.y);
            ctx.beginPath();
            switch (entity.variation) {
                case EntityVariation.UNKNOWN:
                    console.error("tried to draw unknown entity:", entity);
                    break;
                case EntityVariation.CITY:
                    // TODO replace with draw sprite
                    ctx.arc(hs + entity.x * s, hs + entity.y * s, s * 0.7, 0, Math.PI * 2);
                    break;
                case EntityVariation.UNIT:
                    ctx.rect(s * 0.2 + entity.x * s, s * 0.2 + entity.y * s, s * 0.6, s * 0.6);
                    break;
            }
            ctx.fill();
        }
    }
}