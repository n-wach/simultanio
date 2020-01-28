import { Color, Id } from "../comms";
import { Vec2 } from "../gfx/Vec2";
import {Sprite} from "../gfx/Sprite";

// represents a drawable game unit of some sort
export class Thing extends Sprite {
    constructor(col: Color, id: Id, pos: Vec2) {
        super();
    }
}