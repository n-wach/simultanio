import {BasePlayer, Color, YouPlayer} from "../../comms";
import EntityInterpolator from "./EntityInterpolator";
import Interpolated from "./Interpolated";
import getEntity from "./EntityCreator";


export default class BasePlayerInterpolator extends Interpolated<BasePlayer>{
    color: Color;
    entities: {[id: number]: EntityInterpolator} = {}; // id is of type Id = number
    ready: boolean;

    constructor(ref: BasePlayer) {
        super();
        this.sync(ref);
    }


    interpolate(dt: number) {
        for(let id in this.entities) {
            this.entities[id].interpolate(dt);
        }
    }

    sync(ref: BasePlayer) {
        super.sync(ref);
        this.ready = ref.ready;
        this.color = ref.color;
        for(let e of ref.entities) {
            if(this.entities[e.id]) {
                this.entities[e.id].sync(e);
            } else {
                let ent = getEntity(e);
                if(ent) {
                    this.entities[e.id] = ent;
                } else {
                    console.log("Unable to create unknown entity", e);
                }
            }
        }
        for(let id in this.entities) {
            if(!this.entities[id].valid) {
                delete this.entities[id];
            } else {
                this.entities[id].valid = false;
            }
        }
    }
}


export class YouPlayerInterpolator extends BasePlayerInterpolator {
    storedEnergy: number;
    storedMatter: number;
    sync(ref: YouPlayer) {
        super.sync(ref);
        this.storedEnergy = ref.storedEnergy;
        this.storedMatter = ref.storedMatter;
    }
}