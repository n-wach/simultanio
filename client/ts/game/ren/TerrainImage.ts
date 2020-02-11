import Res from "../Res";
import Simul from "../../Simul";

export default class TerrainImage {
    terrainCanvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D;

    constructor() {
        this.terrainCanvas = document.createElement("canvas");
        this.canvasCtx = this.terrainCanvas.getContext("2d");
    }

    update(): void {
        let t = Simul.match.terrainView;
        let tw = t.width;
        let th = t.height;
        if(this.terrainCanvas.width != tw || this.terrainCanvas.height != th) {
            this.terrainCanvas.width = tw;
            this.terrainCanvas.height = th;
        }

        let idata = this.canvasCtx.getImageData(0, 0, tw, th);
        let data = idata.data;
        for(let x = 0; x < tw; x++) {
            for(let y = 0; y < th; y++) {
                let i = x + y * tw;
                let ti = t.grid[x][y];
                let cp = Res.tile_colors[ti.type];
                let c;
                if(ti.active) {
                    c = cp.minimapV;
                } else {
                    c = cp.minimapPV;
                }
                data[i * 4]     = c[0];
                data[i * 4 + 1] = c[1];
                data[i * 4 + 2] = c[2];
                data[i * 4 + 3] = c[3];
            }
        }
        this.canvasCtx.putImageData(idata, 0, 0);
    }
}