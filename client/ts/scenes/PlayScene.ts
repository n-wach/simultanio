import Scene from "../gfx/Scene";
import LobbyScene from "./LobbyScene";
import Game from "../gfx/Game";
import HUD from "../game/ui/HUD";
import Res from "../game/Res";
import {Match} from "../comms";
import Simul from "../Simul";
import GameTransformationLayer from "../game/ren/GameTransformationLayer";

export default class PlayScene extends Scene {
    stage: GameTransformationLayer;

    initialize() {
        Game.clearColor = Res.pal_black;
        
        this.stage = new GameTransformationLayer();
        this.renderables.push(this.stage);

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
