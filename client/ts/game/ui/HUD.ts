import Grid from "../../gfx/ui/Grid";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

export default class HUD extends Grid {
    constructor() {
        super([40, 1.0], [250, 1.0]);
        this.addComponent(new TopBar(), 0, 0, 1, 2);
        this.addComponent(new SideBar(), 1, 0);
    }
}

