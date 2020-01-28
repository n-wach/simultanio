import { Match, TerrainView, YouPlayer, OtherPlayer, Player, Color, Entity } from "../comms";

export class MatchInterpolator {
    you: YouPlayer;
    others: OtherPlayer[];
    terrain_view: TerrainView;

    constructor() {
        // populate empty data
        this.you = {
            stored_energy: 0,
            stored_matter: 0,
            color: Color.WHITE,
            entities: [],
            id: -1
        };
        this.others = []
        this.terrain_view = {
            width: 0,
            height: 0,
            grid: []
        };
    }

    update(match: Match) {
        // update player deltas
        this.updateYou(match.you);

        // update other players
        for (let other of match.other_players) {
            this.updatePlayer(other);
        }

        // update terrain view
        this.updateTerrainView(match.terrain_view);
    }

    updatePlayer(delPlayer: Player) {
        // |> update player list
        if (delPlayer.id != this.you.id) { // make sure player isn't "me"
            // check if the player is a known other
            if (!this.others.filter(x => x.id == delPlayer.id).length) {
                // add the other to our others
                this.others.push({
                    color: delPlayer.color,
                    entities: [], // will sync later
                    id: delPlayer.id
                });
            }
        }
        let other = this.others.filter(x => x.id == delPlayer.id)[0];
        
        // |> check entities and sync to sprites
        // check if entity is known
        for (let nt of delPlayer.entities) {
            let matched_entities = other.entities.filter(x => x.id == nt.id);
            if (matched_entities.length > 0) {
                // update entity info
                let known_entity = matched_entities[0];
                known_entity.variation = nt.variation;
                known_entity.x = nt.x;
                known_entity.y = nt.y;
            } else {
                // entity is not known, add it.
                other.entities.push({
                    variation: nt.variation,
                    x: nt.x,
                    y: nt.y,
                    id: nt.id
                });
                // TODO: call to add sprite
            }
        }
        // check for removed/dead entities
        let removed_entities: Entity[] = [];
        for (let known_nt of other.entities) {
            let matched_entities = delPlayer.entities.filter(x => x.id == known_nt.id);
            if (!matched_entities) {
                // entity is no longer sent, remove it from knowledge
                removed_entities.push(known_nt);
                // TODO: call to remove sprite
            }
        }
        // process entity data queued for removal
        for (let to_remove of removed_entities) {
            other.entities.splice(other.entities.indexOf(to_remove), 1);
        }
    }

    updateYou(delYou: YouPlayer) {
        // update my private fields
        this.you.stored_energy = delYou.stored_energy;
        this.you.stored_matter = delYou.stored_matter;

        // generic player update
        this.updatePlayer(delYou);
    }

    updateTerrainView(delTerrain: TerrainView) {
        // TODO: handle things like previously visible terrain
        // update dimens
        this.terrain_view.height = delTerrain.height;
        this.terrain_view.width = delTerrain.width;

        // blindly update grid
        this.terrain_view.grid = delTerrain.grid;
    }
}