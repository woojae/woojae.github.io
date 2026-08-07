/* Tetris program — canvas game scoped to the tetris window. */
(function () {
  'use strict';

  var canvas = document.getElementById('tetris-board');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var nextCanvas = document.getElementById('tetris-next');
  var nextCtx = nextCanvas.getContext('2d');

  var scoreEl = document.getElementById('tetris-score');
  var linesEl = document.getElementById('tetris-lines');
  var levelEl = document.getElementById('tetris-level');
  var highEl = document.getElementById('tetris-high');
  var overlay = document.getElementById('tetris-overlay');
  var overlayTitle = document.getElementById('tetris-overlay-title');
  var overlayMsg = document.getElementById('tetris-overlay-msg');
  var startBtn = document.getElementById('tetris-start');

  var COLS = 10;
  var ROWS = 20;
  var CELL = canvas.width / COLS;
  var STORAGE_KEY = 'tetris-high-score';
  var LINE_SCORES = [0, 40, 100, 300, 1200];

  var PIECES = {
    I: { color: '#00ffff', cells: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
    J: { color: '#4f7cff', cells: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
    L: { color: '#ff9f1c', cells: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
    O: { color: '#ffe600', cells: [[1, 1], [1, 1]] },
    S: { color: '#39ff14', cells: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
    T: { color: '#ff00ff', cells: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
    Z: { color: '#ff5f56', cells: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] }
  };

  var board, current, nextPiece, bag;
  var score = 0;
  var lines = 0;
  var level = 1;
  var highScore = 0;
  var state = 'ready'; // ready | playing | paused | over
  var dropTimer = 0;
  var lastTime = 0;
  var rafId = null;

  try {
    highScore = parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
  } catch (e) { /* storage unavailable */ }
  highEl.textContent = highScore;

  function emptyBoard() {
    var rows = [];
    for (var y = 0; y < ROWS; y++) rows.push(new Array(COLS).fill(0));
    return rows;
  }

  function refillBag() {
    var keys = Object.keys(PIECES);
    for (var i = keys.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = keys[i];
      keys[i] = keys[j];
      keys[j] = tmp;
    }
    return keys;
  }

  function takePiece() {
    if (!bag || bag.length === 0) bag = refillBag();
    var type = bag.pop();
    var def = PIECES[type];
    var cells = def.cells.map(function (row) { return row.slice(); });
    return {
      color: def.color,
      cells: cells,
      x: Math.floor((COLS - cells[0].length) / 2),
      y: 0
    };
  }

  function collides(piece, offX, offY, cells) {
    cells = cells || piece.cells;
    for (var y = 0; y < cells.length; y++) {
      for (var x = 0; x < cells[y].length; x++) {
        if (!cells[y][x]) continue;
        var bx = piece.x + x + offX;
        var by = piece.y + y + offY;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by >= 0 && board[by][bx]) return true;
      }
    }
    return false;
  }

  function rotated(cells) {
    var size = cells.length;
    var out = [];
    for (var y = 0; y < size; y++) {
      out.push([]);
      for (var x = 0; x < size; x++) {
        out[y].push(cells[size - 1 - x][y]);
      }
    }
    return out;
  }

  function rotate() {
    var cells = rotated(current.cells);
    var kicks = [0, -1, 1, -2, 2];
    for (var i = 0; i < kicks.length; i++) {
      if (!collides(current, kicks[i], 0, cells)) {
        current.cells = cells;
        current.x += kicks[i];
        return;
      }
    }
  }

  function move(dx) {
    if (!collides(current, dx, 0)) current.x += dx;
  }

  function dropDistance() {
    var d = 0;
    while (!collides(current, 0, d + 1)) d++;
    return d;
  }

  function softDrop() {
    if (!collides(current, 0, 1)) {
      current.y++;
      score += 1;
      updateStats();
    } else {
      lockPiece();
    }
  }

  function hardDrop() {
    var d = dropDistance();
    current.y += d;
    score += d * 2;
    lockPiece();
  }

  function lockPiece() {
    for (var y = 0; y < current.cells.length; y++) {
      for (var x = 0; x < current.cells[y].length; x++) {
        if (!current.cells[y][x]) continue;
        var by = current.y + y;
        if (by < 0) {
          gameOver();
          return;
        }
        board[by][current.x + x] = current.color;
      }
    }
    clearLines();
    current = nextPiece;
    nextPiece = takePiece();
    drawNext();
    if (collides(current, 0, 0)) {
      gameOver();
      return;
    }
    dropTimer = 0;
    updateStats();
  }

  function clearLines() {
    var cleared = 0;
    for (var y = ROWS - 1; y >= 0; y--) {
      if (board[y].every(function (cell) { return cell; })) {
        board.splice(y, 1);
        board.unshift(new Array(COLS).fill(0));
        cleared++;
        y++;
      }
    }
    if (cleared > 0) {
      lines += cleared;
      score += LINE_SCORES[cleared] * level;
      level = Math.floor(lines / 10) + 1;
    }
  }

  function dropInterval() {
    return Math.max(90, 750 - (level - 1) * 65);
  }

  function updateStats() {
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelEl.textContent = level;
    if (score > highScore) {
      highScore = score;
      highEl.textContent = highScore;
    }
  }

  function drawCell(c, x, y, size, color, ghost) {
    if (ghost) {
      c.strokeStyle = color;
      c.lineWidth = 1.5;
      c.strokeRect(x + 2, y + 2, size - 4, size - 4);
      return;
    }
    c.fillStyle = color;
    c.fillRect(x + 1, y + 1, size - 2, size - 2);
    c.fillStyle = 'rgba(255, 255, 255, 0.25)';
    c.fillRect(x + 1, y + 1, size - 2, 3);
    c.fillStyle = 'rgba(0, 0, 0, 0.25)';
    c.fillRect(x + 1, y + size - 4, size - 2, 3);
  }

  function draw() {
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (var gx = 1; gx < COLS; gx++) {
      ctx.beginPath();
      ctx.moveTo(gx * CELL, 0);
      ctx.lineTo(gx * CELL, canvas.height);
      ctx.stroke();
    }
    for (var gy = 1; gy < ROWS; gy++) {
      ctx.beginPath();
      ctx.moveTo(0, gy * CELL);
      ctx.lineTo(canvas.width, gy * CELL);
      ctx.stroke();
    }

    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        if (board[y][x]) drawCell(ctx, x * CELL, y * CELL, CELL, board[y][x]);
      }
    }

    if (current && (state === 'playing' || state === 'paused')) {
      var ghostY = current.y + dropDistance();
      for (var py = 0; py < current.cells.length; py++) {
        for (var px = 0; px < current.cells[py].length; px++) {
          if (!current.cells[py][px]) continue;
          if (ghostY + py >= 0 && ghostY !== current.y) {
            drawCell(ctx, (current.x + px) * CELL, (ghostY + py) * CELL, CELL, current.color, true);
          }
          if (current.y + py >= 0) {
            drawCell(ctx, (current.x + px) * CELL, (current.y + py) * CELL, CELL, current.color);
          }
        }
      }
    }
  }

  function drawNext() {
    nextCtx.fillStyle = '#0d0d0d';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (!nextPiece) return;
    var cells = nextPiece.cells;
    var minX = cells[0].length, maxX = -1, minY = cells.length, maxY = -1;
    for (var y = 0; y < cells.length; y++) {
      for (var x = 0; x < cells[y].length; x++) {
        if (!cells[y][x]) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    var w = maxX - minX + 1;
    var h = maxY - minY + 1;
    var size = 20;
    var offX = (nextCanvas.width - w * size) / 2;
    var offY = (nextCanvas.height - h * size) / 2;
    for (var cy = minY; cy <= maxY; cy++) {
      for (var cx = minX; cx <= maxX; cx++) {
        if (cells[cy][cx]) {
          drawCell(nextCtx, offX + (cx - minX) * size, offY + (cy - minY) * size, size, nextPiece.color);
        }
      }
    }
  }

  function loop(time) {
    rafId = requestAnimationFrame(loop);
    if (state !== 'playing') return;
    if (!lastTime) lastTime = time;
    dropTimer += time - lastTime;
    lastTime = time;
    if (dropTimer >= dropInterval()) {
      dropTimer = 0;
      if (!collides(current, 0, 1)) {
        current.y++;
      } else {
        lockPiece();
      }
    }
    draw();
  }

  function startGame() {
    board = emptyBoard();
    bag = null;
    current = takePiece();
    nextPiece = takePiece();
    score = 0;
    lines = 0;
    level = 1;
    dropTimer = 0;
    lastTime = 0;
    state = 'playing';
    overlay.classList.add('is-hidden');
    updateStats();
    drawNext();
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function togglePause() {
    if (state === 'playing') {
      state = 'paused';
      showOverlay('PAUSED', 'press p or tap Play to resume', 'Resume');
    } else if (state === 'paused') {
      state = 'playing';
      lastTime = 0;
      overlay.classList.add('is-hidden');
    }
  }

  function gameOver() {
    state = 'over';
    try {
      localStorage.setItem(STORAGE_KEY, String(highScore));
    } catch (e) { /* storage unavailable */ }
    draw();
    showOverlay('GAME OVER', 'score: ' + score, 'Play Again');
  }

  function showOverlay(title, msg, btnLabel) {
    overlayTitle.textContent = title;
    overlayMsg.textContent = msg;
    startBtn.textContent = btnLabel;
    overlay.classList.remove('is-hidden');
  }

  startBtn.addEventListener('click', function () {
    if (state === 'paused') {
      togglePause();
    } else {
      startGame();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (state === 'ready' || state === 'over') {
      if (e.key === 'Enter') startGame();
      return;
    }
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePause();
      return;
    }
    if (state !== 'playing') return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        move(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        softDrop();
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotate();
        break;
      case ' ':
        e.preventDefault();
        hardDrop();
        break;
    }
  });

  document.querySelectorAll('.tetris-touch-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (state !== 'playing') return;
      switch (btn.dataset.action) {
        case 'left': move(-1); break;
        case 'right': move(1); break;
        case 'down': softDrop(); break;
        case 'rotate': rotate(); break;
        case 'drop': hardDrop(); break;
      }
    });
  });

  board = emptyBoard();
  draw();
})();
