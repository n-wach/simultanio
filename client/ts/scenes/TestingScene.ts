import Scene from "../gfx/Scene";
import Vec2 from "../gfx/Vec2";
import Block from "../game/test/Block";

export default class TestingScene extends Scene {
    initialize() {
        var block = new Block(new Vec2(20, 20), 40);
        this.renderables.push(block);
    }

    destroy() { }
}