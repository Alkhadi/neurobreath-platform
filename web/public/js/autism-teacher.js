// Autism Teacher Page — extracted script from inline template
(function(){
  function enableFocusRingOnTab(){
    document.addEventListener('keydown', e => {
      if(e.key === 'Tab') document.documentElement.classList.add('show-focus');
    });
  }

  function markExternalLinks(){
    for (const a of document.querySelectorAll('a[target="_blank"]')){
      // Avoid duplicating arrow if already appended
      if(!a.textContent.includes('↗')){
        a.insertAdjacentText('beforeend', ' ↗');
      }
    }
  }

  // Run after DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      enableFocusRingOnTab();
      markExternalLinks();
    });
  } else {
    enableFocusRingOnTab();
    markExternalLinks();
  }
})();
