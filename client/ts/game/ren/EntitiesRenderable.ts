import { Renderable } from "../../gfx/Renderable";
import { Entity, EntityVariation, Match } from "../../comms";
import { Game } from "../../gfx/Game";
import { MatchInterpolator } from "../MatchInterpolator";

export class EntitiesRenderable extends Renderable {
    knowledge: MatchInterpolator;

    constructor(knowledge: MatchInterpolator) {
        super();
        this.knowledge = knowledge;
    }

    update(): void {
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.knowledge.you.color;
        EntitiesRenderable.drawEntities(ctx, this.knowledge.you.entities);
        for (let player of this.knowledge.others) {
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