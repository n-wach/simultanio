import Grid from "../../gfx/ui/Grid";
import Simul from "../../Simul";
import Label from "../../gfx/ui/Label";
import Button from "../../gfx/ui/Button";
import City from "../entity/City";
import Unit from "../entity/Unit";
import Res from "../Res";
import Game from "../../gfx/Game";
import Icon from "../../gfx/ui/Icon";

export default class EntityActionList extends Grid {
    cityGrid: Grid;
    unitGrid: Grid;
    activeGrid: Grid;
    constructor() {
        super([1], [1]);

        this.cityGrid = new Grid([40, 50, 50], [1/3, 1/3, 1/3]);
        this.cityGrid.addComponent(new ResourceInfoGrid("1", "1", "per second"), 0, 0, 1, 3);
        this.cityGrid.addComponent(new Button("Set Gather Point"), 1, 0, 1, 3, 10, 10);
        this.cityGrid.addComponent(new Label("Train:", "left"), 2, 0, 1, 3);
        this.cityGrid.addComponent(new Label("Scout", "left"), 3, 0, 0, 10);
        this.cityGrid.addComponent(new ResourceInfoGrid("40", "20", ""), 3, 1, 1, 2, 0, 10);
        this.cityGrid.addComponent(new Label("Fighter", "left"), 4, 0, 0, 10);
        this.cityGrid.addComponent(new ResourceInfoGrid("60", "10", ""), 4, 1, 1, 2, 0, 10);
        this.cityGrid.addComponent(new Label("Builder", "left"), 5, 0, 0, 10);
        this.cityGrid.addComponent(new ResourceInfoGrid("10", "60", ""), 5, 1, 1, 2, 0, 10);

        this.unitGrid = new Grid([50], [1/3, 1/3, 1/3]);
        this.unitGrid.addComponent(new Button("Set Target"), 0, 0, 1, 3, 10, 10);
        this.unitGrid.addComponent(new Button("Cancel Path"), 1, 0, 1, 3, 10, 10);

        this.addComponent(this.cityGrid, 0, 0);
        this.addComponent(this.unitGrid, 0, 0);
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg_accent;
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
                if(e instanceof Unit) this.activeGrid = this.unitGrid;
            } else {
                this.activeGrid = this.unitGrid;
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