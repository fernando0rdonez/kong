import Phaser from "phaser";
import { DEPTHS } from "../config";
import { SWITCH_ACTIVATED_EVENT } from "./Switch";

export class Door extends Phaser.Physics.Arcade.Sprite {
  locked: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, startsLocked: boolean) {
    super(scene, x, y, startsLocked ? "door-locked" : "door-open");
    this.locked = startsLocked;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.interactive);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    scene.events.on(SWITCH_ACTIVATED_EVENT, this.unlock, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      scene.events.off(SWITCH_ACTIVATED_EVENT, this.unlock, this);
    });
  }

  private unlock(): void {
    if (!this.locked) return;
    this.locked = false;
    this.setTexture("door-open");
  }
}
