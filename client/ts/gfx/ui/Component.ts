import Renderable from "../Renderable";

export default abstract class Component implements Renderable {
    x: number;
    y: number;
    width: number;
    height: number;

    resize(): void {}

    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract update(dt: number): void;

}