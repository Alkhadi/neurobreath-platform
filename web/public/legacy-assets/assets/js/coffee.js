(function(){
  'use strict';

  // Optional: pages can provide bank details without hard-coding in this file.
  // Example:
  // window.NB_BANK_DETAILS = {
  //   payee_full_name: 'YOUR_ACCOUNT_NAME',
  //   bank_name: 'YOUR_BANK_NAME',
  //   account_number: 'YOUR_ACCOUNT_NUMBER',
  //   sort_code: '00-00-00',
  //   iban: 'GB00XXXX00000000000000',
  //   reference: 'NeuroBreath'
  // };
  const BANK = (typeof window !== 'undefined' && window.NB_BANK_DETAILS) ? window.NB_BANK_DETAILS : null;

  function safeText(value){
    const s = String(value ?? '').trim();
    return s ? s : '—';
  }

  function isPlaceholderText(value){
    const s = String(value ?? '').trim();
    return !s || s === '—' || s === '-';
  }

  function textOf(el){
    const value = (el && typeof el.textContent === 'string') ? el.textContent.trim() : '';
    return value || '—';
  }

  function setText(el, value){
    if (!el) return;
    el.textContent = (value && String(value).trim()) ? String(value).trim() : '—';
  }

  function fallbackCopy(text){
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }catch{
      return false;
    }
  }

  async function copyToClipboard(text){
    const t = (text || '').trim();
    if (!t) return false;

    if (navigator.clipboard && window.isSecureContext){
      try{
        await navigator.clipboard.writeText(t);
        return true;
      }catch{
        return fallbackCopy(t);
      }
    }

    return fallbackCopy(t);
  }

  function init(){
    const accName = document.getElementById('accName');
    const bankName = document.getElementById('bankName');
    const ref = document.getElementById('ref');
    const acc = document.getElementById('acc');
    const sort = document.getElementById('sort');
    const iban = document.getElementById('iban');

    const feedback = document.getElementById('feedback');
    const copyAllBtn = document.getElementById('copyAll');
    const openChooserBtn = document.getElementById('openChooser');
    const bankHelper = document.getElementById('bankHelper');
    const shareDetailsBtn = document.getElementById('shareDetails');

    const fName = document.getElementById('f_name');
    const fBank = document.getElementById('f_bank');
    const fAcc = document.getElementById('f_acc');
    const fSort = document.getElementById('f_sort');
    const fIban = document.getElementById('f_iban');

    // If a global BANK config exists and the page still has placeholders, populate fields.
    if (BANK){
      if (accName && isPlaceholderText(textOf(accName))) accName.textContent = safeText(BANK.payee_full_name);
      if (bankName && isPlaceholderText(textOf(bankName))) bankName.textContent = safeText(BANK.bank_name);
      if (ref && isPlaceholderText(textOf(ref))) ref.textContent = safeText(BANK.reference || 'NeuroBreath');
      if (acc && isPlaceholderText(textOf(acc))) acc.textContent = safeText(BANK.account_number);
      if (sort && isPlaceholderText(textOf(sort))) sort.textContent = safeText(BANK.sort_code);
      if (iban && isPlaceholderText(textOf(iban))) iban.textContent = safeText(BANK.iban);
    }

    setText(fName, textOf(accName));
    setText(fBank, textOf(bankName));
    setText(fAcc, textOf(acc));
    setText(fSort, textOf(sort));
    setText(fIban, textOf(iban));

    function show(msg){
      if (!feedback) return;
      feedback.textContent = msg;
    }

    function formatAllDetails(){
      const details = {
        name: textOf(accName),
        bank: textOf(bankName),
        reference: textOf(ref),
        account: textOf(acc),
        sortCode: textOf(sort),
        iban: textOf(iban)
      };

      return [
        `Account name: ${details.name}`,
        `Bank: ${details.bank}`,
        `Reference: ${details.reference}`,
        `Account number: ${details.account}`,
        `Sort code: ${details.sortCode}`,
        `IBAN: ${details.iban}`
      ].join('\n');
    }

    async function copyAll(){
      const ok = await copyToClipboard(formatAllDetails());
      show(ok ? 'Copied.' : 'Copy failed — please copy manually.');
      return ok;
    }

    if (copyAllBtn && !copyAllBtn.dataset.nbWired){
      copyAllBtn.dataset.nbWired = '1';
      copyAllBtn.addEventListener('click', () => { void copyAll(); });
    }

    document.querySelectorAll('.copy-mini[data-k]').forEach(btn => {
      if (!btn || btn.dataset.nbWired === '1') return;
      btn.dataset.nbWired = '1';
      btn.addEventListener('click', async () => {
        const key = (btn.getAttribute('data-k') || '').trim();
        const map = {
          payee_full_name: fName,
          bank_name: fBank,
          account_number: fAcc,
          sort_code: fSort,
          iban: fIban
        };
        const el = map[key];
        const value = textOf(el);
        const ok = await copyToClipboard(value);
        show(ok ? 'Copied.' : 'Copy failed — please copy manually.');
      });
    });

    async function shareAllDetails(){
      const text = formatAllDetails();

      // Best available UX on mobile: share sheet (user can save/copy/paste easily).
      if (navigator.share){
        try{
          await navigator.share({ title: 'NeuroBreath bank details', text });
          return true;
        }catch{
          // user cancelled; fall back to copy
        }
      }

      const ok = await copyToClipboard(text);
      show(ok ? 'Copied. Now open your bank app and paste.' : 'Copy failed — please copy manually.');
      return ok;
    }

    if (shareDetailsBtn && !shareDetailsBtn.dataset.nbWired){
      shareDetailsBtn.dataset.nbWired = '1';
      shareDetailsBtn.addEventListener('click', () => { void shareAllDetails(); });
    }

    if (openChooserBtn && !openChooserBtn.dataset.nbWired){
      openChooserBtn.dataset.nbWired = '1';
      openChooserBtn.addEventListener('click', async () => {
        await copyAll();

        if (bankHelper && typeof bankHelper.showModal === 'function'){
          bankHelper.showModal();
          return;
        }

        show('Open your bank app and paste the copied details.');
      });
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
