import {Scene} from "../gfx/Scene";
import {Game} from "../gfx/Game";
import {Match, MatchList} from "../comms";
import {PlayScene} from "./PlayScene";
import { Res } from "../game/Res";
import { Simul } from "../Simul";
import { MatchInterpolator } from "../game/interpolation/MatchInterpolator";
import Button from "../gfx/ui/Button";
import Grid from "../gfx/ui/Grid";

export class LobbyScene extends Scene {
    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new Grid([100], [10, 0.3, 0.4, 300, 0.3, 10]);
        Game.socketio.on("list matches", (matchList: MatchList) => {
            this.ui.clear();
            let row = 0;
            this.ui.addComponent(new Button("Create Match", () => {
                Game.socketio.emit("create match");
            }), row, 2, 1, 2, 10);
            for (let match of matchList.matches) {
                row++;
                this.ui.addComponent(new Button("Join " + match.name + " (" + match.playerCount + "/" + match.maxPlayers + ")", () => {
                        Game.socketio.emit("join match", match.id);
                    }), row, 2, 1, 2, 10);
            }
        });
        Game.socketio.on("join match", (match: Match) => {
            Simul.match = new MatchInterpolator(match);
            Game.setScene(new PlayScene());
        });
    }

    destroy(){}
}

export class LobbyUI extends Grid {
    constructor() {
        super([100], [10, 0.3, 0.4, 300, 0.3, 10]);
        Game.socketio.on("list matches", (matchList: MatchList) => {
            this.clear();
            let row = 0;
            this.addComponent(new Button("Create Match", () => {
                Game.socketio.emit("create match");
            }), row, 2, 1, 2, 10);
            for (let match of matchList.matches) {
                row++;
                this.addComponent(new Button("Join " + match.name + " (" + match.playerCount + "/" + match.maxPlayers + ")", () => {
                        Game.socketio.emit("join match", match.id);
                    }), row, 2, 1, 2, 10);
            }
        });
    }
}