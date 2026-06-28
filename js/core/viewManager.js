/**
 * ============================================================
 *  js/core/viewManager.js  — navegación entre vistas
 * ============================================================
 *
 *  Gestiona:
 *    - showView(id)      mostrar una vista, ocultar el resto,
 *                        llamar game.start() si el juego lo declara.
 *    - backToMenu(id)    detener todos los juegos registrados,
 *                        volver al lobby.
 *    - ESC shortcut.
 *    - Filtros del lobby.
 *    - Tema (dark/light/orange).
 *    - Hex tick del header.
 *    - Contador de módulos.
 *
 *  Depende de: GameRegistry (js/core/gameRegistry.js)
 *              audioManager (js/audioManager.js)
 * ============================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Referencias ── */
    const views       = document.querySelectorAll('.view');
    const themeSelect = document.getElementById('themeSelect');

    /* ── showView ── */
    window.showView = function (id) {
      views.forEach(v => v.classList.toggle('hidden', v.id !== id));
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Llamar start() del juego registrado, si lo declara
      const game = window.GameRegistry && window.GameRegistry.get(id);
      if (game && typeof game.start === 'function') {
        game.start();
      }

      // Compatibilidad hacia atrás: juegos que aún usan window.startXxx
      if (id === 'typix' && typeof window.startTypix === 'function') {
        window.startTypix();
      }
      if (id === 'pairs' && typeof window._pairsStart === 'function') {
        window._pairsStart();
      }
    };

    /* ── backToMenu ── */
    window.backToMenu = function (id) {
      // Detener todos los juegos que tengan stop() en el registry
      if (window.GameRegistry) {
        window.GameRegistry.all().forEach(function (game) {
          if (typeof game.stop === 'function') {
            try { game.stop(); } catch (e) { /* ignorar errores de stop */ }
          }
        });
      }

      // Compatibilidad: stop functions del array GAMES_ALL_STOP_FNS (registry viejo)
      if (typeof window.GAMES_ALL_STOP_FNS === 'function') {
        window.GAMES_ALL_STOP_FNS().forEach(function (fnName) {
          if (typeof window[fnName] === 'function') {
            try { window[fnName](); } catch (e) {}
          }
        });
      }

      if (typeof window.audioManager !== 'undefined' && window.audioManager.play) {
        window.audioManager.play('back');
      } else if (typeof audioManager !== 'undefined' && audioManager.play) {
        audioManager.play('back');
      }

      setTimeout(function () { window.showView(id || 'home'); }, 80);
    };

    /* ── Hex tick counter ── */
    const hexEl = document.getElementById('hexTick');
    if (hexEl) {
      let tick = 0;
      setInterval(function () {
        tick = (tick + 1) & 0xFFFF;
        hexEl.textContent = tick.toString(16).toUpperCase().padStart(4, '0');
      }, 900);
    }

    /* ── Theme ── */
    function applyTheme(theme) {
      document.body.classList.remove('light-theme', 'dark-theme', 'orange-theme');
      document.body.classList.add(theme + '-theme');
      localStorage.setItem('gameTheme', theme);
    }

    if (themeSelect) {
      const saved = localStorage.getItem('gameTheme') || 'dark';
      themeSelect.value = saved;
      applyTheme(saved);
      themeSelect.addEventListener('change', function () {
        applyTheme(themeSelect.value);
      });
    }

    /* ── Contador de módulos (basado en el registry activo) ── */
    function updateModuleCounts() {
      // Usar GameRegistry si está disponible; si no, caer a window.GAMES
      const total = window.GameRegistry
        ? window.GameRegistry.all().length
        : (window.GAMES ? window.GAMES.length : 0);

      ['modsCountHeader', 'modsCountPill', 'modsCountStats'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.textContent = total;
      });
    }

    // Actualizar ahora (post-DOMContentLoaded, todos los juegos ya registrados)
    updateModuleCounts();

    /* ── Vista inicial ── */
    window.showView('home');

  }); // end DOMContentLoaded

  /* ── ESC → Lobby ── */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const tag = (document.activeElement || {}).tagName || '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    const homeView = document.getElementById('home');
    if (homeView && !homeView.classList.contains('hidden')) return;
    if (typeof window.backToMenu === 'function') window.backToMenu('home');
  });

}());
