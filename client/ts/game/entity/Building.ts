import EntityInterpolator from "../interpolation/EntityInterpolator";

export default abstract class Building extends EntityInterpolator {
    isUnit(): boolean {
        return false;
    }
    isBuilding(): boolean {
        return true;
    }
}