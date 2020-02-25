import Vec2 from "../../gfx/Vec2";
import Game from "../../gfx/Game";
import {BuildingType, PlayerCommand} from "../../comms";
import Simul from "../../Simul";

export class EntityAction {
    name: string;
    onuse: (gridPos: Vec2) => void;
    constructor(name: string, onuse: (gridPos: Vec2) => void) {
        this.name = name;
        this.onuse = onuse;
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
}

export class BuildAction extends EntityAction {
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
            // Simul.selectedEntityAction = new TargetAction();
        });
    }
}
