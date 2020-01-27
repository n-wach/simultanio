import {Renderable} from "./Renderable";

export class RenderableGroup extends Renderable {
    renderables: Renderable[];

    constructor(...renderables: Renderable[]) {
        super();
        this.renderables = renderables;
    }


    update() {
        for (let renderable of this.renderables) {
            renderable.update();
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (let renderable of this.renderables) {
            renderable.render(ctx);
        }
    }

    add(ren: Renderable): void {
        this.renderables.push(ren);
    }

    clear(): void {
        this.renderables = [];
    }

    remove(ren: Renderable): void {
        this.renderables.splice(this.renderables.indexOf(ren), 1);
    }
}