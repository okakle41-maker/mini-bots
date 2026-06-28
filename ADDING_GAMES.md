# Cómo agregar un nuevo juego

A partir de la versión 2.0, agregar un módulo requiere **un solo archivo JS + una línea de registro**. El sistema hace el resto automáticamente.

---

## Flujo nuevo (GameRegistry)

### 1. Crear el archivo JS del juego

Crea `js/games/miJuego.js` con esta estructura:

```js
// js/games/miJuego.js

(function () {
  'use strict';

  function init(ui) {
    // `ui` es un objeto con todos los elementos marcados con
    // data-ui="name" dentro de la <section id="miJuego">
    //
    // Ejemplo: si el HTML tiene <button data-ui="start">,
    // aquí tienes ui.start = ese elemento.

    if (!ui.start) return; // sección no presente

    let playing = false;

    ui.start.addEventListener('click', () => {
      playing = true;
      // ... lógica del juego usando ui.board, ui.score, etc.
    });
  }

  function stop() {
    // Limpiar timers, estados, listeners si es necesario
  }

  // Una sola línea para registrar el juego:
  GameRegistry.register({
    id:          'miJuego',          // = id de la <section> en index.html
    name:        'Mi Juego',
    tag:         'REFLEJOS',         // categoría del filtro
    accent:      '#22d3ee',
    icon:        '🎮',
    num:         '18',
    description: 'Descripción breve.',
    difficulty:  3,                  // 1–5
    css:         'css/miJuego.css',  // inyectado automáticamente (o null)

    init,   // recibe ui resuelto con data-ui
    stop,   // llamado en backToMenu automáticamente
    // start: () => {},  // opcional: llamado al entrar a la vista
  });

}());
```

---

### 2. Crear el CSS (opcional)

Crea `css/miJuego.css`. El registry lo inyecta automáticamente gracias al campo `css` — no hay que tocar el `<head>`.

---

### 3. Añadir la sección HTML en `index.html`

Añade una sola `<section>` al cuerpo del HTML. Los elementos de control se marcan con `data-ui` en lugar de `id` globales:

```html
<section id="miJuego" class="view hidden">
  <div class="game-view-inner">
    <button class="back-btn" onclick="window.backToMenu('home')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Volver al lobby
    </button>
    <div class="card">
      <h2>Mi Juego</h2>
      <p>Descripción interna...</p>

      <div class="controls">
        <label>
          Dificultad
          <select data-ui="difficulty">
            <option value="1">Fácil</option>
            <option value="2" selected>Normal</option>
            <option value="3">Difícil</option>
          </select>
        </label>
      </div>

      <button data-ui="start">Empezar</button>
      <div data-ui="board"></div>
      <div data-ui="info" class="result"></div>
    </div>
  </div>
</section>
```

---

### 4. Añadir el script en `index.html`

En la sección de juegos (antes de `gameBootstrap.js`):

```html
<script src="js/games/miJuego.js"></script>
```

---

### ¡Eso es todo!

El sistema hace automáticamente:

| Tarea | Responsable |
|---|---|
| Inyectar CSS | `js/core/gameRegistry.js` |
| Resolver `ui` desde `data-ui` | `js/core/gameRegistry.js` |
| Llamar `init(ui)` en DOMContentLoaded | `js/core/gameRegistry.js` |
| Generar carta en el lobby | `js/gameBootstrap.js` |
| Generar filtros de categoría | `js/gameBootstrap.js` |
| Actualizar contadores de módulos | `js/core/viewManager.js` |
| Llamar `stop()` al volver al lobby | `js/core/viewManager.js` |
| Llamar `start()` al entrar a la vista | `js/core/viewManager.js` |
| Badge de récord en la carta | `js/leaderboardManager.js` |

---

## Atributos data-ui

Dentro de tu `<section id="miJuego">`:

- `data-ui="name"` → `ui.name = element` (un elemento)
- `data-ui-all="name"` → `ui.name = NodeList` (varios elementos del mismo tipo, ej. botones de dificultad)

```html
<!-- Un elemento -->
<button data-ui="startBtn">Empezar</button>

<!-- Varios elementos (NodeList) -->
<button data-ui-all="diffBtn" data-level="easy">Fácil</button>
<button data-ui-all="diffBtn" data-level="hard">Difícil</button>
```

```js
// En init(ui):
ui.startBtn.addEventListener('click', ...);
ui.diffBtn.forEach(btn => ...);  // NodeList
```

Los `data-ui` son **locales a su sección** — no hay conflictos entre juegos aunque usen el mismo nombre (`data-ui="start"` puede existir en todos los juegos sin problema).

---

## Guardar récord en el leaderboard

```js
if (window.Leaderboard) {
  window.Leaderboard.save('miJuego', valorNumérico);
}
```

El badge en la carta se actualiza automáticamente.

---

## Estructura de archivos

```
js/
  core/
    gameRegistry.js   ← registro central y resolución data-ui (no tocar)
    viewManager.js    ← showView, backToMenu, ESC, themes (no tocar)
  gameBootstrap.js    ← genera cartas y filtros del lobby (no tocar)
  app.js              ← solo inits legacy (se reduce con cada migración)
  games/
    miJuego.js        ← NUEVO (un archivo, una línea de register)
css/
  miJuego.css         ← NUEVO (opcional; inyectado automáticamente)
index.html            ← solo agregar la <section> y el <script>
```

---

## Migrar un juego existente (del patrón legacy)

Si el juego ya existe con el patrón `initXxx(uiObject)`:

1. Cambia los `id="fooBar"` del HTML a `data-ui="fooBar"` dentro de la sección.
2. Envuelve la lógica existente en una función `init(ui)` que recibe esos valores.
3. Añade `GameRegistry.register({ id, ..., init, stop })` al final del archivo.
4. Elimina el bloque `initXxx({ ... })` correspondiente de `app.js`.

La migración por juego es ≈ 10 líneas de cambio. Ver `memorygrid.js` como ejemplo.
