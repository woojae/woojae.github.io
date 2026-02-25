(function () {
  'use strict';

  var terminal = document.getElementById('hero-terminal');
  if (!terminal) return;

  var output = document.getElementById('terminal-output');
  var input = document.getElementById('terminal-input');
  var inputLine = document.getElementById('terminal-input-line');
  var body = terminal.querySelector('.terminal-body');

  // Parse post data injected by Hugo
  var posts = [];
  try {
    posts = JSON.parse(terminal.getAttribute('data-posts') || '[]');
  } catch (e) {
    posts = [];
  }

  var history = [];
  var historyIndex = -1;

  // Boot-up message
  var bootLines = [
    '<span class="prompt-line"><span class="prompt-symbol">$</span> cat welcome.txt</span>',
    '<h1 class="hero-title">Welcome to Woojae\'s Terminal</h1>',
    '<p class="hero-description">Engineering notes, projects, and experiments.</p>',
    '<p class="terminal-hint">Type <span class="cmd-highlight">help</span> for available commands.</p>'
  ];
  output.innerHTML = bootLines.join('\n');
  scrollToBottom();

  // Focus input on click anywhere in terminal
  body.addEventListener('click', function () {
    input.focus();
  });

  // Handle enter key
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var cmd = input.value.trim();
      if (cmd) {
        history.push(cmd);
      }
      historyIndex = history.length;
      appendOutput('<span class="prompt-line"><span class="prompt-symbol">$</span> ' + escapeHtml(cmd) + '</span>');
      if (cmd) {
        var result = executeCommand(cmd);
        if (result !== null) {
          appendOutput(result);
        }
      }
      input.value = '';
      scrollToBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  function executeCommand(cmd) {
    var parts = cmd.split(/\s+/);
    var base = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');

    if (base === 'help') return cmdHelp();
    if (base === 'about') return cmdAbout();
    if (base === 'ls') return cmdLs();
    if (base === 'cat' && args === 'welcome.txt') return cmdCatWelcome();
    if (base === 'cat') return '<span class="error">cat: ' + escapeHtml(args || '') + ': No such file or directory</span>';
    if (base === 'whoami') return 'visitor@woojae.github.io';
    if (base === 'date') return new Date().toString();
    if (base === 'clear') { output.innerHTML = ''; return null; }
    if (base === 'cd' && args === 'posts') { window.location.href = '/posts/'; return 'Navigating to /posts/...'; }
    if (base === 'cd') return '<span class="error">cd: ' + escapeHtml(args || '~') + ': Not a valid directory</span>';
    if (base === 'sudo') return '<span class="neon-magenta">Nice try.</span>';
    if (base === 'exit') return '<span class="neon-magenta">There is no escape.</span>';
    if (base === 'cowsay') return cmdCowsay(args || 'moo');
    if (base === 'poop') return '💩';
    if (base === 'pwd') return '/home/visitor/woojae.github.io';
    if (base === 'echo') return escapeHtml(args);
    if (base === 'fortune') return cmdFortune();
    if (base === 'sl') { cmdSl(); return null; }
    if (base === 'rm' && args.indexOf('-rf') !== -1) { cmdRmRf(); return null; }
    if (base === 'hack') { cmdHack(); return null; }
    if (base === 'flip') return '(╯°□°)╯︵ ┻━┻';
    if (base === 'unflip') return '┬─┬ノ( º _ ºノ)';
    if (base === 'shrug') return '¯\\_(ツ)_/¯';
    if (base === 'neofetch') return cmdNeofetch();
    if (base === 'history') return cmdHistory();
    if (base === 'vim' || base === 'vi' || base === 'nano' || base === 'emacs') return cmdVim(base);
    if (base === 'matrix') { cmdMatrix(); return null; }
    if (base === 'tetris') { cmdTetris(); return null; }
    if (base === 'ascii') return cmdAscii();

    return '<span class="error">bash: ' + escapeHtml(base) + ': command not found</span>';
  }

  function cmdHelp() {
    return [
      '<span class="neon-cyan">Available commands:</span>',
      '',
      '  <span class="neon-yellow">── Navigation ──</span>',
      '  <span class="cmd-highlight">help</span>           Show this help message',
      '  <span class="cmd-highlight">about</span>          About Woojae',
      '  <span class="cmd-highlight">ls</span>             List blog posts',
      '  <span class="cmd-highlight">cd posts</span>       Navigate to posts',
      '  <span class="cmd-highlight">cat</span> welcome.txt  Show welcome message',
      '',
      '  <span class="neon-yellow">── Utilities ──</span>',
      '  <span class="cmd-highlight">whoami</span>         Who are you?',
      '  <span class="cmd-highlight">pwd</span>            Print working directory',
      '  <span class="cmd-highlight">date</span>           Current date and time',
      '  <span class="cmd-highlight">echo</span> &lt;text&gt;    Repeat after me',
      '  <span class="cmd-highlight">history</span>        Show command history',
      '  <span class="cmd-highlight">clear</span>          Clear terminal',
      '  <span class="cmd-highlight">neofetch</span>       System information',
      '',
      '  <span class="neon-yellow">── Fun Stuff ──</span>',
      '  <span class="cmd-highlight">cowsay</span> &lt;text&gt;  ASCII cow says your text',
      '  <span class="cmd-highlight">fortune</span>        Random programming wisdom',
      '  <span class="cmd-highlight">matrix</span>         Enter the Matrix',
      '  <span class="cmd-highlight">hack</span>           Initiate hack sequence',
      '  <span class="cmd-highlight">sl</span>             🚂 Choo choo!',
      '  <span class="cmd-highlight">tetris</span>         🎮 Play Tetris!',
      '  <span class="cmd-highlight">ascii</span>          Random ASCII art',
      '  <span class="cmd-highlight">flip</span>           Flip a table',
      '  <span class="cmd-highlight">unflip</span>         Put the table back',
      '  <span class="cmd-highlight">shrug</span>          ¯\\_(ツ)_/¯',
      '  <span class="cmd-highlight">poop</span>           💩',
      '  <span class="cmd-highlight">vim</span>            Good luck',
      '  <span class="cmd-highlight">rm -rf /</span>       Don\'t do it...',
      '  <span class="cmd-highlight">sudo</span>           Try it',
      '  <span class="cmd-highlight">exit</span>           Try to leave',
    ].join('\n');
  }

  function cmdAbout() {
    return [
      '<span class="neon-cyan">Woojae Lee</span>',
      'Software engineer. Mostly devops. Builder of things.',
      'Interested in bicycling, tetris, and making',
      'computers do stuff.',
      '',
      '<span class="neon-green">GitHub:</span>  <a href="https://github.com/woojae" target="_blank">github.com/woojae</a>',
    ].join('\n');
  }

  function cmdLs() {
    if (posts.length === 0) {
      return '<span class="text-dim">No posts found.</span>';
    }
    var lines = ['<span class="neon-cyan">total ' + posts.length + '</span>', ''];
    for (var i = 0; i < posts.length; i++) {
      var p = posts[i];
      lines.push(
        '<span class="neon-green">' + p.date + '</span>  ' +
        '<a href="' + escapeHtml(p.url) + '">' + escapeHtml(p.title) + '</a>'
      );
    }
    return lines.join('\n');
  }

  function cmdCatWelcome() {
    return [
      '<h1 class="hero-title">Welcome to Woojae\'s Terminal</h1>',
      '<p class="hero-description">Engineering notes, projects, and experiments.</p>',
    ].join('\n');
  }

  function cmdCowsay(text) {
    var safeText = escapeHtml(text);
    var len = safeText.length;
    var top = ' ' + repeat('_', len + 2);
    var bottom = ' ' + repeat('-', len + 2);
    var lines = [
      '<pre class="cowsay">' + top,
      '< ' + safeText + ' >',
      bottom,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||</pre>'
    ];
    return lines.join('\n');
  }

  // --- Fun command implementations ---

  var fortunes = [
    'There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.',
    'A SQL query walks into a bar, sees two tables, and asks... "Can I JOIN you?"',
    'To understand recursion, you must first understand recursion.',
    'It works on my machine. ¯\\_(ツ)_/¯',
    '// TODO: fix this later\n// Added 3 years ago',
    'There are 10 types of people: those who understand binary and those who don\'t.',
    'Algorithm: a word used by programmers when they don\'t want to explain what they did.',
    'Programming is 10% writing code and 90% figuring out why it doesn\'t work.',
    '"It\'s not a bug, it\'s a feature." — Every developer ever',
    'If at first you don\'t succeed, call it version 1.0.',
    'Weeks of coding can save you hours of planning.',
    'My code doesn\'t have bugs. It has random features.',
    '99 little bugs in the code, 99 little bugs.\nTake one down, patch it around...\n127 little bugs in the code.',
    'The best thing about a boolean is that even if you are wrong, you are only off by a bit.',
    'I don\'t always test my code, but when I do, I do it in production.',
  ];

  function cmdFortune() {
    var f = fortunes[Math.floor(Math.random() * fortunes.length)];
    return '<span class="neon-yellow">🔮 ' + escapeHtml(f) + '</span>';
  }

  function cmdSl() {
    var frames = [
      [
        '      ====        ________                ___________ ',
        '  _D _|  |_______/        \\__I_I_____===__|_________| ',
        '   |(_)---  |   H\\________/ |   |        =|___ ___|  ',
        '   /     |  |   H  |  |     |   |         ||_| |_||  ',
        '  |      |  |   H  |__--------------------| [___] |  ',
        '  | ________|___H__/__|_____/[][]~\\_______|       |  ',
        '  |/ |   |-----------I_____I [][] []  D   |=======|__ ',
        '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ',
        ' |/-=|___|=    ||    ||    ||    |_____/~\\___/        ',
        '  \\_/      \\O=====O=====O=====O_/      \\_/            ',
      ],
      [
        '        ====        ________                ___________ ',
        '    _D _|  |_______/        \\__I_I_____===__|_________| ',
        '     |(_)---  |   H\\________/ |   |        =|___ ___|  ',
        '     /     |  |   H  |  |     |   |         ||_| |_||  ',
        '    |      |  |   H  |__--------------------| [___] |  ',
        '    | ________|___H__/__|_____/[][]~\\_______|       |  ',
        '    |/ |   |-----------I_____I [][] []  D   |=======|__ ',
        '  __/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ',
        '   |/-=|___|=    ||    ||    ||    |_____/~\\___/        ',
        '    \\_/      \\O=====O=====O=====O_/      \\_/            ',
      ],
    ];
    var idx = 0;
    inputLine.style.display = 'none';
    var interval = setInterval(function () {
      if (idx >= 6) {
        clearInterval(interval);
        inputLine.style.display = '';
        input.focus();
        scrollToBottom();
        return;
      }
      var frame = frames[idx % frames.length];
      appendOutput('<pre class="cowsay neon-green">' + frame.join('\n') + '</pre>');
      scrollToBottom();
      idx++;
    }, 300);
  }

  function cmdRmRf() {
    var fakeFiles = [
      '/etc/passwd', '/usr/bin/node', '/home/visitor/.bashrc',
      '/var/log/syslog', '/boot/vmlinuz', '/usr/lib/libssl.so',
      '/home/visitor/secrets.txt', '/dev/sda1', '/proc/cpuinfo',
      '/home/visitor/.ssh/id_rsa', '/System32/important.dll',
      '/home/visitor/cat_photos/', '/usr/bin/python3',
    ];
    var idx = 0;
    inputLine.style.display = 'none';
    appendOutput('<span class="neon-magenta">☠️  Permission granted. Deleting everything...</span>');
    scrollToBottom();
    var interval = setInterval(function () {
      if (idx >= fakeFiles.length) {
        clearInterval(interval);
        appendOutput('<span class="neon-magenta">Just kidding. 😏 This is a website.</span>');
        inputLine.style.display = '';
        input.focus();
        scrollToBottom();
        return;
      }
      appendOutput('<span class="error">rm: deleting ' + fakeFiles[idx] + '</span>');
      scrollToBottom();
      idx++;
    }, 200);
  }

  function cmdHack() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    var steps = [
      'Bypassing firewall...',
      'Injecting SQL into mainframe...',
      'Downloading the internet...',
      'Decrypting Pentagon files...',
      'Rerouting through 47 proxies...',
      'Accessing satellite uplink...',
      'Compiling kernel in Visual Basic...',
      'ACCESS GRANTED. Just kidding. 🤡',
    ];
    var idx = 0;
    inputLine.style.display = 'none';
    appendOutput('<span class="neon-green">[*] Initiating hack sequence...</span>');
    scrollToBottom();
    var interval = setInterval(function () {
      if (idx >= steps.length) {
        clearInterval(interval);
        inputLine.style.display = '';
        input.focus();
        scrollToBottom();
        return;
      }
      // Generate random hex gibberish before each step
      var gibberish = '';
      for (var g = 0; g < 32; g++) {
        gibberish += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      appendOutput('<span class="text-dim">' + gibberish + '</span>');
      appendOutput('<span class="neon-green">[✓] ' + steps[idx] + '</span>');
      scrollToBottom();
      idx++;
    }, 500);
  }

  function cmdNeofetch() {
    var art = [
      '<span class="neon-cyan">        .--.        </span>',
      '<span class="neon-cyan">       |o_o |       </span>',
      '<span class="neon-cyan">       |:_/ |       </span>',
      '<span class="neon-cyan">      //   \\ \\      </span>',
      '<span class="neon-cyan">     (|     | )     </span>',
      '<span class="neon-cyan">    /\'\\_   _/`\\     </span>',
      '<span class="neon-cyan">    \\___)=(___/     </span>',
    ];
    var info = [
      '<span class="neon-green">visitor</span>@<span class="neon-green">woojae.github.io</span>',
      '─────────────────────',
      '<span class="neon-cyan">OS:</span> WoojaeOS 1.0 (Retro Edition)',
      '<span class="neon-cyan">Host:</span> GitHub Pages',
      '<span class="neon-cyan">Kernel:</span> Hugo v0.128.0-static',
      '<span class="neon-cyan">Shell:</span> woojae-terminal 1.0',
      '<span class="neon-cyan">Terminal:</span> Retro 80s Neon',
      '<span class="neon-cyan">CPU:</span> JavaScript Single-Thread @ ∞GHz',
      '<span class="neon-cyan">Memory:</span> ' + Math.floor(Math.random() * 420 + 69) + 'MB / 640KB (should be enough)',
      '<span class="neon-cyan">Uptime:</span> Since you opened this tab',
      '<span class="neon-cyan">Theme:</span> Neon Cyberpunk 🌆',
      '',
      '<span style="color:#ff0000">███</span><span style="color:#ff8800">███</span><span style="color:#ffff00">███</span><span style="color:#00ff00">███</span><span style="color:#00ffff">███</span><span style="color:#0088ff">███</span><span style="color:#ff00ff">███</span>',
    ];
    var lines = [];
    var max = Math.max(art.length, info.length);
    for (var i = 0; i < max; i++) {
      var left = i < art.length ? art[i] : '                    ';
      var right = i < info.length ? info[i] : '';
      lines.push(left + '   ' + right);
    }
    return '<pre class="cowsay">' + lines.join('\n') + '</pre>';
  }

  function cmdHistory() {
    if (history.length === 0) return '<span class="text-dim">No commands in history.</span>';
    var lines = [];
    for (var i = 0; i < history.length; i++) {
      lines.push('  <span class="neon-yellow">' + (i + 1) + '</span>  ' + escapeHtml(history[i]));
    }
    return lines.join('\n');
  }

  function cmdVim(editor) {
    var msgs = {
      vim: '<span class="neon-magenta">You are now trapped in vim. Good luck getting out.</span>\n<span class="text-dim">Hint: You can\'t. No one can. Just close the tab.</span>',
      vi: '<span class="neon-magenta">You are now trapped in vi. This is even worse than vim.</span>\n<span class="text-dim">May god have mercy on your soul.</span>',
      nano: '<span class="neon-green">nano? What are you, a casual?</span>\n<span class="text-dim">Just kidding. ^X to exit. At least you know that.</span>',
      emacs: '<span class="neon-magenta">Emacs is not a text editor.</span>\n<span class="text-dim">It\'s an operating system that lacks a good text editor.</span>',
    };
    return msgs[editor] || msgs.vim;
  }

  function cmdMatrix() {
    var matrixChars = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ가나다라마바사아자차카타파하0123456789';
    var lineCount = 0;
    inputLine.style.display = 'none';
    appendOutput('<span class="neon-green">[Entering the Matrix...]</span>');
    scrollToBottom();
    var interval = setInterval(function () {
      if (lineCount >= 15) {
        clearInterval(interval);
        appendOutput('<span class="neon-green">[You took the blue pill. Waking up...]</span>');
        inputLine.style.display = '';
        input.focus();
        scrollToBottom();
        return;
      }
      var line = '';
      var cols = 50 + Math.floor(Math.random() * 20);
      for (var c = 0; c < cols; c++) {
        if (Math.random() > 0.7) {
          line += '<span class="neon-green" style="opacity:' + (Math.random() * 0.5 + 0.5).toFixed(2) + '">' +
            matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)) + '</span>';
        } else {
          line += '<span style="color:#003300;opacity:' + (Math.random() * 0.4 + 0.2).toFixed(2) + '">' +
            matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)) + '</span>';
        }
      }
      appendOutput(line);
      scrollToBottom();
      lineCount++;
    }, 150);
  }

  function cmdTetris() {
    var PIECES = [
      { shape: [[1,1,1,1]], color: '#00ffff' },
      { shape: [[1,1],[1,1]], color: '#ffff00' },
      { shape: [[0,1,0],[1,1,1]], color: '#ff00ff' },
      { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
      { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
      { shape: [[1,0,0],[1,1,1]], color: '#0088ff' },
      { shape: [[0,0,1],[1,1,1]], color: '#ff8800' }
    ];

    var COLS = 10;
    var ROWS = 18;
    var board = [];
    var boardColors = [];
    var score = 0;
    var linesCleared = 0;
    var gameOver = false;
    var current = null;
    var currentX = 0;
    var currentY = 0;
    var currentColor = '';
    var next = null;
    var nextColor = '';
    var dropInterval = null;
    var speed = 500;
    var level = 1;

    for (var r = 0; r < ROWS; r++) {
      board[r] = [];
      boardColors[r] = [];
      for (var c = 0; c < COLS; c++) {
        board[r][c] = 0;
        boardColors[r][c] = '';
      }
    }

    var gameEl = document.createElement('div');
    gameEl.className = 'terminal-line';
    output.appendChild(gameEl);
    inputLine.style.display = 'none';

    function randomPiece() {
      var p = PIECES[Math.floor(Math.random() * PIECES.length)];
      return { shape: p.shape.map(function(row) { return row.slice(); }), color: p.color };
    }

    function spawnPiece() {
      if (next === null) {
        var p = randomPiece();
        next = p.shape;
        nextColor = p.color;
      }
      current = next;
      currentColor = nextColor;
      var p2 = randomPiece();
      next = p2.shape;
      nextColor = p2.color;
      currentX = Math.floor((COLS - current[0].length) / 2);
      currentY = 0;
      if (collides(current, currentX, currentY)) {
        gameOver = true;
      }
    }

    function collides(shape, offX, offY) {
      for (var r = 0; r < shape.length; r++) {
        for (var c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            var nr = offY + r;
            var nc = offX + c;
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true;
            if (board[nr][nc]) return true;
          }
        }
      }
      return false;
    }

    function merge() {
      for (var r = 0; r < current.length; r++) {
        for (var c = 0; c < current[r].length; c++) {
          if (current[r][c]) {
            board[currentY + r][currentX + c] = 1;
            boardColors[currentY + r][currentX + c] = currentColor;
          }
        }
      }
    }

    function checkLines() {
      var cleared = 0;
      for (var r = ROWS - 1; r >= 0; r--) {
        var full = true;
        for (var c = 0; c < COLS; c++) {
          if (!board[r][c]) { full = false; break; }
        }
        if (full) {
          board.splice(r, 1);
          boardColors.splice(r, 1);
          var newRow = [];
          var newCRow = [];
          for (var c2 = 0; c2 < COLS; c2++) { newRow.push(0); newCRow.push(''); }
          board.unshift(newRow);
          boardColors.unshift(newCRow);
          cleared++;
          r++;
        }
      }
      if (cleared > 0) {
        var pts = [0, 100, 300, 500, 800];
        score += (pts[cleared] || 800) * level;
        linesCleared += cleared;
        level = Math.floor(linesCleared / 10) + 1;
        speed = Math.max(100, 500 - (level - 1) * 40);
        clearInterval(dropInterval);
        dropInterval = setInterval(drop, speed);
      }
    }

    function rotatePiece(shape) {
      var rows = shape.length;
      var cols = shape[0].length;
      var rotated = [];
      for (var c = 0; c < cols; c++) {
        rotated[c] = [];
        for (var r = rows - 1; r >= 0; r--) {
          rotated[c].push(shape[r][c]);
        }
      }
      return rotated;
    }

    function padL(s, n) {
      while (s.length < n) s = ' ' + s;
      return s;
    }

    function render() {
      var display = [];
      var displayC = [];
      for (var r = 0; r < ROWS; r++) {
        display[r] = board[r].slice();
        displayC[r] = boardColors[r].slice();
      }
      if (current && !gameOver) {
        // Ghost piece (drop preview)
        var ghostY = currentY;
        while (!collides(current, currentX, ghostY + 1)) ghostY++;
        if (ghostY !== currentY) {
          for (var gr = 0; gr < current.length; gr++) {
            for (var gc = 0; gc < current[gr].length; gc++) {
              if (current[gr][gc]) {
                var gdr = ghostY + gr;
                var gdc = currentX + gc;
                if (gdr >= 0 && gdr < ROWS && gdc >= 0 && gdc < COLS && !display[gdr][gdc]) {
                  display[gdr][gdc] = 2; // ghost marker
                  displayC[gdr][gdc] = currentColor;
                }
              }
            }
          }
        }
        // Current piece
        for (var r2 = 0; r2 < current.length; r2++) {
          for (var c2 = 0; c2 < current[r2].length; c2++) {
            if (current[r2][c2]) {
              var dr = currentY + r2;
              var dc = currentX + c2;
              if (dr >= 0 && dr < ROWS && dc >= 0 && dc < COLS) {
                display[dr][dc] = 1;
                displayC[dr][dc] = currentColor;
              }
            }
          }
        }
      }

      var out = [];
      out.push('<pre class="cowsay" style="line-height:1.2;font-size:0.85em">');
      out.push('<span class="neon-cyan">╔' + repeat('══', COLS) + '╗</span>  <span class="neon-yellow">Score: ' + padL(String(score), 6) + '</span>');

      for (var r3 = 0; r3 < ROWS; r3++) {
        var rowStr = '<span class="neon-cyan">║</span>';
        for (var c3 = 0; c3 < COLS; c3++) {
          if (display[r3][c3] === 1) {
            rowStr += '<span style="color:' + displayC[r3][c3] + '">██</span>';
          } else if (display[r3][c3] === 2) {
            rowStr += '<span style="color:' + displayC[r3][c3] + ';opacity:0.25">░░</span>';
          } else {
            rowStr += '<span class="text-dim" style="opacity:0.1">··</span>';
          }
        }
        rowStr += '<span class="neon-cyan">║</span>';
        if (r3 === 0) rowStr += '  <span class="neon-yellow">Level: ' + level + '</span>';
        if (r3 === 1) rowStr += '  <span class="neon-yellow">Lines: ' + linesCleared + '</span>';
        if (r3 === 3) rowStr += '  <span class="neon-cyan">Next:</span>';
        if (next && r3 >= 4 && r3 < 4 + next.length) {
          var nr = '  ';
          for (var nc = 0; nc < next[r3 - 4].length; nc++) {
            nr += next[r3 - 4][nc] ? '<span style="color:' + nextColor + '">██</span>' : '  ';
          }
          rowStr += nr;
        }
        if (r3 === 8)  rowStr += '  <span class="text-dim">← → Move</span>';
        if (r3 === 9)  rowStr += '  <span class="text-dim"> ↑  Rotate</span>';
        if (r3 === 10) rowStr += '  <span class="text-dim"> ↓  Soft drop</span>';
        if (r3 === 11) rowStr += '  <span class="text-dim">SPC Hard drop</span>';
        if (r3 === 12) rowStr += '  <span class="text-dim"> Q  Quit</span>';
        out.push(rowStr);
      }
      out.push('<span class="neon-cyan">╚' + repeat('══', COLS) + '╝</span>');

      if (gameOver) {
        out.push('');
        out.push('<span class="neon-magenta">  ╔══════════════════╗</span>');
        out.push('<span class="neon-magenta">  ║    GAME OVER     ║</span>');
        out.push('<span class="neon-magenta">  ║  Score: ' + padL(String(score), 8) + ' ║</span>');
        out.push('<span class="neon-magenta">  ╚══════════════════╝</span>');
        out.push('<span class="text-dim">  Press any key...</span>');
      }
      out.push('</pre>');
      gameEl.innerHTML = out.join('\n');
      scrollToBottom();
    }

    function drop() {
      if (gameOver) return;
      if (!collides(current, currentX, currentY + 1)) {
        currentY++;
      } else {
        merge();
        checkLines();
        spawnPiece();
      }
      render();
      if (gameOver) {
        clearInterval(dropInterval);
        render();
      }
    }

    function handleKey(e) {
      if (gameOver) {
        e.preventDefault();
        cleanup();
        return;
      }
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        cleanup();
        return;
      }
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        if (!collides(current, currentX - 1, currentY)) currentX--;
      } else if (e.key === 'ArrowRight') {
        if (!collides(current, currentX + 1, currentY)) currentX++;
      } else if (e.key === 'ArrowDown') {
        if (!collides(current, currentX, currentY + 1)) {
          currentY++;
          score += 1;
        }
      } else if (e.key === 'ArrowUp') {
        var rot = rotatePiece(current);
        // Try normal, then wall kicks
        if (!collides(rot, currentX, currentY)) {
          current = rot;
        } else if (!collides(rot, currentX - 1, currentY)) {
          current = rot; currentX--;
        } else if (!collides(rot, currentX + 1, currentY)) {
          current = rot; currentX++;
        } else if (!collides(rot, currentX - 2, currentY)) {
          current = rot; currentX -= 2;
        } else if (!collides(rot, currentX + 2, currentY)) {
          current = rot; currentX += 2;
        }
      } else if (e.key === ' ') {
        while (!collides(current, currentX, currentY + 1)) {
          currentY++;
          score += 2;
        }
        merge();
        checkLines();
        spawnPiece();
        if (gameOver) clearInterval(dropInterval);
      }
      render();
    }

    function cleanup() {
      clearInterval(dropInterval);
      document.removeEventListener('keydown', handleKey);
      inputLine.style.display = '';
      input.focus();
      appendOutput('<span class="neon-cyan">GG! Final score: ' + score + ' | Lines: ' + linesCleared + ' | Level: ' + level + '</span>');
      scrollToBottom();
    }

    appendOutput('<span class="neon-cyan">🎮 TETRIS</span> <span class="text-dim">— Arrow keys to play, Q to quit</span>');
    spawnPiece();
    render();
    document.addEventListener('keydown', handleKey);
    dropInterval = setInterval(drop, speed);
  }

  var asciiArts = [
    // Skull
    '<pre class="cowsay neon-magenta">    ____\n   /    \\\n  | o  o |\n  |  __  |\n  | /  \\ |\n   \\____/\n   _|  |_\n  Memento Mori</pre>',
    // Rocket
    '<pre class="cowsay neon-cyan">       !\n       !\n       ^\n      / \\\n     /___\\\n    |=   =|\n    |     |\n    |     |\n    |     |\n    |     |\n    |     |\n    |     |\n   /|##!##|\\\n  / |##!##| \\\n /  |##!##|  \\\n|  / ^ | ^ \\  |\n | /  ( | )  \\ |\n |/   ( | )   \\|\n     ((   ))\n    ((  :  ))\n    ((  :  ))\n     ((   ))\n      (( ))\n       ( )\n        .\n        .\n        .\n  🚀 To the moon!</pre>',
    // Cat
    '<pre class="cowsay neon-yellow">  /\\_/\\\n ( o.o )\n  > ^ <\n /|   |\\\n(_|   |_)\n   meow.</pre>',
    // Ghost
    '<pre class="cowsay neon-cyan">   .----.\n  / o  o \\\n | \\    / |\n  \\  \\/  /\n   |    |\n   |    |\n   ^~^^~^~\n   BOO! 👻</pre>',
    // Doge
    '<pre class="cowsay neon-yellow">        ▄              ▄\n       ▌▒█           ▄▀▒▌\n       ▌▒▒█        ▄▀▒▒▒▐\n      ▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐\n    ▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐\n  ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌\n ▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌\n ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐\n▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌\n▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░▒▒▒▒▒▒▐\n▌▒▒▒▄██▄▒▒▒▒▒▒▒▒░░░░▒▒▒▒▌\n▌▀▐▄█▄█▌▄▒▀▒▒▒▒▒▒░░░░░░▒▒▐\n▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒░░░░░▒▒▒▌\n▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒░░░░▒▒▒▐\n ▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒▒▒░░▒▒▒▒▌\n ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐\n  ▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▀\n    ▀▄▄▄▄▄▄▀▀▀▀▀▀▄▄▄▄▀\n        such wow\n               much terminal\n      very ascii</pre>',
  ];

  function cmdAscii() {
    return asciiArts[Math.floor(Math.random() * asciiArts.length)];
  }

  function repeat(ch, n) {
    var s = '';
    for (var i = 0; i < n; i++) s += ch;
    return s;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function appendOutput(html) {
    var div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = html;
    output.appendChild(div);
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  // Auto-focus
  input.focus();
})();
