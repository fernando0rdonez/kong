import Phaser from "phaser";

const SPRITE_KEYS = [
  "player-jump",
  "barrel",
  "key",
  "door-locked",
  "door-ajar",
  "door-open",
  "switch-off",
  "switch-on",
  "spring",
  "tile-platform",
  "tile-moving",
  "tile-timed-on",
  "tile-timed-off",
  "cloud",
  "cloud-2",
  "cloud-3",
  "hint-bubble",
  "btn-home",
  "bg-sky",
  "bg-mountains",
  "bg-ocean",
  "menu-bg",
  "level-node",
  "title-banner",
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload(): void {
    for (const key of SPRITE_KEYS) {
      this.load.image(key, `assets/sprites/${key}.png`);
    }
    this.load.spritesheet("player-walk", "assets/sprites/player-walk.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("enemy-walk", "assets/sprites/enemy-walk.png", {
      frameWidth: 60,
      frameHeight: 60,
    });
  }

  create(): void {
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player-walk", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "enemy-walk",
      frames: this.anims.generateFrameNumbers("enemy-walk", { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.scene.start("Menu");
  }
}
