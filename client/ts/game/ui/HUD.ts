import { Renderable } from "../../gfx/Renderable";
import {PlayScene} from "../../scenes/PlayScene";
import {Game} from "../../gfx/Game";
import { Res } from "../Res";
import { Simul } from "../../Simul";
import Component from "../../gfx/ui/Component";

export class HUD extends Component {
    playScene: PlayScene;

    constructor(playScene: PlayScene) {
        super();
        this.playScene = playScene;
    }

    update(): void {

    }

    render(ctx: CanvasRenderingContext2D): void {
        let w = ctx.canvas.width;

        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(0, 0, w, 30);

        let time = Simul.match.info.duration.toFixed(0);
        ctx.fillStyle = Res.col_uifg;
        ctx.font = Res.font_ui;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Time: " + time + " seconds", w / 2, 15);

        let energy = Simul.match.you.storedEnergy.toFixed(0);

        ctx.fillStyle = Res.col_uifg_accent;
        ctx.font = Res.font_ui;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("ENG: " + energy, w - 160, 15, 80);

        let matter = Simul.match.you.storedMatter.toFixed(0);
        ctx.fillStyle = Res.col_uifg_accent;
        ctx.font = Res.font_ui;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("MAT: " + matter, w - 80, 15, 80);

        let your_color = Simul.match.you.color;
        ctx.fillStyle = your_color;
        ctx.font = Res.font_ui;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(your_color + " (you)", w - 5, 30 + 20, 100);

        let i = 0;
        for(let o in Simul.match.otherPlayers) {
            let y = 50 + 25 + i * 25;
            let other_player = Simul.match.otherPlayers[o];
            ctx.fillStyle = other_player.color;
            ctx.fillText(other_player.color, w - 40, y, 60);
            i++;
        }
    }
}