import Renderable from "./Renderable";
import Grid from "./ui/Grid";

export default abstract class Scene {
    ui: Grid;
    stage: Renderable;

    abstract initialize();

    abstract destroy();

    resize() {
        if(this.ui) {
            this.ui.width = window.innerWidth;
            this.ui.height = window.innerHeight;
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
