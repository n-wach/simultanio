import Game from "../Game";
import Grid from "./Grid";
import Component from "./Component";

export default class ScrollComponent extends Component {
    subGrid: Grid;
    verticalOffset: number = 0;

    constructor(subGrid: Grid) {
        super();
        this.subGrid = subGrid;
        let handler = (event) => {
            if (!this.hovered) return false;
            let delta = event.deltaY;
            //convert delta into pixels...
            if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                delta *= 16; // just a guess--depends on inaccessible user settings
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                delta *= 800;  // also just a guess--no good way to predict these...
            }
            this.verticalOffset += delta;
            return true;
        };
        this.handlers.push(handler);
        Game.input.addHandler(handler, "wheel");
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.clip();
        this.subGrid.render(ctx);
        ctx.restore();
    }

    resize() {
        this.subGrid.x = this.x;
        this.subGrid.y = this.y + this.verticalOffset;
        this.subGrid.width = this.width;
        this.subGrid.height = this.height;
        this.subGrid.resize();
    }

    update(dt: number): void {
        super.update(dt);
        if (this.verticalOffset > 0) {
            this.verticalOffset = 0;
        } else {
            let mvo = -Math.abs(Math.max(this.subGrid.requiredHeight() - this.height, 0));
            if (this.verticalOffset < mvo) {
                this.verticalOffset = mvo;
            }
        }
        this.subGrid.y = this.y + this.verticalOffset;
        this.subGrid.update(dt);
    }
}