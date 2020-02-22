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
    entities: AnyEntity[]
    id: Id,
}

export type YouPlayer = BasePlayer & {
    storedEnergy: number,
    storedMatter: number,
};

export enum UnitType {
    BUILDER = "builder",
    FIGHTER = "fighter",
    SCOUT = "scout",
}

export enum BuildingType {
    CITY = "city",
    ENERGY_GENERATOR = "energyGenerator",
    MATTER_COLLECTOR = "matterCollector",
}

export enum EntityStateType {
    DEFAULT = "default",
    PATHING_STATE = "pathingState",
    BUILDING_STATE = "buildingState",
    PATHING_TO_BUILD_STATE = "pathingToBuildState",
    GENERATING_STATE = "generatingState",
    IN_CONSTRUCTION_STATE = "inConstructionState"
}

export type BaseEntity = {
    x: number,
    y: number,
    id: Id,
    state: EntityState,
}

export type BaseEntityState = {
    type: string,
}

export type EntityState = BaseEntityState;

export type Unit = BaseEntity & {
    path: Path,
    type: UnitType,
}
export type Building = BaseEntity & {
    type: BuildingType,
};

export type AnyEntity = Unit | Building;

export type Match = {
    info: MatchListing,
    you: YouPlayer,
    otherPlayers: BasePlayer[],
    terrainView: TerrainView,
};

export type SetTargetsCommand = {
    command: "set targets",
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

export type PlayerCommand = SetTargetsCommand;

