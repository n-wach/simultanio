import MatchInterpolator from "./game/interpolation/MatchInterpolator";
import MapImage from "./game/ren/MapImage";

export default class Simul {
    public static match: MatchInterpolator;
    public static mapImage: MapImage = new MapImage();
    static update(dt: number) {
        if(Simul.match) {
            Simul.match.interpolate(dt);
            Simul.mapImage.update();
        }
    }
}