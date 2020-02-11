import MatchInterpolator from "./game/interpolation/MatchInterpolator";
import TerrainImage from "./game/ren/TerrainImage";

export default class Simul {
    public static match: MatchInterpolator;
    public static terrainImage: TerrainImage = new TerrainImage();
    static update(dt: number) {
        if(Simul.match) {
            Simul.match.interpolate(dt);
            Simul.terrainImage.update();
        }
    }
}