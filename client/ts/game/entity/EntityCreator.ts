import {AnyEntity, BuildingType, UnitType} from "../../comms";
import Scout from "./Scout";
import City from "./City";
import EntityInterpolator from "../interpolation/EntityInterpolator";
import Builder from "./Builder";
import EnergyGenerator from "./EnergyGenerator";
import MatterCollector from "./MatterCollector";
import Fighter from "./Fighter";

export default function getEntity(e: AnyEntity): EntityInterpolator {
    switch (e.type) {
        case UnitType.FIGHTER:
            return new Fighter(e);
        case UnitType.SCOUT:
            return new Scout(e);
        case UnitType.BUILDER:
            return new Builder(e);

        case BuildingType.CITY:
            return new City(e);
        case BuildingType.ENERGY_GENERATOR:
            return new EnergyGenerator(e);
        case BuildingType.MATTER_COLLECTOR:
            return new MatterCollector(e);
    }
    return null;
}