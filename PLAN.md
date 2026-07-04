# Plan: pulido visual "nivel producción" — Isla del Tesoro

Contexto: los sprites individuales (jugador, enemigo, barril, etc.) generados con
`gpt-image-1.5` se ven bien por separado, pero el juego completo se ve plano:
sin fondo/paisaje, las plataformas "flotan" en un celeste liso, las nubes son
estáticas, y el menú es un rectángulo con texto. Este plan cubre el trabajo para
que todo el conjunto se vea cohesivo y temático (isla/pirata).

Se puede retomar entre sesiones: cada fase es independiente y termina en un
estado funcional (no rompe el juego a mitad de camino).

## Fase 1 — Rediseño del enemigo
- [x] Mejorar el prompt del enemigo (más carácter/amenaza sin dejar de ser
      apto para chicos: cangrejo pirata gruñón, cejas, mejor silueta).
- [x] Agregar soporte `--only=<key1,key2>` a `scripts/generate-sprites.mjs`
      para regenerar sprites puntuales sin re-pegarle a los 16 assets.
- [x] Regenerar `enemy.png` y confirmar visualmente en el juego.

## Fase 2 — Fondo con profundidad (parallax) y atmósfera
- [x] Generar 3 capas de fondo nuevas:
  - `bg-sky`: cielo lejano con degradé + nubes difusas (capa más lenta).
  - `bg-mountains`: silueta de montañas/selva lejana.
  - `bg-ocean`: franja de océano que se ve por los huecos entre plataformas
    y debajo del piso (refuerza que son "islas" flotando sobre el mar).
  - (bonus: la primera versión de `bg-sky` salió como una escena completa de
    postal pirata — se reasignó como `menu-bg` para la Fase 3 y se regeneró
    `bg-sky` con un prompt abstracto.)
- [x] `config.ts`: agregar profundidades (`DEPTHS`) para las 3 capas, todas
      detrás de `platforms`.
- [x] `GameScene.ts`: agregar las 3 capas como imágenes estiradas a
      `worldWidth x GAME_HEIGHT` con distinto `scrollFactor` (paralaje).
- [x] Animar el océano (tileSprite con `tilePositionX` avanzando en `update()`)
      para dar sensación de olas.
- [x] Animar las nubes existentes con un tween de deriva horizontal en loop
      (ya no quedan estáticas).

## Fase 3 — Menú temático
- [x] Generar `menu-bg`: ilustración completa de portada (isla tropical,
      barco pirata, cofre en la playa, atardecer), sin texto.
- [x] Generar `level-node`: cartel/tablón de madera para los botones de nivel
      (reemplaza el rectángulo blanco liso).
- [x] `MenuScene.ts`: fondo ilustrado a pantalla completa, botones de nivel
      con el nuevo sprite + hover animado (bounce/scale en vez de solo
      cambiar color), título con mejor tratamiento visual.

## Fase 4 — Ronda de correcciones tras feedback visual
Feedback del usuario tras ver la Fase 2/3 en conjunto: el piso no leía como
piso (bloques flotantes sueltos), el mar tenía demasiadas olas/muy cartoon,
y la puerta se veía chica y flotando sobre el piso.

- [x] `tile-platform`: el prompt original generaba un "cubo" aislado con
      padding alrededor (funcionaba mal incluso con `fit:"cover"` porque el
      apiSize era cuadrado igual que el target, así que cover no recortaba
      nada). Se reescribió el prompt pidiendo explícitamente un "texture
      swatch"/material sample de borde a borde en vez de un objeto — esto
      sí evita que el modelo dibuje un objeto centrado con margen.
- [x] `bg-ocean`: la primera versión traía cielo/nubes "horneados" en la
      parte superior de la imagen (se le había pedido "seen from the side"),
      lo que generaba parches de cielo repetidos en los huecos entre
      plataformas. Se reescribió el prompt prohibiendo explícitamente cielo/
      horizonte/nubes y pidiendo agua desde el borde superior de la imagen.
      También se cambió de patrón de olas repetitivo a una franja vertical
      con degradé de profundidad (más calma, menos "cartoon ruidoso").
- [x] `door-locked`/`door-open`: se agregó soporte `trim` (recorta el margen
      transparente sobrante antes del resize) porque el modelo dejaba mucho
      aire alrededor del arco. Aun con trim, el aspect ratio objetivo
      (100x190, muy angosto) no coincidía con el aspect real del contenido
      (más cuadrado por las palmeras a los costados), así que igual quedaba
      padding vertical → se ajustó el tamaño objetivo a 140x170 con
      `fit:"fill"` para llenar el cuadro sin dejar aire.
- [x] `Door.ts`: se ancla ahora por la base (`setOrigin(0.5,1)` + offset de
      `TILE_SIZE/2`) en vez de por el centro de la celda, así el sprite
      queda apoyado exactamente en el borde superior del piso sin importar
      cuán alto sea, en lugar de depender de que el padding interno de la
      imagen coincidiera por casualidad.

## Fase 5 — Pulido de detalle
- [x] `title-banner`: cartel de madera colgante (con soga) generado y puesto
      detrás del título/subtítulo en `MenuScene`.
- [x] Variantes de nube: se generaron `cloud-2` (achatada/ancha) y `cloud-3`
      (compacta/redonda); `addClouds` en `GameScene` ahora elige al azar
      entre las 3 por instancia.
- [x] Se revisaron `hint-bubble` y `btn-home`: no hacía falta regenerarlos.
      `hint-bubble` se muestra escalado a 0.4 con el texto real superpuesto
      sobre su propio fondo blanco (ver `intro.ts`), así que apenas se nota
      — no vale la pena iterar ahí. `btn-home` ya es un ícono limpio y
      legible, no choca con el arte nuevo.
- [ ] (queda pendiente, no crítico) La franja de mar (`bg-ocean`) sigue
      mostrando una costura vertical sutil en el punto de repetición
      horizontal — aceptable hoy, pero si se quiere pulir más se podría
      generar con bordes izquierdo/derecho forzados a hacer match (o usar
      un degradé sin textura direccional).

## Fase 6 — Animación de caminar/saltar (pendiente)
Hoy el jugador y el enemigo son una sola imagen estática: al moverse
"deslizan" en vez de caminar, y saltar no se nota en el sprite.

- [ ] Generar hojas de sprites (grid de frames) para `player` con al menos:
      2-4 frames de ciclo de caminata + 1 frame de salto/aire. Mismo enfoque
      para `enemy` (ciclo de caminata simple).
- [ ] Riesgo conocido: pedirle a `gpt-image-1.5` un "sprite sheet" en una
      sola imagen no garantiza frames consistentes (mismo tamaño/pose base/
      color) entre sí — es una limitación real de generar frames por
      separado o en grilla con un modelo de imágenes genérico. Probar
      primero con un prompt que pida explícitamente una grilla prolija
      (ej. "4 equally spaced frames in a horizontal row, consistent
      character design and scale across all frames") y evaluar si la
      consistencia alcanza; si no, considerar generar un solo frame base y
      derivar los demás con transformaciones simples (flip, rotación leve
      de piernas recortada a mano) o directamente animar por código
      (bobbing/squash-stretch) como fallback sin arte nuevo.
- [ ] Cortar la hoja resultante en frames individuales con `sharp` (grid
      conocido de antemano) y cargarla como spritesheet en `BootScene`
      (`this.load.spritesheet` en vez de `this.load.image` para esas keys).
- [ ] Definir animaciones Phaser (`this.anims.create`) para walk/idle/jump
      en `Player.ts` (y walk en `Enemy.ts`), y disparar `play()` según
      estado (quieto/caminando/en el aire) en el `update()` de cada uno.
- [ ] Verificar que los tamaños de frame no rompan la física (los `body.setSize`
      actuales asumen las dimensiones de la imagen estática actual).

## Notas técnicas
- Todas las capas de fondo son `Image`/`TileSprite` únicos estirados con
  `setDisplaySize`, no assets tileables reales — es intencional para evitar
  costuras visibles sin depender de que la IA genere texturas perfectamente
  seamless.
- El script de generación es idempotente (salta archivos que ya existen)
  salvo que se pase `--force`. Usar `--only=key1,key2` para iterar sobre un
  sprite puntual sin gastar de nuevo en los otros 15-20 assets.
