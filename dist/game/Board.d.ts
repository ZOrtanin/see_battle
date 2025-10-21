import { Ship } from './Ship';
export declare class Board {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: number;
    cellSize: number;
    ships: Ship[];
    isPlayer: boolean;
    constructor(canvas: HTMLCanvasElement, isPlayer: boolean);
    render(): void;
    private drawGrid;
}
//# sourceMappingURL=Board.d.ts.map