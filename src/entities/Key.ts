import Phaser from "phaser";
import { DEPTHS } from "../config";

export class Key extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "key");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.interactive);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  collect(): void {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });
  }
}
