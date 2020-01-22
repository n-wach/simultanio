import {Scene} from "../gfx/Scene";
import {Match, MatchList, TerrainTile} from "../comms";
import {Button} from "../gfx/ui/Button";
import {LobbyScene} from "./LobbyScene";
import {Game} from "../gfx/Game";
import {HUD} from "../gfx/ui/HUD";

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

        this.add(new HUD(this));

        this.add(new Button("Leave " + this.match.listing.name, 5, 5, 100, 20, () => {
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

        for(let x = 0; x < this.match.terrain.width; x++) {
            for(let y = 0; y < this.match.terrain.height; y++) {
                let tile = this.match.terrain.grid[x][y];
                switch(tile) {
                    case TerrainTile.LAND:
                        ctx.fillStyle = "white";
                        break;
                    case TerrainTile.WATER:
                        ctx.fillStyle = "blue";
                        break;
                    case TerrainTile.MATTER_SOURCE:
                        ctx.fillStyle = "pink";
                        break;
                    case TerrainTile.UNKNOWN:
                        ctx.fillStyle = "black";
                        break;
                }
                ctx.fillRect(100 + x * 10, 100 + y * 10, 10, 10);
            }
        }
    }
}