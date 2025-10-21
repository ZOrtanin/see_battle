type ShipPart = { x: number; y: number; hit: boolean };

export class Ship {
  public parts: ShipPart[];

  constructor(x: number, y: number, size: number, isHorizontal: boolean) {
    this.parts = [];
    for (let i = 0; i < size; i++) {
      this.parts.push({ x: isHorizontal ? x + i : x, y: isHorizontal ? y : y + i, hit: false });
    }
  }

  public isSunk(): boolean {
    return this.parts.every(part => part.hit);
  }
}