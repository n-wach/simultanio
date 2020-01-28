import { Renderable } from "../../gfx/Renderable";
import { Game } from "../../gfx/Game";
import { TerrainTile } from "../../comms";
import { Res } from "../Res";
import { Simul } from "../../Simul";

export class TerrainRenderable extends Renderable {
    static GRID_CELL_SIZE = 10;

    render(ctx: CanvasRenderingContext2D): void {
        let s = TerrainRenderable.GRID_CELL_SIZE;
        let c = s * 0.2;
        let hs = s / 2;
        let w = Simul.match.terrain_view.width;
        let h = Simul.match.terrain_view.height;
        let g = Simul.match.terrain_view.grid;

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
        for(let v in TerrainTile) {
            let t = TerrainTile[v];
            if(t == TerrainTile.UNKNOWN) continue;
            if(t == TerrainTile.LAND) ctx.fillStyle = Res.col_land;
            if(t == TerrainTile.WATER) ctx.fillStyle = Res.col_water;
            if(t == TerrainTile.MATTER_SOURCE) ctx.fillStyle = Res.col_matter;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y];
                    if(tile == t) {
                        ctx.rect(x * s, y * s, s, s);
                    } else {
                        let left = t;
                        let right = t;
                        let top = t;
                        let bot = t;
                        if (x > 0) left = g[x - 1][y];
                        if (x < w - 1) right = g[x + 1][y];
                        if (y > 0) top = g[x][y - 1];
                        if (y < h - 1) bot = g[x][y + 1];

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

        for(let v in TerrainTile) {
            let t = TerrainTile[v];
            if(t == TerrainTile.UNKNOWN) ctx.fillStyle = Res.col_fog;
            if(t == TerrainTile.LAND) ctx.fillStyle = Res.col_land;
            if(t == TerrainTile.WATER) ctx.fillStyle = Res.col_water;
            if(t == TerrainTile.MATTER_SOURCE) ctx.fillStyle = Res.col_matter;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let tile = g[x][y];
                    if(tile != t) {
                        let left = t;
                        let right = t;
                        let top = t;
                        let bot = t;
                        if (x > 0) left = g[x - 1][y];
                        if (x < w - 1) right = g[x + 1][y];
                        if (y > 0) top = g[x][y - 1];
                        if (y < h - 1) bot = g[x][y + 1];

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


        //border
        ctx.strokeStyle = Res.col_uibg;
        ctx.lineWidth = 10;
        ctx.strokeRect(-hs, -hs,
            Simul.match.terrain_view.width * s + s,
            Simul.match.terrain_view.height * s + s);

    }

    update(): void {

    }
}