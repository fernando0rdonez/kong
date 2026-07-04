import Phaser from "phaser";
import { COLORS, DEPTHS, GAME_WIDTH, SPRING_VELOCITY } from "../config";
import { LEVELS } from "../levels/levels";
import { parseLevel } from "../utils/levelParser";
import type { ParsedLevel } from "../utils/levelParser";
import { showMechanicHintOnce } from "../utils/intro";
import { Player } from "../entities/Player";
import type { PlayerControls } from "../entities/Player";
import { Pickup } from "../entities/Pickup";
import { Enemy } from "../entities/Enemy";
import { Switch } from "../entities/Switch";
import { Door } from "../entities/Door";

interface GameSceneData {
  levelIndex: number;
}

export class GameScene extends Phaser.Scene {
  private levelIndex = 0;
  private parsed!: ParsedLevel;
  private player!: Player;
  private controls!: PlayerControls;
  private keyIcon!: Phaser.GameObjects.Image;
  private deathPitY = 0;
  private levelEnded = false;

  constructor() {
    super("Game");
  }

  init(data: GameSceneData): void {
    this.levelIndex = data.levelIndex;
    this.levelEnded = false;
  }

  create(): void {
    const level = LEVELS[this.levelIndex];
    this.cameras.main.setBackgroundColor(COLORS.sky);

    const parsed = parseLevel(this, level);
    this.parsed = parsed;
    this.addClouds(parsed.worldWidth);

    this.physics.world.setBounds(0, 0, parsed.worldWidth, parsed.worldHeight);
    this.cameras.main.setBounds(0, 0, parsed.worldWidth, parsed.worldHeight);

    this.player = new Player(this, parsed.playerSpawn.x, parsed.playerSpawn.y, () =>
      this.restartLevel(),
    );
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Se usan arrays planos (no this.physics.add.group) como blancos de
    // collider/overlap: crear un Group aplicaria sus propiedades por
    // defecto (allowGravity/immovable) a cada hijo, pisando la
    // configuracion propia de cada entidad (puertas, switches, resortes
    // y plataformas especiales dejarian de ser inmoviles/sin gravedad).
    this.physics.add.collider(this.player, parsed.platforms);
    this.physics.add.collider(this.player, parsed.timedPlatforms);
    this.physics.add.collider(this.player, parsed.movingPlatforms);
    this.physics.add.collider(this.player, parsed.springs, (playerObj) => {
      const body = (playerObj as Player).body as Phaser.Physics.Arcade.Body;
      if (body.velocity.y >= 0) {
        body.setVelocityY(SPRING_VELOCITY);
      }
    });
    this.physics.add.collider(
      this.player,
      parsed.doors,
      undefined,
      (_player, doorObj) => (doorObj as Door).locked,
      this,
    );

    this.physics.add.collider(parsed.enemies, parsed.platforms);
    this.physics.add.collider(parsed.enemies, parsed.movingPlatforms);
    this.physics.add.collider(parsed.enemies, parsed.timedPlatforms);

    this.physics.add.collider(parsed.pickups, parsed.platforms);
    this.physics.add.collider(parsed.pickups, parsed.movingPlatforms);
    this.physics.add.collider(parsed.pickups, parsed.timedPlatforms);

    this.physics.add.overlap(this.player, parsed.pickups, (_player, obj) => {
      const pickup = obj as Pickup;
      if (pickup.canBePickedUp()) {
        this.player.setNearbyPickup(pickup);
        showMechanicHintOnce(this, "pickup", pickup.x, pickup.y);
      }
    });

    this.physics.add.overlap(this.player, parsed.switches, (_player, obj) => {
      const sw = obj as Switch;
      this.player.setNearbySwitch(sw);
      showMechanicHintOnce(this, "switch", sw.x, sw.y);
    });

    this.physics.add.overlap(parsed.pickups, parsed.enemies, (pObj, eObj) => {
      const pickup = pObj as Pickup;
      const enemy = eObj as Enemy;
      if (pickup.state === "thrown") {
        enemy.defeat();
        pickup.destroyWithPop();
      }
    });

    this.physics.add.overlap(this.player, parsed.enemies, () => {
      this.player.die();
    });

    if (parsed.key) {
      const keyObj = parsed.key;
      this.physics.add.overlap(this.player, keyObj, () => {
        this.player.hasKey = true;
        keyObj.collect();
        this.updateHud();
      });
    }

    this.physics.add.overlap(this.player, parsed.doors, (_player, obj) => {
      const door = obj as Door;
      if (!door.locked && this.player.hasKey) {
        this.completeLevel();
      }
    });

    parsed.movingPlatforms.forEach((mp) => showMechanicHintOnce(this, "moving", mp.x, mp.y));
    parsed.timedPlatforms.forEach((tp) => showMechanicHintOnce(this, "timed", tp.x, tp.y));
    parsed.springs.forEach((s) => showMechanicHintOnce(this, "spring", s.x, s.y));
    parsed.enemies.forEach((e) => showMechanicHintOnce(this, "enemy", e.x, e.y));

    const keyboard = this.input.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
    this.controls = {
      cursors: keyboard.createCursorKeys(),
      keyA: keyboard.addKey("A"),
      keyD: keyboard.addKey("D"),
      keyW: keyboard.addKey("W"),
      keySpace: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      keyE: keyboard.addKey("E"),
    };

    this.deathPitY = parsed.worldHeight + 300;
    this.setupHud(level.id);
  }

  update(): void {
    if (this.levelEnded) return;

    // Los overlaps de fisica de este frame (que llenan nearbyPickup/nearbySwitch)
    // ya se procesaron antes de llegar aqui, asi que hay que consumirlos antes
    // de limpiarlos para el siguiente frame.
    this.player.update(this.controls);
    this.player.clearNearby();

    this.parsed.enemies.forEach((e) => e.update());
    this.parsed.movingPlatforms.forEach((mp) => mp.update());
    this.parsed.pickups.forEach((p) => {
      if (p.isSlowingDown()) p.settle();
    });

    if (this.player.y > this.deathPitY) {
      this.player.die();
    }

    this.updateHud();
  }

  private setupHud(levelId: number): void {
    this.keyIcon = this.add
      .image(30, 30, "key")
      .setScrollFactor(0)
      .setDepth(DEPTHS.hud)
      .setAlpha(0.3)
      .setScale(0.9);

    this.add
      .text(60, 20, `Nivel ${levelId}`, {
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setScrollFactor(0)
      .setDepth(DEPTHS.hud)
      .setShadow(1, 2, "#00000088", 2);

    const homeButton = this.add
      .image(GAME_WIDTH - 40, 30, "btn-home")
      .setScrollFactor(0)
      .setDepth(DEPTHS.hud)
      .setInteractive({ useHandCursor: true });
    homeButton.on("pointerover", () => homeButton.setScale(1.1));
    homeButton.on("pointerout", () => homeButton.setScale(1));
    homeButton.on("pointerdown", () => this.scene.start("Menu"));
  }

  private updateHud(): void {
    this.keyIcon.setAlpha(this.player.hasKey ? 1 : 0.3);
  }

  private addClouds(worldWidth: number): void {
    const count = Math.max(4, Math.floor(worldWidth / 400));
    for (let i = 0; i < count; i++) {
      this.add
        .image(
          Phaser.Math.Between(0, worldWidth),
          Phaser.Math.Between(30, 160),
          "cloud",
        )
        .setScrollFactor(0.3)
        .setDepth(DEPTHS.background)
        .setAlpha(0.8);
    }
  }

  private restartLevel(): void {
    this.scene.restart({ levelIndex: this.levelIndex });
  }

  private completeLevel(): void {
    if (this.levelEnded) return;
    this.levelEnded = true;

    const { width, height } = this.cameras.main;
    const centerX = this.cameras.main.scrollX + width / 2;
    const centerY = this.cameras.main.scrollY + height / 2;

    this.add
      .text(centerX, centerY, "¡Nivel completado!", {
        fontSize: "42px",
        color: "#ffffff",
        fontStyle: "bold",
        backgroundColor: "#27ae60",
        padding: { x: 24, y: 16 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTHS.hud);

    this.time.delayedCall(1600, () => {
      const nextIndex = this.levelIndex + 1;
      if (nextIndex < LEVELS.length) {
        this.scene.restart({ levelIndex: nextIndex });
      } else {
        this.scene.start("Menu");
      }
    });
  }
}
