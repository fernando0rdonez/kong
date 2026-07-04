import Phaser from "phaser";
import { DEPTHS } from "../config";

export const SWITCH_ACTIVATED_EVENT = "switch-activated";

export class Switch extends Phaser.Physics.Arcade.Sprite {
  private activated = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "switch-off");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.interactive);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  activate(): void {
    if (this.activated) return;
    this.activated = true;
    this.setTexture("switch-on");
    this.scene.events.emit(SWITCH_ACTIVATED_EVENT);
  }
}
