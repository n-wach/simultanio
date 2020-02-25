import {EntityState} from "../../comms";
import StateInterpolator from "./StateInterpolator";
import PathingStateInterpolator from "./states/PathingStateInterpolator";
import EntityInterpolator from "./EntityInterpolator";
import ConstructingStateInterpolator from "./states/ConstructingStateInterpolator";
import PathingToConstructStateInterpolator from "./states/PathingToConstructStateInterpolator";
import GeneratingStateInterpolator from "./states/GeneratingStateInterpolator";
import IdleStateInterpolator from "./states/IdleStateInterpolator";
import InConstructionState from "./states/InConstructionStateInterpolator";
import TrainingStateInterpolator from "./states/TrainingStateInterpolator";

export default function getState(s: EntityState, e: EntityInterpolator): StateInterpolator {
    switch (s.type) {
        case "training":
            return new TrainingStateInterpolator(s, e);
        case "generating":
            return new GeneratingStateInterpolator(s, e);
        case "inConstruction":
            return new InConstructionState(s, e);
        case "idle":
            return new IdleStateInterpolator(s, e);
        case "pathing":
            return new PathingStateInterpolator(s, e);
        case "constructing":
            return new ConstructingStateInterpolator(s, e);
        case "pathingToBuild":
            return new PathingToConstructStateInterpolator(s, e);
    }
}