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
}

export type MatchListing = {
    id: string,
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
}

export type Player = {
    stored_energy: number,
    stored_matter: number,
    color: Color,
    entities: Entity[],
    id: number,
}

export type Entity = {
    variation: EntityVariation,
    // integer is center of grid square
    // ... may be float from [-0.5 to terrain.width-0.5]
    x: number,
    y: number,
    id: number,
}

export type Match = {
    info: MatchListing,
    you: Player,
    other_players: Player[],
    terrain_view: TerrainView,
}
