import Phaser from "phaser";
import { DEPTHS } from "../config";

export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  private startPoint: Phaser.Math.Vector2;
  private endPoint: Phaser.Math.Vector2;
  private speed: number;
  private forward = true;

  constructor(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    speed: number,
  ) {
    super(scene, startX, startY, "tile-moving");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.platforms);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    this.startPoint = new Phaser.Math.Vector2(startX, startY);
    this.endPoint = new Phaser.Math.Vector2(endX, endY);
    this.speed = speed;

    this.moveTowardTarget();
  }

  private moveTowardTarget(): void {
    const target = this.forward ? this.endPoint : this.startPoint;
    this.scene.physics.moveToObject(this, target, this.speed);
  }

  update(): void {
    const target = this.forward ? this.endPoint : this.startPoint;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);

    if (distance < 4) {
      this.forward = !this.forward;
      this.setPosition(target.x, target.y);
      this.moveTowardTarget();
    }
  }
}
