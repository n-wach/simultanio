import {BuildingType, Entity, UnitType} from "../../comms";
import Scout from "./entity/Scout";
import City from "./entity/City";
import EntityInterpolator from "./EntityInterpolator";
import Builder from "./entity/Builder";
import EnergyGenerator from "./entity/EnergyGenerator";
import MatterCollector from "./entity/MatterCollector";
import Fighter from "./entity/Fighter";

export default function getEntity(e: Entity): EntityInterpolator {
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