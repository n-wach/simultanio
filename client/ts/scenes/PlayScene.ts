import Scene from "../gfx/Scene";
import LobbyScene from "./LobbyScene";
import Game from "../gfx/Game";
import HUD from "../game/ui/HUD";
import Res from "../game/Res";
import {GameTransformationLayer} from "../game/ren/GameRenderable";
import {Match} from "../comms";
import Simul from "../Simul";

export default class PlayScene extends Scene {
    initialize() {
        Game.clearColor = Res.pal_black;
        this.stage = new GameTransformationLayer();
        this.ui = new HUD();
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
