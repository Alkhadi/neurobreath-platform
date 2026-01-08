'use client';

import React from 'react';
import { ContentCard } from './ContentCard';
import { Section } from './Section';
import { Language } from '../types';
import researchData from '../data/research.json';

interface ContentSectionsProps {
  language: Language;
}

export const ContentSections: React.FC<ContentSectionsProps> = ({ language }) => {
  const t = (uk: string, us: string) => (language === 'en-GB' ? uk : us);

  return (
    <>
      {/* Overview Section */}
      <Section id="overview" background="white">
        <h2>Understanding Bipolar Disorder</h2>
        <ContentCard>
          <p>
            Bipolar disorder, formerly known as manic depression, is a mental health condition
            {t('characterised', 'characterized')} by extreme mood swings that include emotional
            highs (mania or hypomania) and lows (depression). These episodes can affect mood,
            energy, activity levels, and the ability to carry out day-to-day tasks.
          </p>
          <p>
            During manic episodes, individuals may feel euphoric, full of energy, or unusually
            irritable. During depressive episodes, they may feel sad, hopeless, or lose interest
            in most activities. Between episodes, many people with bipolar disorder experience
            periods of normal mood.
          </p>
          <p>
            Bipolar disorder requires lifelong treatment, even during periods when you feel better.
            Following a treatment plan—usually a combination of medication and
            {t('psychotherapy', 'psychotherapy')}—can help manage symptoms and prevent relapse.
          </p>
        </ContentCard>
      </Section>

      {/* Types of Bipolar Disorder */}
      <Section id="types" background="gray">
        <h2>Types of Bipolar Disorder</h2>

        <ContentCard title="Bipolar I Disorder" icon="1️⃣">
          <p>
            <strong>Criteria:</strong> At least one manic episode that lasts at least 7 days (or
            requires hospitalization). Manic episodes may be preceded or followed by hypomanic or
            major depressive episodes.
          </p>
          <p>
            <strong>Manic Episode Features:</strong>
          </p>
          <ul>
            <li>Abnormally elevated, expansive, or irritable mood</li>
            <li>Increased activity or energy</li>
            <li>Decreased need for sleep</li>
            <li>Grandiosity or inflated self-esteem</li>
            <li>More talkative than usual</li>
            <li>Racing thoughts or flight of ideas</li>
            <li>Distractibility</li>
            <li>Increased goal-directed activity</li>
            <li>Excessive involvement in risky activities</li>
          </ul>
          <p>
            <strong>Severity:</strong> Marked impairment in functioning, potential hospitalization,
            or presence of psychotic features.
          </p>
        </ContentCard>

        <ContentCard title="Bipolar II Disorder" icon="2️⃣">
          <p>
            <strong>Criteria:</strong> At least one hypomanic episode (lasting at least 4
            consecutive days) AND at least one major depressive episode, with no history of full
            manic episodes.
          </p>
          <p>
            <strong>Hypomanic Episode Features:</strong>
          </p>
          <ul>
            <li>Similar symptoms to mania but less severe</li>
            <li>Does not cause marked impairment</li>
            <li>Does not require hospitalization</li>
            <li>No psychotic features</li>
            <li>Observable change in functioning by others</li>
          </ul>
          <p>
            <strong>Note:</strong> Despite being \"milder\" than Bipolar I, Bipolar II can be just
            as debilitating due to more frequent and longer depressive episodes.
          </p>
        </ContentCard>

        <ContentCard title="Cyclothymic Disorder (Cyclothymia)" icon="🔄">
          <p>
            <strong>Criteria:</strong> Numerous periods of hypomanic symptoms and depressive
            symptoms that don't meet full criteria for episodes, lasting for at least 2 years (1
            year in children and adolescents).
          </p>
          <p>
            <strong>Characteristics:</strong>
          </p>
          <ul>
            <li>Chronic fluctuating mood disturbance</li>
            <li>Symptoms never absent for more than 2 consecutive months</li>
            <li>Causes significant distress or impairment</li>
            <li>May develop into Bipolar I or II Disorder</li>
          </ul>
        </ContentCard>

        <ContentCard title="Other Specified & Unspecified Bipolar Disorders" icon="➕">
          <p>
            These categories include bipolar symptoms that don't match the criteria above but still
            cause significant distress or impairment. Examples include:
          </p>
          <ul>
            <li>Short-duration hypomanic episodes with major depressive episodes</li>
            <li>Hypomanic episodes without prior major depressive episodes</li>
            <li>Short-duration cyclothymia</li>
          </ul>
        </ContentCard>
      </Section>

      {/* Diagnosis */}
      <Section id="diagnosis" background="white">
        <h2>Diagnosis & Assessment</h2>

        <ContentCard title="Diagnostic Criteria" icon="📋">
          <p>
            Bipolar disorder is diagnosed based on criteria from the DSM-5 (Diagnostic and
            Statistical Manual of Mental Disorders, 5th Edition) or ICD-11 (International
            Classification of Diseases, 11th Revision).
          </p>
          <p>
            <strong>Assessment typically includes:</strong>
          </p>
          <ul>
            <li>Comprehensive psychiatric evaluation</li>
            <li>Detailed personal and family psychiatric history</li>
            <li>Physical examination to rule out medical causes</li>
            <li>Mood charting and symptom tracking</li>
            <li>Standardized assessment tools (e.g., Young Mania Rating Scale, Hamilton Depression
              Rating Scale)</li>
          </ul>
        </ContentCard>

        <ContentCard title="Assessment Tools" icon="🔍">
          <p>
            <strong>Commonly used assessment instruments:</strong>
          </p>
          <ul>
            <li>
              <strong>Young Mania Rating Scale (YMRS):</strong> Measures severity of manic symptoms
            </li>
            <li>
              <strong>Hamilton Depression Rating Scale (HAM-D):</strong> Assesses depressive
              symptoms
            </li>
            <li>
              <strong>Mood Disorder Questionnaire (MDQ):</strong> Screening tool for bipolar
              disorder
            </li>
            <li>
              <strong>Clinical Global Impression (CGI):</strong> Evaluates overall illness severity
            </li>
            <li>
              <strong>Life functioning assessments:</strong> Evaluate impact on daily life,
              relationships, work/school
            </li>
          </ul>
        </ContentCard>

        <ContentCard title="Differential Diagnosis" icon="⚕️">
          <p>
            It's important to distinguish bipolar disorder from other conditions with similar
            symptoms:
          </p>
          <ul>
            <li>Major depressive disorder (unipolar depression)</li>
            <li>Schizophrenia and schizoaffective disorder</li>
            <li>ADHD (especially in children and adolescents)</li>
            <li>Borderline personality disorder</li>
            <li>Substance-induced mood disorders</li>
            <li>Medical conditions (thyroid disorders, neurological conditions)</li>
          </ul>
        </ContentCard>
      </Section>

      {/* Treatment Options */}
      <Section id="treatment" background="gray">
        <h2>Treatment Options</h2>

        <ContentCard title="Pharmacological Treatment" icon="💊">
          <p>
            Medication is a cornerstone of bipolar disorder treatment. Treatment is typically
            long-term and may include:
          </p>
          
          <h4>Mood {t('Stabilisers', 'Stabilizers')}</h4>
          <ul>
            <li>
              <strong>Lithium:</strong> First-line treatment, proven to prevent manic and depressive
              episodes, reduces suicide risk
            </li>
            <li>
              <strong>Valproate (Valproic acid):</strong> Effective for acute mania and maintenance
            </li>
            <li>
              <strong>Carbamazepine:</strong> Alternative mood {t('stabiliser', 'stabilizer')}
            </li>
            <li>
              <strong>Lamotrigine:</strong> Particularly effective for depressive episodes and
              maintenance
            </li>
          </ul>

          <h4>Atypical Antipsychotics</h4>
          <ul>
            <li>Quetiapine, Olanzapine, Aripiprazole, Risperidone, Lurasidone</li>
            <li>Used for acute mania, mixed episodes, and maintenance</li>
            <li>Some approved for depressive episodes</li>
          </ul>

          <h4>Antidepressants</h4>
          <ul>
            <li>
              Used cautiously and typically with a mood {t('stabiliser', 'stabilizer')} or
              antipsychotic
            </li>
            <li>Risk of triggering manic episodes if used alone</li>
          </ul>

          <p>
            <strong>Important:</strong> Never stop medications without consulting your doctor.
            Regular blood tests may be required to monitor medication levels and side effects.
          </p>
        </ContentCard>

        <ContentCard title="Psychological Therapies" icon="🧠">
          <p>
            Psychotherapy is an essential component of treatment, used alongside medication:
          </p>
          <ul>
            <li>
              <strong>Cognitive Behavioral Therapy (CBT):</strong> Helps identify and change
              negative thought patterns and {t('behaviours', 'behaviors')}
            </li>
            <li>
              <strong>Family-Focused Therapy (FFT):</strong> Involves family members in treatment,
              improves communication and problem-solving
            </li>
            <li>
              <strong>Interpersonal and Social Rhythm Therapy (IPSRT):</strong> Focuses on
              stabilizing daily routines and addressing relationship issues
            </li>
            <li>
              <strong>Psychoeducation:</strong> Education about the illness, treatment, and
              self-management
            </li>
            <li>
              <strong>Group therapy:</strong> Peer support and shared experiences
            </li>
          </ul>
        </ContentCard>

        <ContentCard title="Lifestyle Interventions" icon="🏃">
          <p>
            Lifestyle modifications play a crucial role in managing bipolar disorder:
          </p>
          <ul>
            <li>
              <strong>Regular sleep schedule:</strong> Maintain consistent sleep-wake times (sleep
              disruption is a major trigger)
            </li>
            <li>
              <strong>Exercise:</strong> Regular physical activity improves mood and overall health
            </li>
            <li>
              <strong>Healthy diet:</strong> Balanced nutrition supports brain health
            </li>
            <li>
              <strong>Avoid alcohol and drugs:</strong> Substances can trigger episodes and
              interfere with medications
            </li>
            <li>
              <strong>Stress management:</strong> Techniques like meditation, yoga, mindfulness
            </li>
            <li>
              <strong>Routine and structure:</strong> Maintain regular daily routines
            </li>
          </ul>
        </ContentCard>

        <ContentCard title="Emergency & Crisis Intervention" icon="🚨">
          <p>
            In severe cases, intensive treatment may be necessary:
          </p>
          <ul>
            <li>
              <strong>Hospitalization:</strong> For severe mania, severe depression with suicidal
              ideation, or psychotic symptoms
            </li>
            <li>
              <strong>Crisis intervention services:</strong> Urgent mental health support
            </li>
            <li>
              <strong>Electroconvulsive Therapy (ECT):</strong> For severe, treatment-resistant
              depression or mania
            </li>
          </ul>
          <p>
            <strong>Crisis Contacts:</strong>
          </p>
          <ul>
            <li>{t('UK: Samaritans 116 123', 'US: National Suicide Prevention Lifeline 988')}</li>
            <li>
              {t(
                'UK: NHS 111 (mental health crisis)',
                'US: Crisis Text Line - Text HOME to 741741'
              )}
            </li>
            <li>Emergency services: {t('999', '911')}</li>
          </ul>
        </ContentCard>
      </Section>

      {/* Management Strategies */}
      <Section id="management" background="white">
        <h2>Daily Management Strategies</h2>

        <ContentCard title="Mood Monitoring" icon="📊">
          <p>
            Regular mood tracking is one of the most effective self-management strategies:
          </p>
          <ul>
            <li>Track mood, sleep, medications, and potential triggers daily</li>
            <li>Use mood charts, apps, or journals</li>
            <li>
              {t('Recognise', 'Recognize')} early warning signs of mood episodes
            </li>
            <li>Share tracking data with healthcare providers</li>
            <li>Identify patterns and triggers over time</li>
          </ul>
          <p>
            <strong>Use the Mood Tracker tool on this page to start tracking your mood today!</strong>
          </p>
        </ContentCard>

        <ContentCard title="Sleep Hygiene" icon="😴">
          <p>
            Sleep is critically important for mood stability. Poor sleep can trigger episodes:
          </p>
          <ul>
            <li>Go to bed and wake up at the same time every day</li>
            <li>Aim for 7-9 hours of sleep</li>
            <li>Create a relaxing bedtime routine</li>
            <li>Keep bedroom dark, quiet, and cool</li>
            <li>Avoid screens 1 hour before bed</li>
            <li>Limit caffeine and avoid alcohol</li>
            <li>Don't nap for more than 20-30 minutes</li>
          </ul>
        </ContentCard>

        <ContentCard title="Identifying Triggers" icon="⚠️">
          <p>
            Understanding your triggers can help prevent episodes:
          </p>
          <ul>
            <li>
              <strong>Sleep disruption:</strong> Travel, shift work, insomnia
            </li>
            <li>
              <strong>Stress:</strong> Work pressure, relationship conflicts, major life changes
            </li>
            <li>
              <strong>Substance use:</strong> Alcohol, drugs, excessive caffeine
            </li>
            <li>
              <strong>Medication changes:</strong> Stopping or changing medications
            </li>
            <li>
              <strong>Seasonal changes:</strong> Less daylight in winter, more in summer
            </li>
            <li>
              <strong>Hormonal changes:</strong> Menstrual cycle, pregnancy, menopause
            </li>
          </ul>
        </ContentCard>

        <ContentCard title="Building a Support Network" icon="🤝">
          <p>
            Strong social support improves outcomes:
          </p>
          <ul>
            <li>Share your diagnosis with trusted family and friends</li>
            <li>Educate your support network about bipolar disorder</li>
            <li>Join support groups (online or in-person)</li>
            <li>Maintain regular contact with healthcare providers</li>
            <li>Consider peer support specialists</li>
            <li>Create a crisis plan with your support network</li>
          </ul>
        </ContentCard>

        <ContentCard title="Relapse Prevention" icon="🛡️">
          <p>
            Strategies to prevent mood episodes:
          </p>
          <ul>
            <li>Take medications exactly as prescribed</li>
            <li>Attend all therapy and medical appointments</li>
            <li>Monitor mood and warning signs daily</li>
            <li>Maintain healthy sleep, diet, and exercise routines</li>
            <li>Avoid alcohol and recreational drugs</li>
            <li>Manage stress proactively</li>
            <li>Act quickly at first signs of mood changes</li>
            <li>Have a written relapse prevention plan</li>
          </ul>
        </ContentCard>
      </Section>
    </>
  );
};
