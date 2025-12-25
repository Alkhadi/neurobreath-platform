/* NeuroBreath Rewards Page Wiring
   - Renders points, badges, coupons on rewards.html
   - Requires rewards-system.js
*/
(() => {
  'use strict';

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function mk(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('data-')) el.setAttribute(k, v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    for (const ch of children) el.appendChild(ch);
    return el;
  }

  function createStatusBox(parent) {
    let box = qs('#nbQuickWinResult', parent);
    if (!box) {
      box = mk('div', {
        id: 'nbQuickWinResult',
        class: 'nb-quickwin__result muted',
        role: 'status',
        'aria-live': 'polite'
      });
      parent.appendChild(box);
    }
    return box;
  }

  function copyToClipboard(text) {
    const t = String(text || '');
    if (!t) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t).then(() => true).catch(() => false);
    }
    // fallback
    return new Promise((resolve) => {
      const ta = document.createElement('textarea');
      ta.value = t;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      document.body.removeChild(ta);
      resolve(ok);
    });
  }

  function renderBadgesAll(state) {
    const allWrap = qs('#all-badges');
    if (!allWrap) return;

    const earnedSet = new Set(state.earnedBadges || []);
    const catalog = (window.NeuroBreathRewards && window.NeuroBreathRewards.catalog) || { BADGES: [] };

    allWrap.innerHTML = '';
    for (const b of (catalog.BADGES || [])) {
      const earned = earnedSet.has(b.id);
      const card = mk('div', {
        class: 'badge-card' + (earned ? ' badge-card--earned' : ''),
        'data-category': b.category || 'all'
      });

      const top = mk('div', { class: 'badge-top flex justify-between align-center' });
      top.appendChild(mk('div', { class: 'badge-icon', text: b.icon || '🏅', 'aria-hidden': 'true' }));
      top.appendChild(mk('div', { class: 'badge-status muted', text: earned ? 'Earned' : 'Not yet' }));

      card.appendChild(top);
      card.appendChild(mk('h3', { class: 'badge-title', text: b.title || 'Badge' }));
      card.appendChild(mk('p', { class: 'muted', text: b.description || '' }));

      if (!earned) {
        // Provide a gentle hint where possible
        const hint = mk('p', { class: 'small-note', text: 'Keep going—small, consistent wins unlock this.' });
        card.appendChild(hint);
      }

      allWrap.appendChild(card);
    }
  }

  function renderBadgesEarned(state) {
    const earnedWrap = qs('#earned-badges');
    if (!earnedWrap) return;

    const earned = state.earnedBadges || [];
    const wallet = state.wallet || {};
    const earnedMap = wallet.earnedBadges || {};
    const catalog = (window.NeuroBreathRewards && window.NeuroBreathRewards.catalog) || { BADGES: [] };
    const byId = new Map((catalog.BADGES || []).map(b => [b.id, b]));

    earnedWrap.innerHTML = '';
    if (!earned.length) {
      earnedWrap.appendChild(mk('p', { class: 'muted', text: 'No badges earned yet. Start practising to earn your first badge!' }));
      return;
    }

    for (const id of earned) {
      const meta = byId.get(id) || { title: id, icon: '🏅', description: '' };
      const earnedAt = earnedMap[id]?.earnedAt ? new Date(earnedMap[id].earnedAt) : null;
      const sub = earnedAt ? `Earned ${earnedAt.toLocaleDateString('en-GB')}` : 'Earned';
      const card = mk('div', { class: 'badge-card badge-card--earned' });
      card.appendChild(mk('div', { class: 'badge-icon', text: meta.icon || '🏅', 'aria-hidden': 'true' }));
      card.appendChild(mk('h3', { class: 'badge-title', text: meta.title || 'Badge' }));
      card.appendChild(mk('p', { class: 'muted', text: meta.description || '' }));
      card.appendChild(mk('p', { class: 'small-note', text: sub }));
      earnedWrap.appendChild(card);
    }
  }

  function renderCoupons(state) {
    const grid = qs('#coupons-grid');
    if (!grid) return;

    const coupons = state.coupons || [];
    const wallet = state.wallet || {};
    const promptVault = wallet.promptVault || {};
    const tokens = wallet.tokens || {};

    grid.innerHTML = '';
    if (!coupons.length) {
      grid.appendChild(mk('p', { class: 'muted', text: 'No rewards available yet.' }));
      return;
    }

    for (const c of coupons) {
      const card = mk('div', { class: 'coupon-card' });

      const title = mk('h3', { class: 'coupon-title', text: `${c.icon || '🎁'} ${c.title}` });
      const meta = mk('p', { class: 'muted', text: `${c.cost} pts • ${c.category || 'reward'}` });
      const desc = mk('p', { class: 'muted', text: c.description || '' });

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(desc);

      const actions = mk('div', { class: 'coupon-actions flex justify-between align-center' });

      // Status
      let statusText = 'Locked';
      if (c.redeemed) statusText = 'Redeemed';
      else if (c.unlocked) statusText = c.canAfford ? 'Ready' : 'Unlocked (need points)';
      actions.appendChild(mk('span', { class: 'muted', text: statusText }));

      // Button
      const btn = mk('button', {
        type: 'button',
        class: 'nb-btn nb-btn--primary',
        'data-coupon-id': c.id,
        text: c.redeemed ? 'Redeemed' : `Redeem (${c.cost})`
      });
      if (!c.redeemable) btn.disabled = true;

      actions.appendChild(btn);
      card.appendChild(actions);

      // If redeemed prompt, show it + copy
      if (c.redeemed && c.kind === 'prompt') {
        const pv = promptVault[c.id];
        const text = pv?.text || c.promptText || '';
        const wrap = mk('div', { class: 'coupon-prompt' });

        wrap.appendChild(mk('p', { class: 'small-note', text: 'Prompt unlocked — copy/paste:' }));
        const ta = mk('textarea', {
          class: 'coupon-textarea',
          rows: '8',
          readonly: 'readonly'
        });
        ta.value = text;
        wrap.appendChild(ta);

        const copyBtn = mk('button', { type: 'button', class: 'nb-btn', text: 'Copy prompt' });
        copyBtn.addEventListener('click', async () => {
          const ok = await copyToClipboard(text);
          copyBtn.textContent = ok ? 'Copied ✓' : 'Copy failed';
          setTimeout(() => (copyBtn.textContent = 'Copy prompt'), 1200);
        });
        wrap.appendChild(copyBtn);
        card.appendChild(wrap);
      }

      // If token, show balance
      if (c.kind === 'token') {
        const count = Number(tokens[c.tokenId] || 0);
        const tokenLine = mk('p', { class: 'small-note', text: `Token balance: ${count}` });
        card.appendChild(tokenLine);
      }

      grid.appendChild(card);
    }

    // Wire redeem handlers (event delegation)
    grid.onclick = (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest('button[data-coupon-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-coupon-id');
      if (!id) return;
      const api = window.NeuroBreathRewards;
      if (!api) return;
      const res = api.redeemCoupon(id);
      if (!res.ok) {
        const reasonMap = {
          locked: 'This reward is still locked.',
          already_redeemed: 'You already redeemed this reward.',
          not_enough_points: 'You do not have enough points yet.',
          unknown_coupon: 'Unknown reward.'
        };
        alert(reasonMap[res.reason] || 'Could not redeem this reward.');
      }
      // UI will refresh via event
    };
  }

  function wireBadgeTabs() {
    const tabs = qs('#badges-tabs');
    const grid = qs('#all-badges');
    if (!tabs || !grid) return;

    tabs.addEventListener('click', (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest('.tab-btn');
      if (!btn) return;

      qsa('.tab-btn', tabs).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category') || 'all';
      qsa('.badge-card', grid).forEach(card => {
        const cardCat = card.getAttribute('data-category') || 'all';
        const show = (cat === 'all') || (cardCat === cat);
        card.style.display = show ? '' : 'none';
      });
    });
  }

  function wireQuickWin() {
    const qw = qs('.nb-quickwin');
    if (!qw) return;

    const actions = qs('.nb-quickwin__actions', qw);
    if (!actions) return;

    const btns = qsa('button', actions);
    const recommendBtn = btns[0] || null;
    const tokenBtn = btns[1] || null;

    const status = createStatusBox(qw);

    if (recommendBtn) {
      recommendBtn.addEventListener('click', () => {
        const api = window.NeuroBreathRewards;
        if (!api) return;
        const rec = api.recommendNextQuest();
        status.innerHTML =
          `<strong>${escapeHtml(rec.title)}</strong><br>` +
          `${escapeHtml(rec.description)}<br>` +
          `<span class="small-note">${escapeHtml(rec.pointsHint || '')}</span><br>` +
          `<button type="button" class="nb-btn" id="nbOpenRecommendedQuest">Open recommended quest →</button>`;
        const openBtn = qs('#nbOpenRecommendedQuest', qw);
        if (openBtn) {
          openBtn.addEventListener('click', () => { window.location.href = rec.href; }, { once: true });
        }
      });
    }

    if (tokenBtn) {
      tokenBtn.addEventListener('click', () => {
        const api = window.NeuroBreathRewards;
        if (!api) return;

        const state = api.getState();
        const balance = Number(state.wallet?.tokens?.['streak-pause'] || 0);

        if (balance <= 0) {
          status.textContent = 'No Streak Pause Tokens available yet. Redeem one in "Redeem Rewards".';
          return;
        }

        const res = api.useToken('streak-pause');
        if (res.ok) {
          status.textContent = 'Streak Pause Token used (local). Consider logging a gentle 1‑minute session anyway, if possible.';
        } else {
          status.textContent = 'Could not use token.';
        }
      });
    }
  }

  function renderAll() {
    const api = window.NeuroBreathRewards;
    if (!api) return;

    const state = api.getState();

    const pointsEl = qs('#rewards-points');
    if (pointsEl) pointsEl.textContent = String(state.availablePoints ?? 0);

    renderBadgesEarned(state);
    renderBadgesAll(state);
    renderCoupons(state);
  }

  function init() {
    if (!window.NeuroBreathRewards) return;

    wireBadgeTabs();
    wireQuickWin();
    renderAll();

    window.addEventListener('nb:rewards-update', () => renderAll());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
