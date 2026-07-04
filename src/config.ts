export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE_SIZE = 64;

export const COLORS = {
  sky: 0x6ec6ff,
} as const;

export const DEPTHS = {
  bgSky: -40,
  bgMountains: -30,
  bgOcean: -20,
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
