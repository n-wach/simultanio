import {Scene} from "../gfx/Scene";
import {Vec2} from "../gfx/Vec2";
import {Game} from "../gfx/Game";
import {Match, MatchList} from "../comms";
import {Button} from "../gfx/ui/Button";
import { Block } from "../game/Block";
import {PlayScene} from "./PlayScene";

export class LobbyScene extends Scene {
    socketio: SocketIOClient.Socket;

    constructor(socketio: SocketIOClient.Socket) {
        super();
        this.socketio = socketio;
        this.socketio.on("list matches", (matchList: MatchList) => {
            this.clear();
            let w = Game.canvas.width;
            this.add(new Button("Create Match", w / 2 - 300, 20, 600, 70, () => {
                this.socketio.emit("create match");
            }));
            for (let i = 0; i < matchList.matches.length; i++) {
                let x = w / 2 - 300;
                let y = 100 + i * 80;
                let match = matchList.matches[i];
                this.add(new Button("Join " + match.name + " (" + match.player_count + "/" + match.max_players + " players)",
                    x, y, 600, 70, () => {
                        this.socketio.emit("join match", match.id);
                    }));
            }
        });
        this.socketio.on("join match", (match: Match) => {
            Game.setScene(new PlayScene(this.socketio, match));
        });
    }
    destroy() {
        super.destroy();
        this.socketio.off("join match");
        this.socketio.off("list matches");
    }
}