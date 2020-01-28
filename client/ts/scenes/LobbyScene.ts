import {Scene} from "../gfx/Scene";
import {Game} from "../gfx/Game";
import {Match, MatchList} from "../comms";
import {Button} from "../gfx/ui/Button";
import {PlayScene} from "./PlayScene";
import {RenderableGroup} from "../gfx/RenderableGroup";

export class LobbyScene extends Scene {
    destroy(){}

    initialize() {
        this.ui = new LobbyUI();
        Game.socketio.on("join match", (match: Match) => {
            Game.match = match;
            Game.setScene(new PlayScene());
        });
    }
}


export class LobbyUI extends RenderableGroup {
    constructor() {
        super();
        Game.socketio.on("list matches", (matchList: MatchList) => {
            this.clear();
            let w = Game.canvas.width;
            this.add(new Button("Create Match", w / 2 - 300, 20, 600, 70, () => {
                Game.socketio.emit("create match");
            }));
            for (let i = 0; i < matchList.matches.length; i++) {
                let x = w / 2 - 300;
                let y = 100 + i * 80;
                let match = matchList.matches[i];
                this.add(new Button("Join " + match.name + " (" + match.player_count + "/" + match.max_players + ")",
                    x, y, 600, 70, () => {
                        Game.socketio.emit("join match", match.id);
                    }));
            }
        });
    }
}