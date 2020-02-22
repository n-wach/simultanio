import Building from "./Building";
import {EntityStateType} from "../../comms";

export default class MatterCollector extends Building {
    static MAX_CIRCLE_RADIUS = 1;
    circleRadius: number = 0;

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.state.type != EntityStateType.IN_CONSTRUCTION_STATE) {
            let a = ctx.globalAlpha;
            ctx.globalAlpha = 0.3 * (MatterCollector.MAX_CIRCLE_RADIUS - this.circleRadius) / MatterCollector.MAX_CIRCLE_RADIUS;
            ctx.ellipse(0, 0, this.circleRadius, this.circleRadius, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = a;
        }
        ctx.beginPath();
        ctx.moveTo(0.2, 0.2);
        ctx.arc(0, 0.2, 0.2, 0, Math.PI, false);
        ctx.lineTo(-0.2, -0.2);
        ctx.arc(0, -0.2, 0.2, Math.PI, 0, false);
        ctx.closePath();
    }

    interpolate(dt: number) {
    }

    update(dt: number): void {
        this.circleRadius -= (MatterCollector.MAX_CIRCLE_RADIUS * dt);
        while(this.circleRadius < 0) this.circleRadius += MatterCollector.MAX_CIRCLE_RADIUS;
    }

    getName(): string {
        return "Collector";
    }
}