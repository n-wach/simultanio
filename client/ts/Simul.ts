import MatchInterpolator from "./game/interpolation/MatchInterpolator";
import MapImage from "./game/ren/MapImage";
import {Unit} from "./comms";
import {EntityAction, TargetAction} from "./game/ui/EntityAction";

export default class Simul {
    public static match: MatchInterpolator;
    public static mapImage: MapImage = new MapImage();
    public static selectedEntities: Unit[] = [];
    public static selectedEntityAction: EntityAction = new TargetAction();
    static update(dt: number) {
        if(Simul.match) {
            Simul.match.interpolate(dt);
            Simul.mapImage.update();
        }
    }
}