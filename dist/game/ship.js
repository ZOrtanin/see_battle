export class Ship {
    parts;
    constructor(x, y, size, isHorizontal) {
        this.parts = [];
        for (let i = 0; i < size; i++) {
            this.parts.push({ x: isHorizontal ? x + i : x, y: isHorizontal ? y : y + i, hit: false });
        }
    }
    isSunk() {
        return this.parts.every(part => part.hit);
    }
}
//# sourceMappingURL=Ship.js.map