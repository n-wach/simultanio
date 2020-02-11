import {Match, MatchListing, TerrainView} from "../../comms";
import Interpolated from "./Interpolated";
import BasePlayerInterpolator, {YouPlayerInterpolator} from "./PlayerInterpolator";

export default class MatchInterpolator extends Interpolated<Match> {
    you: YouPlayerInterpolator;
    otherPlayers: {[id: number]: BasePlayerInterpolator} = {};
    terrainView: TerrainView;
    info: MatchListing;
    constructor(ref: Match) {
        super();
        this.you = new YouPlayerInterpolator(ref.you);
        this.sync(ref);
    }

    sync(ref: Match) {
        super.sync(ref);
        this.you.sync(ref.you);

        for(let o of ref.otherPlayers) {
            if(this.otherPlayers[o.id]) {
                this.otherPlayers[o.id].sync(o);
            } else {
                this.otherPlayers[o.id] = new BasePlayerInterpolator(o);
            }
        }
        for(let id in this.otherPlayers) {
            if(!this.otherPlayers[id].valid) {
                delete this.otherPlayers[id];
            } else {
                this.otherPlayers[id].valid = false;
            }
        }

        this.terrainView = ref.terrainView;
        this.info = ref.info;
    }

    interpolate(dt: number) {
        this.you.interpolate(dt);
        for(let o in this.otherPlayers) {
            this.otherPlayers[o].interpolate(dt);
        }
    }
}