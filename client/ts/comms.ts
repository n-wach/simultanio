export enum MatchStatus {
    WAITING = "waiting",
    STARTED = "started",
    ENDED = "ended",
}

export enum Color {
    RED = "red",
    ORANGE = "orange",
    YELLOW = "yellow",
    GREEN = "green",
    BLUE = "blue",
    PURPLE = "purple",
}

export enum TerrainTile {
    LAND = "land",
    WATER = "water",
    MATTER_SOURCE = "matter_source",
    UNKNOWN = "unknown",
}

export enum EntityVariation {
    UNKNOWN = "unknown",
    CITY = "city",
    UNIT = "unit",
}

export type Id = number;

export type MatchListing = {
    id: Id,
    name: string,
    player_count: number,
    max_players: number,
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

export type YouPlayer = {
    stored_energy: number,
    stored_matter: number,
    color: Color,
    entities: Entity[],
    id: Id,
};

export type OtherPlayer = {
    color: Color,
    entities: Entity[],
    id: Id,
};

export type Player = YouPlayer | OtherPlayer;

export type Entity = {
    variation: EntityVariation,
    // integer is center of grid square
    // ... may be float from [-0.5 to terrain.width-0.5]
    x: number,
    y: number,
    id: Id,
};

export type Match = {
    info: MatchListing,
    you: YouPlayer,
    other_players: OtherPlayer[],
    terrain_view: TerrainView,
};

export type SetTargetCommand = {
    command: "set target",
    id: Id,
    x: number,
    y: number,
};

export type SetTargetsCommand = {
    command: "set targets",
    ids: Id[],
    x: number,
    y: number,
};

export type PlayerCommand = SetTargetCommand | SetTargetsCommand;

