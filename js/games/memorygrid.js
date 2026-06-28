/**
 * js/games/memorygrid.js
 *
 * Migrado al sistema GameRegistry.
 * Ya no usa getElementById globales: recibe `ui` resuelto desde
 * los atributos data-ui de la <section id="memorygrid">.
 *
 * Elementos esperados (marcados en index.html con data-ui="..."):
 *   start, board, status, result, lives,
 *   size, showTime, livesInput, minJump, maxJump,
 *   pathLength, distractorBias, showPath, alwaysVisible, infinite
 */

(function () {
  'use strict';

  // ---- utilidades ----
  const clamp  = (v, a, b) => Math.max(a, Math.min(b, v));
  const intVal = (el, d) => {
    const n = parseInt(el?.value, 10);
    return Number.isFinite(n) ? n : d;
  };
  const boolVal = (el, d = false) => (el ? !!el.checked : d);

  function init(ui) {
    if (!ui.start) return; // sección no presente en el DOM

    const game = {
      cfg: null,
      grid: [],
      solutionPath: [],
      player: { x: 0, y: 0 },
      goal:   { x: 0, y: 0 },
      lives: 2,
      playing: false,
      _memTimer: null,

      readConfig() {
        const size       = clamp(intVal(ui.size, 5), 3, 14);
        const minJump    = clamp(intVal(ui.minJump, 1), 1, size - 1);
        const maxJump    = clamp(intVal(ui.maxJump, Math.max(3, Math.floor(size / 2))),
                                 minJump, (size - 1) * 2);
        const pathLength = clamp(intVal(ui.pathLength, size + 2), 2, size * size);

        this.cfg = {
          size,
          showTime:       clamp(intVal(ui.showTime, 4000), 300, 60000),
          lives:          clamp(intVal(ui.livesInput, 2), 1, 9),
          minJump,
          maxJump,
          pathLength,
          distractorBias: clamp(intVal(ui.distractorBias, 50), 0, 100),
          showPath:       boolVal(ui.showPath, false),
          alwaysVisible:  boolVal(ui.alwaysVisible, false),
          infinite:       boolVal(ui.infinite, true),
        };
        return this.cfg;
      },

      setStatus(text) { if (ui.status)  ui.status.textContent = text; },
      setLives(n)     { if (ui.lives)   ui.lives.textContent  = '❤️'.repeat(Math.max(0, n)); },
      setResult(text) { if (ui.result)  ui.result.textContent = text; },

      cellsAtDistance(from, dist, size) {
        const out = [];
        for (let dx = -dist; dx <= dist; dx++) {
          const dy = dist - Math.abs(dx);
          const candidates = dy === 0 ? [[dx, 0]] : [[dx, dy], [dx, -dy]];
          for (const [ox, oy] of candidates) {
            const x = from.x + ox;
            const y = from.y + oy;
            if (x >= 0 && y >= 0 && x < size && y < size) out.push({ x, y });
          }
        }
        return out;
      },

      generatePath() {
        const { size, minJump, maxJump, pathLength } = this.cfg;
        for (let attempt = 0; attempt < 200; attempt++) {
          const visited = new Set();
          const key = (p) => `${p.x},${p.y}`;
          const path = [{ x: 0, y: 0 }];
          visited.add(key(path[0]));
          let ok = true;
          for (let step = 0; step < pathLength - 1; step++) {
            const cur    = path[path.length - 1];
            const isLast = step === pathLength - 2;
            const pool   = [];
            for (let d = minJump; d <= maxJump; d++) {
              this.cellsAtDistance(cur, d, size)
                .filter(c => !visited.has(key(c)))
                .forEach(c => pool.push({ ...c, dist: d }));
            }
            if (pool.length === 0) { ok = false; break; }
            let next;
            if (isLast) {
              next = pool[Math.floor(Math.random() * pool.length)];
            } else {
              const safe = pool.filter(c => {
                const tmp = new Set(visited); tmp.add(key(c));
                for (let d = minJump; d <= maxJump; d++) {
                  if (this.cellsAtDistance(c, d, size).some(n => !tmp.has(key(n)))) return true;
                }
                return false;
              });
              const choice = safe.length ? safe : pool;
              next = choice[Math.floor(Math.random() * choice.length)];
            }
            path.push({ x: next.x, y: next.y });
            visited.add(key(next));
          }
          if (ok && path.length === pathLength) {
            this.solutionPath = path;
            this.goal = path[path.length - 1];
            return true;
          }
        }
        this.solutionPath = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
        this.goal = this.solutionPath[1];
        return false;
      },

      assignNumbers() {
        const { size, minJump, maxJump, distractorBias } = this.cfg;
        this.grid = Array.from({ length: size }, () => Array(size).fill(null));
        for (let i = 0; i < this.solutionPath.length; i++) {
          const c    = this.solutionPath[i];
          const next = this.solutionPath[i + 1];
          const value = next
            ? Math.abs(next.x - c.x) + Math.abs(next.y - c.y)
            : null;
          this.grid[c.y][c.x] = { x: c.x, y: c.y, value, onPath: true, element: null };
        }
        const onPathKeys = new Set(this.solutionPath.map(p => `${p.x},${p.y}`));
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (this.grid[y][x]) continue;
            const trap = Math.random() * 100 < distractorBias;
            let value;
            if (trap) {
              const valid = [];
              for (let d = minJump; d <= maxJump; d++) {
                if (this.cellsAtDistance({ x, y }, d, size).length > 0) valid.push(d);
              }
              value = valid.length
                ? valid[Math.floor(Math.random() * valid.length)]
                : minJump;
            } else {
              value = minJump + Math.floor(Math.random() * (maxJump - minJump + 1));
            }
            this.grid[y][x] = { x, y, value, onPath: false, element: null };
          }
        }
      },

      buildBoard() {
        this.readConfig();
        const { size } = this.cfg;
        this.player = { x: 0, y: 0 };
        this.lives  = this.cfg.lives;
        this.generatePath();
        this.assignNumbers();
        ui.board.innerHTML = '';
        ui.board.style.display = 'grid';
        ui.board.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        ui.board.style.gap = '6px';
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const data = this.grid[y][x];
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => this.handleClick(x, y));
            if (x === 0 && y === 0) {
              cell.textContent = data.value;
              cell.dataset.label = 'S';
              cell.classList.add('memory-start', 'player');
            } else if (x === this.goal.x && y === this.goal.y) {
              cell.textContent = '';
              cell.dataset.label = 'E';
              cell.classList.add('memory-end');
            } else {
              cell.textContent = data.value;
            }
            if (this.cfg.showPath && data.onPath &&
                !(x === 0 && y === 0) &&
                !(x === this.goal.x && y === this.goal.y)) {
              cell.classList.add('memory-pathhint');
            }
            data.element = cell;
            ui.board.appendChild(cell);
          }
        }
      },

      startGame() {
        this.player = { x: 0, y: 0 };
        this.setLives(this.lives);
        this.playing = true;
        this.showNumbers();
        if (this.cfg.alwaysVisible) {
          this.setStatus('Modo visible - ¡Juega!');
          return;
        }
        this.setStatus(`Memoriza (${this.cfg.showTime} ms)`);
        clearTimeout(this._memTimer);
        this._memTimer = setTimeout(() => {
          this.hideNumbers();
          this.setStatus('¡Juega!');
        }, this.cfg.showTime);
      },

      showNumbers() {
        for (let y = 0; y < this.cfg.size; y++) {
          for (let x = 0; x < this.cfg.size; x++) {
            const c = this.grid[y][x];
            if (!c) continue;
            if (x === this.goal.x && y === this.goal.y) continue;
            c.element.textContent = c.value;
          }
        }
      },

      hideNumbers() {
        for (let y = 0; y < this.cfg.size; y++) {
          for (let x = 0; x < this.cfg.size; x++) {
            const c = this.grid[y][x];
            if (!c) continue;
            if (x === this.goal.x && y === this.goal.y) continue;
            c.element.textContent = '';
          }
        }
      },

      renderPlayer() {
        ui.board.querySelectorAll('.memory-cell')
          .forEach(c => c.classList.remove('player'));
        const c = this.grid[this.player.y][this.player.x];
        if (c) c.element.classList.add('player');
      },

      flash(cell, ok) {
        const cls = ok ? 'flash-ok' : 'flash-error';
        cell.classList.add(cls);
        setTimeout(() => cell.classList.remove(cls), 250);
      },

      handleClick(x, y) {
        if (!this.playing) return;
        if (x === this.player.x && y === this.player.y) return;
        const current = this.grid[this.player.y][this.player.x];
        const target  = this.grid[y][x];
        const dist    = Math.abs(x - this.player.x) + Math.abs(y - this.player.y);
        if (current.value === null || dist !== current.value) {
          this.flash(target.element, false);
          this.lives--;
          this.setLives(this.lives);
          this.setStatus(`Incorrecto (distancia ${dist}, requerido ${current.value})`);
          if (this.lives <= 0) {
            this.playing = false;
            this.setStatus('💀 Game Over');
            this.revealPath();
          }
          return;
        }
        this.flash(target.element, true);
        this.player = { x, y };
        this.renderPlayer();
        if (x === this.goal.x && y === this.goal.y) {
          this.playing = false;
          this.setStatus('✅ ¡Completado!');
          if (this.cfg.infinite) {
            setTimeout(() => { this.buildBoard(); this.startGame(); }, 900);
          }
        } else {
          const step = this.solutionPath.findIndex(p => p.x === x && p.y === y);
          this.setStatus(`Correcto (${step + 1}/${this.solutionPath.length})`);
        }
      },

      revealPath() {
        this.solutionPath.forEach((p, i) => {
          const c = this.grid[p.y][p.x];
          if (!c) return;
          c.element.classList.add('memory-pathhint');
          if (i > 0 && !(p.x === this.goal.x && p.y === this.goal.y)) {
            c.element.textContent = c.value;
          }
        });
      },

      stop() {
        clearTimeout(this._memTimer);
        this.playing = false;
      },
    };

    // ── Eventos ──
    ui.start.addEventListener('click', () => {
      game.buildBoard();
      game.startGame();
    });

    [ui.size, ui.minJump, ui.maxJump, ui.pathLength].forEach(el => {
      if (!el) return;
      el.addEventListener('change', () => {
        if (!game.playing) game.buildBoard();
      });
    });

    // Exponer stop para compatibilidad global (usado por backToMenu legacy)
    window.stopMemoryGrid = () => game.stop();

    // Devolver el objeto game por si GameRegistry lo necesita
    return game;
  }

  function stop() {
    if (typeof window.stopMemoryGrid === 'function') window.stopMemoryGrid();
  }

  /* ── Registro ── */
  window.GameRegistry.register({
    id:          'memorygrid',
    name:        'Memory Grid',
    tag:         'MEMORIA',
    accent:      '#06b6d4',
    icon:        '🧩',
    num:         '17',
    description: 'Memoriza el tablero y llega a la salida utilizando los saltos correctos.',
    difficulty:  4,
    css:         'css/memorygrid.css',

    init,   // recibe ui resuelto desde data-ui
    stop,
  });

}());
