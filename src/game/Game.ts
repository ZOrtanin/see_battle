import { Board } from './Board';
import { Player } from './Player';
import { Ship } from './Ship';

export class Game {
  private playerBoard: Board;
  private enemyBoard: Board;
  private player: Player;
  private enemy: Player;

  constructor(playerCanvas: HTMLCanvasElement, enemyCanvas: HTMLCanvasElement) {
    this.playerBoard = new Board(playerCanvas, true);
    this.enemyBoard = new Board(enemyCanvas, false);
    this.player = new Player(this.playerBoard);
    this.enemy = new Player(this.enemyBoard);
  }

  public start(): void {

    this.playerBoard.ships.push(new Ship(1, 1, 3, false));
    this.playerBoard.render();
    this.enemyBoard.render();
    this.setupEventListeners();
 
  }

  private setupEventListeners(): void {
    this.enemyBoard.canvas.addEventListener('click', (e) => {
      const rect = this.enemyBoard.canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / 40);
      const y = Math.floor((e.clientY - rect.top) / 40);
      console.log(x)
      this.player.attack(this.enemyBoard, x, y);
    });
  }
}