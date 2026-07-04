import Phaser from "phaser";
import { PLAYER_SPEED, PLAYER_JUMP_VELOCITY, DEPTHS } from "../config";
import { Pickup } from "./Pickup";
import { Switch } from "./Switch";

export interface PlayerControls {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keyA: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  keyW: Phaser.Input.Keyboard.Key;
  keySpace: Phaser.Input.Keyboard.Key;
  keyE: Phaser.Input.Keyboard.Key;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  hasKey = false;
  carried: Pickup | null = null;
  facing: 1 | -1 = 1;

  private nearbyPickup: Pickup | null = null;
  private nearbySwitch: Switch | null = null;
  private alive = true;
  private onDeath: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, onDeath: () => void) {
    super(scene, x, y, "player");
    this.onDeath = onDeath;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTHS.player);
    this.setCollideWorldBounds(false);
    this.setDragX(1400);
    this.setMaxVelocity(PLAYER_SPEED, 900);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.width * 0.8, this.height * 0.95);
  }

  clearNearby(): void {
    this.nearbyPickup = null;
    this.nearbySwitch = null;
  }

  setNearbyPickup(pickup: Pickup): void {
    this.nearbyPickup = pickup;
  }

  setNearbySwitch(sw: Switch): void {
    this.nearbySwitch = sw;
  }

  update(controls: PlayerControls): void {
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const left = controls.cursors.left?.isDown || controls.keyA.isDown;
    const right = controls.cursors.right?.isDown || controls.keyD.isDown;
    const up = controls.cursors.up?.isDown || controls.keyW.isDown;

    if (left && !right) {
      body.setVelocityX(-PLAYER_SPEED);
      this.facing = -1;
      this.setFlipX(true);
    } else if (right && !left) {
      body.setVelocityX(PLAYER_SPEED);
      this.facing = 1;
      this.setFlipX(false);
    }

    if (up && body.blocked.down) {
      body.setVelocityY(PLAYER_JUMP_VELOCITY);
    }

    if (this.carried) {
      this.carried.followCarrier(this.x, this.y - this.height * 0.65);
    }

    if (Phaser.Input.Keyboard.JustDown(controls.keySpace)) {
      this.handleSpace();
    }

    if (Phaser.Input.Keyboard.JustDown(controls.keyE)) {
      this.nearbySwitch?.activate();
    }
  }

  private handleSpace(): void {
    if (this.carried) {
      const carried = this.carried;
      this.carried = null;
      carried.throwFrom(this.x, this.y - this.height * 0.5, this.facing);
    } else if (this.nearbyPickup && this.nearbyPickup.canBePickedUp()) {
      this.carried = this.nearbyPickup;
      this.carried.pickUpBy();
    }
  }

  die(): void {
    if (!this.alive) return;
    this.alive = false;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.tweens.add({
      targets: this,
      scale: 0,
      angle: 180,
      duration: 350,
      ease: "Back.easeIn",
      onComplete: () => this.onDeath(),
    });
  }
}
