import Renderable from "./Renderable";
import Grid from "./ui/Grid";

export default abstract class Scene {
    ui: Grid;
    renderables: Renderable[] = [];

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
        for (var i = 0; i < this.renderables.length; i++) {
            this.renderables[i].update(dt);
        }
        if(this.ui) this.ui.update(dt);
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (var i = 0; i < this.renderables.length; i++) {
            this.renderables[i].render(ctx);
        }
        if(this.ui) this.ui.render(ctx);
    }
}
