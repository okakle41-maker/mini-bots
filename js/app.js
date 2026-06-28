/**
 * ============================================================
 *  js/app.js — arranque de la aplicación (versión slim)
 * ============================================================
 *
 *  Qué hace este archivo:
 *    - Inicializar backgroundManager.
 *    - Llamar los initFn de los juegos legacy que aún usan el
 *      patrón initXxx(uiObject) en lugar de GameRegistry.register().
 *
 *  Qué ya NO hace (delegado a otros módulos):
 *    - showView / backToMenu        → js/core/viewManager.js
 *    - Hex tick, themes, ESC        → js/core/viewManager.js
 *    - Cartas del lobby, filtros    → js/gameBootstrap.js
 *    - Registro de juegos           → js/core/gameRegistry.js
 *
 *  Para migrar un juego del patrón legacy a GameRegistry:
 *    1. Añade GameRegistry.register({ id, init, stop, ... }) en el .js del juego.
 *    2. Marca sus elementos con data-ui="name" en index.html.
 *    3. Elimina su bloque initXxx({ ... }) de aquí.
 *    ¡Eso es todo!
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  backgroundManager.init();

  // ── Juegos legacy (patrón initXxx(uiObject)) ──────────────────────────────
  //
  // Cada bloque puede eliminarse individualmente cuando el juego migre a
  // GameRegistry.register(). Los que ya migraron (memorygrid) no están aquí.
  //
  // ─────────────────────────────────────────────────────────────────────────

  initTermita({
    startTermita: document.getElementById('startTermita'),
    gridEl:       document.getElementById('grid'),
    gridSizeEl:   document.getElementById('gridSize'),
    targetsEl:    document.getElementById('targets'),
    showTimeEl:   document.getElementById('showTime'),
    roundsEl:     document.getElementById('rounds'),
    termitaInfo:  document.getElementById('termitaInfo')
  });

  initSimon({
    startSimon:    document.getElementById('startSimon'),
    simonBoard:    document.getElementById('simonBoard'),
    colorCountEl:  document.getElementById('colorCount'),
    baseLengthEl:  document.getElementById('baseLength'),
    simonSpeedEl:  document.getElementById('simonSpeed'),
    simonRoundsEl: document.getElementById('simonRounds'),
    simonInfo:     document.getElementById('simonInfo')
  });

  if (window.initArrowGame) initArrowGame({
    startArrow:     document.getElementById('startArrow'),
    arrowLevelEl:   document.getElementById('arrowLevel'),
    arrowLengthEl:  document.getElementById('arrowLength'),
    arrowTimeInput: document.getElementById('arrowTimeInput'),
    arrowButtons:   document.getElementById('arrowButtons'),
    arrowDisplay:   document.getElementById('arrowDisplay'),
    arrowStep:      document.getElementById('arrowStep'),
    arrowCombo:     document.getElementById('arrowCombo'),
    arrowPercent:   document.getElementById('arrowPercent'),
    arrowProgress:  document.getElementById('arrowProgress'),
    arrowRecord:    document.getElementById('arrowRecord'),
    arrowMessage:   document.getElementById('arrowMessage'),
    arrowSequence:  document.getElementById('arrowSequence')
  });

  if (window.initLettersFall) initLettersFall({
    startLetters:            document.getElementById('startLetters'),
    lettersArea:             document.getElementById('lettersArea'),
    lettersInput:            document.getElementById('lettersInput'),
    lettersLevel:            document.getElementById('lettersLevel'),
    lettersDifficulty:       document.getElementById('lettersDifficulty'),
    lettersDifficultySelect: document.getElementById('lettersDifficultySelect'),
    lettersScore:            document.getElementById('lettersScore'),
    lettersBest:             document.getElementById('lettersBest'),
    lettersLives:            document.getElementById('lettersLives'),
    lettersMessage:          document.getElementById('lettersMessage')
  });

  if (window.initHackingDevice) initHackingDevice({
    startHacking:           document.getElementById('startHacking'),
    hackingBoard:           document.getElementById('hackingBoard'),
    hackingSize:            document.getElementById('hackingSize'),
    hackingLength:          document.getElementById('hackingLength'),
    hackingTime:            document.getElementById('hackingTime'),
    hackingRounds:          document.getElementById('hackingRounds'),
    hackingSets:            document.getElementById('hackingSets'),
    hackingMoveAll:         document.getElementById('hackingMoveAll'),
    hackingHighlightTarget: document.getElementById('hackingHighlightTarget'),
    hackingStreak:          document.getElementById('hackingStreak'),
    hackingMax:             document.getElementById('hackingMax'),
    hackingTimer:           document.getElementById('hackingTimer'),
    hackingTarget:          document.getElementById('hackingTarget'),
    hackingInfo:            document.getElementById('hackingInfo')
  });

  if (window.initHoleMatch) initHoleMatch({
    startHoleMatch:   document.getElementById('startHoleMatch'),
    difficultySelect: document.getElementById('holematchDifficulty'),
    targetCountInput: document.getElementById('holematchTargetCount'),
    progressText:     document.getElementById('holematchProgress'),
    mistakesText:     document.getElementById('holematchMistakes'),
    timerText:        document.getElementById('holematchTimer'),
    messageText:      document.getElementById('holematchMessage'),
    progressBar:      document.getElementById('holematchProgressBar'),
    holematchBoard:   document.getElementById('holematchBoard')
  });

  if (window.initColorCount) initColorCount({
    startButton:      document.getElementById('startColorCount'),
    submitButton:     document.getElementById('colorcountSubmit'),
    answerInput:      document.getElementById('colorcountAnswer'),
    difficultySelect: document.getElementById('colorcountDifficulty'),
    timerText:        document.getElementById('colorcountTimer'),
    levelText:        document.getElementById('colorcountLevel'),
    scoreText:        document.getElementById('colorcountScore'),
    questionText:     document.getElementById('colorcountQuestion'),
    gridContainer:    document.getElementById('colorcountGrid'),
    answerList:       document.getElementById('colorcountAnswers'),
    messageBox:       document.getElementById('colorcountMessage')
  });

  if (window.initPairs) {
    initPairs({
      startPairs:    document.getElementById('startPairs'),
      pairsBoard:    document.getElementById('pairsBoard'),
      pairsMovesEl:  document.getElementById('pairsMoves'),
      pairsPairsEl:  document.getElementById('pairsPairs'),
      pairsTimeEl:   document.getElementById('pairsTime'),
      pairsTimerBar: document.getElementById('pairsTimerBar'),
      pairsDiffBtns: document.querySelectorAll('.pairs-diff-btn'),
      pairsMessage:  document.getElementById('pairsMessage')
    });
  }

  if (window.initUnlocked) initUnlocked({
    canvas:          document.getElementById('unlockedCanvas'),
    startBtn:        document.getElementById('startUnlocked'),
    infoEl:          document.getElementById('unlockedInfo'),
    ringCountEl:     document.getElementById('unlockedRingCount'),
    colorsPerRingEl: document.getElementById('unlockedColors'),
    snapAngleEl:     document.getElementById('unlockedSnap'),
    timeLimitEl:     document.getElementById('unlockedTime'),
    roundsEl:        document.getElementById('unlockedRounds'),
    showTargetsEl:   document.getElementById('unlockedShowTargets'),
    showLabelsEl:    document.getElementById('unlockedShowLabels'),
    scoreEl:         document.getElementById('unlockedScore'),
    timerEl:         document.getElementById('unlockedTimer'),
    roundEl:         document.getElementById('unlockedRound'),
    ringIndicatorEl: document.getElementById('unlockedRingIndicator'),
    prevRingBtn:     document.getElementById('unlockedPrevRing'),
    nextRingBtn:     document.getElementById('unlockedNextRing')
  });

  // ── Fin de inits legacy ───────────────────────────────────────────────────
  // Cuando todos los juegos migren a GameRegistry.register(), este archivo
  // quedará vacío (o solo con backgroundManager.init()).

});
