import { Scene } from "../gfx/Scene";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/ui/HUD";
import { Res } from "../game/Res";
import { GameRenderable } from "../game/ren/GameRenderable";
import { Match } from "../comms";
import { Simul } from "../Simul";
export class PlayScene extends Scene {

    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new HUD(this);
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
