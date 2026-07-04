import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "../config";
import { LEVELS } from "../levels/levels";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.sky);

    this.add
      .text(GAME_WIDTH / 2, 120, "Isla del Tesoro", {
        fontSize: "56px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setShadow(2, 4, "#00000055", 4);

    this.add
      .text(GAME_WIDTH / 2, 180, "Elige un nivel", {
        fontSize: "24px",
        color: "#ffffffcc",
      })
      .setOrigin(0.5);

    const cols = 5;
    const spacing = 160;
    const startX = GAME_WIDTH / 2 - ((cols - 1) * spacing) / 2;
    const y = GAME_HEIGHT / 2;

    LEVELS.forEach((level, index) => {
      const x = startX + index * spacing;
      const button = this.add
        .rectangle(x, y, 120, 120, 0xffffff, 0.9)
        .setStrokeStyle(4, 0x2c3e50)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(x, y, String(level.id), {
          fontSize: "48px",
          color: "#2c3e50",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      button.on("pointerover", () => button.setFillStyle(0xffe66d, 1));
      button.on("pointerout", () => button.setFillStyle(0xffffff, 0.9));
      button.on("pointerdown", () => {
        this.scene.start("Game", { levelIndex: index });
      });
    });

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, "Flechas/WASD: mover y saltar   ESPACIO: agarrar/lanzar   E: activar", {
        fontSize: "16px",
        color: "#ffffffcc",
      })
      .setOrigin(0.5);
  }
}
