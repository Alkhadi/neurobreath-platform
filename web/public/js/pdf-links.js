(() => {
  const links = Array.from(document.querySelectorAll('a[data-pdf]'));
  if (!links.length) return;

  const cdnBase = 'assets/downloads/';
  const fileMap = new Map([
    ['Autism — Adult Support Guide (UK).pdf', 'autism-adult-support-guide-uk.pdf'],
    ['Autism — Clinic Guide & Checklists (UK).pdf', 'autism-clinic-guide-checklists-uk.pdf'],
    ['Autism — Later Life & Carer Guide (UK).pdf', 'autism-later-life-carer-guide-uk.pdf'],
    ['Autism — Parent Quick Guide (UK).pdf', 'autism-parent-quick-guide-uk.pdf'],
    ['Dyslexia — Adult Resources (UK).pdf', 'dyslexia-adult-resources-uk.pdf'],
    ['Dyslexia — Parent Support Guide.pdf', 'dyslexia-parent-support-guide.pdf'],
    ['Dyslexia — Practice Pack (templates).pdf', 'dyslexia-practice-pack-templates.pdf'],
    ['parent-quick-pack.zip', 'parent-quick-pack.zip'],
    ['mshare_pdfs_2025-10-01.zip', 'mshare_pdfs_2025-10-01.zip'],
    ['parent-quick-pack-README.txt', 'parent-quick-pack-README.txt']
  ]);

  links.forEach(link => {
    const raw = (link.dataset.pdf || '').trim();
    if (!raw) return;
    const mapped = fileMap.get(raw) || raw;
    const href = /^https?:/i.test(mapped) ? mapped : cdnBase + encodeURI(mapped.replace(/^\/+/, ''));
    link.setAttribute('href', href);
    if (!link.hasAttribute('download') && /\.(pdf|zip|txt)$/i.test(raw)) {
      link.setAttribute('download', raw);
    }
    if (!link.hasAttribute('rel')) {
      link.setAttribute('rel', 'noopener');
    }
  });
})();
