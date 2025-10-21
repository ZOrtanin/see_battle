type ShipPart = {
    x: number;
    y: number;
    hit: boolean;
};
export declare class Ship {
    parts: ShipPart[];
    constructor(x: number, y: number, size: number, isHorizontal: boolean);
    isSunk(): boolean;
}
export {};
//# sourceMappingURL=Ship.d.ts.map