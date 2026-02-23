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

    return '<span class="error">bash: ' + escapeHtml(base) + ': command not found</span>';
  }

  function cmdHelp() {
    return [
      '<span class="neon-cyan">Available commands:</span>',
      '',
      '  <span class="cmd-highlight">help</span>        Show this help message',
      '  <span class="cmd-highlight">about</span>       About Woojae',
      '  <span class="cmd-highlight">ls</span>          List blog posts',
      '  <span class="cmd-highlight">cat</span> welcome.txt  Show welcome message',
      '  <span class="cmd-highlight">whoami</span>      Who are you?',
      '  <span class="cmd-highlight">date</span>        Current date and time',
      '  <span class="cmd-highlight">clear</span>       Clear terminal',
      '  <span class="cmd-highlight">cd posts</span>    Navigate to posts',
      '  <span class="cmd-highlight">cowsay</span> &lt;text&gt;  ASCII cow says your text',
      '  <span class="cmd-highlight">poop</span>        💩',
      '  <span class="cmd-highlight">exit</span>        Try to leave',
    ].join('\n');
  }

  function cmdAbout() {
    return [
      '<span class="neon-cyan">Woojae Lee</span>',
      'Software engineer. Builder of things.',
      'Interested in systems, tools, and making',
      'computers do interesting stuff.',
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
