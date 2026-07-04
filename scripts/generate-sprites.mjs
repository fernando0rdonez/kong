#!/usr/bin/env node
// Genera los sprites del juego con la API de imagenes de OpenAI y los deja
// listos en public/assets/sprites/ para que Phaser los cargue directamente.
//
// Uso:
//   npm run generate:sprites          -> genera solo lo que falte
//   npm run generate:sprites -- --force -> regenera todo de nuevo
//
// Requiere OPENAI_API_KEY en el archivo .env de la raiz del proyecto.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "assets", "sprites");

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5";
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "low";

if (!API_KEY) {
  console.error(
    "Falta OPENAI_API_KEY. Agregalo a tu archivo .env en la raiz del proyecto\n" +
      "(OPENAI_API_KEY=sk-...) y volve a correr: npm run generate:sprites",
  );
  process.exit(1);
}

const STYLE_SUFFIX =
  "children's video game sprite, flat vector cartoon illustration, bold clean thick outlines, " +
  "vibrant saturated colors, soft cel-shading, simple friendly shapes, centered composition, " +
  "isolated on a plain background, no text, no watermark, no drop shadow, " +
  "tropical pirate treasure-island theme";

const BG_STYLE =
  "children's video game background illustration, flat vector cartoon style, bold clean shapes, " +
  "vibrant saturated colors, soft cel-shading, wide panoramic scene, full bleed edge to edge, " +
  "no characters, no text, no watermark, tropical pirate treasure-island theme";

const SPRITES = [
  {
    key: "player",
    prompt: `A friendly cartoon pirate-adventurer kid character, red shirt, yellow bandana and belt, big round friendly eyes, short simple arms and legs, standing pose facing right, chibi proportions, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 54,
    height: 54,
  },
  {
    key: "enemy",
    prompt: `A grumpy cartoon pirate crab enemy for a children's platformer, round spiky purple shell with a darker purple outline and small spikes on top, angry furrowed eyebrows over big round eyes, one raised snapping pincer as a threat pose, a tiny red bandana tied on top of the shell, clearly readable as a game obstacle/enemy but still cute and non-scary, standing pose facing right, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 51,
    height: 51,
  },
  {
    key: "barrel",
    prompt: `A wooden pirate treasure barrel, warm orange-brown wood planks with dark metal bands, front view, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 48,
    height: 48,
  },
  {
    key: "key",
    prompt: `A golden ornate treasure key, shiny gold with a round decorative bow and simple teeth, front view, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 45,
    height: 45,
  },
  {
    key: "door-locked",
    prompt: `A locked stone dungeon door structure on a tropical island, filling almost the entire frame with minimal empty space around it, gray stone archway with wooden planks and a metal padlock in the center, front view, tall portrait orientation, ${STYLE_SUFFIX}`,
    apiSize: "1024x1536",
    width: 140,
    height: 170,
    fit: "fill",
    trim: true,
  },
  {
    key: "door-open",
    prompt: `An open treasure door archway structure on a tropical island standing ajar revealing a warm golden glow inside, filling almost the entire frame with minimal empty space around it, green wooden door frame, front view, tall portrait orientation, ${STYLE_SUFFIX}`,
    apiSize: "1024x1536",
    width: 140,
    height: 170,
    fit: "fill",
    trim: true,
  },
  {
    key: "switch-off",
    prompt: `A toy-like lever switch in the OFF/down position, red lever handle mounted on a brown wooden base, front view, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 35,
    height: 39,
  },
  {
    key: "switch-on",
    prompt: `A toy-like lever switch in the ON/up position, green lever handle mounted on a brown wooden base, front view, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 35,
    height: 39,
  },
  {
    key: "spring",
    prompt: `A bouncy cartoon spring coil trampoline, orange metal coil mounted on a brown wooden base, front view, wide rectangular composition, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 45,
    height: 29,
  },
  {
    key: "tile-platform",
    prompt: `A seamless macro texture swatch/material sample of grass-topped earth and rock ground for a 2D platformer, NOT an object or cube floating on a background — this is a flat close-up material texture that must fill 100% of the square image edge-to-edge with zero border, zero padding, zero vignette and zero empty background of any color visible anywhere, lush green grass texture across the top third blending into rich brown soil and rock texture across the rest, flat cartoon shading, bold clean colors, tropical pirate treasure-island theme, no text, no watermark`,
    apiSize: "1024x1024",
    width: 64,
    height: 64,
    background: "opaque",
    fit: "cover",
  },
  {
    key: "tile-moving",
    prompt: `A floating stone platform slab, blue-gray stone with a glowing blue trim, wide rectangular slab, front view, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 64,
    height: 32,
  },
  {
    key: "tile-timed-on",
    prompt: `A magic timed platform slab that is active and glowing, purple stone with bright glowing purple energy lines, wide rectangular slab, front view, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 64,
    height: 32,
  },
  {
    key: "tile-timed-off",
    prompt: `A magic timed platform slab that is inactive and dim, dark gray stone with faint dim purple lines, wide rectangular slab, front view, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 64,
    height: 32,
  },
  {
    key: "cloud",
    prompt: `A simple fluffy white cartoon cloud, soft rounded puffy shapes, wide horizontal shape, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 120,
    height: 50,
  },
  {
    key: "cloud-2",
    prompt: `A simple fluffy white cartoon cloud, a different silhouette than a typical cloud (longer and flatter, stretched out horizontally, fewer bumps), soft rounded puffy shapes, wide horizontal shape, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 130,
    height: 40,
  },
  {
    key: "cloud-3",
    prompt: `A simple fluffy white cartoon cloud, small and compact with a rounder chunkier silhouette (more bunched-up puffs, less spread out than a typical wide cloud), soft rounded puffy shapes, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 80,
    height: 55,
  },
  {
    key: "hint-bubble",
    prompt: `A simple round white cartoon speech-bubble icon with a thin dark outline, empty inside, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 48,
    height: 48,
  },
  {
    key: "btn-home",
    prompt: `A simple cartoon home button icon, white rounded-square background with a dark blue house silhouette centered inside, flat UI icon style, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 48,
    height: 48,
  },
  {
    key: "bg-sky",
    prompt: `An abstract, minimal sky-gradient texture for a video game background layer, uniform soft gradient from pale sky-blue at the top to a very light warm horizon glow at the bottom, only two or three soft blurry cloud smudges scattered with even spacing, absolutely no islands, no mountains, no ships, no palm trees, no framing elements at the edges, no distinct objects of any kind, just a smooth abstract color gradient with faint cloud texture that can be stretched to any width, ${BG_STYLE}`,
    apiSize: "1536x1024",
    width: 1536,
    height: 640,
    background: "opaque",
    fit: "cover",
  },
  {
    key: "bg-mountains",
    prompt: `A distant jungle mountain skyline silhouette for a side-scrolling platformer background, layered dark teal-green jungle hills and palm tree silhouettes along the horizon line, flat solid silhouette shapes only, nothing drawn above the hill line, no sky, no clouds, no ground, ${BG_STYLE}`,
    apiSize: "1536x1024",
    width: 1536,
    height: 420,
    background: "transparent",
    fit: "cover",
  },
  {
    key: "bg-ocean",
    prompt: `A tall vertical slice of calm, elegant stylized ocean water for a 2D game background, showing ONLY water from the very top edge of the image to the very bottom edge — absolutely no sky, no clouds, no horizon line, no land, no boats visible anywhere, the top edge of the image is already the water surface itself with a gentle soft ripple/highlight (no thick white spiky foam, no repeating comic wave crests), smoothly transitioning downward into deeper rich teal-blue water with soft light rays filtering down through it, calm and painterly rather than busy or cartoonish, seamlessly tileable on the left and right edges only, ${BG_STYLE}`,
    apiSize: "1024x1536",
    width: 420,
    height: 550,
    background: "opaque",
    fit: "cover",
  },
  {
    key: "level-node",
    prompt: `A round wooden treasure sign for a level-select button in a children's pirate game, weathered brown wood disc with a decorative rope binding wrapped around the outer edge, a couple of small metal rivets, completely blank and empty open center area with absolutely no text, no numbers, no letters, no symbols of any kind in the middle, front view, flat cartoon style, ${STYLE_SUFFIX}`,
    apiSize: "1024x1024",
    width: 150,
    height: 150,
  },
  {
    key: "title-banner",
    prompt: `A wide wooden signboard banner for a game title, weathered horizontal wood planks with a rope or chain hanging loop at each end, completely blank and empty open center area with absolutely no text, no numbers, no letters, no symbols of any kind on it, front view, flat cartoon style, ${STYLE_SUFFIX}`,
    apiSize: "1536x1024",
    width: 560,
    height: 190,
    fit: "fill",
    trim: true,
  },
];

async function generateOne(spec, force) {
  const outPath = path.join(OUT_DIR, `${spec.key}.png`);
  if (fs.existsSync(outPath) && !force) {
    console.log(`[skip] ${spec.key}.png ya existe (usa --force para regenerar)`);
    return;
  }

  console.log(`[gen]  ${spec.key} ...`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: spec.prompt,
      size: spec.apiSize,
      quality: QUALITY,
      background: spec.background ?? "transparent",
      n: 1,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error para "${spec.key}" (${res.status}): ${body}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`Respuesta sin imagen para "${spec.key}": ${JSON.stringify(json)}`);
  }

  const raw = Buffer.from(b64, "base64");
  let pipeline = sharp(raw);
  if (spec.trim) {
    // Recorta el margen transparente que el modelo suele dejar alrededor
    // del sujeto, para que el resize/fit no deje "aire" antes del borde.
    pipeline = pipeline.trim();
  }
  await pipeline
    .resize(spec.width, spec.height, {
      fit: spec.fit ?? "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath);

  console.log(`[ok]   ${spec.key}.png (${spec.width}x${spec.height})`);
}

async function main() {
  const force = process.argv.includes("--force");
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const specs = only ? SPRITES.filter((s) => only.has(s.key)) : SPRITES;
  if (only) {
    const missing = [...only].filter((k) => !specs.some((s) => s.key === k));
    if (missing.length) {
      console.error(`[warn] claves desconocidas en --only: ${missing.join(", ")}`);
    }
  }

  for (const spec of specs) {
    try {
      await generateOne(spec, force);
    } catch (err) {
      console.error(`[fail] ${spec.key}:`, err.message);
      process.exitCode = 1;
    }
  }
}

main();
