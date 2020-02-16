import Component from "../../gfx/ui/Component";
import Grid from "../../gfx/ui/Grid";
import Simul from "../../Simul";

export default class EntityActionList extends Component {
    allGrids: Grid[] = [];
    activeGrid: Grid;
    constructor() {
        super();

    }

    resize(): void {
        super.resize();
        for(let grid of this.allGrids) {
            grid.resize();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(this.activeGrid) this.activeGrid.render(ctx);
    }

    update(dt: number): void {
        super.update(dt);
        if(Simul.selectedEntities.length == 0) {
            this.activeGrid = null;
        } else {
            if(Simul.selectedEntities.length == 1) {

            }
        }
        if(this.activeGrid) this.activeGrid.update(dt);
    }
}