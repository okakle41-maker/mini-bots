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
    id:          'termita',         // data-game en la carta  ←→  id de la <section>
    name:        'Termita',
    description: 'Memoriza la cuadrícula iluminada. Señala las celdas correctas antes de que el sistema las borre.',
    icon:        '🐜',
    num:         '01',
    tag:         'MEMORIA',
    accent:      '#f97316',
    difficulty:  2,

    // Función de inicialización (se llama una vez en DOMContentLoaded)
    // Recibe el objeto `ui` construido por el registro con todos los
    // getElementById del viewId automáticamente disponibles en el DOM.
    // Si el juego tiene su propio init manual, puede ignorar `ui`.
    init: null,            // null → el juego gestiona su propio init (memorygrid, maze, etc.)
    initFn: 'initTermita', // nombre en window.* (si init===null se llama en app.js como antes)
    stopFn: null,          // nombre en window.* para detener el juego al volver al lobby

    // Leaderboard
    leaderboard: {
      format: v => `${v} pts`
    }
  },

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

  // ── SECUENCIA ──────────────────────────────────────────────
  {
    id:          'simon',
    name:        'Simon Dice',
    description: 'Repite secuencias de colores en orden exacto. Cada ronda añade un paso más al patrón.',
    icon:        '🧠',
    num:         '02',
    tag:         'SECUENCIA',
    accent:      '#818cf8',
    difficulty:  3,

    init: null,
    initFn: 'initSimon',
    stopFn: 'stopSimon',

    leaderboard: {
      format: v => `${v} rondas`
    }
  },

  {
    id:          'sequence-game',
    name:        'Sequence',
    description: 'Repite patrones numéricos que crecen en complejidad cada ronda.',
    icon:        '🔢',
    num:         '13',
    tag:         'SECUENCIA',
    accent:      '#f59e0b',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopSequence',

    leaderboard: null
  },

  // ── REFLEJOS ───────────────────────────────────────────────
  {
    id:          'arrow',
    name:        'Desafío Flechas',
    description: 'Presiona la tecla de flecha correcta antes de que caduque la señal. Velocidad máxima requerida.',
    icon:        '⬆️',
    num:         '03',
    tag:         'REFLEJOS',
    accent:      '#ff9a3c',
    difficulty:  2,

    init: null,
    initFn: 'initArrowGame',
    stopFn: 'stopArrow',

    leaderboard: {
      format: v => `${v}%`
    }
  },

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
    id:          'rhythmclick',
    name:        'Rhythm Click',
    description: 'Pulsa los objetivos al ritmo del tempo. La sincronía lo es todo.',
    icon:        '🥁',
    num:         '14',
    tag:         'REFLEJOS',
    accent:      '#ec4899',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopRhythm',

    leaderboard: null
  },

  {
    id:          'progresstiming',
    name:        'Progress Timing',
    description: 'Detén la barra en el momento exacto. El margen se reduce con cada nivel.',
    icon:        '⏱️',
    num:         '15',
    tag:         'REFLEJOS',
    accent:      '#14b8a6',
    difficulty:  2,

    init: null,
    initFn: null,
    stopFn: 'stopProgressTiming',

    leaderboard: null
  },

  // ── CIFRADO ────────────────────────────────────────────────
  {
    id:          'soup',
    name:        'Hacking Device',
    description: 'Descifra el código de acceso e infiltra el sistema antes de que el firewall te detecte.',
    icon:        '💀',
    num:         '04',
    tag:         'CIFRADO',
    accent:      '#f43f5e',
    difficulty:  5,

    init: null,
    initFn: 'initHackingDevice',
    stopFn: 'stopHacking',

    leaderboard: {
      format: v => `${v} racha`
    }
  },

  {
    id:          'keyspam-game',
    name:        'Key Spam',
    description: 'Pulsa la tecla indicada lo más rápido posible antes de que el tiempo se agote.',
    icon:        '⌨️',
    num:         '12',
    tag:         'CIFRADO',
    accent:      '#a78bfa',
    difficulty:  1,

    init: null,
    initFn: null,
    stopFn: 'stopKeySpam',

    leaderboard: null
  },

  // ── TIPEO ──────────────────────────────────────────────────
  {
    id:          'letters',
    name:        'Caída de letras',
    description: 'Escribe las letras que caen en tiempo real. Si llegan al suelo, el sistema falla.',
    icon:        '⌨️',
    num:         '05',
    tag:         'TIPEO',
    accent:      '#a78bfa',
    difficulty:  3,

    init: null,
    initFn: 'initLettersFall',
    stopFn: 'stopLettersFall',

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

  // ── PERCEPCIÓN ─────────────────────────────────────────────
  {
    id:          'holematch',
    name:        'Hole Match',
    description: 'Empareja la forma con el hueco correcto al instante. El margen de error es cero.',
    icon:        '🔷',
    num:         '06',
    tag:         'PERCEPCIÓN',
    accent:      '#facc15',
    difficulty:  2,

    init: null,
    initFn: 'initHoleMatch',
    stopFn: 'stopHoleMatch',

    leaderboard: null
  },

  {
    id:          'maze-game',
    name:        'Laberinto',
    description: 'Navega el laberinto procedural sin tocar las paredes. Cada nivel es más complejo.',
    icon:        '🌀',
    num:         '11',
    tag:         'PERCEPCIÓN',
    accent:      '#34d399',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopMaze',

    leaderboard: null
  },

  {
    id:          'rapidlines-game',
    name:        'Rapid Lines',
    description: 'Identifica si las líneas son paralelas o se intersectan. Reacción pura.',
    icon:        '📐',
    num:         '16',
    tag:         'PERCEPCIÓN',
    accent:      '#f97316',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopRapidLines',

    leaderboard: null
  },

  // ── ANÁLISIS ───────────────────────────────────────────────
  {
    id:          'colorcount',
    name:        'Color Count',
    description: 'Cuenta los elementos del color indicado antes de que el tiempo se agote.',
    icon:        '🎨',
    num:         '07',
    tag:         'ANÁLISIS',
    accent:      '#fb923c',
    difficulty:  3,

    init: null,
    initFn: 'initColorCount',
    stopFn: 'stopColorCount',

    leaderboard: null
  },

  // ── ESTRATEGIA ─────────────────────────────────────────────
  {
    id:          'pairs',
    name:        'Pairs',
    description: 'Encuentra todos los pares iguales con el menor número de movimientos posible.',
    icon:        '🃏',
    num:         '08',
    tag:         'ESTRATEGIA',
    accent:      '#fb7185',
    difficulty:  2,

    init: null,
    initFn: 'initPairs',
    stopFn: 'stopPairs',

    leaderboard: null
  },

  {
    id:          'unlocked',
    name:        'Unlocked',
    description: 'Alinea los anillos rotantes hasta que todos los colores coincidan con el objetivo.',
    icon:        '🔓',
    num:         '08b',
    tag:         'ESTRATEGIA',
    accent:      '#c084fc',
    difficulty:  4,

    init: null,
    initFn: 'initUnlocked',
    stopFn: 'stopUnlocked',

    leaderboard: {
      format: v => `${v} rondas`
    }
  },

  {
    id:          'circle-game',
    name:        'Circle',
    description: 'Pon a prueba tus reflejos con el juego de los círculos.',
    icon:        '⭕',
    num:         '10b',
    tag:         'REFLEJOS',
    accent:      '#10b981',
    difficulty:  3,

    init: null,
    initFn: null,
    stopFn: 'stopCircle',

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
