import Phaser from "phaser";
import { generateTextures } from "../utils/textures";
import { TILE_SIZE } from "../config";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    generateTextures(this, TILE_SIZE);
    this.scene.start("Menu");
  }
}
