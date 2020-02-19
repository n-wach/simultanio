import Grid from "../../gfx/ui/Grid";
import Simul from "../../Simul";
import Label from "../../gfx/ui/Label";
import Button from "../../gfx/ui/Button";
import City from "../entity/City";
import Unit from "../entity/Unit";
import Res from "../Res";
import Game from "../../gfx/Game";
import Icon from "../../gfx/ui/Icon";
import LabelButton from "../../gfx/ui/LabelButton";
import Builder from "../entity/Builder";
import MatterCollector from "../entity/MatterCollector";
import EnergyGenerator from "../entity/EnergyGenerator";

export default class EntityActionList extends Grid {
    cityGrid: Grid;
    generatorGrid: Grid;
    collectorGrid: Grid;
    unitGrid: Grid;
    builderGrid: Grid;
    activeGrid: Grid;
    constructor() {
        super([1], [1]);

        this.cityGrid = new Grid([40, 50, 50], [1]);
        this.cityGrid.addComponent(new ResourceInfoGrid("1", "1", "per second"), 0, 0);
        this.cityGrid.addComponent(new LabelButton("Set Gather Point"), 1, 0, 1, 1, 10, 10);
        this.cityGrid.addComponent(new Label("Train:", "left"), 2, 0);
        this.cityGrid.addComponent(new EntityCreationOption("Scout", 80, 20, 20), 3, 0, 1, 1, 10, 10);
        this.cityGrid.addComponent(new EntityCreationOption("Builder", 20, 80, 20), 4, 0, 1, 1, 10, 10);
        this.cityGrid.addComponent(new EntityCreationOption("Fighter", 60, 10, 20), 5, 0, 1, 1, 10, 10);

        this.collectorGrid = new Grid([40], [1]);
        this.collectorGrid.addComponent(new ResourceInfoGrid("0", "1", "per second"), 0, 0);

        this.generatorGrid = new Grid([40], [1]);
        this.generatorGrid.addComponent(new ResourceInfoGrid("1", "0", "per second"), 0, 0);

        this.unitGrid = new Grid([50], [1]);
        this.unitGrid.addComponent(new LabelButton("Set Target"), 0, 0, 1, 1, 10, 10);
        this.unitGrid.addComponent(new LabelButton("Cancel Path"), 1, 0, 1, 1, 10, 10);

        this.builderGrid = new Grid([50], [1]);
        this.builderGrid.addComponent(new LabelButton("Set Target"), 0, 0, 1, 1, 10, 10);
        this.builderGrid.addComponent(new LabelButton("Cancel Path"), 1, 0, 1, 1, 10, 10);
        this.builderGrid.addComponent(new Label("Build:", "left"), 2, 0);
        this.builderGrid.addComponent(new EntityCreationOption("City", 200, 200, 20), 3, 0, 1, 1, 10, 10);
        this.builderGrid.addComponent(new EntityCreationOption("Generator", 0, 100, 20), 4, 0, 1, 1, 10, 10);
        this.builderGrid.addComponent(new EntityCreationOption("Collector", 100, 0, 20), 5, 0, 1, 1, 10, 10);

        this.addComponent(this.cityGrid, 0, 0);
        this.addComponent(this.unitGrid, 0, 0);
        this.addComponent(this.builderGrid, 0, 0);
        this.addComponent(this.generatorGrid, 0, 0);
        this.addComponent(this.collectorGrid, 0, 0);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg_secondary;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.activeGrid) this.activeGrid.render(ctx);
    }

    update(dt: number): void {
        super.update(dt);
        if(Simul.selectedEntities.length == 0) {
            this.activeGrid = null;
        } else {
            if(Simul.selectedEntities.length == 1) {
                let e = Simul.selectedEntities[0];
                if(e instanceof City) this.activeGrid = this.cityGrid;
                else if(e instanceof MatterCollector) this.activeGrid = this.collectorGrid;
                else if(e instanceof EnergyGenerator) this.activeGrid = this.generatorGrid;
                else if(e instanceof Builder) this.activeGrid = this.builderGrid;
                else if(e instanceof Unit) this.activeGrid = this.unitGrid;
            } else {
                let allBuilders = true;
                for(let e of Simul.selectedEntities) {
                    if(!(e instanceof Builder)) allBuilders = false;
                }
                if(allBuilders) this.activeGrid = this.builderGrid;
                else this.activeGrid = this.unitGrid;
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
    constructor(name: string, energy: number, matter: number, time: number) {
        super(new Grid([1], [1, 30, 30, 30, 30, 50]));
        (this.subComponent as Grid).addComponent(new Label(name), 0, 0);
        (this.subComponent as Grid).addComponent(new Icon("/energy.png"), 0, 1, 1, 1, 0, 10);
        (this.subComponent as Grid).addComponent(new Label(energy.toFixed(0)), 0, 2);
        (this.subComponent as Grid).addComponent(new Icon("/matter.png"), 0, 3, 1, 1, 0, 10);
        (this.subComponent as Grid).addComponent(new Label(matter.toFixed(0)), 0, 4);
        (this.subComponent as Grid).addComponent(new Label(time.toFixed(0) + "s"), 0, 5);
    }
}