import Phaser from "phaser";
import type { LevelData } from "../levels/types";
import { Enemy } from "../entities/Enemy";
import { Pickup } from "../entities/Pickup";
import { Switch } from "../entities/Switch";
import { Door } from "../entities/Door";
import { Key } from "../entities/Key";
import { MovingPlatform } from "../entities/MovingPlatform";
import { TimedPlatform } from "../entities/TimedPlatform";
import { Spring } from "../entities/Spring";

export interface ParsedLevel {
  playerSpawn: { x: number; y: number };
  key: Key | null;
  doors: Door[];
  platforms: Phaser.Physics.Arcade.StaticGroup;
  movingPlatforms: MovingPlatform[];
  timedPlatforms: TimedPlatform[];
  enemies: Enemy[];
  pickups: Pickup[];
  switches: Switch[];
  springs: Spring[];
  worldWidth: number;
  worldHeight: number;
}

function cellCenter(col: number, row: number, tileSize: number): { x: number; y: number } {
  return { x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 };
}

export function parseLevel(scene: Phaser.Scene, level: LevelData): ParsedLevel {
  const { grid, tileSize } = level;
  const platforms = scene.physics.add.staticGroup();
  const enemies: Enemy[] = [];
  const pickups: Pickup[] = [];
  const switches: Switch[] = [];
  const springs: Spring[] = [];
  const doors: Door[] = [];
  let key: Key | null = null;
  let playerSpawn = { x: tileSize, y: tileSize };

  const hasSwitches = grid.some((row) => row.includes("S"));

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const code = grid[row][col];
      if (code === "." || code === "M" || code === "T") continue;
      const { x, y } = cellCenter(col, row, tileSize);

      switch (code) {
        case "#":
          platforms.create(x, y, "tile-platform");
          break;
        case "P":
          playerSpawn = { x, y };
          break;
        case "K":
          key = new Key(scene, x, y);
          break;
        case "D":
          doors.push(new Door(scene, x, y, hasSwitches));
          break;
        case "E":
          enemies.push(new Enemy(scene, x, y, tileSize));
          break;
        case "B":
          pickups.push(new Pickup(scene, x, y));
          break;
        case "S":
          switches.push(new Switch(scene, x, y));
          break;
        case "R":
          springs.push(new Spring(scene, x, y));
          break;
      }
    }
  }

  const movingPlatforms = level.movingPlatforms.map((cfg) => {
    const start = cellCenter(cfg.startX, cfg.startY, tileSize);
    const end = cellCenter(cfg.endX, cfg.endY, tileSize);
    return new MovingPlatform(scene, start.x, start.y, end.x, end.y, cfg.speed);
  });

  const timedPlatforms = level.timedPlatforms.map((cfg) => {
    const { x, y } = cellCenter(cfg.x, cfg.y, tileSize);
    return new TimedPlatform(scene, x, y, cfg.onDuration, cfg.offDuration);
  });

  return {
    playerSpawn,
    key,
    doors,
    platforms,
    movingPlatforms,
    timedPlatforms,
    enemies,
    pickups,
    switches,
    springs,
    worldWidth: grid[0].length * tileSize,
    worldHeight: grid.length * tileSize,
  };
}
