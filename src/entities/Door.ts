import Phaser from "phaser";
import { DEPTHS, TILE_SIZE } from "../config";
import { SWITCH_ACTIVATED_EVENT } from "./Switch";

export class Door extends Phaser.Physics.Arcade.Sprite {
  locked: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, startsLocked: boolean) {
    // Se ancla por la base (no por el centro) en el borde inferior de la
    // celda, que coincide con el borde superior del piso: asi la puerta
    // queda apoyada en el suelo sin importar cuan alto sea el sprite.
    super(scene, x, y + TILE_SIZE / 2, startsLocked ? "door-locked" : "door-open");
    this.locked = startsLocked;
    this.setOrigin(0.5, 1);

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
