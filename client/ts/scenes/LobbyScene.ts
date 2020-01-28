import {Scene} from "../gfx/Scene";
import {Game} from "../gfx/Game";
import {Match, MatchList} from "../comms";
import {Button} from "../gfx/ui/Button";
import {PlayScene} from "./PlayScene";
import {RenderableGroup} from "../gfx/RenderableGroup";
import { Res } from "../game/Res";
import { Simul } from "../Simul";

export class LobbyScene extends Scene {
    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new LobbyUI();
        Game.socketio.on("join match", (match: Match) => {
            Simul.match.update(match);
            Game.setScene(new PlayScene());
        });
    }

    destroy(){}
}


export class LobbyUI extends RenderableGroup {
    constructor() {
        super();
        Game.socketio.on("list matches", (matchList: MatchList) => {
            this.clear();
            let w = Game.canvas.width;
            let matchListX = 40;
            let matchListY = 40;
            this.add(new Button("Create Match", matchListX, matchListY, 400, 80, () => {
                Game.socketio.emit("create match");
            }));
            for (let i = 0; i < matchList.matches.length; i++) {
                let itemY = matchListY + (i + 1) * 100;
                let match = matchList.matches[i];
                this.add(new Button("Join " + match.name + " (" + match.player_count + "/" + match.max_players + ")",
                    matchListX, itemY, 400, 80, () => {
                        Game.socketio.emit("join match", match.id);
                    }));
            }
        });
    }
}