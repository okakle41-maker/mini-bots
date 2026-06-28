/**
 * ============================================================
 *  js/gameBootstrap.js  — generación automática de cartas del lobby
 * ============================================================
 *
 *  Lee los juegos registrados en GameRegistry (nuevo) y en
 *  window.GAMES (legacy) y:
 *
 *    1. Genera las cartas en #gameList.
 *    2. Genera los botones de filtro en #filterBar.
 *    3. Actualiza los contadores de módulos.
 *    4. Registra el hover/click sound en las cartas.
 *    5. Llama los initFn legacy de window.GAMES para los juegos
 *       que aún no usan GameRegistry.register().
 *    6. Parcha leaderboard con la config de ambos registros.
 *
 *  Nota: el stop de todos los juegos lo gestiona viewManager.js.
 *  Este archivo NO toca backToMenu.
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Obtener lista unificada de juegos ── */
  function getAllGames() {
    // Preferir GameRegistry (nuevo); hacer fallback a window.GAMES (legacy)
    if (window.GameRegistry && window.GameRegistry.all().length > 0) {
      return window.GameRegistry.all();
    }
    return window.GAMES || [];
  }

  /* ── 1. Generar cartas del lobby ── */
  function buildGameCards() {
    const gameList = document.getElementById('gameList');
    if (!gameList) return;

    gameList.innerHTML = '';

    const arrowSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5">
      <polyline points="9 18 15 12 9 6"/>
    </svg>`;

    getAllGames().forEach(function (game, index) {
      const btn = document.createElement('button');
      btn.className = 'game-card';
      btn.dataset.game = game.id;
      btn.dataset.tags = game.tag || game.tags || '';
      btn.style.setProperty('--accent', game.accent || '#fff');
      btn.style.animationDelay = (index * 80) + 'ms';

      const maxDots = 5;
      let dotsHTML = '';
      for (let i = 0; i < maxDots; i++) {
        dotsHTML += `<span class="diff-dot ${i < (game.difficulty || 3) ? 'diff-dot--filled' : 'diff-dot--empty'}"></span>`;
      }

      btn.innerHTML = `
        <div class="card-border"></div>
        <div class="card-shine"></div>
        <div class="card-glare"></div>
        <div class="card-3d">
          <div class="card-accent-strip"></div>
          <div class="card-hero">
            <div class="card-hero-bg"></div>
            <span class="card-num">${game.num || game.number || '?'}</span>
            <span class="card-icon-lg">${game.icon || '🎮'}</span>
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="card-tag">${game.tag || ''}</span>
            </div>
            <h3 class="card-name">${game.name || game.id}</h3>
            <p class="card-desc">${game.description || ''}</p>
            <span class="card-record-badge" data-record="${game.id}" hidden></span>
            <div class="card-bottom">
              <div class="diff-dots">${dotsHTML}</div>
              <span class="card-cta">EJECUTAR ${arrowSVG}</span>
            </div>
          </div>
        </div>
        <div class="card-bottom-glow"></div>
      `;

      gameList.appendChild(btn);
    });
  }

  /* ── 2. Filtros del lobby ── */
  function initFilterBar() {
    const filterBar = document.getElementById('filterBar');
    const gameList  = document.getElementById('gameList');
    if (!filterBar || !gameList) return;

    // Limpiar filtros existentes (excepto el "TODOS" si está hardcodeado)
    const existingDynamic = filterBar.querySelectorAll('.filter-btn:not([data-filter="TODOS"])');
    existingDynamic.forEach(function (b) { b.remove(); });

    const cards = Array.from(gameList.querySelectorAll('.game-card[data-tags]'));
    const allTags = [];

    cards.forEach(function (c) {
      (c.dataset.tags || '').split(',').map(function (t) { return t.trim(); })
        .filter(Boolean)
        .forEach(function (t) {
          if (!allTags.includes(t)) allTags.push(t);
        });
    });

    allTags.sort().forEach(function (tag) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = tag;
      btn.textContent = tag;
      filterBar.appendChild(btn);
    });

    let activeFilter = 'TODOS';

    function applyFilter(tag) {
      activeFilter = tag;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.toggle('filter-btn--active', b.dataset.filter === tag);
      });
      cards.forEach(function (card) {
        if (tag === 'TODOS') {
          card.classList.remove('game-card--filtered');
        } else {
          const tags = (card.dataset.tags || '').split(',').map(function (t) { return t.trim(); });
          card.classList.toggle('game-card--filtered', !tags.includes(tag));
        }
      });
    }

    filterBar.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      applyFilter(btn.dataset.filter);
    });
  }

  /* ── 3. Contadores de módulos ── */
  function updateModuleCount() {
    const total = getAllGames().length;
    ['modsCountHeader', 'modsCountPill', 'modsCountStats'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.textContent = total;
    });
  }

  /* ── 4. Inicializar juegos legacy (initFn en window.GAMES) ──
          Solo para los que aún NO usan GameRegistry.register().
          Los que usan GameRegistry ya reciben init(ui) desde allí. */
  function initLegacyGames() {
    const legacyGames = window.GAMES || [];
    if (!legacyGames.length) return;

    legacyGames.forEach(function (game) {
      if (!game.initFn) return;
      const fn = window[game.initFn];
      if (typeof fn !== 'function') return;

      // Construir UI object manual (patrón legacy)
      const section = document.getElementById(game.id);
      if (!section) return;

      // Para los juegos con initFn, se construye un ui vacío y el
      // handler usa getElementById globales como antes.
      // Los que ya migraron a data-ui no llegan aquí.
      try { fn(buildLegacyUi(game.id)); } catch (e) {
        console.warn('[Bootstrap] Error inicializando', game.id, e);
      }
    });
  }

  /* Helper: construye el objeto ui legacy con todos los getElementById
     de la sección del juego. Mantiene compatibilidad sin tocar los juegos. */
  function buildLegacyUi(gameId) {
    // Los juegos legacy ignoran el ui object y llaman getElementById ellos mismos.
    // Devolvemos un proxy vacío por si alguno lo inspecciona.
    return {};
  }

  /* ── 5. Leaderboard ── */
  function patchLeaderboard() {
    if (!window.Leaderboard || !window.GAMES_LEADERBOARD_CONFIG) return;
    const cfg = window.GAMES_LEADERBOARD_CONFIG();
    if (typeof window.Leaderboard._patchConfig === 'function') {
      window.Leaderboard._patchConfig(cfg);
    }
  }

  /* ── 6. Sonidos de hover/click en cartas ── */
  function initCardSounds() {
    const gameGrid = document.getElementById('gameList');
    if (!gameGrid) return;

    let inside = false;

    // Usar audioManager de forma defensiva
    const audio = window.audioManager || (typeof audioManager !== 'undefined' ? audioManager : null);

    gameGrid.addEventListener('mouseenter', function (e) {
      if (e.target.closest('.game-card')) {
        if (inside) return;
        inside = true;
        if (audio) audio.play('hover');
      }
    }, true);

    gameGrid.addEventListener('mouseleave', function (e) {
      if (e.target.closest('.game-card')) inside = false;
    }, true);

    gameGrid.addEventListener('click', function (e) {
      const card = e.target.closest('.game-card[data-game]');
      if (!card) return;
      if (audio) audio.play('open');
      setTimeout(function () { window.showView(card.dataset.game); }, 80);
    });
  }


  /* ── Seed: registrar juegos legacy (window.GAMES) en GameRegistry ──
     Se ejecuta aquí, en DOMContentLoaded, cuando todos los juegos
     ya han cargado. Los que llamaron GameRegistry.register() ellos
     mismos (memorygrid, etc.) ya están presentes y se saltean. */
  function seedLegacyGames() {
    if (!window.GameRegistry || !window.GAMES) return;

    window.GAMES.forEach(function (g) {
      // Si ya está registrado por el propio juego, no sobreescribir
      if (window.GameRegistry.get(g.id)) return;

      window.GameRegistry.register({
        id:          g.id,
        name:        g.name,
        tag:         g.tag,
        accent:      g.accent,
        icon:        g.icon,
        num:         g.num,
        description: g.description,
        difficulty:  g.difficulty,
        css:         null,       // el CSS ya está en el <head>
        init:        null,       // lo inicia app.js (patrón legacy)
        stop: g.stopFn
          ? function () {
              var fn = window[g.stopFn];
              if (typeof fn === 'function') try { fn(); } catch (e) {}
            }
          : null,
        start:       null,
        leaderboard: g.leaderboard || null,
      });
    });
  }

  /* ── Entry point ── */
  document.addEventListener('DOMContentLoaded', function () {
    seedLegacyGames();     // primero: garantizar que GameRegistry tenga todos los juegos
    buildGameCards();
    updateModuleCount();
    patchLeaderboard();
    initFilterBar();
    initCardSounds();
    // Los inits de GameRegistry ya se llamaron en el register().
    // Los legacy de window.GAMES que no han migrado:
    // (se omite aquí; app.js los llama directamente por ahora)
  });

}());
