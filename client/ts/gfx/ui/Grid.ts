import Component from "./Component";

export default class Grid extends Component {
    nRows: number = 0;
    nCols: number = 0;
    totalHConst: number = 0;
    totalVConst: number = 0;
    rowHeights: number[] = [];
    colWidths: number[] = [];
    components: Component[][] = [];

    constructor(rowHeights: number[], colWidths: number[]) {
        super();
        this.nRows = rowHeights.length;
        this.nCols = colWidths.length;
        this.rowHeights = rowHeights;
        for(let r of rowHeights) {
            if(r > 1) {
                this.totalVConst += r;
            }
        }
        this.colWidths = colWidths;
        for(let c of colWidths) {
            if(c > 1) {
                this.totalHConst += c;
            }
        }
        this.components = [];
        for(let r = 0; r < this.nRows; r++) {
            let cols = [];
            for(let c = 0; c < this.nCols; c++) {
                cols.push(null);
            }
            this.components.push(cols);
        }
    }

    addComponent(component: Component, row: number, col: number) {
        component.x = this.getX(col);
        component.y = this.getY(row);
        component.width = this.getWidth(col);
        component.height = this.getHeight(row);
        this.components[row][col] = component;
    }

    removeComponent(row: number, col: number) {
        this.components[row][col] = null;
    }

    getWidth(col: number) {
        let c = this.colWidths[col];
        if(c > 1) return c;
        let remainingWidth = this.width - this.totalHConst;
        if(remainingWidth < 0) return 0;
        return remainingWidth * c;
    }

    getHeight(row: number) {
        let r = this.rowHeights[row];
        if(r > 1) return r;
        let remainingWidth = this.height - this.totalVConst;
        if(remainingWidth < 0) return 0;
        return remainingWidth * r;
    }

    getX(col: number) {
        let x = 0;
        for(let c = 0; c < col; c++) {
            x += this.getWidth(c);
        }
        return x;
    }

    getY(row: number) {
        let y = 0;
        for(let r = 0; r < row; r++) {
            y += this.getWidth(r);
        }
        return y;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.translate(this.x, this.y);
        for(let r = 0; r < this.nRows; r++) {
            for(let c = 0; c < this.nCols; c++) {
                if(this.components[r][c]) this.components[r][c].render(ctx);
            }
        }
        ctx.translate(-this.x, -this.y);
    }

    update(dt: number): void {
        for(let r = 0; r < this.nRows; r++) {
            for(let c = 0; c < this.nCols; c++) {
                if(this.components[r][c]) this.components[r][c].update(dt);
            }
        }
    }
}