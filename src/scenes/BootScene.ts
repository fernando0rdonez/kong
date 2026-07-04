import Phaser from "phaser";

const SPRITE_KEYS = [
  "player",
  "enemy",
  "barrel",
  "key",
  "door-locked",
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
  }

  create(): void {
    this.scene.start("Menu");
  }
}
