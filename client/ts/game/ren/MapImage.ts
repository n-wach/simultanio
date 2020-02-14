import Res from "../Res";
import Simul from "../../Simul";

export default class MapImage {
    terrainCanvas: HTMLCanvasElement;
    annotationCanvas: HTMLCanvasElement;
    terrainCtx: CanvasRenderingContext2D;
    annotationCtx: CanvasRenderingContext2D;

    constructor() {
        this.terrainCanvas = document.createElement("canvas");
        this.terrainCtx = this.terrainCanvas.getContext("2d");
        this.annotationCanvas = document.createElement("canvas");
        this.annotationCtx = this.annotationCanvas.getContext("2d");
    }

    update(): void {
        let t = Simul.match.terrainView;
        let tw = t.width;
        let th = t.height;
        if(this.terrainCanvas.width != tw || this.terrainCanvas.height != th) {
            this.terrainCanvas.width = tw;
            this.terrainCanvas.height = th;
            this.annotationCanvas.width = tw;
            this.annotationCanvas.height = th;
        }

        let idata = this.terrainCtx.getImageData(0, 0, tw, th);
        let data = new Uint32Array(idata.data.buffer);
        for(let x = 0; x < tw; x++) {
            for(let y = 0; y < th; y++) {
                let i = x + y * tw;
                let ti = t.grid[x][y];
                let cp = Res.tile_colors[ti.type];
                data[i] = ti.active ? cp.minimapV : cp.minimapPV;
            }
        }
        this.terrainCtx.putImageData(idata, 0, 0);

        for(let player of Simul.match.allPlayers()) {
            let c = Res.player_colors[player.color].minimapV;
            for(let e in player.entities) {
                let entity = player.entities[e];
                let x = Math.floor(entity.x);
                let y = Math.floor(entity.y);
                let i = x + y * tw;
                data[i] = c;
            }
        }
        this.annotationCtx.putImageData(idata, 0, 0);
    }
}