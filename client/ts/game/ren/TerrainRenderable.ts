import {Renderable} from "../../gfx/Renderable";
import {TerrainTileType} from "../../comms";
import {Res} from "../Res";
import {Simul} from "../../Simul";

export class TerrainRenderable implements Renderable {
    static GRID_CELL_SIZE = 100;

    render(ctx: CanvasRenderingContext2D): void {
        let s = TerrainRenderable.GRID_CELL_SIZE;
        let c = s * 0.2;
        let w = Simul.match.terrainView.width;
        let h = Simul.match.terrainView.height;
        let g = Simul.match.terrainView.grid;

        //border
        ctx.fillStyle = Res.col_uibg;
        ctx.fillRect(-s, -s,
            Simul.match.terrainView.width * s + 2 * s,
            Simul.match.terrainView.height * s + 2 * s);


        //fill fog first
        ctx.fillStyle = Res.col_fog;
        ctx.fillRect(0, 0, w * s, h * s);

        /*
           TODO so this kinda speeds things up, but it's nowhere near fast enough for a large,
            explored grid (say 500x500)...
            i also tried rendering to a RenderCanvas and drawing that,
            but normal putImageData doesn't respect transformation matrix
            using drawImage instead (passing the canvas) works but is jittery for large
            terrains any ideas would be welcome
         */
        for(let v in TerrainTileType) {
            let t = TerrainTileType[v];
            switch(t) {
                case TerrainTileType.UNKNOWN:
                    continue;
                case TerrainTileType.LAND:
                    ctx.fillStyle = Res.col_land;
                    break;
                case TerrainTileType.WATER:
                    ctx.fillStyle = Res.col_water;
                    break;
                case TerrainTileType.MATTER_SOURCE:
                    ctx.fillStyle = Res.col_matter;
                    break;
            }
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y].type;
                    if(tile == t) {
                        ctx.rect(x * s, y * s, s, s);
                    }
                }
            }
            ctx.fill();
        }

        for(let v in TerrainTileType) {
            let t = TerrainTileType[v];
            switch(t) {
                case TerrainTileType.UNKNOWN:
                    ctx.fillStyle = Res.col_fog;
                    break;
                case TerrainTileType.LAND:
                    ctx.fillStyle = Res.col_land;
                    break;
                case TerrainTileType.WATER:
                    ctx.fillStyle = Res.col_water;
                    break;
                case TerrainTileType.MATTER_SOURCE:
                    ctx.fillStyle = Res.col_matter;
                    break;
            }
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y].type;
                    if(tile != t) {
                        let left = null;
                        let right = null;
                        let top = null;
                        let bot = null;
                        if (x > 0) left = g[x - 1][y].type;
                        if (x < w - 1) right = g[x + 1][y].type;
                        if (y > 0) top = g[x][y - 1].type;
                        if (y < h - 1) bot = g[x][y + 1].type;

                        if(left == t && top == t) {
                            ctx.moveTo(x * s, y * s);
                            ctx.lineTo(x * s + c, y * s);
                            ctx.lineTo(x * s, y * s + c);
                            ctx.closePath();
                        }
                        if(top == t && right == t) {
                            ctx.moveTo((x + 1) * s, y * s);
                            ctx.lineTo((x + 1) * s - c, y * s);
                            ctx.lineTo((x + 1) * s, y * s + c);
                            ctx.closePath();
                        }
                        if(right == t && bot == t) {
                            ctx.moveTo((x + 1) * s, (y + 1) * s);
                            ctx.lineTo((x + 1) * s - c, (y + 1) * s);
                            ctx.lineTo((x + 1) * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                        if(bot == t && left == t) {
                            ctx.moveTo(x * s, (y + 1) * s);
                            ctx.lineTo(x * s + c, (y + 1) * s);
                            ctx.lineTo(x * s, (y + 1) * s - c);
                            ctx.closePath();
                        }
                    }
                }
            }
            ctx.fill();
        }

        ctx.fillStyle = Res.pal_black;
        let a = ctx.globalAlpha;
        ctx.globalAlpha = Res.passive_alpha;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let t = g[x][y].type;
                let a = g[x][y].active;
                if(t != TerrainTileType.UNKNOWN && !a) {
                    ctx.rect(x * s, y * s, s, s);
                }

                /* TODO: this doesn't work very well...
                let left: boolean = null;
                let right: boolean = null;
                let top: boolean = null;
                let bot: boolean = null;
                if (x > 0) left = !g[x - 1][y].active;
                if (x < w - 1) right = !g[x + 1][y].active;
                if (y > 0) top = !g[x][y - 1].active;
                if (y < h - 1) bot = !g[x][y + 1].active;

                if (left && top) {
                    ctx.moveTo(x * s, y * s);
                    ctx.lineTo(x * s + c, y * s);
                    ctx.lineTo(x * s, y * s + c);
                    ctx.closePath();
                }
                if (top && right) {
                    ctx.moveTo((x + 1) * s, y * s);
                    ctx.lineTo((x + 1) * s - c, y * s);
                    ctx.lineTo((x + 1) * s, y * s + c);
                    ctx.closePath();
                }
                if (right && bot) {
                    ctx.moveTo((x + 1) * s, (y + 1) * s);
                    ctx.lineTo((x + 1) * s - c, (y + 1) * s);
                    ctx.lineTo((x + 1) * s, (y + 1) * s - c);
                    ctx.closePath();
                }
                if (bot && left) {
                    ctx.moveTo(x * s, (y + 1) * s);
                    ctx.lineTo(x * s + c, (y + 1) * s);
                    ctx.lineTo(x * s, (y + 1) * s - c);
                    ctx.closePath();
                }*/
            }
        }


        ctx.fill();
        ctx.globalAlpha = a;

    }

    update(): void {

    }
}