import Phaser from "phaser";
import { DEPTHS } from "../config";

export class TimedPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    onDuration: number,
    offDuration: number,
  ) {
    super(scene, x, y, "tile-timed-on");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.platforms);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    this.scheduleToggle(true, onDuration, offDuration);
  }

  private scheduleToggle(currentlyOn: boolean, onDuration: number, offDuration: number): void {
    const delay = currentlyOn ? onDuration : offDuration;
    this.scene.time.delayedCall(delay, () => {
      const nowOn = !currentlyOn;
      this.setSolid(nowOn);
      this.scheduleToggle(nowOn, onDuration, offDuration);
    });
  }

  private setSolid(on: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.enable = on;
    this.setTexture(on ? "tile-timed-on" : "tile-timed-off");
    this.setAlpha(on ? 1 : 0.4);
  }
}
