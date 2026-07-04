import Phaser from "phaser";
import { DEPTHS, THROW_SPEED_X, THROW_SPEED_Y } from "../config";

export type PickupState = "idle" | "carried" | "thrown";

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  state: PickupState = "idle";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "barrel");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.entities);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * 0.9, this.height * 0.9);
    body.setDragX(500);
  }

  canBePickedUp(): boolean {
    return this.state === "idle";
  }

  isSlowingDown(): boolean {
    if (!this.active || !this.body) return false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    return this.state === "thrown" && Math.abs(body.velocity.x) < 15;
  }

  pickUpBy(): void {
    this.state = "carried";
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = false;
    this.setDepth(DEPTHS.carried);
  }

  followCarrier(x: number, y: number): void {
    this.setPosition(x, y);
  }

  throwFrom(x: number, y: number, direction: 1 | -1): void {
    this.state = "thrown";
    this.setDepth(DEPTHS.entities);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
    this.setPosition(x + direction * 20, y);
    body.setVelocity(THROW_SPEED_X * direction, THROW_SPEED_Y);
  }

  settle(): void {
    if (this.state !== "thrown") return;
    this.state = "idle";
  }

  destroyWithPop(): void {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 200,
      ease: "Back.easeIn",
      onComplete: () => this.destroy(),
    });
  }
}
