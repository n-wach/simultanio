import Renderable from "../../gfx/Renderable";
import {BaseEntity, Id} from "../../comms";
import Interpolated from "./Interpolated";
import GameRenderable from "../ren/GameRenderable";

export default abstract class EntityInterpolator extends Interpolated<BaseEntity> implements Renderable {
    x: number;
    y: number;
    id: Id;

    constructor(ref: BaseEntity) {
        super();
        this.sync(ref);
    }

    sync(ref: BaseEntity) {
        super.sync(ref);
        this.id = ref.id;
        this.x = ref.x;
        this.y = ref.y;
    }

    render(ctx: CanvasRenderingContext2D): void {
        let s = GameRenderable.TILE_SIZE;
        let hs = s / 2;
        ctx.translate(hs + s * this.x, hs + s * this.y);
        this.draw(ctx);
        ctx.translate(-(hs + s * this.x), -(hs + s * this.y));
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract update(dt: number): void;
}
