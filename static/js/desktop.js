(function () {
  'use strict';

  // --- Draggable windows (desktop pointers only) ---
  var win = document.querySelector('.window');
  var bar = win && win.querySelector('.window-titlebar');
  var main = document.querySelector('.desktop-main');

  if (win && bar && main && window.matchMedia('(pointer: fine)').matches) {
    bar.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('a, button')) return;

      var winRect = win.getBoundingClientRect();
      var mainRect = main.getBoundingClientRect();
      var offsetX = e.clientX - winRect.left;
      var offsetY = e.clientY - winRect.top;

      if (!win.classList.contains('is-dragged')) {
        win.style.width = winRect.width + 'px';
        win.classList.add('is-dragged');
      }

      function move(ev) {
        var x = ev.clientX - mainRect.left - offsetX;
        var y = ev.clientY - mainRect.top - offsetY;
        win.style.left = x + 'px';
        win.style.top = y + 'px';
      }

      function up() {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
      }

      move(e);
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      e.preventDefault();
    });
  }

  // --- Print action in reader windows ---
  var printBtn = document.querySelector('[data-action="print"]');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }
})();
