/* Diagnosis decisions: subtle parallax for hero background/orb (respects reduced motion). */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion && reduceMotion.matches) return;

  const hero = document.querySelector('.nb-hero');
  if (!hero) return;

  let rafId = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const apply = () => {
    rafId = 0;

    const rect = hero.getBoundingClientRect();
    const viewportH = window.innerHeight || 0;
    const total = viewportH + rect.height;

    if (!total) return;

    const progress = clamp((viewportH - rect.top) / total, 0, 1);
    const centered = (progress - 0.5) * 2; // -1..1

    const base = centered * 36; // px, subtle

    hero.style.setProperty('--nb-hero-parallax-1', `${base * 0.8}px`);
    hero.style.setProperty('--nb-hero-parallax-2', `${base * 0.5}px`);
    hero.style.setProperty('--nb-hero-parallax-3', `${base * 0.25}px`);
    hero.style.setProperty('--nb-orb-y', `${base * 0.6}px`);
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(apply);
  };

  const onScroll = () => schedule();
  const onResize = () => schedule();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  // If the user toggles reduced motion while open, cleanly disable the effect.
  const disable = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;

    hero.style.setProperty('--nb-hero-parallax-1', '0px');
    hero.style.setProperty('--nb-hero-parallax-2', '0px');
    hero.style.setProperty('--nb-hero-parallax-3', '0px');
    hero.style.setProperty('--nb-orb-y', '0px');
  };

  if (reduceMotion) {
    const handler = evt => {
      if (evt && evt.matches) disable();
    };

    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', handler);
    } else if (typeof reduceMotion.addListener === 'function') {
      reduceMotion.addListener(handler);
    }
  }

  apply();
})();
