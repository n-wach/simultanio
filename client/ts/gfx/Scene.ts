import {RenderableGroup} from "./RenderableGroup";

export abstract class Scene {
    ui: RenderableGroup;
    stage: RenderableGroup;

    abstract initialize();

    abstract destroy();

    update() {
        if(this.stage) this.stage.update();
        if(this.ui) this.ui.update();
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(this.stage) this.stage.render(ctx);
        if(this.ui) this.ui.render(ctx);
    }
}
