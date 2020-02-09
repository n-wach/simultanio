import Building from "./Building";

export default class City extends Building {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.rect(-40, -40, 80, 80);
    }

    interpolate(dt: number) {

    }

    update(dt: number): void {

    }
}