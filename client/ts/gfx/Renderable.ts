export abstract class Renderable {
    abstract update(): void;
    abstract render(ctx: CanvasRenderingContext2D): void;
}