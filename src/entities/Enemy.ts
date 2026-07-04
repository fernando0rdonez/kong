import Phaser from "phaser";
import { DEPTHS, ENEMY_SPEED, ENEMY_PATROL_RANGE } from "../config";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private minX: number;
  private maxX: number;
  private direction: 1 | -1 = 1;
  private defeated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, tileSize: number) {
    super(scene, x, y, "enemy-walk", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.entities);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * 0.85, this.height * 0.85);
    body.setVelocityX(ENEMY_SPEED * this.direction);

    this.minX = x - ENEMY_PATROL_RANGE * tileSize;
    this.maxX = x + ENEMY_PATROL_RANGE * tileSize;

    this.play("enemy-walk");
  }

  update(): void {
    if (this.defeated) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.left || this.x <= this.minX) {
      this.direction = 1;
    } else if (body.blocked.right || this.x >= this.maxX) {
      this.direction = -1;
    }

    body.setVelocityX(ENEMY_SPEED * this.direction);
    this.setFlipX(this.direction < 0);
  }

  defeat(): void {
    if (this.defeated) return;
    this.defeated = true;
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      angle: 90,
      duration: 250,
      ease: "Back.easeIn",
      onComplete: () => this.destroy(),
    });
  }
}
