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
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "menu-bg")
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add
      .image(GAME_WIDTH / 2, 135, "title-banner")
      .setDisplaySize(640, 217);

    this.add
      .text(GAME_WIDTH / 2, 100, "Isla del Tesoro", {
        fontSize: "64px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#2c3e50",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setShadow(2, 4, "#00000066", 6);

    this.add
      .text(GAME_WIDTH / 2, 168, "Elige un nivel", {
        fontSize: "26px",
        color: "#ffffff",
        stroke: "#2c3e50",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const cols = 5;
    const spacing = 170;
    const startX = GAME_WIDTH / 2 - ((cols - 1) * spacing) / 2;
    const y = GAME_HEIGHT / 2 + 40;

    LEVELS.forEach((level, index) => {
      const x = startX + index * spacing;

      const node = this.add
        .image(x, y, "level-node")
        .setInteractive({ useHandCursor: true });

      const label = this.add
        .text(x, y, String(level.id), {
          fontSize: "48px",
          color: "#2c3e50",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      node.on("pointerover", () => {
        this.tweens.add({
          targets: [node, label],
          scale: 1.12,
          duration: 160,
          ease: "Back.easeOut",
        });
      });
      node.on("pointerout", () => {
        this.tweens.add({
          targets: [node, label],
          scale: 1,
          duration: 160,
          ease: "Sine.easeOut",
        });
      });
      node.on("pointerdown", () => {
        this.scene.start("Game", { levelIndex: index });
      });
    });

    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 40, GAME_WIDTH, 52, 0x1a1a2e, 0.45)
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 40,
        "Flechas/WASD: mover y saltar   ESPACIO: agarrar/lanzar   E: activar",
        {
          fontSize: "16px",
          color: "#ffffffee",
        },
      )
      .setOrigin(0.5);
  }
}
