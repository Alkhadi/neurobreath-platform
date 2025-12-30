(function(){
  function initTimer(root){
    if(!root) return;
    const display = root.querySelector('[data-timer-display]');
    const bar = root.querySelector('[data-timer-bar]');
    const start = root.querySelector('[data-timer-start]');
    const stop = root.querySelector('[data-timer-stop]');
    if(!display || !start || !stop) return;
    const total = Number(root.dataset.seconds || 300) || 300;
    let remaining = total;
    let timer = null;

    const render = () => {
      const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
      const seconds = String(remaining % 60).padStart(2, '0');
      display.textContent = `${minutes}:${seconds}`;
      if(bar){
        const pct = ((total - remaining) / total) * 100;
        bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
      }
    };

    render();

    start.addEventListener('click', () => {
      if(timer) return;
      let last = Date.now();
      timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - last) / 1000);
        if(diff > 0){
          remaining -= diff;
          last = now;
          if(remaining <= 0){
            remaining = 0;
            clearInterval(timer);
            timer = null;
          }
          render();
        }
      }, 250);
    });

    stop.addEventListener('click', () => {
      if(timer){
        clearInterval(timer);
        timer = null;
      }
      remaining = total;
      render();
    });
  }

  function initJar(root){
    if(!root) return;
    const countEl = root.querySelector('[data-jar-count]');
    const inc = root.querySelector('[data-jar-inc]');
    const reset = root.querySelector('[data-jar-reset]');
    if(!countEl || !inc || !reset) return;
    const key = `adhdJar_${root.id || 'default'}`;
    let count = 0;

    try{
      count = Number(localStorage.getItem(key) || 0) || 0;
    }catch{}

    const render = () => {
      countEl.textContent = count;
    };

    render();

    inc.addEventListener('click', () => {
      count += 1;
      try{ localStorage.setItem(key, String(count)); }catch{}
      render();
    });

    reset.addEventListener('click', () => {
      count = 0;
      try{ localStorage.setItem(key, '0'); }catch{}
      render();
    });
  }

  function initAutosave(field){
    if(!field || !field.dataset) return;
    const key = field.dataset.autosave;
    if(!key) return;
    const storageKey = `adhdNotes_${key}`;

    try{
      const existing = localStorage.getItem(storageKey);
      if(typeof existing === 'string' && !field.value){
        field.value = existing;
      }
    }catch{}

    const save = () => {
      try{ localStorage.setItem(storageKey, field.value || ''); }catch{}
    };

    field.addEventListener('input', save);
    field.addEventListener('change', save);
  }

  function relocateProgressCard(){
    const anchor = document.getElementById('adhdYoungPeopleProgressAnchor');
    if(!anchor) return;

    const move = () => {
      const card = document.getElementById('progressCard');
      if(!card){
        requestAnimationFrame(move);
        return;
      }
      anchor.replaceWith(card);
      card.classList.add('card');
    };

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', move);
    } else {
      move();
    }
  }

  function ready(handler){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', handler);
    } else {
      handler();
    }
  }

  ready(() => {
    document.querySelectorAll('[data-widget="timer"]').forEach(initTimer);
    document.querySelectorAll('[data-widget="jar"]').forEach(initJar);
    document.querySelectorAll('[data-autosave]').forEach(initAutosave);
    relocateProgressCard();
  });
})();
