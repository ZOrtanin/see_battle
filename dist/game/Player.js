export class Player {
    board;
    constructor(board) {
        this.board = board;
    }
    attack(enemyBoard, x, y) {
        enemyBoard.ships.forEach(ship => {
            ship.parts.forEach((part) => {
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
//# sourceMappingURL=Player.js.map