import Game from "../Game";
import Res from "../../game/Res";
import Component from "./Component";

export default class Button extends Component {
    onclick: () => void;
    subComponent: Component;

    constructor(subComponent: Component, onclick?: () => void) {
        super();
        this.subComponent = subComponent;
        this.onclick = onclick;
        let handler = (event) => {
            if(this.hovered) {
                if (this.onclick) this.onclick();
                return true;
            }
            return false;
        };
        this.handlers.push(handler);
        Game.input.addHandler(handler, "mouseup");
    }
    
    render(ctx: CanvasRenderingContext2D): void {
        if(this.hovered) {
            ctx.fillStyle = Res.col_uibg_accent;
        } else {
            ctx.fillStyle = Res.col_uibg;
        }
        ctx.fillRect(this.x, this.y , this.width, this.height);
        this.subComponent.render(ctx);
    }

    resize() {
        this.subComponent.x = this.x;
        this.subComponent.y = this.y;
        this.subComponent.width = this.width;
        this.subComponent.height = this.height;
        this.subComponent.resize();
    }

    update(dt: number): void {
        super.update(dt);
        this.subComponent.update(dt);
    }
}