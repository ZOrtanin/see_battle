import { Board } from './Board';
import { Player } from './Player';
export class Game {
    playerBoard;
    enemyBoard;
    player;
    enemy;
    constructor(playerCanvas, enemyCanvas) {
        this.playerBoard = new Board(playerCanvas, true);
        this.enemyBoard = new Board(enemyCanvas, false);
        this.player = new Player(this.playerBoard);
        this.enemy = new Player(this.enemyBoard);
    }
    start() {
        this.playerBoard.render();
        this.enemyBoard.render();
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.enemyBoard.canvas.addEventListener('click', (e) => {
            const rect = this.enemyBoard.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / 40);
            const y = Math.floor((e.clientY - rect.top) / 40);
            this.player.attack(this.enemyBoard, x, y);
        });
    }
}
//# sourceMappingURL=Game.js.map