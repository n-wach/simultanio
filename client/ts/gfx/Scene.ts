import { Renderable } from "./Renderable";

export class Scene {
    renderables: Renderable[];

    initialize() {
        this.renderables = [];
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

    remove(ren: Renderable): void {
        this.renderables.splice(this.renderables.indexOf(ren), 1);
    }
}