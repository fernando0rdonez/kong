export type TileCode =
  | "." // vacio
  | "#" // plataforma solida
  | "P" // spawn jugador
  | "K" // llave
  | "D" // puerta
  | "E" // enemigo
  | "B" // barril/caja (pickup)
  | "S" // switch
  | "M" // plataforma movil (config extra en movingPlatforms)
  | "T" // plataforma de timing (config extra en timedPlatforms)
  | "R"; // resorte

export interface MovingPlatformConfig {
  startX: number; // columna de la grid
  startY: number; // fila de la grid
  endX: number; // columna de la grid
  endY: number; // fila de la grid
  speed: number; // px/seg
}

export interface TimedPlatformConfig {
  x: number; // columna de la grid
  y: number; // fila de la grid
  onDuration: number; // ms visible/solida
  offDuration: number; // ms invisible/atravesable
}

export interface LevelData {
  id: number;
  grid: string[][];
  tileSize: number;
  movingPlatforms: MovingPlatformConfig[];
  timedPlatforms: TimedPlatformConfig[];
}
