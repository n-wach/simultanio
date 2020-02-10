import {PlayScene} from "../../scenes/PlayScene";
import Grid from "../../gfx/ui/Grid";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default class HUD extends Grid {
    constructor() {
        super([40, 1.0, 250], [1.0]);
        this.addComponent(new TopBar(), 0, 0);
        this.addComponent(new BottomBar(), 2, 0);
    }
}

