import Component from "./Component";

export default class Grid extends Component {
    nRows: number = 0;
    nCols: number = 0;
    totalHConst: number = 0;
    totalVConst: number = 0;
    rowHeights: number[] = [];
    colWidths: number[] = [];

    components: Component[] = [];
    //row,col,rspan,cspan,hmargin,vmargin
    positions: [number, number, number, number, number, number][] = [];

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
    }


    resize() {
        for(let i = 0; i < this.components.length; i++) {
            let c = this.components[i];
            let po = this.positions[i];
            let p = this.evalPosition(...po);
            c.x = p.x;
            c.y = p.y;
            c.width = p.width;
            c.height = p.height;
            c.resize();
        }
    }

    evalPosition(row: number, col: number, rowSpan: number, colSpan: number, hmargin: number, vmargin) {
        let w = 0;
        let h = 0;
        for(let c = 0; c < colSpan; c++) {
            w += this.getWidth(col + c);
        }
        for(let r = 0; r < rowSpan; r++) {
            h += this.getHeight(row + r);
        }
        return {
            x: this.getX(col) + hmargin / 2,
            y: this.getY(row) + vmargin / 2,
            width: w - hmargin,
            height: h - vmargin,
        };
    }

    addComponent(component: Component, row: number, col: number, rowSpan: number=1, colSpan: number=1, hmargin: number=0, vmargin: number=0) {
        let p = this.evalPosition(row, col, rowSpan, colSpan, hmargin, vmargin);
        component.x = p.x;
        component.y = p.y;
        component.width = p.width;
        component.height = p.height;
        this.components.push(component);
        this.positions.push([row, col, rowSpan, colSpan, hmargin, vmargin]);
    }

    clear() {
        this.components = [];
    }

    getWidth(col: number): number {
        if(col >= this.nCols) return this.getWidth(this.nCols - 1);
        let c = this.colWidths[col];
        if(c > 1) return c;
        let remainingWidth = this.width - this.totalHConst;
        if(remainingWidth < 0) return 0;
        return remainingWidth * c;
    }

    getHeight(row: number): number {
        if(row >= this.nRows) return this.getHeight(this.nRows - 1);
        let r = this.rowHeights[row];
        if(r > 1) return r;
        let remainingHeight = this.height - this.totalVConst;
        if(remainingHeight < 0) return 0;
        return remainingHeight * r;
    }

    getX(col: number): number {
        let x = this.x;
        for(let c = 0; c < col; c++) {
            x += this.getWidth(c);
        }
        return x;
    }

    getY(row: number): number {
        let y = this.y;
        for(let r = 0; r < row; r++) {
            y += this.getHeight(r);
        }
        return y;
    }

    render(ctx: CanvasRenderingContext2D): void {
        for(let c of this.components) {
            c.render(ctx);
        }
    }

    update(dt: number): void {
        super.update(dt);
        for(let c of this.components) {
            c.update(dt);
        }
    }
}