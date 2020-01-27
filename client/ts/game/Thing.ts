import { Color, Id } from "../comms";
import { Vec2 } from "../gfx/Vec2";

// represents a drawable game unit of some sort
export class Thing extends Sprite {
    constructor(col: Color, id: Id, pos: Vec2) {
        super();
    }
}