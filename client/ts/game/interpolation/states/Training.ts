import {TrainingState} from "../../../comms";
import Idle from "./Idle";

export default class Training extends Idle {
    trainingStatus: number;
    static MAX_CIRCLE_RADIUS = 1;
    circleRadius: number = 0;

    sync(ref: TrainingState) {
        this.trainingStatus = ref.trainingStatus;
        super.sync(ref);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        let a = ctx.globalAlpha;
        let r = Training.MAX_CIRCLE_RADIUS;
        ctx.globalAlpha = 0.3 * (r - this.circleRadius) / r;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.circleRadius, this.circleRadius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.3;
        ctx.fillRect(-0.4, -0.4, 0.8, 0.1);
        ctx.globalAlpha = a;
        ctx.fillRect(-0.4, -0.4, 0.8 * this.trainingStatus, 0.1);
        ctx.globalAlpha = a;
    }

    interpolate(dt: number) {
        let r = Training.MAX_CIRCLE_RADIUS;
        this.circleRadius += (r * dt);
        while (this.circleRadius > r) this.circleRadius -= r;
    }
}