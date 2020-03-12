import Scene from "../gfx/Scene";
import Game from "../gfx/Game";
import {Match, MatchStatus} from "../comms";
import Res from "../game/Res";
import Simul from "../Simul";
import Grid from "../gfx/ui/Grid";
import PlayScene from "./PlayScene";
import Label from "../gfx/ui/Label";
import LabelButton from "../gfx/ui/LabelButton";

export default class ReadyScene extends Scene {
    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new Grid([50, 100, 40], [10, 0.3, 0.4, 300, 0.3, 10]);
        this.rebuild();
        Game.socketio.on("game update", (match: Match) => {
            Simul.match.sync(match);
            if (match.info.status == MatchStatus.STARTED) {
                let focal = match.you.entities[0];
                let play = new PlayScene();
                Game.setScene(play);
                play.stage.update(0);
                play.stage.centerOnGrid(focal.x, focal.y);
            } else {
                this.rebuild();
            }
        });
    }

    rebuild() {
        this.ui.clear();
        this.ui.addComponent(new Label(Simul.match.info.name + ": Waiting..."), 1, 2, 1, 2, 0, 10);

        let readyGrid = new Grid([1], [0.2, 0.2, 50, 0.2, 50, 0.3]);
        let youColor = Res.player_colors[Simul.match.you.color].style;
        readyGrid.addComponent(new Label("YOU are", "right", youColor), 0, 1, 1, 2, 10);
        if (Simul.match.you.ready) {
            readyGrid.addComponent(new LabelButton("Ready", "center", () => {
                Game.socketio.emit("unready");
            }), 0, 3, 1, 2, 10);
        } else {
            readyGrid.addComponent(new LabelButton("Not Ready", "center", () => {
                Game.socketio.emit("ready");
            }), 0, 3, 1, 2, 10);
        }
        this.ui.addComponent(readyGrid, 3, 2, 1, 2, 0, 10);
        let row = 4;
        for (let other of Simul.match.getOtherPlayers()) {
            let otherColor = Res.player_colors[other.color].style;
            let readyGrid = new Grid([1], [0.2, 0.2, 50, 0.2, 50, 0.3]);
            readyGrid.addComponent(new Label(other.color.toUpperCase() + " is", "right", otherColor), 0, 1, 1, 2, 10);
            readyGrid.addComponent(new Label(other.ready ? "Ready" : "Not Ready", "center", otherColor), 0, 3, 1, 2, 10);
            this.ui.addComponent(readyGrid, row++, 2, 1, 2, 0, 10);
        }
    }

    destroy() {
    }
}
