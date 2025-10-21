export class Board {
    canvas;
    ctx;
    size = 10;
    cellSize = 40;
    ships = [];
    isPlayer;
    constructor(canvas, isPlayer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isPlayer = isPlayer;
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        // this.drawShips();
    }
    drawGrid() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                console.log('--------');
                this.ctx.strokeStyle = 'red';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                // this.ctx.fillStyle = 'lightblue';
                // this.ctx.strokeRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize - 20);
            }
        }
    }
}
//# sourceMappingURL=Board.js.map