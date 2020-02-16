import Renderable from "../../gfx/Renderable";
import {BaseEntity, Id} from "../../comms";
import Interpolated from "./Interpolated";

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
        ctx.translate(this.x, this.y);
        this.draw(ctx);
        ctx.translate(-this.x, -this.y);
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract update(dt: number): void;
}
