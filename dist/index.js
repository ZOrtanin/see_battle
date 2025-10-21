import { Game } from './game/Game';
const playerCanvas = document.getElementById('playerBoard');
const enemyCanvas = document.getElementById('enemyBoard');
const game = new Game(playerCanvas, enemyCanvas);
game.start();
//# sourceMappingURL=index.js.map