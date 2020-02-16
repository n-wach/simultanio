import Grid from "../../gfx/ui/Grid";
import Icon from "../../gfx/ui/Icon";
import Button from "../../gfx/ui/Button";
import Game from "../../gfx/Game";
import Res from "../Res";
import Label from "../../gfx/ui/Label";
import Simul from "../../Simul";

export default class TopBar extends Grid {
    constructor() {
        super([1.0], [40, 60, 40, 60, 100, 1.0, 40]);
        Game.input.addHandler((event) => {
            return this.hovered;
        }, "mousedown");
        this.addComponent(new Icon("/energy.png"), 0, 0, 1, 1, 10);
        this.addComponent(new EnergyLabel(), 0, 1);
        this.addComponent(new Icon("/matter.png"), 0, 2, 1, 1, 10);
        this.addComponent(new MatterLabel(), 0, 3);
        this.addComponent(new TimeLabel(), 0, 4, 1, 1, 0);
        this.addComponent(new Button("X", () => {
            Game.socketio.emit("leave match");
        }), 0, 6, 1, 1, 5);
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        super.render(ctx);
    }
}


class TimeLabel extends Label {
    constructor() {
        super("Waiting...", "left");
    }
    update(dt: number): void {
        super.update(dt);
        this.text = "Time: " + Simul.match.info.duration.toFixed(0);
    }
}


class EnergyLabel extends Label {
    constructor() {
        super("0", "left");
    }
    update(dt: number): void {
        super.update(dt);
        this.text = Simul.match.you.storedEnergy.toFixed(0);
    }
}


class MatterLabel extends Label {
    constructor() {
        super("0", "left");
    }
    update(dt: number): void {
        super.update(dt);
        this.text = Simul.match.you.storedMatter.toFixed(0);
    }
}
