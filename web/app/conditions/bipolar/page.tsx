'use client';

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { getLanguagePreference } from './utils/language';
import { Hero } from './components/Hero';
import { LanguageToggle } from './components/LanguageToggle';
import { Section } from './components/Section';
import { ContentSections } from './components/ContentSections';
import { SupportResources } from './components/SupportResources';
import { MoodTracker } from './components/MoodTracker';
import { StreakCounter } from './components/StreakCounter';
import { Achievements } from './components/Achievements';
import { ProgressTracker } from './components/ProgressTracker';
import { InteractiveTools } from './components/InteractiveTools';
import './styles/globals.css';

export default function BipolarPage() {
  const [language, setLanguage] = useState<Language>('en-GB');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = getLanguagePreference();
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const t = (uk: string, us: string) => (language === 'en-GB' ? uk : us);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <main>

        {/* ── Band 1: Hero — background image + dark overlay (via CSS module) ── */}
        <Hero
          title="Understanding Bipolar Disorder"
          subtitle={t(
            'Comprehensive, evidence-based information and support for managing bipolar disorder. Resources for affected individuals, families, educators, and healthcare professionals.',
            'Comprehensive, evidence-based information and support for managing bipolar disorder. Resources for affected individuals, families, educators, and healthcare professionals.'
          )}
          topSlot={<LanguageToggle onLanguageChange={handleLanguageChange} />}
        />

        {/* ── Band 2: Table of Contents — soft blue ── */}
        <Section background="white" className="!bg-blue-50/70 dark:!bg-blue-950/10">
          <nav aria-label="Page navigation">
            <h2>Contents</h2>
            <div className="toc-grid">
              {[
                { href: '#overview', label: 'Overview', icon: '📖' },
                { href: '#types', label: 'Types', icon: '🔢' },
                { href: '#diagnosis', label: 'Diagnosis', icon: '🔍' },
                { href: '#treatment', label: 'Treatment', icon: '💊' },
                { href: '#management', label: 'Management', icon: '🗓️' },
                { href: '#interactive-tools', label: 'Interactive Tools', icon: '🎯' },
                { href: '#support-resources', label: 'Support Resources', icon: '🤝' },
                { href: '#statistics', label: 'Statistics', icon: '📊' },
              ].map((item) => (
                <a key={item.href} href={item.href} className="toc-link">
                  <span className="toc-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </nav>
        </Section>

        {/* ── Band 3: Main Content Sections — own alternating bg ── */}
        <ContentSections language={language} />

        {/* ── Band 4: Interactive Tools — indigo tint ── */}
        <Section id="interactive-tools" background="white" className="!bg-indigo-50 dark:!bg-indigo-950/15">
          <h2>Interactive Management Tools</h2>
          <p className="tools-intro">
            Evidence-based tools to help you track your mood, build healthy habits, and manage
            symptoms effectively.
          </p>
          <MoodTracker language={language} />
          <StreakCounter language={language} />
          <Achievements language={language} />
          <ProgressTracker language={language} />
          <InteractiveTools language={language} />
        </Section>

        {/* ── Band 5: Support Resources — green tint ── */}
        <div className="bg-green-50/60 dark:bg-green-950/10">
          <SupportResources language={language} />
        </div>

        {/* ── Band 6: Statistics — amber tint ── */}
        <Section id="statistics" background="white" className="!bg-amber-50/50 dark:!bg-amber-950/10">
          <h2>Statistics &amp; Epidemiology</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">1-2%</div>
              <div className="stat-label">Global prevalence of bipolar disorder</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">15-25</div>
              <div className="stat-label">Typical age of onset (years)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Equal</div>
              <div className="stat-label">{t('Prevalence across genders', 'Prevalence across genders')}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value success">High</div>
              <div className="stat-label">Treatment effectiveness with proper management</div>
            </div>
          </div>
          <div className="key-facts">
            <h3>Key Facts</h3>
            <ul>
              <li>Bipolar disorder affects approximately 46 million people worldwide (WHO)</li>
              <li>With proper treatment, most people with bipolar disorder can lead productive, fulfilling lives</li>
              <li>Early diagnosis and intervention improve long-term outcomes</li>
              <li>Bipolar disorder has a strong genetic component - having a first-degree relative with the condition increases risk</li>
              <li>Co-occurring conditions are common, including anxiety disorders, substance use disorders, and ADHD</li>
            </ul>
          </div>
        </Section>

        {/* ── Band 7: References — slate ── */}
        <Section background="gray" className="!bg-slate-100 dark:!bg-slate-900/40">
          <h2>References &amp; Further Reading</h2>
          <div className="references-content">
            <p>This page is based on evidence from authoritative sources including:</p>
            <ul>
              <li>
                <strong>{t('NHS (National Health Service, UK)', 'CDC (Centers for Disease Control and Prevention, US)')}:</strong>{' '}
                Clinical guidelines and patient information
              </li>
              <li>
                <strong>NICE (National Institute for Health and Care Excellence):</strong> Bipolar disorder: assessment and management (CG185)
              </li>
              <li>
                <strong>American Psychiatric Association:</strong> DSM-5 diagnostic criteria and practice guidelines
              </li>
              <li>
                <strong>WHO (World Health Organization):</strong> ICD-11 and global health data
              </li>
              <li>
                <strong>PubMed Database:</strong> Peer-reviewed research studies
              </li>
              <li>
                <strong>Bipolar UK, DBSA, NAMI:</strong> Patient advocacy and support {t('organisations', 'organizations')}
              </li>
            </ul>
            <p className="disclaimer">
              <strong>Disclaimer:</strong> This page provides evidence-based information for educational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified mental health provider with any questions regarding a medical condition or treatment.
            </p>
          </div>
        </Section>

      </main>
    </div>
  );
}
