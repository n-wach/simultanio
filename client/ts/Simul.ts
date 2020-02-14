import MatchInterpolator from "./game/interpolation/MatchInterpolator";
import MapImage from "./game/ren/MapImage";
import Building from "./game/entity/Building";
import {Unit} from "./comms";

export default class Simul {
    public static match: MatchInterpolator;
    public static mapImage: MapImage = new MapImage();
    public static selectedBuilding: Building = null;
    public static selectedUnits: Unit[] = null;
    static update(dt: number) {
        if(Simul.match) {
            Simul.match.interpolate(dt);
            Simul.mapImage.update();
        }
    }
}