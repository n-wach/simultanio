import {Scene} from "../gfx/Scene";
import {Match, MatchList} from "../comms";
import {Button} from "../gfx/ui/Button";
import {LobbyScene} from "./LobbyScene";
import {Game} from "../gfx/Game";

export class PlayScene extends Scene {
    socketio: SocketIOClient.Socket;
    match: Match;

    constructor(socketio: SocketIOClient.Socket, match: Match) {
        super();
        this.match = match;
        this.socketio = socketio;
        this.socketio.on("game update", (match: Match) => {
            this.match = match;
        });
        this.socketio.on("leave match", () => {
            Game.setScene(new LobbyScene(this.socketio));
        });
    }

    update() {
        super.update();

    }

    initialize() {
        super.initialize();

        this.add(new Button("Leave " + this.match.listing.name, 100, 100, 400, 80, () => {
            this.socketio.emit("leave match");
        }));
    }

    destroy() {
        super.destroy();
        this.socketio.off("game update");
        this.socketio.off("leave match");
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }
}