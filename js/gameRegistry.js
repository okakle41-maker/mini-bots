/**
 * ============================================================
 *  GAME REGISTRY — registro central de módulos
 * ============================================================
 *  Para agregar un nuevo juego, SOLO hay que:
 *
 *  1. Crear js/games/miJuego.js  (expone window.initMiJuego y window.stopMiJuego)
 *  2. Crear css/miJuego.css      (estilos opcionales)
 *  3. Agregar una entrada aquí abajo en GAMES
 *  4. Agregar la sección HTML del juego en index.html  (id = viewId)
 *
 *  ¡Eso es todo! El sistema hace el resto automáticamente:
 *  - Carta en el lobby
 *  - Navegación
 *  - Stop al volver al lobby
 *  - Leaderboard badge
 * ============================================================
 */

window.GAMES = [

  // ── MEMORIA ────────────────────────────────────────────────
  {
    id:          'memorygrid',
    name:        'Memory Grid',
    description: 'Sigue el camino oculto de celdas. Un paso en falso y reincias la ruta.',
    icon:        '🧩',
    num:         '17',
    tag:         'MEMORIA',
    accent:      '#06b6d4',
    difficulty:  4,

    init: null,
    initFn: null,          // se inicializa con su propio DOMContentLoaded interno
    stopFn: null,

    leaderboard: null
  },

  // ── REFLEJOS ───────────────────────────────────────────────
  {
    id:          'skillchecks',
    name:        'Skill Check',
    description: 'Detén la aguja en la zona verde. Cada acierto la hace más pequeña y rápida.',
    icon:        '🎯',
    num:         '10',
    tag:         'REFLEJOS',
    accent:      '#10b981',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopCircle',

    leaderboard: {
      format: v => `${v} pts`
    }
  },

  {
    id:          'typix',
    name:        'Typix',
    description: 'Transcribe el texto con la mayor velocidad y precisión posible.',
    icon:        '📝',
    num:         '09',
    tag:         'TIPEO',
    accent:      '#38bdf8',
    difficulty:  2,

    init: null,
    initFn: null,
    stopFn: 'stopTypix',

    leaderboard: null
  },

];

/* ──────────────────────────────────────────────────────────────
   HELPERS — usados por gameBootstrap.js
────────────────────────────────────────────────────────────── */

/** Devuelve todos los stopFn únicos (para backToMenu) */
window.GAMES_ALL_STOP_FNS = () =>
  [...new Set(window.GAMES.map(g => g.stopFn).filter(Boolean))];

/** Devuelve la config de leaderboard de cada juego que la tenga */
window.GAMES_LEADERBOARD_CONFIG = () => {
  const cfg = {};
  window.GAMES.forEach(g => {
    if (g.leaderboard) cfg[g.id] = g.leaderboard;
  });
  return cfg;
};
