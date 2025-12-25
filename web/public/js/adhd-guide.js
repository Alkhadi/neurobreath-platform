(function () {
  function initTimer(root) {
    if (!root) return;
    const display = root.querySelector('[data-timer-display]');
    const bar = root.querySelector('[data-timer-bar]');
    const start = root.querySelector('[data-timer-start]');
    const stop = root.querySelector('[data-timer-stop]');
    if (!display || !start || !stop) return;

    let total = Number(root.dataset.seconds || 300);
    let remaining = total;
    let timer = null;

    function render() {
      const m = String(Math.floor(remaining / 60)).padStart(2, '0');
      const s = String(remaining % 60).padStart(2, '0');
      display.textContent = `${m}:${s}`;
      if (bar) {
        bar.style.width = ((total - remaining) / total * 100).toFixed(1) + '%';
      }
    }

    render();

    start.addEventListener('click', () => {
      if (timer) return;
      let last = Date.now();
      timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.round((now - last) / 1000);
        if (diff > 0) {
          remaining -= diff;
          last = now;
          if (remaining <= 0) {
            remaining = 0;
            clearInterval(timer);
            timer = null;
          }
          render();
        }
      }, 250);
    });

    stop.addEventListener('click', () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      remaining = total;
      render();
    });
  }

  function initJar(root) {
    if (!root) return;
    const countEl = root.querySelector('[data-jar-count]');
    const inc = root.querySelector('[data-jar-inc]');
    const reset = root.querySelector('[data-jar-reset]');
    if (!countEl || !inc || !reset) return;

    const key = 'adhdJar_' + (root.id || 'default');
    let count = Number(localStorage.getItem(key) || 0);

    function render() {
      countEl.textContent = count;
    }

    render();

    inc.addEventListener('click', () => {
      count++;
      localStorage.setItem(key, count);
      render();
    });

    reset.addEventListener('click', () => {
      count = 0;
      localStorage.setItem(key, count);
      render();
    });
  }

  function initAutosave(textarea) {
    if (!textarea) return;
    const key =
      'adhdNote_' + (textarea.id || textarea.dataset.autosave || 'default');
    const existing = localStorage.getItem(key);
    if (existing) textarea.value = existing;

    textarea.addEventListener('input', () => {
      localStorage.setItem(key, textarea.value || '');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document
      .querySelectorAll('[data-widget="timer"]')
      .forEach(initTimer);
    document
      .querySelectorAll('[data-widget="jar"]')
      .forEach(initJar);
    document
      .querySelectorAll('textarea[data-autosave]')
      .forEach(initAutosave);
  });
})();
