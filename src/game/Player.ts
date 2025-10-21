import { Board } from './Board';

export class Player {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  public attack(enemyBoard: Board, x: number, y: number): void {
    enemyBoard.ships.forEach(ship => {
      ship.parts.forEach((part: any) => {
        if (part.x === x && part.y === y) {
          part.hit = true;
          if (ship.isSunk()) {
            console.log('Корабль потоплен!');
          }
        }
      });
    });
    enemyBoard.render();
  }
}