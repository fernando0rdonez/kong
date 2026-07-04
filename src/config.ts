export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 64;

export const COLORS = {
  sky: 0x6ec6ff,
  platform: 0x8d5b3b,
  platformTop: 0x6ab04c,
  player: 0xff6b6b,
  playerAccent: 0xffe66d,
  enemy: 0x8e44ad,
  barrel: 0xd35400,
  key: 0xf1c40f,
  door: 0x27ae60,
  doorLocked: 0x7f8c8d,
  switchOff: 0xc0392b,
  switchOn: 0x2ecc71,
  movingPlatform: 0x3498db,
  timedPlatformOn: 0x9b59b6,
  timedPlatformOff: 0x2c3e50,
  spring: 0xe67e22,
  hud: 0xffffff,
} as const;

export const DEPTHS = {
  background: 0,
  platforms: 10,
  interactive: 15,
  entities: 20,
  player: 25,
  carried: 26,
  hud: 100,
} as const;

export const PLAYER_SPEED = 220;
export const PLAYER_JUMP_VELOCITY = -520;
export const GRAVITY_Y = 1300;
export const THROW_SPEED_X = 420;
export const THROW_SPEED_Y = -150;
export const SPRING_VELOCITY = -800;
export const ENEMY_SPEED = 60;
export const ENEMY_PATROL_RANGE = 2.5; // en tiles, hacia cada lado del spawn

export const REGISTRY_KEYS = {
  currentLevelIndex: "currentLevelIndex",
} as const;
