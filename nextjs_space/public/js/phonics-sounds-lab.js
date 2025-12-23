(() => {
  'use strict';

  const LETTER_TIMINGS = {
    intro: { start: 0, end: 7.9 },
    letters: [
      { letter: 'A', start: 7.9, callEnd: 10.74, repeatStart: 11.36, repeatEnd: 13.12, end: 15.26 },
      { letter: 'B', start: 15.26, callEnd: 17.9, repeatStart: 18.22, repeatEnd: 19.94, end: 21.82 },
      { letter: 'C', start: 21.82, callEnd: 24.48, repeatStart: 25.06, repeatEnd: 26.44, end: 27.88 },
      { letter: 'D', start: 27.88, callEnd: 30.4, repeatStart: 30.88, repeatEnd: 32.42, end: 33.78 },
      { letter: 'E', start: 33.78, callEnd: 36.44, repeatStart: 37.24, repeatEnd: 38.54, end: 40.08 },
      { letter: 'F', start: 40.08, callEnd: 42.58, repeatStart: 43.18, repeatEnd: 44.58, end: 62.38, milestoneEnd: 55 },
      { letter: 'G', start: 62.38, callEnd: 65.02, repeatStart: 65.42, repeatEnd: 68.12, end: 68.3 },
      { letter: 'H', start: 68.3, callEnd: 71.04, repeatStart: 71.62, repeatEnd: 73.08, end: 74.4 },
      { letter: 'I', start: 74.4, callEnd: 77.22, repeatStart: 77.62, repeatEnd: 79.28, end: 80.5 },
      { letter: 'J', start: 80.5, callEnd: 83.32, repeatStart: 83.92, repeatEnd: 85.36, end: 86.76 },
      { letter: 'K', start: 86.76, callEnd: 89.1, repeatStart: 89.64, repeatEnd: 91.1, end: 92.54 },
      { letter: 'L', start: 92.54, callEnd: 94.84, repeatStart: 95.48, repeatEnd: 97, end: 114.72, milestoneEnd: 107.02 },
      { letter: 'M', start: 114.72, callEnd: 117.44, repeatStart: 118.14, repeatEnd: 119.6, end: 120.98 },
      { letter: 'N', start: 120.98, callEnd: 123.56, repeatStart: 124.32, repeatEnd: 125.76, end: 127.4 },
      { letter: 'O', start: 127.4, callEnd: 129.88, repeatStart: 130.36, repeatEnd: 131.96, end: 133.12 },
      { letter: 'P', start: 133.12, callEnd: 135.54, repeatStart: 136.18, repeatEnd: 137.38, end: 138.54 },
      { letter: 'Q', start: 138.54, callEnd: 141, repeatStart: 141.56, repeatEnd: 143.06, end: 144.52 },
      { letter: 'R', start: 144.52, callEnd: 147.48, repeatStart: 148, repeatEnd: 149.88, end: 167.88, milestoneEnd: 160.02 },
      { letter: 'S', start: 167.88, callEnd: 170.4, repeatStart: 170.9, repeatEnd: 172.48, end: 173.6 },
      { letter: 'T', start: 173.6, callEnd: 176.12, repeatStart: 176.8, repeatEnd: 178.2, end: 179.48 },
      { letter: 'U', start: 179.48, callEnd: 182.04, repeatStart: 182.7, repeatEnd: 184.26, end: 185.36 },
      { letter: 'V', start: 185.36, callEnd: 188, repeatStart: 188.6, repeatEnd: 190.06, end: 190.92 },
      { letter: 'W', start: 190.92, callEnd: 193.68, repeatStart: 194.06, repeatEnd: 195.74, end: 196.74 },
      { letter: 'X', start: 196.74, callEnd: 199.2, repeatStart: 199.76, repeatEnd: 201.12, end: 202.26 },
      { letter: 'Y', start: 202.26, callEnd: 204.82, repeatStart: 205.42, repeatEnd: 206.96, end: 208.06 },
      { letter: 'Z', start: 208.06, callEnd: 210.52, repeatStart: 211.18, repeatEnd: 212.64, end: 225.8, milestoneEnd: 225.08 }
    ]
  };

  const MILESTONES = [
    {
      id: 'bronze',
      label: 'Bronze breath break achieved',
      letters: 'A–F',
      triggerLetter: 'F',
      seconds: 10,
      body: 'You just wrapped the A–F repeats with perfect pacing. Hold this bronze pause for a sip of air, then tap Continue to glide into the G–L crew.'
    },
    {
      id: 'silver',
      label: 'Silver sound sweep complete',
      letters: 'G–L',
      triggerLetter: 'L',
      seconds: 10,
      body: 'Beautiful focus through the G–L set. Take this silver pause for ten calm seconds of breathing, then tap Continue to meet the M–R team.'
    },
    {
      id: 'gold',
      label: 'Gold glide mastered',
      letters: 'M–R',
      triggerLetter: 'R',
      seconds: 10,
      body: 'You’ve moved through M–R with smooth, steady sound work. Hold this gold pause, breathe out slowly, then tap Continue to glide into the final S–Z stretch.'
    },
    {
      id: 'platinum',
      label: 'Platinum phoneme circuit',
      letters: 'S–Z',
      triggerLetter: 'Z',
      seconds: 12,
      body: 'Full alphabet circuit complete — S through Z sounded with calm control. Enjoy this platinum spotlight, then decide if you’d like to claim an official NeuroBreath certificate.'
    }
  ];

  const HEAD_VARIANTS = ['sunrise', 'onyx', 'neon', 'aurora'];
  const LETTER_CALL_HEADROOM = 0.18;

  const getLetterCompletionTime = info => {
    if (!info) return null;
    if (typeof info.milestoneEnd === 'number') return info.milestoneEnd;
    if (typeof info.repeatEnd === 'number') return info.repeatEnd;
    if (typeof info.callEnd === 'number') return info.callEnd;
    return typeof info.end === 'number' ? info.end : null;
  };

  const letterTimingList = LETTER_TIMINGS.letters;
  const fallbackDuration = letterTimingList[letterTimingList.length - 1]?.end || 0;

  const formatTime = seconds => {
    const clamped = Math.max(0, seconds);
    const m = Math.floor(clamped / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(clamped % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const findLetterIndexForTime = currentTime => {
    for (let i = 0; i < letterTimingList.length; i += 1) {
      const info = letterTimingList[i];
      if (currentTime >= info.start && currentTime < info.end) return i;
    }
    return letterTimingList.length - 1;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('dlxLetterSoundScreen');
    if (!screen) return;

    const openBtn = document.getElementById('openPhonicsBtn') || document.getElementById('dlxLetterSoundsBtn');
    const panel = screen.querySelector('.dlx-letter-sound-panel');
    const closeElements = screen.querySelectorAll('[data-letter-sound-close]');
    const startBtn = document.getElementById('dlxLetterSoundStart');
    const pauseBtn = document.getElementById('dlxLetterSoundPause');
    const restartBtn = document.getElementById('dlxLetterSoundRestart');
    const randomHeadBtn = document.getElementById('dlxLetterSoundRandomHead');
    const progressEl = document.getElementById('dlxLetterSoundProgress');
    const timeEl = document.getElementById('dlxLetterSoundTime');
    const audio = document.getElementById('dlxLetterSoundAudio');
    const mouthHead = document.getElementById('dlxMouthHead');
    const mouthLetter = document.getElementById('dlxMouthLetter');
    const mouthWord = document.getElementById('dlxMouthWord');
    const mouthTip = document.getElementById('dlxMouthTip');
    const grid = document.getElementById('dlxLetterSoundGrid');
    const chips = grid ? Array.from(grid.querySelectorAll('.dlx-letter-sound-chip')) : [];
    const celebration = document.getElementById('dlxLetterSoundCelebration');
    const celebrationTitle = document.getElementById('dlxLetterSoundCelebrationTitle');
    const celebrationBody = document.getElementById('dlxLetterSoundCelebrationBody');
    const celebrationClock = document.getElementById('dlxLetterSoundCelebrationClock');
    const celebrationClockValue = document.getElementById('dlxLetterSoundCelebrationClockValue');
    const celebrationTimer = document.getElementById('dlxLetterSoundCelebrationTimer');
    const celebrationPrompt = document.getElementById('dlxLetterSoundCelebrationPrompt');
    const continueBtn = document.getElementById('dlxLetterSoundContinue');
    const closeCelebrationBtn = document.getElementById('dlxLetterSoundCloseCelebration');
    const buzz = document.getElementById('dlxLetterSoundBuzz');
    const buzzLabel = document.getElementById('dlxLetterSoundBuzzLabel');
    const buzzLetter = document.getElementById('dlxLetterSoundBuzzLetter');
    const buzzTip = document.getElementById('dlxLetterSoundBuzzTip');
    const certificateBlock = document.getElementById('dlxLetterSoundCertificate');
    const certForm = document.getElementById('dlxLetterSoundCertificateForm');
    const certPreview = document.getElementById('dlxLetterSoundCertificatePreview');
    const certAwardee = document.getElementById('dlxCertificateAwardee');
    const certMedal = document.getElementById('dlxCertificateMedal');
    const certMessage = document.getElementById('dlxCertificateMessage');
    const certId = document.getElementById('dlxCertificateId');
    const certIssued = document.getElementById('dlxCertificateIssued');
    const certPrintBtn = document.getElementById('dlxCertificatePrintBtn');
    const certEditBtn = document.getElementById('dlxCertificateEditBtn');
    const certCloseBtn = document.getElementById('dlxCertificateCloseBtn');
    const certPrintSurface = document.getElementById('dlxCertificatePrintSurface');
    const certPrintPortal = document.getElementById('dlxCertificatePrintPortal');

    if (!audio) return;

    let countdownInterval = null;
    let countdownSeconds = 0;
    let currentMilestoneIndex = 0;
    let lastLetterIndex = -1;
    let isPlatinumCertificateMode = false;
    let pendingResumeTime = null;
    let pendingResumeLetterIndex = null;
    let didActivatePrintPortal = false;

    const setCertificateActionState = hasPreview => {
      const enable = Boolean(hasPreview);
      if (certPrintBtn) {
        certPrintBtn.disabled = !enable;
        certPrintBtn.setAttribute('aria-disabled', enable ? 'false' : 'true');
      }
      if (certEditBtn) {
        certEditBtn.hidden = !enable;
      }
    };

    const mountCertificatePrintClone = () => {
      if (!certPrintPortal || !certPrintSurface) return false;
      certPrintPortal.innerHTML = '';
      const clone = certPrintSurface.cloneNode(true);
      clone.id = 'dlxCertificatePrintSurfacePrint';
      certPrintPortal.appendChild(clone);
      return true;
    };

    const clearCertificatePrintClone = () => {
      if (certPrintPortal) {
        certPrintPortal.innerHTML = '';
      }
    };

    const prepareCertificatePrint = () => {
      if (!certPreview || certPreview.hidden) return false;
      if (!mountCertificatePrintClone()) return false;
      document.body.classList.add('printing-certificate');
      didActivatePrintPortal = true;
      return true;
    };

    const cleanupCertificatePrint = () => {
      if (didActivatePrintPortal) {
        document.body.classList.remove('printing-certificate');
        didActivatePrintPortal = false;
      }
      clearCertificatePrintClone();
    };

    setCertificateActionState(false);

    const clearPendingResumeTarget = () => {
      pendingResumeTime = null;
      pendingResumeLetterIndex = null;
    };

    const setPendingResumeTargetFromIndex = index => {
      if (typeof index !== 'number' || index < 0) {
        clearPendingResumeTarget();
        return;
      }
      const nextLetter = letterTimingList[index + 1];
      if (nextLetter) {
        pendingResumeTime = nextLetter.start;
        pendingResumeLetterIndex = index + 1;
      } else {
        const fallback = letterTimingList[index];
        pendingResumeTime = fallback?.end ?? audio.duration ?? fallbackDuration;
        pendingResumeLetterIndex = letterTimingList.length - 1;
      }
    };

    const resetCountdown = () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    };

    const openScreen = () => {
      screen.removeAttribute('hidden');
      screen.setAttribute('aria-hidden', 'false');
      audio.pause();
      audio.currentTime = 0;
      currentMilestoneIndex = 0;
      lastLetterIndex = -1;
      resetCelebration();
      updateUIForTime();
    };

    const closeScreen = () => {
      screen.setAttribute('hidden', 'hidden');
      screen.setAttribute('aria-hidden', 'true');
      audio.pause();
      resetCelebration();
    };

    const activateChip = letter => {
      chips.forEach(chip => {
        const isActive = chip.dataset.letterSoundChip === letter;
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    };

    const updateMouthForLetter = (letterObj, currentTime) => {
      if (!letterObj) return;
      const { letter, start, callEnd, repeatStart, repeatEnd, end } = letterObj;
      mouthHead?.setAttribute('data-letter', letter);
      if (mouthLetter) mouthLetter.textContent = `${letter} / ${letter.toLowerCase()}`;
      if (mouthWord) mouthWord.textContent = 'Focus on the main sound of this letter.';

      let phase = 'rest';
      if (currentTime >= start && currentTime < callEnd) {
        phase = 'call';
        if (mouthTip) mouthTip.textContent = 'Listen to Coach Dorothy say the sound once.';
      } else if (repeatStart !== null && repeatStart !== undefined && currentTime >= repeatStart && currentTime < (repeatEnd ?? end)) {
        phase = 'repeat';
        if (mouthTip) mouthTip.textContent = 'Breathe out gently and repeat the sound with her.';
      } else if (mouthTip) {
        mouthTip.textContent = 'Stay relaxed and wait for the next letter.';
      }
      mouthHead?.setAttribute('data-mouth-phase', phase);
    };

    const updateUIForTime = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || fallbackDuration;
      if (progressEl && duration) {
        progressEl.value = Math.round((currentTime / duration) * 1000);
      }
      if (timeEl) timeEl.textContent = formatTime(currentTime);

      const idx = findLetterIndexForTime(currentTime);
      if (idx !== lastLetterIndex && idx >= 0) {
        lastLetterIndex = idx;
        const letterObj = letterTimingList[idx];
        activateChip(letterObj.letter);
        updateMouthForLetter(letterObj, currentTime);
      } else if (idx >= 0) {
        updateMouthForLetter(letterTimingList[idx], currentTime);
      }

      checkMilestones(currentTime);
    };

    const setBuzzVisibility = isVisible => {
      if (!buzz) return;
      if (isVisible) {
        buzz.removeAttribute('hidden');
        buzz.classList.add('is-visible');
      } else {
        buzz.classList.remove('is-visible');
        buzz.setAttribute('hidden', 'hidden');
      }
    };

    const resetCelebration = (options = {}) => {
      const keepResumeTarget = Boolean(options.keepResumeTarget);
      const keepCertificate = Boolean(options.keepCertificate);
      if (celebration) {
        celebration.classList.remove('is-visible');
        celebration.setAttribute('hidden', 'hidden');
        celebration.dataset.state = 'idle';
      }
      panel?.classList.remove('is-celebrating');
      if (!keepCertificate) {
        panel?.classList.remove('is-certificate-mode');
        certificateBlock?.classList.remove('is-visible');
        if (certPreview) certPreview.hidden = true;
        setCertificateActionState(false);
      }
      setBuzzVisibility(false);
      if (continueBtn) continueBtn.disabled = true;
      resetCountdown();
      isPlatinumCertificateMode = false;
      if (!keepResumeTarget) {
        clearPendingResumeTarget();
      }
    };

    const updateCountdownUI = milestone => {
      if (!celebrationClockValue || !celebrationClock) return;
      celebrationClockValue.textContent = countdownSeconds.toString();
      const total = milestone.seconds || 1;
      const ratio = total ? (total - countdownSeconds) / total : 1;
      celebrationClock.style.setProperty('--clock-progress', `${Math.min(1, Math.max(0, ratio)) * 360}deg`);
    };

    const startCountdown = milestone => {
      resetCountdown();
      countdownSeconds = milestone.seconds;
      updateCountdownUI(milestone);
      countdownInterval = window.setInterval(() => {
        countdownSeconds -= 1;
        if (countdownSeconds <= 0) {
          countdownSeconds = 0;
          resetCountdown();
          if (celebrationTimer) celebrationTimer.textContent = 'Pause finished — tap Continue when you are ready.';
          if (continueBtn) continueBtn.disabled = false;
        }
        updateCountdownUI(milestone);
        if (celebrationTimer && countdownSeconds > 0) {
          celebrationTimer.textContent = `Celebration pause: ${countdownSeconds} seconds of calm breathing.`;
        }
      }, 1000);
    };

    const showMilestone = (milestone, letterIndex) => {
      const letterObj = typeof letterIndex === 'number' ? letterTimingList[letterIndex] : null;
      const completionTime = getLetterCompletionTime(letterObj);
      if (typeof completionTime === 'number') {
        audio.currentTime = completionTime;
      }
      audio.pause();
      panel?.classList.add('is-celebrating');
      celebration?.classList.add('is-visible');
      celebration?.removeAttribute('hidden');
      celebration.dataset.medal = milestone.id;
      celebration.dataset.state = 'running';
      if (celebrationTitle) celebrationTitle.textContent = milestone.label;
      if (celebrationBody) celebrationBody.textContent = milestone.body;
      if (celebrationTimer) celebrationTimer.textContent = `Celebration pause: ${milestone.seconds} seconds of calm breathing.`;
      if (celebrationPrompt) {
        celebrationPrompt.textContent = milestone.id === 'platinum'
          ? 'Hold this platinum pause. When the countdown reaches zero, choose whether to open the certificate form or finish for today.'
          : 'Hold this pause, then tap Continue when the countdown reaches zero.';
      }
      if (continueBtn) {
        continueBtn.textContent = milestone.id === 'platinum' ? 'Open certificate form' : 'Continue';
        continueBtn.disabled = true;
      }
      if (buzzLabel) buzzLabel.textContent = milestone.label;
      if (buzzLetter) buzzLetter.textContent = milestone.letters;
      if (buzzTip) {
        buzzTip.textContent = milestone.id === 'platinum'
          ? 'Crowd applause, drums and lights — enjoy this platinum moment before deciding your next step.'
          : 'Crowd applause, gentle drums and stage lights — enjoy this short breathing break.';
      }
      setBuzzVisibility(true);
      if (milestone.id === 'platinum') {
        pendingResumeTime = letterObj?.end ?? audio.duration ?? fallbackDuration;
        pendingResumeLetterIndex = letterIndex;
      } else {
        setPendingResumeTargetFromIndex(letterIndex);
      }
      startCountdown(milestone);
    };

    const checkMilestones = currentTime => {
      if (isPlatinumCertificateMode || !celebration) return;
      if (currentMilestoneIndex >= MILESTONES.length) return;
      const milestone = MILESTONES[currentMilestoneIndex];
      const letterIndex = letterTimingList.findIndex(entry => entry.letter === milestone.triggerLetter);
      if (letterIndex < 0) return;
      const completionTime = getLetterCompletionTime(letterTimingList[letterIndex]);
      if (completionTime === null) return;
      if (currentTime >= completionTime && celebration.dataset.state !== 'running') {
        showMilestone(milestone, letterIndex);
        currentMilestoneIndex += 1;
      }
    };

    const handleContinueClick = () => {
      if (!continueBtn || continueBtn.disabled || countdownSeconds > 0) return;
      const medal = celebration?.dataset?.medal;
      const resumeAt = pendingResumeTime;
      const resumeIndex = pendingResumeLetterIndex;

      if (medal === 'platinum') {
        resetCelebration();
        isPlatinumCertificateMode = true;
        panel?.classList.add('is-certificate-mode');
        certificateBlock?.classList.add('is-visible');
        if (certPreview) certPreview.hidden = true;
        setCertificateActionState(false);
        clearPendingResumeTarget();
        return;
      }

      resetCelebration({ keepResumeTarget: true });
      const playbackTime = typeof resumeAt === 'number' ? Math.max(resumeAt - LETTER_CALL_HEADROOM, 0) : audio.currentTime;
      audio.currentTime = playbackTime;
      if (typeof resumeIndex === 'number') {
        lastLetterIndex = resumeIndex - 1;
      }
      clearPendingResumeTarget();
      audio.play().catch(() => {});
    };

    const jumpToLetter = letter => {
      const target = letterTimingList.find(entry => entry.letter === letter);
      if (!target) return;
      audio.pause();
      audio.currentTime = Math.max(target.start - LETTER_CALL_HEADROOM, 0);
      lastLetterIndex = Math.max(letterTimingList.indexOf(target) - 1, -1);
      resetCelebration();
      audio.play().catch(() => {});
      updateUIForTime();
    };

    openBtn?.addEventListener('click', openScreen);
    closeElements.forEach(element => element.addEventListener('click', closeScreen));

    startBtn?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.currentTime = 0;
        resetCelebration();
        audio.play().catch(() => {});
      }
    });

    pauseBtn?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        pauseBtn.textContent = 'Pause';
      } else {
        audio.pause();
        pauseBtn.textContent = 'Continue';
      }
    });

    restartBtn?.addEventListener('click', () => {
      audio.currentTime = 0;
      currentMilestoneIndex = 0;
      lastLetterIndex = -1;
      resetCelebration();
      audio.play().catch(() => {});
    });

    randomHeadBtn?.addEventListener('click', () => {
      const variant = HEAD_VARIANTS[Math.floor(Math.random() * HEAD_VARIANTS.length)];
      mouthHead?.setAttribute('data-variant', variant);
    });

    progressEl?.addEventListener('input', () => {
      const duration = audio.duration || fallbackDuration;
      const ratio = progressEl.value / 1000;
      audio.currentTime = ratio * duration;
      resetCelebration();
      updateUIForTime();
    });

    audio.addEventListener('timeupdate', updateUIForTime);
    audio.addEventListener('ended', () => {
      checkMilestones(audio.duration || fallbackDuration);
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => jumpToLetter(chip.dataset.letterSoundChip));
    });

    continueBtn?.addEventListener('click', handleContinueClick);
    closeCelebrationBtn?.addEventListener('click', resetCelebration);

    certForm?.addEventListener('submit', event => {
      event.preventDefault();
      const nameInput = document.getElementById('dlxCertificateNameInput');
      const genderInput = document.getElementById('dlxCertificateGenderInput');
      const ageInput = document.getElementById('dlxCertificateAgeInput');
      const faithInput = document.getElementById('dlxCertificateReligionInput');
      const name = nameInput?.value?.trim();
      if (!name) return;

      if (certAwardee) certAwardee.textContent = name;
      const gender = genderInput?.value;
      let medalText = 'Calm Focus Laureate';
      if (gender === 'Female') medalText = 'Platinum Sound Scholar';
      if (gender === 'Male') medalText = 'Platinum Sound Champion';
      if (certMedal) certMedal.textContent = medalText;

      const age = ageInput?.value?.trim();
      const faith = faithInput?.value?.trim();
      let message = `${name} has completed the full A–Z phoneme circuit with Platinum mastery, using calm breathing and steady focus.`;
      if (age) message += ` At the age of ${age}, this is a powerful reading milestone.`;
      if (faith) message += ` This award respects the learner’s ${faith} faith background.`;
      if (certMessage) certMessage.textContent = message;

      const randomId = `NB-${Math.floor(10000 + Math.random() * 90000)}`;
      if (certId) certId.textContent = randomId;
      const issued = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
      if (certIssued) certIssued.textContent = issued;

      if (certPreview) {
        certPreview.hidden = false;
        certPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setCertificateActionState(true);
    });

    certPrintBtn?.addEventListener('click', () => {
      if (certPrintBtn.disabled) return;
      if (!prepareCertificatePrint()) return;
      window.print();
    });

    certEditBtn?.addEventListener('click', () => {
      if (certPreview) certPreview.hidden = true;
      setCertificateActionState(false);
      const nameInput = document.getElementById('dlxCertificateNameInput');
      if (certForm) {
        certForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      nameInput?.focus({ preventScroll: true });
    });

    certCloseBtn?.addEventListener('click', () => {
      resetCelebration();
    });

    const handleBeforePrint = () => {
      if (didActivatePrintPortal) return;
      prepareCertificatePrint();
    };

    const handleAfterPrint = () => {
      cleanupCertificatePrint();
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    audio.addEventListener('error', () => {
      console.warn('Letter-sound audio could not be loaded. Ensure assets/tts/letters-sounds-only-eleven-labs-phonics-alphabet-sounds-dorothy.mp3 exists.');
    });
  });
})();
