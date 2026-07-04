import type { LevelData } from "./types";
import { TILE_SIZE } from "../config";

class LevelBuilder {
  private cells: string[][];

  constructor(width: number, height: number) {
    this.cells = Array.from({ length: height }, () => Array(width).fill("."));
  }

  solid(row: number, colStart: number, colEnd: number): this {
    for (let c = colStart; c <= colEnd; c++) this.cells[row][c] = "#";
    return this;
  }

  set(row: number, col: number, code: string): this {
    this.cells[row][col] = code;
    return this;
  }

  build(): string[][] {
    return this.cells;
  }
}

// Nivel 1: solo movimiento y salto. Sin enemigos ni objetos.
const level1: LevelData = {
  id: 1,
  tileSize: TILE_SIZE,
  grid: new LevelBuilder(20, 10)
    .solid(8, 0, 5)
    .solid(8, 8, 12)
    .solid(8, 15, 19)
    .solid(7, 9, 10)
    .set(7, 1, "P")
    .set(6, 9, "K")
    .set(7, 18, "D")
    .build(),
  movingPlatforms: [],
  timedPlatforms: [],
};

// Nivel 2: agrega pickup/carry/throw y el primer enemigo.
const level2: LevelData = {
  id: 2,
  tileSize: TILE_SIZE,
  grid: new LevelBuilder(22, 10)
    .solid(8, 0, 9)
    .solid(8, 12, 21)
    .set(7, 1, "P")
    .set(7, 5, "B")
    .set(7, 16, "E")
    .set(7, 19, "K")
    .set(7, 21, "D")
    .build(),
  movingPlatforms: [],
  timedPlatforms: [],
};

// Nivel 3: agrega switches y puertas bloqueadas.
const level3: LevelData = {
  id: 3,
  tileSize: TILE_SIZE,
  grid: new LevelBuilder(24, 10)
    .solid(8, 0, 23)
    .set(7, 1, "P")
    .set(7, 4, "B")
    .set(7, 10, "E")
    .set(7, 14, "S")
    .set(7, 20, "K")
    .set(7, 22, "D")
    .build(),
  movingPlatforms: [],
  timedPlatforms: [],
};

// Nivel 4: agrega plataformas moviles para cruzar un pozo.
const level4: LevelData = {
  id: 4,
  tileSize: TILE_SIZE,
  grid: new LevelBuilder(22, 11)
    .solid(9, 0, 6)
    .solid(9, 14, 21)
    .set(8, 1, "P")
    .set(8, 3, "B")
    .set(8, 7, "M")
    .set(8, 17, "E")
    .set(8, 16, "K")
    .set(8, 20, "D")
    .build(),
  movingPlatforms: [{ startX: 7, startY: 8, endX: 13, endY: 8, speed: 90 }],
  timedPlatforms: [],
};

// Nivel 5: combina todas las mecanicas anteriores, mas resortes y
// plataformas de timing.
const level5: LevelData = {
  id: 5,
  tileSize: TILE_SIZE,
  grid: new LevelBuilder(28, 12)
    .solid(9, 0, 5)
    .solid(9, 10, 15)
    .solid(9, 18, 27)
    .set(8, 1, "P")
    .set(8, 3, "B")
    .set(8, 4, "R")
    .set(8, 6, "M")
    .set(8, 11, "S")
    .set(8, 12, "R")
    .set(8, 13, "E")
    .set(8, 16, "T")
    .set(8, 21, "K")
    .set(8, 24, "E")
    .set(8, 26, "D")
    .build(),
  movingPlatforms: [{ startX: 6, startY: 8, endX: 9, endY: 8, speed: 100 }],
  timedPlatforms: [{ x: 16, y: 8, onDuration: 1300, offDuration: 900 }],
};

export const LEVELS: LevelData[] = [level1, level2, level3, level4, level5];
