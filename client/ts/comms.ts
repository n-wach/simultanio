export enum MatchStatus {
    WAITING = "waiting",
    STARTED = "started",
    ENDED = "ended",
}

export enum Color {
    WHITE = "white",
    RED = "red",
    ORANGE = "orange",
    YELLOW = "yellow",
    GREEN = "green",
    BLUE = "blue",
    PURPLE = "purple",
}

export enum TerrainTileType {
    LAND = "land",
    WATER = "water",
    MATTER_SOURCE = "matter_source",
    UNKNOWN = "unknown",
}

export enum UnitType {
    BUILDER = "builder",
    FIGHTER = "fighter",
    SCOUT = "scout",
}

export enum BuildingType {
    CITY = "city",
    TRAINER = "trainer",
    ENERGY_GENERATOR = "energyGenerator",
    MATTER_COLLECTOR = "matterCollector",
}

export type Id = number;

export type Path = { x: number, y: number }[]

export type TerrainTile = {
    type: TerrainTileType,
    active: boolean,
};

export type MatchListing = {
    id: Id,
    name: string,
    playerCount: number,
    maxPlayers: number,
    status: MatchStatus,
    duration: number,
};

export type MatchList = {
    matches: MatchListing[]
};

export type TerrainView = {
    width: number,
    height: number,
    grid: TerrainTile[][],
};

export type BasePlayer = {
    color: Color,
    entities: Entity[]
    id: Id,
    ready: boolean;
}

export type YouPlayer = BasePlayer & {
    storedEnergy: number,
    storedMatter: number,
};

export type EntityType = "unknown" | UnitType | BuildingType;

export type Entity = {
    x: number,
    y: number,
    id: Id,
    state: EntityState,
    type: EntityType,
    health: number,
}

export type IdleState = {
    type: "idle",
};

export type GhostState = {
    type: "ghost",
};

export type GuardingState = {
    type: "guarding"
}

export type WaitingToBuildState = {
    type: "waitingToBuild"
}

export type FightingState = {
    type: "fighting",
    target: Id,
    path: Path,
}

export type InConstructionState = {
    type: "inConstruction",
}

export type GeneratingState = {
    type: "generating",
}

export type TrainingState = {
    trainingStatus: number;
    type: "training",
    queue: UnitType[],
}

export type PathingState = {
    type: "pathing",
    path: Path,
}

export type ConstructingState = {
    type: "constructing",
    building: Id,
}

export type PathingToBuildState = {
    type: "pathingToBuild",
    ghost: Id,
    path: Path,
}

export type EntityState = PathingState
    | ConstructingState
    | PathingToBuildState
    | FightingState
    | GuardingState
    | GeneratingState
    | InConstructionState
    | TrainingState
    | GhostState
    | IdleState
    | WaitingToBuildState;

export type Match = {
    info: MatchListing,
    you: YouPlayer,
    otherPlayers: BasePlayer[],
    terrainView: TerrainView,
};

export type SetTargetCommand = {
    command: "set target",
    ids: Id[],
    x: number,
    y: number,
};

export type BuildCommand = {
    command: "build",
    ids: Id[],
    buildingType: BuildingType,
    x: number,
    y: number,
};

export type TrainCommand = {
    command: "train",
    infinite: Boolean,
    building: Id,
    unitType: UnitType,
}

export type ResetCommand = {
    command: "reset",
    ids: Id[],
}

export type DestroyCommand = {
    command: "destroy",
    ids: Id[],
}

export type PlayerCommand = SetTargetCommand | ResetCommand | BuildCommand | TrainCommand | DestroyCommand;

