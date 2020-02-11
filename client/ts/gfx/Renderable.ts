export default interface Renderable {
    update(dt: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}
