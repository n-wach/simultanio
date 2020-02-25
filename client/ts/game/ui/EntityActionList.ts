import Grid from "../../gfx/ui/Grid";
import Simul from "../../Simul";
import Label from "../../gfx/ui/Label";
import Button from "../../gfx/ui/Button";
import Res from "../Res";
import Game from "../../gfx/Game";
import Icon from "../../gfx/ui/Icon";
import LabelButton from "../../gfx/ui/LabelButton";
import {BuildAction} from "./EntityAction";
import {EntityType, PlayerCommand} from "../../comms";

export default class EntityActionList extends Grid {
    selectionTypes: EntityType[] = [];

    constructor() {
        super([40], [1.0]);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg_secondary;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }

    update(dt: number): void {
        super.update(dt);
        let newTypes = [];
        let same = true;
        for (let i = 0; i < Simul.selectedEntities.length; i++) {
            newTypes.push(Simul.selectedEntities[i].type);
            if (this.selectionTypes.length <= i || newTypes[i] != this.selectionTypes[i]) same = false;
        }
        if (newTypes.length != this.selectionTypes.length) same = false;
        if (!same) {
            this.selectionTypes = newTypes;
            this.regenerate();
        }
    }

    regenerate() {
        this.clear();
        this.nRows = 1;
        this.nCols = 1;
        let allGenerate = true;
        let allCanBuild = true;
        let allCanPath = true;
        let allCanTrain = true;
        let sharedType = undefined;
        for (let t of this.selectionTypes) {
            if (sharedType == undefined) sharedType = t;
            else if (sharedType != t) sharedType = null;
            let d = Simul.STATS[t];
            allGenerate = allGenerate && d["generates"] != undefined;
            allCanBuild = allCanBuild && d["can_build"] != undefined;
            allCanPath = allCanPath && d["movement_speed"] != undefined;
            allCanTrain = allCanTrain && d["can_train"] != undefined;
        }

        let row = 0;
        if (allGenerate && sharedType) {
            let rates = Simul.STATS[sharedType]["generates"];
            this.addComponent(new ResourceInfoGrid(rates.energy, rates.matter, "per second"), row++, 0);
        }
        if (allCanPath && sharedType != undefined) {
            this.addComponent(new LabelButton("Set Target"), row++, 0, 1, 1, 10, 10);
            this.addComponent(new LabelButton("Cancel Path"), row++, 0, 1, 1, 10, 10);
        }
        if (allCanBuild && sharedType) {
            this.addComponent(new Label("Build:"), row++, 0, 1, 1, 10, 10);
            for (let type of Simul.STATS[sharedType]["can_build"]) {
                let b = Simul.STATS[type];
                this.addComponent(new EntityCreationOption(b.name, b.cost.energy, b.cost.matter, 0, () => {
                    Simul.selectedEntityAction = new BuildAction(type);
                }), row++, 0, 1, 1, 10, 10);
            }
        }
        if (allCanTrain && sharedType) {
            this.addComponent(new LabelButton("Set Gather Point"), row++, 0, 1, 1, 10, 10);
            this.addComponent(new Label("Train:"), row++, 0, 1, 1, 10, 10);
            for (let type of Simul.STATS[sharedType]["can_train"]) {
                let e = Simul.STATS[type];
                this.addComponent(new EntityCreationOption(e.name, e.cost.energy, e.cost.matter, e.cost.time, () => {
                    Game.socketio.emit("player command", ({
                        command: "train",
                        unitType: type,
                        building: Simul.selectedEntities[0].id,
                    } as PlayerCommand));
                }), row++, 0, 1, 1, 10, 10);
            }
        }
    }
}

class ResourceInfoGrid extends Grid {
    constructor(energy: string, matter: string, time: string) {
        super([40], [40, 20, 10, 40, 20, 10, 1.0]);
        Game.input.addHandler((event) => {
            return this.hovered;
        }, "mousedown");
        this.addComponent(new Icon("/energy.png"), 0, 0, 1, 1, 10, 10);
        this.addComponent(new Label(energy, "left"), 0, 1);
        this.addComponent(new Icon("/matter.png"), 0, 3, 1, 1, 10, 10);
        this.addComponent(new Label(matter, "left"), 0, 4);
        this.addComponent(new Label(time, "left"), 0, 6);
    }
}

class EntityCreationOption extends Button {
    constructor(name: string, energy: number, matter: number, time: number, onclick?: () => void) {
        super(new Grid([1], [1, 20, 30, 20, 30, 50]), onclick);
        (this.subComponent as Grid).addComponent(new Label(name), 0, 0);
        (this.subComponent as Grid).addComponent(new Icon("/energy.png"), 0, 1, 1, 1, 0, 10);
        (this.subComponent as Grid).addComponent(new Label(energy.toFixed(0)), 0, 2);
        (this.subComponent as Grid).addComponent(new Icon("/matter.png"), 0, 3, 1, 1, 0, 10);
        (this.subComponent as Grid).addComponent(new Label(matter.toFixed(0)), 0, 4);
        (this.subComponent as Grid).addComponent(new Label(time.toFixed(0) + "s"), 0, 5);
    }
}