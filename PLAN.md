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

## Fase 6 — Animación de caminar/saltar + puerta + personajes más grandes
Antes el jugador y el enemigo eran una sola imagen estática (deslizaban en
vez de caminar) y la puerta cambiaba de textura instantáneamente al
desbloquear.

- [x] `player-walk`/`enemy-walk`: hojas de sprites 2x2 (4 frames) generadas
      con `gpt-image-1.5` en quality `medium` (se subió de `low` solo para
      estas dos, la consistencia entre frames importa más acá). Contra lo
      que anticipaba el riesgo documentado, la consistencia entre frames
      salió sorprendentemente bien al pedir explícitamente una grilla 2x2
      con "identical character design/proportions/colors/scale in every
      frame" — no hizo falta el fallback de animar por código.
- [x] `player-jump`: frame único separado (pose en el aire, rodillas
      arriba, brazos arriba), mismo tamaño que los frames de walk.
- [x] Tamaños subidos ~18% (jugador 54px→64px, enemigo 51px→60px) para que
      se vean "un poco más grandes" como pidió el usuario.
- [x] `BootScene`: `this.load.spritesheet` para `player-walk`/`enemy-walk`
      (frameWidth/frameHeight) + `this.anims.create` para ambos ciclos
      (`player-walk` frameRate 8, `enemy-walk` frameRate 6, ambos loop).
- [x] `Player.ts`: nuevo método `updateAnimation` que decide entre 3 estados
      por frame — en el aire (`body.blocked.down === false`) usa la imagen
      suelta `player-jump`; moviéndose en el piso reproduce `player-walk`;
      quieto vuelve a `player-walk` frame 0 (idle). Verificado inyectando
      velocidad directamente vía consola del navegador (la automatización
      de teclado del browser no sostiene una tecla apretada de forma
      confiable) — se confirmó el cambio de textura y el frame avanzando.
- [x] `Enemy.ts`: reproduce `enemy-walk` en loop desde el constructor (el
      enemigo siempre está patrullando, no necesita estados).
- [x] `door-ajar`: frame intermedio generado; `Door.unlock()` ahora hace
      una transición de 2 pasos (`door-ajar` inmediato + un leve tween de
      "pop" -> `door-open` después de 260ms) en vez de un cambio de textura
      instantáneo. Verificado emitiendo el evento de switch directamente y
      confirmando la secuencia de texturas con los tiempos esperados.
- [x] Se borraron los assets/specs estáticos `player.png`/`enemy.png`
      (reemplazados por los sprite sheets).

## Fase 7 — Pendiente (no crítico)
- [ ] La hoja de `enemy-walk` tiene frames bastante parecidos entre sí (el
      cangrejo no muestra tanta diferencia de pose como el jugador) —
      aceptable para un "shuffle" pero se podría pedir más contraste entre
      frames si se quiere más notorio.
- [ ] No existe mecánica de puerta que se vuelva a cerrar, así que solo se
      animó la apertura (`door-ajar`→`door-open`). Si en el futuro se
      agrega una mecánica de re-cerrado, reutilizar `door-ajar` como paso
      intermedio también para ese sentido.

## Notas técnicas
- Todas las capas de fondo son `Image`/`TileSprite` únicos estirados con
  `setDisplaySize`, no assets tileables reales — es intencional para evitar
  costuras visibles sin depender de que la IA genere texturas perfectamente
  seamless.
- El script de generación es idempotente (salta archivos que ya existen)
  salvo que se pase `--force`. Usar `--only=key1,key2` para iterar sobre un
  sprite puntual sin gastar de nuevo en los otros 15-20 assets.
