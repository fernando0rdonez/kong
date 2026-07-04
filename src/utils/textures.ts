import Phaser from "phaser";
import { COLORS } from "../config";

/**
 * Genera todas las texturas del juego como shapes dibujados con Graphics,
 * evitando depender de archivos de imagen externos.
 */
export function generateTextures(scene: Phaser.Scene, tileSize: number): void {
  const g = scene.add.graphics();

  // Plataforma solida (bloque con "pasto" arriba)
  drawRoundedBlock(g, tileSize, COLORS.platform, COLORS.platformTop);
  g.generateTexture("tile-platform", tileSize, tileSize);
  g.clear();

  // Plataforma movil
  g.fillStyle(COLORS.movingPlatform, 1);
  g.fillRoundedRect(0, 0, tileSize, tileSize * 0.5, 6);
  g.lineStyle(3, 0x1b4f72, 1);
  g.strokeRoundedRect(1, 1, tileSize - 2, tileSize * 0.5 - 2, 6);
  g.generateTexture("tile-moving", tileSize, tileSize * 0.5);
  g.clear();

  // Plataforma de timing (encendida / apagada)
  g.fillStyle(COLORS.timedPlatformOn, 1);
  g.fillRoundedRect(0, 0, tileSize, tileSize * 0.5, 6);
  g.generateTexture("tile-timed-on", tileSize, tileSize * 0.5);
  g.clear();

  g.fillStyle(COLORS.timedPlatformOff, 0.35);
  g.fillRoundedRect(0, 0, tileSize, tileSize * 0.5, 6);
  g.lineStyle(2, COLORS.timedPlatformOff, 0.6);
  g.strokeRoundedRect(1, 1, tileSize - 2, tileSize * 0.5 - 2, 6);
  g.generateTexture("tile-timed-off", tileSize, tileSize * 0.5);
  g.clear();

  // Jugador (personaje redondeado con ojos)
  const pSize = tileSize * 0.85;
  g.fillStyle(COLORS.player, 1);
  g.fillRoundedRect(0, 0, pSize, pSize, 10);
  g.fillStyle(COLORS.playerAccent, 1);
  g.fillRoundedRect(pSize * 0.15, pSize * 0.65, pSize * 0.7, pSize * 0.2, 4);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(pSize * 0.32, pSize * 0.35, pSize * 0.12);
  g.fillCircle(pSize * 0.68, pSize * 0.35, pSize * 0.12);
  g.fillStyle(0x2c3e50, 1);
  g.fillCircle(pSize * 0.34, pSize * 0.35, pSize * 0.05);
  g.fillCircle(pSize * 0.7, pSize * 0.35, pSize * 0.05);
  g.generateTexture("player", pSize, pSize);
  g.clear();

  // Enemigo (criatura redonda con antenas, look amigable)
  const eSize = tileSize * 0.8;
  g.fillStyle(COLORS.enemy, 1);
  g.fillRoundedRect(0, eSize * 0.15, eSize, eSize * 0.85, 12);
  g.lineStyle(4, 0x5b2c6f, 1);
  g.strokeRoundedRect(0, eSize * 0.15, eSize, eSize * 0.85, 12);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(eSize * 0.32, eSize * 0.5, eSize * 0.13);
  g.fillCircle(eSize * 0.68, eSize * 0.5, eSize * 0.13);
  g.fillStyle(0x2c3e50, 1);
  g.fillCircle(eSize * 0.32, eSize * 0.5, eSize * 0.06);
  g.fillCircle(eSize * 0.68, eSize * 0.5, eSize * 0.06);
  g.generateTexture("enemy", eSize, eSize);
  g.clear();

  // Barril / caja
  const bSize = tileSize * 0.75;
  g.fillStyle(COLORS.barrel, 1);
  g.fillRoundedRect(0, 0, bSize, bSize, 8);
  g.lineStyle(4, 0x7a3502, 1);
  g.strokeRoundedRect(2, 2, bSize - 4, bSize - 4, 8);
  g.lineStyle(3, 0x7a3502, 1);
  g.strokeRect(0, bSize * 0.25, bSize, 0);
  g.strokeRect(0, bSize * 0.75, bSize, 0);
  g.generateTexture("barrel", bSize, bSize);
  g.clear();

  // Llave
  const kSize = tileSize * 0.7;
  g.fillStyle(COLORS.key, 1);
  g.fillCircle(kSize * 0.3, kSize * 0.3, kSize * 0.28);
  g.fillStyle(0x1a1a2e, 1);
  g.fillCircle(kSize * 0.3, kSize * 0.3, kSize * 0.12);
  g.fillStyle(COLORS.key, 1);
  g.fillRect(kSize * 0.28, kSize * 0.3, kSize * 0.1, kSize * 0.6);
  g.fillRect(kSize * 0.38, kSize * 0.68, kSize * 0.18, kSize * 0.1);
  g.fillRect(kSize * 0.38, kSize * 0.85, kSize * 0.14, kSize * 0.1);
  g.generateTexture("key", kSize, kSize * 1.0);
  g.clear();

  // Puerta (abierta y cerrada)
  const doorW = tileSize * 0.9;
  const doorH = tileSize * 1.8;
  g.fillStyle(COLORS.doorLocked, 1);
  g.fillRoundedRect(0, 0, doorW, doorH, 6);
  g.fillStyle(0x34495e, 1);
  g.fillRoundedRect(doorW * 0.15, doorH * 0.1, doorW * 0.7, doorH * 0.35, 4);
  g.fillRoundedRect(doorW * 0.15, doorH * 0.55, doorW * 0.7, doorH * 0.35, 4);
  g.generateTexture("door-locked", doorW, doorH);
  g.clear();

  g.fillStyle(COLORS.door, 1);
  g.fillRoundedRect(0, 0, doorW, doorH, 6);
  g.fillStyle(0x1e8449, 1);
  g.fillRoundedRect(doorW * 0.15, doorH * 0.1, doorW * 0.7, doorH * 0.35, 4);
  g.fillRoundedRect(doorW * 0.15, doorH * 0.55, doorW * 0.7, doorH * 0.35, 4);
  g.fillStyle(0xf1c40f, 1);
  g.fillCircle(doorW * 0.78, doorH * 0.5, doorW * 0.06);
  g.generateTexture("door-open", doorW, doorH);
  g.clear();

  // Switch (encendido / apagado)
  const sSize = tileSize * 0.55;
  g.fillStyle(0x5d4037, 1);
  g.fillRoundedRect(0, sSize * 0.6, sSize, sSize * 0.5, 4);
  g.fillStyle(COLORS.switchOff, 1);
  g.fillRoundedRect(sSize * 0.15, 0, sSize * 0.7, sSize * 0.7, 6);
  g.generateTexture("switch-off", sSize, sSize * 1.1);
  g.clear();

  g.fillStyle(0x5d4037, 1);
  g.fillRoundedRect(0, sSize * 0.6, sSize, sSize * 0.5, 4);
  g.fillStyle(COLORS.switchOn, 1);
  g.fillRoundedRect(sSize * 0.15, sSize * 0.15, sSize * 0.7, sSize * 0.55, 6);
  g.generateTexture("switch-on", sSize, sSize * 1.1);
  g.clear();

  // Resorte
  const rW = tileSize * 0.7;
  const rH = tileSize * 0.45;
  g.fillStyle(0x784212, 1);
  g.fillRect(0, rH * 0.7, rW, rH * 0.3);
  g.fillStyle(COLORS.spring, 1);
  g.fillRoundedRect(rW * 0.1, 0, rW * 0.8, rH * 0.75, 4);
  g.generateTexture("spring", rW, rH);
  g.clear();

  // Fondo simple con degrade (una nube)
  g.fillStyle(0xffffff, 0.9);
  g.fillEllipse(40, 20, 70, 30);
  g.fillEllipse(75, 15, 50, 26);
  g.generateTexture("cloud", 120, 50);
  g.clear();

  // Icono generico para pistas de mecanicas nuevas
  g.fillStyle(0xffffff, 0.95);
  g.fillCircle(24, 24, 24);
  g.lineStyle(3, 0x2c3e50, 1);
  g.strokeCircle(24, 24, 24);
  g.generateTexture("hint-bubble", 48, 48);
  g.clear();

  // Boton de "volver al inicio" (icono de casa)
  const btnSize = 48;
  g.fillStyle(0xffffff, 0.95);
  g.fillRoundedRect(0, 0, btnSize, btnSize, 10);
  g.lineStyle(3, 0x2c3e50, 1);
  g.strokeRoundedRect(1.5, 1.5, btnSize - 3, btnSize - 3, 10);
  g.fillStyle(0x2c3e50, 1);
  g.fillTriangle(
    btnSize * 0.5,
    btnSize * 0.2,
    btnSize * 0.22,
    btnSize * 0.48,
    btnSize * 0.78,
    btnSize * 0.48,
  );
  g.fillRect(btnSize * 0.28, btnSize * 0.48, btnSize * 0.44, btnSize * 0.28);
  g.fillStyle(0xffffff, 1);
  g.fillRect(btnSize * 0.44, btnSize * 0.58, btnSize * 0.12, btnSize * 0.18);
  g.generateTexture("btn-home", btnSize, btnSize);
  g.clear();

  g.destroy();
}

function drawRoundedBlock(
  g: Phaser.GameObjects.Graphics,
  size: number,
  base: number,
  top: number,
): void {
  g.fillStyle(base, 1);
  g.fillRect(0, 0, size, size);
  g.fillStyle(top, 1);
  g.fillRect(0, 0, size, size * 0.28);
  g.lineStyle(2, 0x000000, 0.15);
  g.strokeRect(0, 0, size, size);
}
