import { Match, TerrainView, YouPlayer, OtherPlayer, Player, Color } from "../comms";

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
        // ensure player exists in list
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
        // TODO: check entities and sync to sprites
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