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

export enum EntityType {
    UNIT = "unit",
    BUILDING = "building",
}

export type MatchListing = {
    id: string,
    name: string,
    player_count: number,
    max_player: number,
};

export type MatchList = {
    matches: MatchListing[]
};


export type Terrain = {
    width: number,
    height: number,
    grid: TerrainTile[][],
}

export type Player = {
    stored_energy: number,
    stored_matter: number,
    color: Color,
    id: number,
}

export type Entity = {
    type: EntityType,
    variation: string,
    x: number,
    y: number,
    color: Color,
    id: number,
}

export type Match = {
    listing: MatchListing,
    duration: number,
    players: Player[],
    terrain: Terrain,
    entities: Entity[],
    status: MatchStatus,
}






