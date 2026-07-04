import Phaser from "phaser";
import { DEPTHS } from "../config";

export class Spring extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "spring");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.interactive);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  bounce(): void {
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.5,
      duration: 80,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }
}
