import {AnyEntity, BuildingType, UnitType} from "../../comms";
import Scout from "./Scout";
import City from "./City";
import EntityInterpolator from "../interpolation/EntityInterpolator";

export default function getEntity(e: AnyEntity): EntityInterpolator {
    switch (e.type) {
        case UnitType.SCOUT:
            return new Scout(e);
        case BuildingType.CITY:
            return new City(e);
    }
    return null;
}