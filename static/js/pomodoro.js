/* Pomodoro program — focus timer scoped to the pomodoro window. */
(function () {
  'use strict';

  var timeEl = document.getElementById('pomo-time');
  if (!timeEl) return;
  var phaseEl = document.getElementById('pomo-phase');
  var ringEl = document.getElementById('pomo-ring');
  var toggleBtn = document.getElementById('pomo-toggle');
  var resetBtn = document.getElementById('pomo-reset');
  var dotsEl = document.getElementById('pomo-dots');
  var sessionLabelEl = document.getElementById('pomo-session-label');
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('.pomo-mode'));

  var MODES = {
    focus: { minutes: 25, phrase: 'time to focus' },
    short: { minutes: 5, phrase: 'take a short break' },
    long: { minutes: 15, phrase: 'take a long break' }
  };
  var SESSIONS_PER_CYCLE = 4;
  var CIRCUMFERENCE = 2 * Math.PI * 90;

  var mode = 'focus';
  var running = false;
  var remainingMs = MODES.focus.minutes * 60000;
  var endTime = 0;
  var intervalId = null;
  var completedFocus = 0; // completed focus sessions in the current cycle
  var baseTitle = document.title;
  var audioCtx = null;

  function totalMs() {
    return MODES[mode].minutes * 60000;
  }

  function formatTime(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function render() {
    var text = formatTime(remainingMs);
    timeEl.textContent = text;
    phaseEl.textContent = MODES[mode].phrase;
    document.title = running ? text + ' · ' + MODES[mode].phrase : baseTitle;

    var progress = 1 - remainingMs / totalMs();
    ringEl.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));

    toggleBtn.textContent = running ? 'Pause' : 'Start';

    var dots = dotsEl.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('is-done', i < completedFocus);
      dots[i].classList.toggle('is-current', mode === 'focus' && i === completedFocus);
    }
    var sessionNum = Math.min(completedFocus + 1, SESSIONS_PER_CYCLE);
    sessionLabelEl.textContent = mode === 'focus'
      ? 'session ' + sessionNum + ' of ' + SESSIONS_PER_CYCLE
      : completedFocus + ' of ' + SESSIONS_PER_CYCLE + ' sessions done';
  }

  function setMode(next, keepCycle) {
    mode = next;
    if (!keepCycle && next === 'focus' && completedFocus >= SESSIONS_PER_CYCLE) {
      completedFocus = 0;
    }
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    remainingMs = totalMs();
    modeBtns.forEach(function (btn) {
      var active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    render();
  }

  function beep() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      for (var i = 0; i < 3; i++) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, now + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.25 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.25 + 0.2);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.22);
      }
    } catch (e) { /* audio unavailable */ }
  }

  function tick() {
    remainingMs = endTime - Date.now();
    if (remainingMs <= 0) {
      remainingMs = 0;
      complete();
      return;
    }
    render();
  }

  function complete() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    beep();
    if (mode === 'focus') {
      completedFocus++;
      setMode(completedFocus >= SESSIONS_PER_CYCLE ? 'long' : 'short', true);
    } else {
      if (mode === 'long') completedFocus = 0;
      setMode('focus', true);
    }
  }

  function start() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { /* audio unavailable */ }
    }
    running = true;
    endTime = Date.now() + remainingMs;
    intervalId = setInterval(tick, 250);
    render();
  }

  function pause() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    remainingMs = Math.max(0, endTime - Date.now());
    render();
  }

  toggleBtn.addEventListener('click', function () {
    if (running) {
      pause();
    } else {
      start();
    }
  });

  resetBtn.addEventListener('click', function () {
    setMode(mode, true);
  });

  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setMode(btn.dataset.mode);
    });
  });

  ringEl.style.strokeDasharray = String(CIRCUMFERENCE);
  ringEl.style.strokeDashoffset = String(CIRCUMFERENCE);
  render();
})();
