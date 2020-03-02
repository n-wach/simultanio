import {EntityState} from "../../comms";
import StateInterpolator from "./StateInterpolator";
import Pathing from "./states/Pathing";
import EntityInterpolator from "./EntityInterpolator";
import Constructing from "./states/Constructing";
import PathingToConstruct from "./states/PathingToConstruct";
import Generating from "./states/Generating";
import Idle from "./states/Idle";
import InConstruction from "./states/InConstruction";
import Training from "./states/Training";
import Ghost from "./states/Ghost";
import Fighting from "./states/Fighting";
import Guarding from "./states/Guarding";
import WaitingToBuild from "./states/WaitingToBuild";

export default function getState(s: EntityState, e: EntityInterpolator): StateInterpolator {
    switch (s.type) {
        case "waitingToBuild":
            return new WaitingToBuild(s, e);
        case "fighting":
            return new Fighting(s, e);
        case "guarding":
            return new Guarding(s, e);
        case "training":
            return new Training(s, e);
        case "generating":
            return new Generating(s, e);
        case "inConstruction":
            return new InConstruction(s, e);
        case "idle":
            return new Idle(s, e);
        case "ghost":
            return new Ghost(s, e);
        case "pathing":
            return new Pathing(s, e);
        case "constructing":
            return new Constructing(s, e);
        case "pathingToBuild":
            return new PathingToConstruct(s, e);
    }
}