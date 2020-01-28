import { Scene } from "../gfx/Scene";
import { Button } from "../gfx/ui/Button";
import { LobbyScene } from "./LobbyScene";
import { Game } from "../gfx/Game";
import { HUD } from "../game/ui/HUD";
import { RenderableGroup } from "../gfx/RenderableGroup";
import { Res } from "../game/Res";
import { GameRenderable } from "../game/ren/GameRenderable";
import { MatchInterpolator } from "../game/MatchInterpolator";
import { Match } from "../comms";
import { Thing } from "../game/sprites/Thing";

export class PlayScene extends Scene {
    public things: Thing[];
    public knowledge: MatchInterpolator;

    initialize() {
        Game.clearColor = Res.col_bg;
        this.knowledge = new MatchInterpolator();
        this.ui = new RenderableGroup(new HUD(this),
            new Button("Leave", 5, 5, 100, 20, () => {
                Game.socketio.emit("leave match");
            }));
        this.stage = new GameRenderable();
        Game.socketio.on("game update", (match: Match) => {
            this.knowledge.update(match);
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
