import { Renderable } from "./Renderable";

export abstract class Scene {
    renderables: Renderable[];

    initialize() {
        this.renderables = [];
    }

    destroy() {
        // TODO: ...
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