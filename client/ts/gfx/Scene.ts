import {Renderable} from "./Renderable";
import Grid from "./ui/Grid";
import {Game} from "./Game";

export abstract class Scene {
    ui: Grid;
    stage: Renderable;

    abstract initialize();

    abstract destroy();

    resize() {
        if(this.ui) {
            this.ui.width = Game.canvas.width;
            this.ui.height = Game.canvas.height;
            this.ui.x = 0;
            this.ui.y = 0;
            this.ui.resize();
        }
    }

    update(dt: number) {
        if(this.stage) this.stage.update(dt);
        if(this.ui) this.ui.update(dt);
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(this.stage) this.stage.render(ctx);
        if(this.ui) this.ui.render(ctx);
    }
}
