import {RenderableGroup} from "./RenderableGroup";

export abstract class Scene {
    ui: RenderableGroup;
    stage: RenderableGroup;

    abstract initialize();

    abstract destroy();

    update() {
        this.ui.update();
        this.stage.update();
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.stage.render(ctx);
        this.ui.render(ctx);
    }
}
