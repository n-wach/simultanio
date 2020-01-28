import { RenderableGroup } from "../../gfx/RenderableGroup";
import { Game } from "../../gfx/Game";
import { PlayerCommand } from "../../comms";
import { TerrainRenderable } from "./TerrainRenderable";
import { EntitiesRenderable } from "./EntitiesRenderable";
import { MatchInterpolator } from "../MatchInterpolator";

export class GameRenderable extends RenderableGroup {
    constructor(knowledge: MatchInterpolator) {
        super();
        Game.input.addHandler((event) => {
            let p = this.transformToCanvas(event);
            Game.socketio.emit("player command", ({
                command: "set target",
                x: p.x / 10,
                y: p.y / 10,
            } as PlayerCommand));
            return true;
        }, "mousedown", "touchstart");
        Game.input.addHandler((event) => {
            let delta = event.deltaY;
            //convert delta into pixels...
            if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
                delta *= 16; // just a guess--depends on inaccessible user settings
            } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
                delta *= 800;  // also just a guess--no good way to predict these...
            }
            this.zoomOnPoint(delta, this.transformToCanvas(event));
            return true;
        }, "wheel");
        this.add(new TerrainRenderable(), new EntitiesRenderable(knowledge));
    }
}