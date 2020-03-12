import Scene from "../gfx/Scene";
import Game from "../gfx/Game";
import {Match, MatchList} from "../comms";
import Res from "../game/Res";
import Simul from "../Simul";
import MatchInterpolator from "../game/interpolation/MatchInterpolator";
import Grid from "../gfx/ui/Grid";
import LabelButton from "../gfx/ui/LabelButton";
import ReadyScene from "./ReadyScene";

export default class LobbyScene extends Scene {
    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new Grid([50, 100], [10, 0.3, 0.4, 300, 0.3, 10]);
        Game.socketio.on("list matches", (matchList: MatchList) => {
            this.ui.clear();
            let row = 1;
            this.ui.addComponent(new LabelButton("Create Match", "center", () => {
                Game.socketio.emit("create match");
            }), row, 2, 1, 2, 0,10);
            for (let match of matchList.matches) {
                row++;
                let name = "Join " + match.name + " (" + match.playerCount + "/" + match.maxPlayers + ")";
                this.ui.addComponent(new LabelButton(name, "center", () => {
                    Game.socketio.emit("join match", match.id);
                }), row, 2, 1, 2, 0, 10);
            }
        });
        Game.socketio.on("join match", (match: Match) => {
            Simul.match = new MatchInterpolator(match);
            Game.setScene(new ReadyScene());
        });
    }

    destroy() { }
}
