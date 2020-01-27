import {Scene} from "../gfx/Scene";
import {Button} from "../gfx/ui/Button";
import {LobbyScene} from "./LobbyScene";
import {Game} from "../gfx/Game";
import {HUD} from "../game/HUD";
import {Entity, EntityVariation, Match, PlayerCommand, TerrainTile} from "../comms";
import {RenderableGroup} from "../gfx/RenderableGroup";

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

    initialize() {
        this.ui = new RenderableGroup(new HUD(this),
            new Button("Leave", 5, 5, 100, 20, () => {
            this.socketio.emit("leave match");
        }));
        this.stage = new RenderableGroup();
    }

    destroy() {
        this.socketio.off("game update");
        this.socketio.off("leave match");
    }

    update() {
        super.update();
        if(Game.input.mousePressed) {
            let pos = Game.input.mousePos;
            pos.x -= 105;
            pos.y -= 105;
            this.socketio.emit("player command", ({
                command: "set target",
                x: pos.x / 10,
                y: pos.y / 10,
            } as PlayerCommand));
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);

        for(let x = 0; x < this.match.terrain_view.width; x++) {
            for(let y = 0; y < this.match.terrain_view.height; y++) {
                let tile = this.match.terrain_view.grid[x][y];
                switch(tile) {
                    case TerrainTile.LAND:
                        ctx.fillStyle = "white";
                        break;
                    case TerrainTile.WATER:
                        ctx.fillStyle = "darkblue";
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

        ctx.fillStyle = this.match.you.color;
        PlayScene.drawEntities(ctx, this.match.you.entities);
        for(let player of this.match.other_players) {
            ctx.fillStyle = player.color;
            PlayScene.drawEntities(ctx, player.entities);
        }
    }

    static drawEntities(ctx: CanvasRenderingContext2D, entities: Entity[]) {
        for(let entity of entities) {
            ctx.moveTo(entity.x, entity.y);
            ctx.beginPath();
            switch(entity.variation) {
                case EntityVariation.UNKNOWN:
                    console.error("tried to draw unknown entity:", entity);
                    break;
                case EntityVariation.CITY:
                    // TODO replace with draw sprite
                    ctx.arc(100 + 5 + entity.x * 10, 100 + 5 + entity.y * 10, 7, 0, Math.PI * 2);
                    break;
                case EntityVariation.UNIT:
                    ctx.rect(100 + 2 + entity.x * 10, 100 + 2 + entity.y * 10, 6, 6);
                    break;
            }
            ctx.fill();
        }
    }
}