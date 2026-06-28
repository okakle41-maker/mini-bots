<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fa33d63056b6f29821bdf6e960006ebcd1e764ff
/**
 * js/games/simon.js
 *
 * Migrado al sistema GameRegistry.
 * Elementos esperados (data-ui dentro de <section id="simon">):
 *   start, simonBoard, colorCount, baseLength, simonSpeed, simonRounds, info
 */

(function () {
  'use strict';

  function init(ui) {
    const { simonBoard, colorCount: colorCountEl, baseLength: baseLengthEl,
            simonSpeed: simonSpeedEl, simonRounds: simonRoundsEl,
            info: simonInfo, start: startSimon } = ui;

    if (!startSimon) return; // sección no presente

    const simonColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

    let simonState = {
      colorCount: 4,
      baseLength: 3,
      speed: 700,
      rounds: 5,
      currentRound: 0,
      sequence: [],
      userIndex: 0,
      playerTurn: false,
      score: 0,
      playing: false
    };

    function setupSimonBoard(count) {
      simonBoard.innerHTML = '';
      const colors = simonColors.slice(0, count);
      simonBoard.style.gridTemplateColumns = count <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
      colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = `simon-button ${color} disabled`;
        btn.dataset.color = color;
        btn.textContent = color;
        btn.addEventListener('click', () => onSimonPress(color));
        simonBoard.appendChild(btn);
      });
    }

    function getSimonButtons() {
      return Array.from(simonBoard.children);
    }

    function flashSimonButton(color) {
      const button = simonBoard.querySelector(`[data-color="${color}"]`);
      if (!button) return;
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), simonState.speed / 2);
    }

    function disableSimonButtons(disabled) {
      getSimonButtons().forEach(btn => {
        btn.classList.toggle('disabled', disabled);
        btn.disabled = disabled;
      });
    }

    function playSimonSequence(index = 0) {
      if (index >= simonState.sequence.length) {
        simonState.playerTurn = true;
        disableSimonButtons(false);
        simonInfo.textContent = `Tu turno: reproduce la secuencia de ${simonState.sequence.length} colores.`;
        return;
      }

      const color = simonState.sequence[index];
      flashSimonButton(color);
      simonInfo.textContent = `Escucha la secuencia... (${index + 1}/${simonState.sequence.length})`;
      setTimeout(() => playSimonSequence(index + 1), simonState.speed);
    }

    function generateSimonSequence(length) {
      const colors = simonColors.slice(0, simonState.colorCount);
      const sequence = [];
      for (let i = 0; i < length; i++) {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
      }
      return sequence;
    }

    function startSimonRound() {
      simonState.currentRound += 1;
      const length = simonState.baseLength + simonState.currentRound - 1;
      simonState.sequence = generateSimonSequence(length);
      simonState.userIndex = 0;
      simonState.playerTurn = false;
      simonInfo.textContent = `Ronda ${simonState.currentRound}/${simonState.rounds}: observa la secuencia.`;
      disableSimonButtons(true);
      simonBoard.classList.remove('hidden');
      setTimeout(() => playSimonSequence(0), 500);
    }

    function endSimonGame(message) {
      simonState.playing = false;
      simonState.playerTurn = false;
      disableSimonButtons(true);
      startSimon.disabled = false;
      simonInfo.textContent = message;
      if (window.Leaderboard) window.Leaderboard.save('simon', simonState.score, simonState.rounds);
    }

    function onSimonPress(color) {
      if (!simonState.playerTurn) return;
      const button = simonBoard.querySelector(`[data-color="${color}"]`);
      if (!button) return;
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 150);

      const expected = simonState.sequence[simonState.userIndex];
      if (color !== expected) {
        endSimonGame(`Fallaste en el intento ${simonState.userIndex + 1}. Secuencia correcta: ${simonState.sequence.join(', ')}.`);
        return;
      }

      simonState.userIndex += 1;
      if (simonState.userIndex >= simonState.sequence.length) {
        simonState.score += 1;
        if (simonState.currentRound >= simonState.rounds) {
          endSimonGame(`¡Felicidades! Juego completado. Puntuación: ${simonState.score}/${simonState.rounds}.`);
        } else {
          simonInfo.textContent = `Correcto. Preparando siguiente ronda...`;
          disableSimonButtons(true);
          setTimeout(startSimonRound, 900);
        }
      } else {
        simonInfo.textContent = `Bien. Siguiente color ${simonState.userIndex + 1}/${simonState.sequence.length}.`;
      }
    }

<<<<<<< HEAD
=======
=======
function initSimon(ui) {
  const { simonBoard, colorCountEl, baseLengthEl, simonSpeedEl, simonRoundsEl, simonInfo, startSimon } = ui;
  const simonColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

  let simonState = {
    colorCount: 4,
    baseLength: 3,
    speed: 700,
    rounds: 5,
    currentRound: 0,
    sequence: [],
    userIndex: 0,
    playerTurn: false,
    score: 0,
    playing: false
  };

  function setupSimonBoard(count) {
    simonBoard.innerHTML = '';
    const colors = simonColors.slice(0, count);
    simonBoard.style.gridTemplateColumns = count <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
    colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = `simon-button ${color} disabled`;
      btn.dataset.color = color;
      btn.textContent = color;
      btn.addEventListener('click', () => onSimonPress(color));
      simonBoard.appendChild(btn);
    });
  }

  function getSimonButtons() {
    return Array.from(simonBoard.children);
  }

  function flashSimonButton(color) {
    const button = simonBoard.querySelector(`[data-color="${color}"]`);
    if (!button) return;
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), simonState.speed / 2);
  }

  function disableSimonButtons(disabled) {
    getSimonButtons().forEach(btn => {
      btn.classList.toggle('disabled', disabled);
      btn.disabled = disabled;
    });
  }

  function playSimonSequence(index = 0) {
    if (index >= simonState.sequence.length) {
      simonState.playerTurn = true;
      disableSimonButtons(false);
      simonInfo.textContent = `Tu turno: reproduce la secuencia de ${simonState.sequence.length} colores.`;
      return;
    }

    const color = simonState.sequence[index];
    flashSimonButton(color);
    simonInfo.textContent = `Escucha la secuencia... (${index + 1}/${simonState.sequence.length})`;
    setTimeout(() => playSimonSequence(index + 1), simonState.speed);
  }

  function generateSimonSequence(length) {
    const colors = simonColors.slice(0, simonState.colorCount);
    const sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    return sequence;
  }

  function startSimonRound() {
    simonState.currentRound += 1;
    const length = simonState.baseLength + simonState.currentRound - 1;
    simonState.sequence = generateSimonSequence(length);
    simonState.userIndex = 0;
    simonState.playerTurn = false;
    simonInfo.textContent = `Ronda ${simonState.currentRound}/${simonState.rounds}: observa la secuencia.`;
    disableSimonButtons(true);
    simonBoard.classList.remove('hidden');
    setTimeout(() => playSimonSequence(0), 500);
  }

  function endSimonGame(message) {
    simonState.playing = false;
    simonState.playerTurn = false;
    disableSimonButtons(true);
    startSimon.disabled = false;
    simonInfo.textContent = message;
    if (window.Leaderboard) window.Leaderboard.save('simon', simonState.score, simonState.rounds);
  }

  function onSimonPress(color) {
    if (!simonState.playerTurn) return;
    const button = simonBoard.querySelector(`[data-color="${color}"]`);
    if (!button) return;
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 150);

    const expected = simonState.sequence[simonState.userIndex];
    if (color !== expected) {
      endSimonGame(`Fallaste en el intento ${simonState.userIndex + 1}. Secuencia correcta: ${simonState.sequence.join(', ')}.`);
      return;
    }

    simonState.userIndex += 1;
    if (simonState.userIndex >= simonState.sequence.length) {
      simonState.score += 1;
      if (simonState.currentRound >= simonState.rounds) {
        endSimonGame(`¡Felicidades! Juego completado. Puntuación: ${simonState.score}/${simonState.rounds}.`);
      } else {
        simonInfo.textContent = `Correcto. Preparando siguiente ronda...`;
        disableSimonButtons(true);
        setTimeout(startSimonRound, 900);
      }
    } else {
      simonInfo.textContent = `Bien. Siguiente color ${simonState.userIndex + 1}/${simonState.sequence.length}.`;
    }
  }

  if (startSimon) {
>>>>>>> 62391f4243fe7608a90643d819dbb787d8e46119
>>>>>>> fa33d63056b6f29821bdf6e960006ebcd1e764ff
    startSimon.addEventListener('click', () => {
      simonState.colorCount = Math.max(2, Math.min(parseInt(colorCountEl.value, 10) || 4, simonColors.length));
      simonState.baseLength = Math.max(1, parseInt(baseLengthEl.value, 10) || 3);
      simonState.speed = Math.max(200, Math.min(parseInt(simonSpeedEl.value, 10) || 700, 2000));
      simonState.rounds = Math.max(1, Math.min(parseInt(simonRoundsEl.value, 10) || 5, 20));
      simonState.currentRound = 0;
      simonState.score = 0;
      simonState.sequence = [];
      simonState.userIndex = 0;
      simonState.playing = true;
      setupSimonBoard(simonState.colorCount);
      simonBoard.classList.add('hidden');
      startSimon.disabled = true;
      startSimonRound();
    });
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fa33d63056b6f29821bdf6e960006ebcd1e764ff

    // Exponer stop real (antes window.stopSimon no funcionaba: cerraba sobre
    // una variable fuera de alcance). Lo dejamos disponible por compatibilidad.
    window.stopSimon = () => { simonState.playing = false; simonState.playerTurn = false; };
  }

  function stop() {
    if (typeof window.stopSimon === 'function') window.stopSimon();
  }

  window.GameRegistry.register({
    id:          'simon',
    name:        'Simon Dice',
    tag:         'SECUENCIA',
    accent:      '#818cf8',
    icon:        '🧠',
    num:         '02',
    description: 'Repite secuencias de colores en orden exacto. Cada ronda añade un paso más al patrón.',
    difficulty:  3,
    css:         'css/simon.css',

    init,
    stop,
    leaderboard: { format: v => `${v} rondas` }
  });

}());
<<<<<<< HEAD
=======
=======
  }
}
window.stopSimon = function () {
  if (typeof simonState !== 'undefined') simonState.playing = false;
};
window.initSimon = initSimon;
>>>>>>> 62391f4243fe7608a90643d819dbb787d8e46119
>>>>>>> fa33d63056b6f29821bdf6e960006ebcd1e764ff
