(() => {
    const STORAGE_PREFIX = 'dyslexia-guide-';

    const byId = (id) => document.getElementById(id);

    const contrastBtn = byId('contrastBtn');
    const spacingBtn = byId('spacingBtn');
    const guideBtn = byId('guideBtn');
    const ttsBtn = byId('ttsBtn');
    const readingGuide = byId('readingGuide');

    const fontSizeDisplay = byId('fontSizeDisplay');
    const fontDecrease = byId('fontDecrease');
    const fontIncrease = byId('fontIncrease');

    const printGuideBtn = byId('printGuideBtn');

    const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    const speechSynthesisRef = window.speechSynthesis;

    let currentFontSize = 100;
    let isSpeaking = false;

    function savePreference(key, value) {
        try {
            localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
        } catch {
            // ignore
        }
    }

    function loadPreference(key, fallback) {
        try {
            const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function updateFontSize() {
        document.documentElement.style.fontSize = `${(currentFontSize / 100) * 18}px`;
        if (fontSizeDisplay) fontSizeDisplay.textContent = `${currentFontSize}%`;
        savePreference('fontSize', currentFontSize);
    }

    function setTtsButtonMode(mode) {
        if (!ttsBtn) return;

        if (mode === 'stop') {
            ttsBtn.classList.add('active');
            ttsBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                Stop
            `;
            return;
        }

        ttsBtn.classList.remove('active');
        ttsBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            Read Aloud
        `;
    }

    function initToolbar() {
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                contrastBtn.classList.toggle('active');
                savePreference('highContrast', document.body.classList.contains('high-contrast'));
            });
        }

        if (spacingBtn) {
            spacingBtn.addEventListener('click', () => {
                document.body.classList.toggle('increased-spacing');
                spacingBtn.classList.toggle('active');
                savePreference('increasedSpacing', document.body.classList.contains('increased-spacing'));
            });
        }

        if (guideBtn) {
            guideBtn.addEventListener('click', () => {
                document.body.classList.toggle('reading-guide-active');
                guideBtn.classList.toggle('active');
                savePreference('readingGuide', document.body.classList.contains('reading-guide-active'));
            });
        }

        document.addEventListener('mousemove', (e) => {
            if (!readingGuide) return;
            if (!document.body.classList.contains('reading-guide-active')) return;
            readingGuide.style.top = `${e.clientY - 20}px`;
        });

        if (fontDecrease) {
            fontDecrease.addEventListener('click', () => {
                if (currentFontSize > 80) {
                    currentFontSize -= 10;
                    updateFontSize();
                }
            });
        }

        if (fontIncrease) {
            fontIncrease.addEventListener('click', () => {
                if (currentFontSize < 150) {
                    currentFontSize += 10;
                    updateFontSize();
                }
            });
        }

        if (ttsBtn) {
            if (!supportsSpeech) {
                ttsBtn.disabled = true;
                ttsBtn.title = 'Read aloud is not supported in this browser.';
            }

            setTtsButtonMode('read');
            ttsBtn.addEventListener('click', () => {
                if (!supportsSpeech) return;

                if (isSpeaking) {
                    speechSynthesisRef.cancel();
                    isSpeaking = false;
                    setTtsButtonMode('read');
                    return;
                }

                let textToRead = window.getSelection?.().toString() ?? '';
                if (!textToRead) {
                    const mainContent = document.querySelector('.content-wrapper');
                    textToRead = mainContent ? mainContent.innerText.substring(0, 5000) : 'No content available.';
                }

                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.onend = () => {
                    isSpeaking = false;
                    setTtsButtonMode('read');
                };

                speechSynthesisRef.cancel();
                speechSynthesisRef.speak(utterance);
                isSpeaking = true;
                setTtsButtonMode('stop');
            });
        }
    }

    function initCollapsibles() {
        document.querySelectorAll('.collapsible-header').forEach((header) => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                const content = header.nextElementSibling;
                content?.classList.toggle('active');
            });
        });
    }

    function initAgeTabs() {
        const ageTabs = document.querySelectorAll('.age-tab');
        const ageContents = document.querySelectorAll('.age-content');

        ageTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetAge = tab.dataset.age;
                if (!targetAge) return;

                ageTabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');

                ageContents.forEach((content) => {
                    content.classList.remove('active');
                    if (content.id === `age-${targetAge}`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    function initQuiz() {
        document.querySelectorAll('.quiz-question').forEach((question) => {
            const correctAnswer = Number.parseInt(question.dataset.correct ?? '', 10);
            if (Number.isNaN(correctAnswer)) return;

            const options = question.querySelectorAll('.quiz-option');
            const feedback = question.querySelector('.quiz-feedback');
            if (!feedback) return;

            options.forEach((option) => {
                option.addEventListener('click', () => {
                    options.forEach((opt) => {
                        opt.disabled = true;
                    });

                    const selectedOption = Number.parseInt(option.dataset.option ?? '', 10);
                    if (selectedOption === correctAnswer) {
                        option.classList.add('correct');
                        feedback.classList.add('show');
                        return;
                    }

                    option.classList.add('incorrect');
                    options.forEach((opt) => {
                        const optValue = Number.parseInt(opt.dataset.option ?? '', 10);
                        if (optValue === correctAnswer) opt.classList.add('correct');
                    });
                    feedback.innerHTML = `<strong>Not quite!</strong> ${feedback.innerHTML.replace('<strong>Correct!</strong> ', '')}`;
                    feedback.classList.add('show');
                });
            });
        });
    }

    function initTocSmoothScroll() {
        document.querySelectorAll('.toc-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                const href = card.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                e.preventDefault();
                const targetElement = document.getElementById(href.slice(1));
                targetElement?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function initScrollReveal() {
        const targets = Array.from(document.querySelectorAll('.content-card, .collapsible'));
        if (targets.length === 0) return;

        targets.forEach((el) => el.classList.add('reveal-on-scroll'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        targets.forEach((el) => observer.observe(el));
    }

    function initPrint() {
        if (!printGuideBtn) return;
        printGuideBtn.addEventListener('click', () => window.print());
    }

    function loadPreferences() {
        const highContrast = loadPreference('highContrast', false);
        if (highContrast) {
            document.body.classList.add('high-contrast');
            contrastBtn?.classList.add('active');
        }

        const increasedSpacing = loadPreference('increasedSpacing', false);
        if (increasedSpacing) {
            document.body.classList.add('increased-spacing');
            spacingBtn?.classList.add('active');
        }

        const readingGuideActive = loadPreference('readingGuide', false);
        if (readingGuideActive) {
            document.body.classList.add('reading-guide-active');
            guideBtn?.classList.add('active');
        }

        const savedFontSize = loadPreference('fontSize', null);
        if (typeof savedFontSize === 'number' && savedFontSize >= 80 && savedFontSize <= 150) {
            currentFontSize = savedFontSize;
            updateFontSize();
        }
    }

    function isTypingContext(el) {
        if (!el) return false;
        const tag = (el.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        return Boolean(el.isContentEditable);
    }

    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (isTypingContext(document.activeElement)) return;

            const key = e.key.toLowerCase();
            if (key === 'c') contrastBtn?.click();
            if (key === 's') {
                e.preventDefault();
                spacingBtn?.click();
            }
            if (key === 'g') guideBtn?.click();
            if (key === 'r') ttsBtn?.click();

            if (e.key === 'Escape' && isSpeaking && supportsSpeech) {
                speechSynthesisRef.cancel();
                isSpeaking = false;
                setTtsButtonMode('read');
            }
        });
    }

    loadPreferences();

    initToolbar();
    initCollapsibles();
    initAgeTabs();
    initQuiz();
    initTocSmoothScroll();
    initScrollReveal();
    initPrint();
    initKeyboardShortcuts();

    // eslint-disable-next-line no-console
    console.log('Dyslexia Reading Strategies Guide loaded successfully!');
})();
