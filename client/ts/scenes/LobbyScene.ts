import {Scene} from "../gfx/Scene";
import {Game} from "../gfx/Game";
import {Match, MatchList} from "../comms";
import {Button} from "../gfx/ui/Button";
import {PlayScene} from "./PlayScene";
import {RenderableGroup} from "../gfx/RenderableGroup";
import { Res } from "../game/Res";
import { Block } from "../game/sprites/Block";
import { Vec2 } from "../gfx/Vec2";

export class LobbyScene extends Scene {
    destroy(){}

    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new LobbyUI();
        this.stage = new LobbyStage();
        Game.socketio.on("join match", (match: Match) => {
            Game.match = match;
            Game.setScene(new PlayScene());
        });
    }
}

export class LobbyStage extends RenderableGroup {
    constructor() {
        super();
        this.add(new Block(new Vec2(20, 20), new Vec2(40, 40)));
    }
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