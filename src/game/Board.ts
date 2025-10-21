import { Ship } from './Ship';

export class Board {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public size: number = 10;
  public cellSize: number = 40;
  public ships: Ship[] = [];
  public isPlayer: boolean;

  constructor(canvas: HTMLCanvasElement, isPlayer: boolean) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.isPlayer = isPlayer;
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawShips();
  }

  private drawGrid(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
       
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        // this.ctx.fillStyle = 'lightblue';
        // this.ctx.strokeRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize - 20);
      }
    }
  }

  private drawShips(): void {
    if (this.isPlayer) {
      console.log(this)
      this.ships.forEach(ship => {
        console.log(ship)
        ship.parts.forEach((part: any) => {
          console.log(part)
          this.ctx.fillStyle = 'gray';
          this.ctx.fillRect(part.x * this.cellSize, part.y * this.cellSize, this.cellSize, this.cellSize);
        });
      });
    }
  }
}