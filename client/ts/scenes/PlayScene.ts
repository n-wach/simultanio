import { Scene } from "../gfx/Scene";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/ui/HUD";
import { RenderableGroup } from "../gfx/RenderableGroup";
import { Res } from "../game/Res";
import { GameRenderable } from "../game/ren/GameRenderable";
import { MatchInterpolator } from "../game/interpolation/MatchInterpolator";
import { Match } from "../comms";
import { Simul } from "../Simul";
import Button from "../gfx/ui/Button";
import Grid from "../gfx/ui/Grid";

export class PlayScene extends Scene {

    initialize() {

        Game.clearColor = Res.col_bg;
        this.ui = new Grid([40, 1], [1]);
        this.ui.addComponent(new HUD(this), 0, 0);
        this.stage = new GameRenderable();
        Game.socketio.on("game update", (match: Match) => {
            Simul.match.sync(match);
        });
        Game.socketio.on("leave match", () => {
            Game.setScene(new LobbyScene());
        });
    }

    destroy() {

    }

}
