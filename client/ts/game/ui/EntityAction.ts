import Vec2 from "../../gfx/Vec2";
import Game from "../../gfx/Game";
import {BuildingType, Entity, PlayerCommand} from "../../comms";
import Simul from "../../Simul";
import Res from "../Res";
import Building from "../interpolation/entity/Building";
import getEntity from "../interpolation/EntityCreator";

export abstract class EntityAction {
    name: string;
    onuse: (gridPos: Vec2) => void;
    uses: { age: number, gridPos: Vec2 }[] = [];
    constructor(name: string, onuse: (gridPos: Vec2) => void) {
        this.name = name;
        this.onuse = (gridPos: Vec2) => {
            this.uses.push({age: 0, gridPos: gridPos});
            onuse(gridPos);
        }
    }

    abstract renderHover(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2);

    abstract renderUse(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2, age: number);

    update(dt: number) {
        for (let i = 0; i < this.uses.length; i++) {
            this.uses[i].age += dt;
            if (this.uses[i].age > 5) {
                this.uses.splice(i, 1);
                i--;
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, scale: number, mouseGridPos: Vec2) {
        this.renderHover(ctx, scale, mouseGridPos);
        for (let use of this.uses) {
            this.renderUse(ctx, scale, use.gridPos, use.age);
        }
    }
}

export class TargetAction extends EntityAction {
    constructor() {
        super("Set Target", (gridPos: Vec2) => {
            let ids = [];
            for(let e of Simul.selectedEntities) {
                ids.push(e.id);
            }
            if(ids.length > 0) {
                Game.socketio.emit("player command", ({
                    command: "set target",
                    ids: ids,
                    x: gridPos.x,
                    y: gridPos.y,
                } as PlayerCommand));
            }
        });
    }

    renderHover(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2) {

    }

    renderUse(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2, age: number) {
        if (age > 0.5) return;
        ctx.fillStyle = Res.map_action;
        let l = age / 0.5;
        ctx.globalAlpha = l / 2;
        let r = (50 / scale) * (1 - l);
        ctx.beginPath();
        ctx.ellipse(gridPos.x, gridPos.y, r, r, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class BuildAction extends EntityAction {
    building: Building;
    constructor(buildingType: BuildingType) {
        super("Build", (gridPos: Vec2) => {
            let ids = [];
            for (let e of Simul.selectedEntities) {
                ids.push(e.id);
            }
            if (ids.length > 0) {
                Game.socketio.emit("player command", ({
                    command: "build",
                    buildingType: buildingType,
                    ids: ids,
                    x: gridPos.x,
                    y: gridPos.y,
                } as PlayerCommand));
            }
        });
        this.building = getEntity({
            type: buildingType,
            state: {type: "ghost"},
            health: 0,
            x: null,
            y: null,
        } as Entity);
    }

    renderHover(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2) {
        this.building.x = gridPos.x;
        this.building.y = gridPos.y;
        ctx.fillStyle = Res.player_colors[Simul.match.you.color].style;
        this.building.render(ctx);
    }

    renderUse(ctx: CanvasRenderingContext2D, scale: number, gridPos: Vec2, age: number) {
        if (age > 1.2) return;
        let l = age / 1.2;
        ctx.globalAlpha = (1 - l) / 4;
        let r = l * 5;
        ctx.beginPath();
        ctx.ellipse(gridPos.x, gridPos.y, r, r, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
