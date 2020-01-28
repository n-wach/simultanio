import { Scene } from "../gfx/Scene";
import { Button } from "../gfx/ui/Button";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/ui/HUD";
import { Entity, EntityVariation, Match, PlayerCommand, TerrainTile } from "../comms";
import { RenderableGroup } from "../gfx/RenderableGroup";
import { Thing } from "../game/Thing";
import { Res } from "../game/Res";
import { GameRenderable } from "../game/ren/GameRenderable";

export class PlayScene extends Scene {
    public things: Thing[];

    initialize() {
        Game.clearColor = Res.col_bg;
        this.ui = new RenderableGroup(new HUD(this),
            new Button("Leave", 5, 5, 100, 20, () => {
                Game.socketio.emit("leave match");
            }));
        this.stage = new GameRenderable();
        Game.socketio.on("game update", (match: Match) => {
            Game.match = match;
        });
        Game.socketio.on("leave match", () => {
            Game.setScene(new LobbyScene());
        });
    }

    update() {
    }

    destroy() {

    }

}
