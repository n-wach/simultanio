import { Renderable } from "../../gfx/Renderable";
import { Entity, EntityVariation } from "../../comms";
import { Game } from "../../gfx/Game";

export class EntitiesRenderable extends Renderable {
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