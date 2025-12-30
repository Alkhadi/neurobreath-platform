(function () {
  'use strict';

  function $(selector) {
    return document.querySelector(selector);
  }

  function randomIndexExcluding(length, excludeIndex) {
    if (!length) return -1;
    if (length === 1) return 0;
    let idx = Math.floor(Math.random() * length);
    if (idx === excludeIndex) {
      idx = (idx + 1) % length;
    }
    return idx;
  }

  // ------------------------------
  // Game 1 · Sensory Stoplight Trainer
  // ------------------------------

  const stoplightScenarios = [
    {
      text: 'The classroom is quiet, the lights are soft, the timetable is on the board and the autistic pupil has their headphones and favourite fidget.',
      answer: 'green',
      explanation: 'Everything is predictable with low sensory load and clear information — this is a Green, ready-to-learn moment.'
    },
    {
      text: 'The class has just moved to a different room without warning. The new room is a bit echoey but not extremely loud. The pupil is frowning and holding their ears occasionally.',
      answer: 'amber',
      explanation: 'There is some sensory strain and an unexpected change, but no crisis yet. Amber — support to adjust is needed now.'
    },
    {
      text: 'The fire alarm has just gone off, the corridor is crowded and staff are shouting instructions from different directions. The pupil is crying, covering their ears and trying to bolt.',
      answer: 'red',
      explanation: 'This is an overwhelming crisis moment with high noise, crowding and fear. Red — follow the agreed crisis plan first.'
    },
    {
      text: 'It is lunchtime in the dining hall. There is background noise and movement, but the pupil is sitting with a trusted friend, wearing noise-reducing headphones and has a visual schedule on the table.',
      answer: 'amber',
      explanation: 'There is significant sensory input but strong supports in place. Amber — keep support available and watch for signs of overload.'
    },
    {
      text: 'The pupil is in a calm breakout room with one familiar adult, the door is half-open and there is a clear two-step written plan on the table.',
      answer: 'green',
      explanation: 'Low sensory load, clear expectations and trusted support — Green zone. Great time for learning or debrief.'
    },
    {
      text: "End of day: the corridor is packed, bells are ringing and several staff members call the pupil's name at once to hurry them along.",
      answer: 'red',
      explanation: 'High noise, crowding and time pressure can quickly tip into meltdown or shutdown. Red — slow things down and reduce demands.'
    },
    {
      text: 'A supply teacher arrives instead of the usual teacher. The pupil was warned this morning with a visual cue, and the lesson routine stays the same.',
      answer: 'amber',
      explanation: 'Change plus preparation. Amber — keep checking in and offer extra structure if needed.'
    }
  ];

  function initSensoryStoplightGame() {
    const container = document.querySelector('[data-game="stoplight"]');
    if (!container) return;

    const scenarioEl = $('#stoplightScenarioText');
    const feedbackEl = $('#stoplightFeedback');
    const scoreEl = $('#stoplightScore');
    const totalEl = $('#stoplightTotal');
    const nextBtn = $('#stoplightNext');
    const choiceButtons = Array.from(container.querySelectorAll('[data-stoplight-choice]'));

    if (!scenarioEl || !feedbackEl || !scoreEl || !totalEl || !nextBtn || !choiceButtons.length) {
      return;
    }

    let currentIndex = -1;
    let score = 0;
    let total = 0;

    function renderScenario() {
      const idx = randomIndexExcluding(stoplightScenarios.length, currentIndex);
      if (idx === -1) return;
      currentIndex = idx;
      const scenario = stoplightScenarios[idx];

      container.classList.remove('autism-game--correct', 'autism-game--incorrect');
      scenarioEl.textContent = scenario.text;
      feedbackEl.textContent = '';
      nextBtn.textContent = 'Next scenario';
      nextBtn.setAttribute('aria-label', 'Next sensory scenario');
    }

    function handleAnswer(choice) {
      if (currentIndex === -1) {
        feedbackEl.textContent = 'Tap "Start practice" first to see a scenario.';
        return;
      }
      const scenario = stoplightScenarios[currentIndex];
      total += 1;

      if (choice === scenario.answer) {
        score += 1;
        container.classList.remove('autism-game--incorrect');
        container.classList.add('autism-game--correct');
        feedbackEl.textContent = '✅ Correct: ' + scenario.explanation;
      } else {
        container.classList.remove('autism-game--correct');
        container.classList.add('autism-game--incorrect');
        feedbackEl.textContent = '⬇️ Not the best match: ' + scenario.explanation;
      }

      scoreEl.textContent = String(score);
      totalEl.textContent = String(total);
    }

    choiceButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const choice = btn.getAttribute('data-stoplight-choice');
        if (!choice) return;
        handleAnswer(choice);
      });
    });

    nextBtn.addEventListener('click', renderScenario);
  }

  // ------------------------------
  // Game 2 · Support Script Switcher
  // ------------------------------

  const scriptQuestions = [
    {
      scenario: 'A student is rocking in their chair and staring at the floor after the lesson location was changed at the last minute.',
      options: [
        '"Everyone else has managed to move rooms, you need to try harder."',
        '"The room changed quickly. Let\'s step into the corridor for two minutes, then I will show you the plan one step at a time."',
        '"Stop rocking, you are distracting the class. Sit still or you will have a consequence."'
      ],
      correctIndex: 1,
      rationale: 'The second script names the change, offers a quieter space, and gives a clear, stepwise plan without blame or shame.'
    },
    {
      scenario: 'An autistic pupil is covering their ears and asking "When is this going to end?" during a noisy group activity.',
      options: [
        '"It will be over when it\'s over. You just have to get used to noise."',
        '"In about ten minutes. Let\'s look at the timer together and plan what you can do until then."',
        '"You\'re being overdramatic. The other students are fine."'
      ],
      correctIndex: 1,
      rationale: 'The second option answers the question clearly, uses a visual time cue, and helps the pupil plan how to cope until the activity ends.'
    },
    {
      scenario: 'A teenager has stopped speaking mid-lesson and is staring at one point on the wall, not starting the written task.',
      options: [
        '"You are being rude by ignoring me. You must answer when I talk to you."',
        '"You seem stuck. Shall I write the first sentence with you, or would you like to type instead?"',
        '"If you don\'t start in the next minute you will lose break time."'
      ],
      correctIndex: 1,
      rationale: 'The second script assumes difficulty, not defiance, and offers concrete, low-pressure choices to get started.'
    },
    {
      scenario: 'A pupil returns from break visibly upset because a game changed suddenly and the rules kept shifting.',
      options: [
        '"That\'s just how playground games work, you need to be more flexible."',
        '"It sounds like the rules kept changing. Let\'s write down the version you like, then we can show friends tomorrow."',
        '"Ignore it and get on with your work, it\'s not important."'
      ],
      correctIndex: 1,
      rationale: 'The second option validates the experience and uses writing to create predictable rules the child can share later.'
    },
    {
      scenario: 'During a meltdown, an adult instinctively says "Use your words or I can\'t help you."',
      options: [
        'Keep repeating "Use your words" until the pupil calms enough to speak.',
        'Shift to a calm voice, reduce language and use agreed non-verbal signals and visual choices instead.',
        'Raise your voice so they can hear you more clearly over the noise.'
      ],
      correctIndex: 1,
      rationale: 'In crisis, language often shuts down. The second response reduces verbal load and relies on pre-agreed signals and visuals.'
    }
  ];

  function initSupportScriptsGame() {
    const container = document.querySelector('[data-game="scripts"]');
    if (!container) return;

    const scenarioEl = $('#scriptsScenarioText');
    const optionsEl = $('#scriptsOptions');
    const feedbackEl = $('#scriptsFeedback');
    const scoreEl = $('#scriptsScore');
    const totalEl = $('#scriptsTotal');
    const nextBtn = $('#scriptsNext');

    if (!scenarioEl || !optionsEl || !feedbackEl || !scoreEl || !totalEl || !nextBtn) {
      return;
    }

    let currentIndex = -1;
    let score = 0;
    let total = 0;

    function renderQuestion() {
      const idx = randomIndexExcluding(scriptQuestions.length, currentIndex);
      if (idx === -1) return;
      currentIndex = idx;
      const q = scriptQuestions[idx];

      container.classList.remove('autism-game--correct', 'autism-game--incorrect');
      scenarioEl.textContent = q.scenario;
      feedbackEl.textContent = '';
      optionsEl.innerHTML = '';

      q.options.forEach(function (optText, index) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'autism-game__btn';
        btn.textContent = optText;
        btn.setAttribute('data-option-index', String(index));
        btn.addEventListener('click', function () {
          handleAnswer(index);
        });
        optionsEl.appendChild(btn);
      });

      nextBtn.textContent = 'Next scenario';
    }

    function handleAnswer(index) {
      if (currentIndex === -1) {
        feedbackEl.textContent = 'Tap "Next scenario" to load a question first.';
        return;
      }
      const q = scriptQuestions[currentIndex];
      total += 1;

      if (index === q.correctIndex) {
        score += 1;
        container.classList.remove('autism-game--incorrect');
        container.classList.add('autism-game--correct');
        feedbackEl.textContent = '✅ Correct: ' + q.rationale;
      } else {
        container.classList.remove('autism-game--correct');
        container.classList.add('autism-game--incorrect');
        feedbackEl.textContent = '⬇️ Not the most supportive option. ' + q.rationale;
      }

      scoreEl.textContent = String(score);
      totalEl.textContent = String(total);
    }

    nextBtn.addEventListener('click', renderQuestion);
  }

  // ------------------------------
  // Game 3 · Regulation Match-Up
  // ------------------------------

  const regulationQuestions = [
    {
      scenario: 'A pupil is quietly withdrawing under the table after a whole morning of small changes. They are not disruptive but look exhausted.',
      options: [
        'Insist they return to their seat immediately and finish all missed work.',
        'Offer a 3–5 minute "Silent Box" break with a visual timer, then come back to a shorter, clearly defined task.',
        'Send them out of class for "non-compliance" so they learn the consequences.'
      ],
      correctIndex: 1,
      rationale: 'A short, predictable silent break plus a reduced task respects limited energy and prevents escalation.'
    },
    {
      scenario: 'Assembly is loud and echoey. The pupil is covering their ears and shifting in their seat.',
      options: [
        'Keep them in place so they "get used to it".',
        'Move them to the end of a row near the exit with noise-reducing headphones and a simple visual for how long is left.',
        'Move them to the front row so they can see better.'
      ],
      correctIndex: 1,
      rationale: 'Relocating near an exit, using headphones and giving clear timing decreases sensory load and increases sense of control.'
    },
    {
      scenario: 'A young person has homework, therapy and after-school clubs all on the same day. They are starting to have more meltdowns at night.',
      options: [
        'Add an extra club so they socialise more and get used to busy days.',
        'Create a weekly energy map together and drop or shorten at least one demand on heavy days.',
        'Keep the schedule the same for now and wait to see if the meltdowns stop on their own.'
      ],
      correctIndex: 1,
      rationale: 'Mapping energy then reducing stacked demands is protective against autistic burnout and chronic stress.'
    },
    {
      scenario: 'An autistic employee is struggling with back-to-back video meetings and cameras-on expectations.',
      options: [
        'Allow camera-off options, schedule buffer breaks and offer written follow-ups instead of extra live debriefs.',
        'Explain that cameras must be on at all times to show engagement.',
        'Ask them to stay late to catch up on anything they missed while overwhelmed.'
      ],
      correctIndex: 1,
      rationale: 'Flexible communication modes and built-in breaks are reasonable adjustments that protect focus and wellbeing.'
    },
    {
      scenario: 'A pupil is starting to flap their hands and pace before a test. They have practised a 60-second breathing reset in calmer moments.',
      options: [
        'Tell them to stop moving and sit still immediately so they look "ready".',
        'Offer the agreed 60-second reset with the breathing visualiser before starting the paper.',
        'Ignore it and begin the test so you do not lose time.'
      ],
      correctIndex: 1,
      rationale: 'Using a pre-agreed regulation tool before the test can lower anxiety and support performance without shame.'
    }
  ];

  function initRegulationMatchGame() {
    const container = document.querySelector('[data-game="regulation"]');
    if (!container) return;

    const scenarioEl = $('#regulationScenarioText');
    const optionsEl = $('#regulationOptions');
    const feedbackEl = $('#regulationFeedback');
    const scoreEl = $('#regulationScore');
    const totalEl = $('#regulationTotal');
    const nextBtn = $('#regulationNext');

    if (!scenarioEl || !optionsEl || !feedbackEl || !scoreEl || !totalEl || !nextBtn) {
      return;
    }

    let currentIndex = -1;
    let score = 0;
    let total = 0;

    function renderQuestion() {
      const idx = randomIndexExcluding(regulationQuestions.length, currentIndex);
      if (idx === -1) return;
      currentIndex = idx;
      const q = regulationQuestions[idx];

      container.classList.remove('autism-game--correct', 'autism-game--incorrect');
      scenarioEl.textContent = q.scenario;
      feedbackEl.textContent = '';
      optionsEl.innerHTML = '';

      q.options.forEach(function (optText, index) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'autism-game__btn';
        btn.textContent = optText;
        btn.setAttribute('data-option-index', String(index));
        btn.addEventListener('click', function () {
          handleAnswer(index);
        });
        optionsEl.appendChild(btn);
      });

      nextBtn.textContent = 'Start round';
    }

    function handleAnswer(index) {
      if (currentIndex === -1) {
        feedbackEl.textContent = 'Tap "Start round" to load a situation first.';
        return;
      }
      const q = regulationQuestions[currentIndex];
      total += 1;

      if (index === q.correctIndex) {
        score += 1;
        container.classList.remove('autism-game--incorrect');
        container.classList.add('autism-game--correct');
        feedbackEl.textContent = '✅ Correct: ' + q.rationale;
      } else {
        scoreEl.textContent = String(score);
        container.classList.remove('autism-game--correct');
        container.classList.add('autism-game--incorrect');
        feedbackEl.textContent = '⬇️ Another option protects energy and dignity more effectively. ' + q.rationale;
      }

      scoreEl.textContent = String(score);
      totalEl.textContent = String(total);
    }

    nextBtn.addEventListener('click', renderQuestion);
  }

  // ------------------------------
  // Initialise all autism games
  // ------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    initSensoryStoplightGame();
    initSupportScriptsGame();
    initRegulationMatchGame();
  });
})();(() => {
  const hero = document.getElementById('autism-hero');
  if (!hero) return;

  const root = window.__MSHARE__ || {};
  const Stats = root.Stats;
  const PAGE_ID = typeof root.pageId === 'string' ? root.pageId : '';

  const moduleMeta = { version: '1.1.0', locale: 'en-UK', brand: 'NeuroBreath' };
  const flows = [
    {
      id: 'comm',
      title: 'Communication booster',
      minutes: 5,
      steps: [
        { type: 'text', title: 'Warm-up', body: "Follow the child's lead. Mirror play for 30–60 seconds." },
        { type: 'multi-select', title: 'Targets', options: ['Request (more/help)', 'Choice (A/B)', 'Comment (look/uh-oh)', 'Social game (again!)'], saveAs: 'comm.targets' },
        { type: 'timer', seconds: 180, title: 'Play & model', body: 'Model 1–2 word phrases. Pause 5–10 s. Accept all attempts (speech/sign/AAC).' },
        { type: 'log', metric: 'attempts', title: 'Attempts today', saveAs: 'comm.attempts' },
        { type: 'text', title: 'Wrap', body: 'Celebrate. Snapshot: attempts = {{comm.attempts}}.' }
      ]
    },
    {
      id: 'abc',
      title: 'Behaviour: ABC coach',
      minutes: 6,
      steps: [
        { type: 'text', title: 'Pick one behaviour', body: 'Describe it in observable words.' },
        { type: 'abc', title: 'Record ABC', saveAs: 'abc.row' },
        { type: 'checklist', title: 'Teach replacement', items: ['Give simple way to ask (picture/word)', 'Reduce trigger (noise, unclear demand)', 'Reinforce calm/ask quickly'] },
        { type: 'log', metric: 'abc.count', title: 'Events today', saveAs: 'abc.count' }
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep routine',
      minutes: 5,
      steps: [
        { type: 'planner', title: 'Bed routine', body: 'Choose 3–4 calming steps (bath, book, music).', saveAs: 'sleep.plan' },
        { type: 'timer', seconds: 60, title: 'Lights down', body: 'Dim lights; no screens. Breathe slowly together.' },
        { type: 'survey', title: 'Latency last night', scale: [0, 120], unit: 'min', saveAs: 'sleep.latency' }
      ]
    },
    {
      id: 'sensory',
      title: 'Sensory regulation',
      minutes: 4,
      steps: [
        { type: 'picker', title: 'Need → tool', options: ['Noise→headphones', 'Movement→walk/trampoline', 'Deep pressure→weighted lap (if liked)'], saveAs: 'sens.pick' },
        { type: 'timer', seconds: 120, title: 'Do the tool', body: 'Stay curious about comfort; stop if disliked.' }
      ]
    }
  ];

  const downloadBase = 'https://files.mindpaylink.com/';
  const modulesKey = 'mshare_coach_modules_v1';
  const progressKey = 'mshare_coach_progress_v1';
  const speakKey = 'coach_speak';

  function pushEvent(payload) {
    if (!payload) return;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    } catch (_) {
      /* noop */
    }
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', payload.event || 'interaction', payload);
      }
    } catch (_) {
      /* noop */
    }
  }

  function toast(message, type = 'info') {
    if (!message) return;
    try {
      if (window.__MSHARE__ && typeof window.__MSHARE__.toast === 'function') {
        window.__MSHARE__.toast(message, type);
        return;
      }
    } catch (_) {
      /* fall back to DOM toast */
    }
    const host = document.getElementById('toast');
    if (!host) {
      console.log('[toast]', message);
      return;
    }
    const item = document.createElement('div');
    item.className = `toast toast-${type}`;
    item.textContent = message;
    item.setAttribute('role', 'status');
    host.appendChild(item);
    setTimeout(() => {
      item.remove();
    }, type === 'error' ? 6000 : 3000);
  }

  function toAbsoluteUrl(file) {
    if (!file) return null;
    const trimmed = file.trim();
    if (/^https?:/i.test(trimmed)) return trimmed;
    return downloadBase + encodeURI(trimmed.replace(/^\/+/, ''));
  }

  function loadModules() {
    try {
      const raw = localStorage.getItem(modulesKey);
      return raw ? JSON.parse(raw) || {} : {};
    } catch (_) {
      return {};
    }
  }

  function saveModules(mods) {
    try {
      localStorage.setItem(modulesKey, JSON.stringify(mods || {}));
    } catch (_) {
      /* noop */
    }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(progressKey);
      return raw ? JSON.parse(raw) || {} : {};
    } catch (_) {
      return {};
    }
  }

  function saveProgress(value) {
    try {
      localStorage.setItem(progressKey, JSON.stringify(value || {}));
    } catch (_) {
      /* noop */
    }
  }

  function setSpeakPreference(enabled) {
    try {
      localStorage.setItem(speakKey, enabled ? 'true' : 'false');
    } catch (_) {
      /* noop */
    }
  }

  function getSpeakPreference() {
    try {
      return localStorage.getItem(speakKey) === 'true';
    } catch (_) {
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const zipBtn = document.getElementById('downloadZipBtn');
  if (zipBtn && !zipBtn.dataset.nbWired) {
    const file = zipBtn.getAttribute('data-pdf');
    const url = toAbsoluteUrl(file);
    if (url) {
      zipBtn.setAttribute('href', url);
      if (file) zipBtn.setAttribute('download', file);
      zipBtn.dataset.href = url;
    } else {
      zipBtn.addEventListener('click', evt => {
        evt.preventDefault();
        toast('Download not available right now.', 'error');
      });
    }
    zipBtn.dataset.nbWired = '1';
  }

  const verifyBtn = document.getElementById('btnVerifyJson');
  const jsonLink = document.getElementById('downloadCoachJson');

  async function sha256Hex(buffer) {
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async function verifyCoachJson() {
    try {
      if (!jsonLink) {
        toast('JSON link not found.', 'error');
        return;
      }
      const expected = (jsonLink.getAttribute('data-checksum') || '').trim().toLowerCase();
      const response = await fetch(jsonLink.getAttribute('href'), { cache: 'no-store' });
      if (!response.ok) throw new Error(`Network error ${response.status}`);
      const buffer = await response.arrayBuffer();
      const actual = await sha256Hex(buffer);
      if (expected && actual === expected) {
        toast('JSON verified ✓ (checksum matches).');
        pushEvent({ event: 'verify', type: 'json', label: 'autism-coach', result: 'ok' });
      } else {
        toast('Checksum mismatch. Please re-download or contact support.', 'error');
        pushEvent({ event: 'verify', type: 'json', label: 'autism-coach', result: 'mismatch' });
      }
    } catch (err) {
      toast(`Verification failed: ${err && err.message ? err.message : 'unknown error'}`, 'error');
      pushEvent({ event: 'verify', type: 'json', label: 'autism-coach', result: 'error' });
    }
  }

  if (verifyBtn && !verifyBtn.dataset.nbWired) {
    verifyBtn.addEventListener('click', verifyCoachJson);
    verifyBtn.dataset.nbWired = '1';
  }

  const previewBtn = document.getElementById('btnPreviewFlows');
  const clearBtn = document.getElementById('btnClearPreview');
  const previewSelect = document.getElementById('flowPick');
  const jsonPreview = document.getElementById('jsonPreview');
  const flowSteps = document.getElementById('flowSteps');
  const flowTitle = document.getElementById('flowTitle');
  const copyBtn = document.getElementById('btnCopyJson');
  const toggleStepsBtn = document.getElementById('btnToggleSteps');
  const flowViewer = document.getElementById('flowViewer');
  const quickPreviewButtons = Array.from(document.querySelectorAll('[data-flow-preview]'));
  const quickStartButtons = Array.from(document.querySelectorAll('[data-flow-start]'));

  let viewerFlows = [];
  let stepsVisible = false;

  function prettyJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (err) {
      return String(value || '');
    }
  }

  function setStepsVisibility(visible) {
    stepsVisible = !!visible;
    if (!flowSteps) return;
    if (stepsVisible) flowSteps.removeAttribute('hidden');
    else flowSteps.setAttribute('hidden', '');
    if (toggleStepsBtn) toggleStepsBtn.setAttribute('aria-expanded', stepsVisible ? 'true' : 'false');
  }

  function populatePreviewSelect(source) {
    if (!previewSelect) return;
    const options = source
      .map(flow => `<option value="${escapeHtml(flow.id)}">${escapeHtml(flow.title || flow.id)}</option>`)
      .join('');
    previewSelect.innerHTML = `<option value="">Choose...</option>${options}`;
  }

  function refreshStepsList(flow) {
    if (!flowSteps) return;
    flowSteps.innerHTML = '';
    if (!flow || !Array.isArray(flow.steps)) {
      setStepsVisibility(false);
      return;
    }
    const list = document.createElement('ol');
    list.className = 'flow-step-list';
    flow.steps.forEach((step, index) => {
      const item = document.createElement('li');
      const title = step.title || `Step ${index + 1}`;
      const suffix = step.body ? ` - ${step.body}` : '';
      item.innerHTML = `<strong>${escapeHtml(title)}</strong>${escapeHtml(suffix)}`;
      list.appendChild(item);
    });
    flowSteps.appendChild(list);
    setStepsVisibility(stepsVisible && flow.steps.length > 0);
  }

  function updateFlowPreview() {
    if (!previewSelect || !jsonPreview) return;
    const selected = viewerFlows.find(flow => String(flow.id) === previewSelect.value);
    if (!selected) {
      jsonPreview.textContent = '';
      if (flowTitle) flowTitle.textContent = 'Flow';
      refreshStepsList(null);
      return;
    }
    jsonPreview.textContent = prettyJson(selected);
    if (flowTitle) flowTitle.textContent = selected.title || selected.id;
    refreshStepsList(selected);
  }

  function ensureViewerFlows() {
    viewerFlows = availableFlows();
    populatePreviewSelect(viewerFlows);
    if (previewBtn) previewBtn.setAttribute('aria-expanded', 'true');
  }

  function previewFlow(flowId) {
    if (!previewSelect) return;
    if (!viewerFlows.length) ensureViewerFlows();
    if (!viewerFlows.length) return;
    previewSelect.value = flowId || '';
    updateFlowPreview();
    previewSelect.focus();
    pushEvent({ event: 'flow_preview_select', id: flowId || '' });
  }

  if (previewBtn && !previewBtn.dataset.nbWired) {
    previewBtn.addEventListener('click', () => {
      ensureViewerFlows();
      setStepsVisibility(false);
      updateFlowPreview();
      toast('Flows loaded. Choose a flow to preview.');
    });
    previewBtn.dataset.nbWired = '1';
  }

  if (clearBtn && !clearBtn.dataset.nbWired) {
    clearBtn.addEventListener('click', () => {
      viewerFlows = [];
      if (previewSelect) previewSelect.innerHTML = '';
      if (jsonPreview) jsonPreview.textContent = '';
      if (flowTitle) flowTitle.textContent = 'Flow';
      refreshStepsList(null);
      setStepsVisibility(false);
      if (previewBtn) previewBtn.setAttribute('aria-expanded', 'false');
    });
    clearBtn.dataset.nbWired = '1';
  }

  if (previewSelect) {
    previewSelect.addEventListener('change', () => {
      updateFlowPreview();
    });
  }

  if (copyBtn && !copyBtn.dataset.nbWired) {
    copyBtn.addEventListener('click', async () => {
      try {
        const text = jsonPreview ? jsonPreview.textContent || '' : '';
        if (!text.trim()) {
          toast('Nothing to copy yet.', 'error');
          return;
        }
        await navigator.clipboard.writeText(text);
        toast('JSON copied to clipboard.');
        pushEvent({ event: 'flow_json_copy' });
      } catch (err) {
        toast('Copy failed.', 'error');
      }
    });
    copyBtn.dataset.nbWired = '1';
  }

  if (toggleStepsBtn && !toggleStepsBtn.dataset.nbWired) {
    toggleStepsBtn.addEventListener('click', () => {
      setStepsVisibility(!stepsVisible);
    });
    toggleStepsBtn.dataset.nbWired = '1';
  }

  if (flowViewer && !flowViewer.dataset.nbWired) {
    flowViewer.addEventListener('keydown', event => {
      if ((event.key || '').toLowerCase() === 'f') {
        event.preventDefault();
        previewSelect?.focus();
      }
    });
    flowViewer.dataset.nbWired = '1';
  }

  quickPreviewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const flowId = button.getAttribute('data-flow-preview');
      previewFlow(flowId);
    });
  });

  const addBtn = document.getElementById('btnAddCoach');
  if (addBtn && !addBtn.dataset.nbWired) {
    addBtn.addEventListener('click', () => {
      const modules = loadModules();
      modules.autism = {
        id: 'autism',
        name: 'Autism Coach',
        version: moduleMeta.version,
        flows,
        addedAt: Date.now()
      };
      saveModules(modules);
      toast('Autism Coach added to your app.');
      pushEvent({ event: 'coach_added', id: 'autism' });
    });
    addBtn.dataset.nbWired = '1';
  }

  const openBtn = document.getElementById('btnOpenCoach');
  const runner = document.getElementById('coachRunner');
  const runnerDialog = document.getElementById('coachRunnerDialog');
  const runnerClose = document.getElementById('coachRunnerClose');
  const runnerBackdrop = document.getElementById('coachRunnerBackdrop');
  const coachSelect = document.getElementById('coachFlowPick');
  const stepHost = document.getElementById('coachStepHost');
  const btnPrev = document.getElementById('coachPrev');
  const btnNext = document.getElementById('coachNext');
  const btnStart = document.getElementById('coachStart');
  const timerLabel = document.getElementById('coachTimerLabel');
  const speakToggle = document.getElementById('coachSpeak');

  if (!openBtn || !runner || !coachSelect || !stepHost || !btnPrev || !btnNext || !btnStart) {
    return;
  }

  const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const VoicePrefs = window.NeurobreathVoicePreferences || null;

  function normalizeCoachProfile(value){
    if (value === 'female') return 'female';
    if (value === 'male') return 'male';
    return 'uk-male';
  }

  let coachVoiceProfile = normalizeCoachProfile(
    (VoicePrefs && typeof VoicePrefs.get === 'function' && VoicePrefs.get()) ||
    (VoicePrefs && typeof VoicePrefs.getDefault === 'function' && VoicePrefs.getDefault()) ||
    'uk-male'
  );

  const maleVoiceHints = [/google uk english male/i, /microsoft george/i, /microsoft ryan/i, /microsoft guy/i, /daniel/i, /brian/i, /arthur/i];
  const femaleVoiceHints = [/female/i, /hazel/i, /sonia/i, /libby/i, /serena/i, /kate/i, /victoria/i, /emma/i];
  let preferredCoachVoice = null;
  let coachVoiceHooked = false;

  if (VoicePrefs && typeof VoicePrefs.subscribe === 'function'){
    VoicePrefs.subscribe(value => {
      coachVoiceProfile = normalizeCoachProfile(value);
      preferredCoachVoice = null;
      if (supportsSpeech){
        try{ window.speechSynthesis.cancel(); }catch{}
      }
    });
  }

  function pickCoachVoice(voices){
    if (!Array.isArray(voices) || !voices.length) return null;
    const gender = coachVoiceProfile === 'female' ? 'female' : 'male';
    const preferGb = coachVoiceProfile !== 'male';
    const hints = gender === 'female' ? femaleVoiceHints : maleVoiceHints;
    const lowerLang = voice => (voice.lang || '').toLowerCase();

    if (preferGb){
      const gbVoices = voices.filter(v => lowerLang(v).startsWith('en-gb'));
      const gbHit = gbVoices.find(v => hints.some(pattern => pattern.test(v.name)));
      if (gbHit) return gbHit;
      if (gbVoices[0]) return gbVoices[0];
    }

    const enVoices = voices.filter(v => /^en-/i.test(v.lang || ''));
    const enHit = enVoices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (enHit) return enHit;
    if (enVoices[0]) return enVoices[0];

    const anyHit = voices.find(v => hints.some(pattern => pattern.test(v.name)));
    if (anyHit) return anyHit;
    return voices[0] || null;
  }

  function ensureCoachVoice(){
    if (!supportsSpeech) return null;
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices();
    if (voices.length){
      preferredCoachVoice = pickCoachVoice(voices) || preferredCoachVoice;
      return preferredCoachVoice;
    }
    if (!coachVoiceHooked){
      coachVoiceHooked = true;
      const handler = () => {
        const updated = synth.getVoices();
        if (updated.length){
          preferredCoachVoice = pickCoachVoice(updated) || preferredCoachVoice;
        }
      };
      if (typeof synth.addEventListener === 'function'){
        synth.addEventListener('voiceschanged', handler);
      } else if ('onvoiceschanged' in synth){
        synth.onvoiceschanged = handler;
      }
    }
    return preferredCoachVoice;
  }

  if (runnerDialog && !runnerDialog.hasAttribute('tabindex')) {
    runnerDialog.setAttribute('tabindex', '-1');
  }

  let timerId = null;
  let startTimestamp = 0;
  let currentFlow = null;
  let stepIndex = -1;
  let runState = {};

  function availableFlows() {
    const modules = loadModules();
    const stored = modules.autism && Array.isArray(modules.autism.flows) ? modules.autism.flows : null;
    return stored && stored.length ? stored : flows;
  }

  function populateCoachSelect(source) {
    const options = source
      .map(flow => `<option value="${escapeHtml(flow.id)}">${escapeHtml(flow.title || flow.id)}</option>`)
      .join('');
  coachSelect.innerHTML = `<option value="">Choose a flow...</option>${options}`;
  }

  function saveProgressSnapshot() {
    const snapshot = loadProgress();
    if (stepIndex >= 0 && currentFlow) {
      snapshot.autism = { flowId: currentFlow.id, stepIndex };
    } else {
      delete snapshot.autism;
    }
    saveProgress(snapshot);
  }

  function speakStep(step) {
    try {
      if (!speakToggle || !speakToggle.checked || !supportsSpeech) return;
      const utterance = new SpeechSynthesisUtterance();
      const parts = [];
      if (step.title) parts.push(String(step.title));
      if (step.body) parts.push(String(step.body));
      utterance.text = parts.join('. ');
      const voice = ensureCoachVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = (voice && voice.lang) || 'en-GB';
      utterance.rate = 0.96;
      utterance.pitch = coachVoiceProfile === 'female' ? 1.08 : 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      /* speech optional */
    }
  }

  function renderTimer(seconds) {
    if (timerId) clearInterval(timerId);
    let remaining = Number(seconds) || 0;
    const timerEl = document.getElementById('coachTimer');
    if (!timerEl) return;
  timerLabel.textContent = 'Running...';
    timerEl.textContent = `${Math.max(0, remaining)}s`;
    timerId = window.setInterval(() => {
      remaining -= 1;
      if (timerEl) timerEl.textContent = `${Math.max(0, remaining)}s`;
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        timerLabel.textContent = 'Done';
      }
    }, 1000);
  }

  function readStepData(step) {
    if (!step) return;
    const key = step.saveAs || `${currentFlow.id}:${stepIndex}`;
    let value = null;
    switch (step.type) {
      case 'multi-select':
      case 'checklist': {
        const checks = Array.from(stepHost.querySelectorAll('input[type="checkbox"]'));
        value = checks.filter(box => box.checked).map(box => box.parentElement.textContent.trim());
        break;
      }
      case 'picker': {
        const select = stepHost.querySelector('select');
        value = select ? select.value : null;
        break;
      }
      case 'log':
      case 'survey': {
        const input = stepHost.querySelector('input[type="number"]');
        value = input ? Number(input.value || 0) : 0;
        break;
      }
      case 'abc': {
        value = {
          A: (stepHost.querySelector('#abcA') || {}).value || '',
          B: (stepHost.querySelector('#abcB') || {}).value || '',
          C: (stepHost.querySelector('#abcC') || {}).value || ''
        };
        break;
      }
      case 'planner': {
        const textarea = stepHost.querySelector('textarea');
        value = textarea ? textarea.value : '';
        break;
      }
      default:
        value = null;
    }
    runState[key] = value;
  }

  function renderStep() {
    const steps = currentFlow?.steps || [];
    if (stepIndex < 0 || stepIndex >= steps.length) {
      finishRun();
      return;
    }
    const step = steps[stepIndex];
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerLabel.textContent = '';
    const title = escapeHtml(step.title || `Step ${stepIndex + 1}`);
    let html = `<h4 class="flow-step-title">${title}</h4>`;
    if (step.body) {
      html += `<p class="muted">${escapeHtml(step.body)}</p>`;
    }
    switch (step.type) {
      case 'timer': {
        const secs = Number(step.seconds) || 0;
        html += `<div class="input-row"><strong>Timer:</strong> <span id="coachTimer">${secs}s</span></div>`;
        break;
      }
      case 'multi-select':
      case 'checklist': {
        const items = (step.options || step.items || []).map((item, idx) => {
          return `<label class="btn"><input type="checkbox" data-idx="${idx}"> ${escapeHtml(item)}</label>`;
        }).join('');
        html += `<div class="kv-grid">${items}</div>`;
        break;
      }
      case 'picker': {
        const options = (step.options || []).map(item => `<option>${escapeHtml(item)}</option>`).join('');
        html += `<div class="input-row"><select id="coachPick">${options}</select></div>`;
        break;
      }
      case 'log':
      case 'survey': {
        html += '<div class="input-row"><label>Value <input type="number" id="coachValue" min="0" step="1"></label></div>';
        break;
      }
      case 'abc': {
        html += '<div class="kv-grid">' +
          '<textarea rows="2" id="abcA" placeholder="Antecedent (what happened before)"></textarea>' +
          '<textarea rows="2" id="abcB" placeholder="Behaviour (what we saw)"></textarea>' +
          '<textarea rows="2" id="abcC" placeholder="Consequence (what followed)"></textarea>' +
          '</div>';
        break;
      }
      case 'planner': {
        html += '<div class="input-row"><textarea rows="3" id="coachPlan" placeholder="List bedtime steps"></textarea></div>';
        break;
      }
      default:
        break;
    }
    stepHost.innerHTML = html;
    btnPrev.disabled = stepIndex <= 0;
    btnNext.disabled = false;
    btnStart.disabled = true;
    if (step.type === 'timer') {
      renderTimer(step.seconds);
    }
    speakStep(step);
    saveProgressSnapshot();
  }

  function resetRunnerUi(message) {
    stepHost.innerHTML = `<p class="muted">${escapeHtml(message)}</p>`;
    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnStart.disabled = false;
    timerLabel.textContent = '';
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function openRunner(requestedId) {
    const source = availableFlows();
    if (!source.length) {
      toast('Coach not available.', 'error');
      return;
    }
    populateCoachSelect(source);
    currentFlow = null;
    const progress = loadProgress().autism || null;
    if (requestedId) {
      const match = source.find(flow => String(flow.id) === String(requestedId));
      if (match) {
        currentFlow = match;
        stepIndex = -1;
      }
    }
    if (!requestedId && progress) {
      const saved = source.find(flow => String(flow.id) === String(progress.flowId));
      if (saved) {
        currentFlow = saved;
        stepIndex = Number.isFinite(progress.stepIndex) ? Number(progress.stepIndex) : -1;
      }
    }
    if (!currentFlow) {
      currentFlow = source[0];
      stepIndex = -1;
    }
    coachSelect.value = currentFlow ? String(currentFlow.id) : '';
    runState = {};
    startTimestamp = 0;
    btnStart.textContent = stepIndex >= 0 ? 'Resume' : 'Start';
    resetRunnerUi(`Press ${btnStart.textContent} to begin.`);
    if (speakToggle) speakToggle.checked = getSpeakPreference();
    runner.hidden = false;
    runner.setAttribute('aria-hidden', 'false');
    pushEvent({ event: 'coach_opened', id: 'autism' });
    runnerDialog?.focus?.();
  }

  function closeRunner() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    runner.hidden = true;
    runner.setAttribute('aria-hidden', 'true');
  }

  function startRun() {
    if (!currentFlow) return;
    if (stepIndex < 0) stepIndex = 0;
    startTimestamp = Date.now();
    runState = {};
    renderStep();
  }

  function nextStep() {
    const steps = currentFlow?.steps || [];
    if (!steps.length) return;
    readStepData(steps[stepIndex]);
    if (stepIndex < steps.length - 1) {
      stepIndex += 1;
      renderStep();
    } else {
      finishRun();
    }
  }

  function prevStep() {
    if (stepIndex <= 0) return;
    stepIndex -= 1;
    renderStep();
  }

  function finishRun() {
    if (!currentFlow) {
      closeRunner();
      return;
    }
    const elapsed = startTimestamp ? Math.max(1, Math.round((Date.now() - startTimestamp) / 1000)) : 0;
    try {
      if (Stats && typeof Stats.addSession === 'function') {
        Stats.addSession({ techId: `autism:${currentFlow.id}`, seconds: elapsed, breaths: 0, pageId: PAGE_ID });
      }
    } catch (_) {
      /* ignore */
    }
    const snapshot = loadProgress();
    delete snapshot.autism;
    saveProgress(snapshot);
    toast('Session saved to your progress.');
    pushEvent({ event: 'coach_complete', id: currentFlow.id, seconds: elapsed });
    closeRunner();
  }

  function onFlowChange() {
  const source = availableFlows();
  const chosen = source.find(flow => String(flow.id) === coachSelect.value);
    currentFlow = chosen || source[0] || null;
    stepIndex = -1;
    runState = {};
    btnStart.textContent = 'Start';
    resetRunnerUi('Press Start to begin.');
    saveProgressSnapshot();
  }

  if (openBtn && !openBtn.dataset.nbWired) {
    openBtn.addEventListener('click', () => openRunner());
    openBtn.dataset.nbWired = '1';
  }

  if (runnerClose) runnerClose.addEventListener('click', closeRunner);
  if (runnerBackdrop) runnerBackdrop.addEventListener('click', event => {
    if (event.target === runnerBackdrop) closeRunner();
  });

  coachSelect.addEventListener('change', onFlowChange);
  btnStart.addEventListener('click', startRun);
  btnNext.addEventListener('click', nextStep);
  btnPrev.addEventListener('click', prevStep);

  if (speakToggle) {
    speakToggle.addEventListener('change', () => {
      setSpeakPreference(!!speakToggle.checked);
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && runner && !runner.hidden) {
      closeRunner();
    }
  });

  populateCoachSelect(availableFlows());
  resetRunnerUi('Press Start to begin.');

  quickStartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const flowId = button.getAttribute('data-flow-start');
      openRunner(flowId || undefined);
      pushEvent({ event: 'coach_quick_start', id: flowId || '' });
    });
  });
})();
