import Phaser from "phaser";
import { DEPTHS } from "../config";

export type MechanicId =
  | "pickup"
  | "switch"
  | "moving"
  | "timed"
  | "spring"
  | "enemy";

const STORAGE_PREFIX = "kong-intro-seen:";

function hasSeen(id: MechanicId): boolean {
  return localStorage.getItem(STORAGE_PREFIX + id) === "1";
}

function markSeen(id: MechanicId): void {
  localStorage.setItem(STORAGE_PREFIX + id, "1");
}

const LABELS: Record<MechanicId, string> = {
  pickup: "ESPACIO: agarra y lanza",
  switch: "E: activa",
  moving: "¡se mueve!",
  timed: "¡aparece y desaparece!",
  spring: "¡rebota!",
  enemy: "¡cuidado, te atrapa!",
};

/**
 * Muestra una burbuja de pista breve encima de un objeto la primera vez
 * que el jugador ve esa mecanica. No vuelve a mostrarse despues.
 */
export function showMechanicHintOnce(
  scene: Phaser.Scene,
  id: MechanicId,
  x: number,
  y: number,
): void {
  if (hasSeen(id)) return;
  markSeen(id);

  const bubbleY = y - 50;
  const bubble = scene.add
    .image(x, bubbleY, "hint-bubble")
    .setDepth(DEPTHS.hud)
    .setScale(0.4);
  const label = scene.add
    .text(x, bubbleY, LABELS[id], {
      fontSize: "14px",
      color: "#2c3e50",
      fontStyle: "bold",
      backgroundColor: "#ffffffcc",
      padding: { x: 6, y: 3 },
    })
    .setOrigin(0.5)
    .setDepth(DEPTHS.hud + 1);

  scene.tweens.add({
    targets: bubble,
    scale: 0.55,
    y: bubbleY - 10,
    duration: 350,
    yoyo: true,
    repeat: 1,
    ease: "Sine.easeInOut",
  });

  scene.tweens.add({
    targets: [bubble, label],
    alpha: 0,
    delay: 1600,
    duration: 400,
    onComplete: () => {
      bubble.destroy();
      label.destroy();
    },
  });
}
