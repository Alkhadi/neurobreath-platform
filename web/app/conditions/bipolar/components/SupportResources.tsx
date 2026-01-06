'use client';

import React, { useState } from 'react';
import { ContentCard } from './ContentCard';
import { Section } from './Section';
import { Language } from '../types';

interface SupportResourcesProps {
  language: Language;
}

type Audience =
  | 'children'
  | 'adolescents'
  | 'adults'
  | 'elderly'
  | 'parents'
  | 'teachers'
  | 'carers'
  | 'healthcare';

export const SupportResources: React.FC<SupportResourcesProps> = ({ language }) => {
  const [selectedAudience, setSelectedAudience] = useState<Audience>('adults');

  const t = (uk: string, us: string) => (language === 'en-GB' ? uk : us);

  const audiences = [
    { id: 'children' as Audience, label: 'Children', icon: '👶' },
    { id: 'adolescents' as Audience, label: 'Adolescents', icon: '🧑' },
    { id: 'adults' as Audience, label: 'Adults', icon: '👤' },
    { id: 'elderly' as Audience, label: 'Elderly', icon: '👵' },
    { id: 'parents' as Audience, label: 'Parents & Family', icon: '👨‍👩‍👧' },
    { id: 'teachers' as Audience, label: 'Teachers', icon: '👩‍🏫' },
    { id: 'carers' as Audience, label: 'Carers', icon: '🤲' },
    { id: 'healthcare' as Audience, label: 'Healthcare Professionals', icon: '⚕️' },
  ];

  return (
    <Section id="support-resources" background="gray">
      <h2>Support Resources</h2>
      <p className="support-intro">
        Comprehensive support resources tailored for different audiences. Select your role to view
        relevant information and resources.
      </p>

      <div className="audience-selector">
        {audiences.map((audience) => (
          <button
            key={audience.id}
            onClick={() => setSelectedAudience(audience.id)}
            className={`audience-button ${selectedAudience === audience.id ? 'active' : ''}`}
          >
            <span className="audience-icon">{audience.icon}</span>
            <span className="audience-label">{audience.label}</span>
          </button>
        ))}
      </div>

      <div className="resource-content">
        {selectedAudience === 'children' && <ChildrenResources language={language} t={t} />}
        {selectedAudience === 'adolescents' && <AdolescentsResources language={language} t={t} />}
        {selectedAudience === 'adults' && <AdultsResources language={language} t={t} />}
        {selectedAudience === 'elderly' && <ElderlyResources language={language} t={t} />}
        {selectedAudience === 'parents' && <ParentsResources language={language} t={t} />}
        {selectedAudience === 'teachers' && <TeachersResources language={language} t={t} />}
        {selectedAudience === 'carers' && <CarersResources language={language} t={t} />}
        {selectedAudience === 'healthcare' && <HealthcareResources language={language} t={t} />}
      </div>
    </Section>
  );
};

// Children Resources
const ChildrenResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> =
  ({ language, t }) => (
    <>
      <ContentCard title="Understanding Bipolar Disorder in Children" icon="👶">
        <p>
          Bipolar disorder in children presents unique challenges. Symptoms may differ from adults
          and can be confused with other conditions like ADHD.
        </p>
        <p>
          <strong>Common signs in children:</strong>
        </p>
        <ul>
          <li>Severe mood swings different from normal childhood mood changes</li>
          <li>Explosive temper tantrums</li>
          <li>Rapid cycling between high and low moods</li>
          <li>Periods of extreme silliness or giddiness</li>
          <li>Decreased need for sleep without fatigue</li>
          <li>Difficulty concentrating</li>
        </ul>
      </ContentCard>

      <ContentCard title="Treatment Considerations" icon="⚕️">
        <ul>
          <li>Early diagnosis and intervention are crucial</li>
          <li>Family-based treatment approaches</li>
          <li>School accommodations and support</li>
          <li>Age-appropriate psychoeducation</li>
          <li>Regular monitoring of medications</li>
        </ul>
      </ContentCard>

      <ContentCard title="Resources for Children" icon="📚">
        <ul>
          <li>
            <strong>{t('CAMHS (Child and Adolescent Mental Health Services)', 'Child Psychiatry Services')}:</strong>{' '}
            Specialist mental health services for children
          </li>
          <li>
            <strong>YoungMinds:</strong> Mental health charity for children (UK)
          </li>
          <li>
            <strong>The Child Mind Institute:</strong> Resources and information (US)
          </li>
          <li>
            <strong>Support groups for families</strong> with children with bipolar disorder
          </li>
        </ul>
      </ContentCard>
    </>
  );

// Adolescents Resources
const AdolescentsResources: React.FC<{
  language: Language;
  t: (uk: string, us: string) => string;
}> = ({ language, t }) => (
  <>
    <ContentCard title="Bipolar Disorder in Adolescence" icon="🧑">
      <p>
        Adolescence is a common time for bipolar disorder to emerge. The teenage years bring unique
        challenges as individuals navigate school, relationships, and identity formation.
      </p>
      <p>
        <strong>Key considerations:</strong>
      </p>
      <ul>
        <li>Mood episodes may be more rapid and intense</li>
        <li>Increased risk-taking {t('behaviour', 'behavior')}</li>
        <li>Academic and social challenges</li>
        <li>Substance use concerns</li>
        <li>Transition planning to adult services</li>
      </ul>
    </ContentCard>

    <ContentCard title="Self-Management for Teens" icon="💪">
      <ul>
        <li>Learn about your condition and treatment</li>
        <li>Take medications as prescribed</li>
        <li>Track your moods and identify triggers</li>
        <li>Maintain regular sleep schedules (critical!)</li>
        <li>Build healthy coping strategies</li>
        <li>Stay connected with friends and activities</li>
        <li>Talk openly with your treatment team</li>
      </ul>
    </ContentCard>

    <ContentCard title="Resources for Teens" icon="🌟">
      <ul>
        <li>
          <strong>The Mix:</strong> Support for under-25s (UK) - themix.org.uk
        </li>
        <li>
          <strong>Childline:</strong> Confidential support (UK) - 0800 1111
        </li>
        <li>
          <strong>Teen Line:</strong> Peer-to-peer support (US) - 310-855-4673
        </li>
        <li>
          <strong>Crisis Text Line:</strong> Text HOME to 741741 (US)
        </li>
        <li>
          <strong>Online forums:</strong> Bipolar UK eCommunity, DBSA online groups
        </li>
      </ul>
    </ContentCard>
  </>
);

// Adults Resources
const AdultsResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> =
  ({ language, t }) => (
    <>
      <ContentCard title="Living Well with Bipolar Disorder" icon="👤">
        <p>
          Many adults with bipolar disorder lead fulfilling, successful lives with proper
          treatment and self-management. Recovery is possible.
        </p>
        <p>
          <strong>Key strategies for adults:</strong>
        </p>
        <ul>
          <li>Consistent medication adherence</li>
          <li>Regular therapy or {t('counselling', 'counseling')} sessions</li>
          <li>Daily mood monitoring</li>
          <li>Workplace accommodations if needed</li>
          <li>Relationship communication</li>
          <li>Financial management during mood episodes</li>
          <li>Crisis planning</li>
        </ul>
      </ContentCard>

      <ContentCard title="Work & Career" icon="💼">
        <ul>
          <li>
            You may be entitled to workplace adjustments under disability discrimination laws
          </li>
          <li>Consider flexible working arrangements</li>
          <li>Manage stress and workload proactively</li>
          <li>Know your rights regarding disclosure</li>
          <li>
            {t('Access to Work scheme (UK)', 'ADA accommodations (US)')} can provide support
          </li>
        </ul>
      </ContentCard>

      <ContentCard title="Relationships & Family" icon="❤️">
        <ul>
          <li>Open communication with partners and family</li>
          <li>Involve loved ones in crisis planning</li>
          <li>Couples therapy can be helpful</li>
          <li>Family-focused therapy improves outcomes</li>
          <li>Support groups for families and partners</li>
        </ul>
      </ContentCard>

      <ContentCard title="Organizations & Support" icon="🤝">
        <ul>
          <li>
            <strong>Bipolar UK:</strong> www.bipolaruk.org - Support groups, eCommunity, resources
          </li>
          <li>
            <strong>Mind:</strong> www.mind.org.uk - Information and local support (UK)
          </li>
          <li>
            <strong>Rethink Mental Illness:</strong> www.rethink.org - Advice and advocacy (UK)
          </li>
          <li>
            <strong>DBSA:</strong> www.dbsalliance.org - Support groups and resources (US)
          </li>
          <li>
            <strong>NAMI:</strong> www.nami.org - Education, support, advocacy (US)
          </li>
          <li>
            <strong>International Bipolar Foundation:</strong> ibpf.org - Global resources
          </li>
        </ul>
      </ContentCard>
    </>
  );

// Elderly Resources
const ElderlyResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> =
  ({ language, t }) => (
    <>
      <ContentCard title="Bipolar Disorder in Older Adults" icon="👵">
        <p>
          Bipolar disorder in older adults presents unique considerations, including medical
          comorbidities, cognitive changes, and medication interactions.
        </p>
        <p>
          <strong>Specific considerations:</strong>
        </p>
        <ul>
          <li>Increased sensitivity to medication side effects</li>
          <li>Drug interactions with other medications</li>
          <li>Cognitive assessment and monitoring</li>
          <li>Physical health conditions affecting treatment</li>
          <li>Social isolation concerns</li>
          <li>Grief and loss issues</li>
        </ul>
      </ContentCard>

      <ContentCard title="Treatment Adaptations" icon="💊">
        <ul>
          <li>Lower medication doses may be needed</li>
          <li>More frequent monitoring required</li>
          <li>Careful consideration of medication interactions</li>
          <li>Regular physical health check-ups</li>
          <li>Adapted psychotherapy approaches</li>
        </ul>
      </ContentCard>

      <ContentCard title="Support Services" icon="🏥">
        <ul>
          <li>
            <strong>Age UK:</strong> Support for older people (UK) - www.ageuk.org.uk
          </li>
          <li>
            <strong>NHS continuing healthcare:</strong> For complex health needs (UK)
          </li>
          <li>
            <strong>AARP:</strong> Resources for older adults (US) - www.aarp.org
          </li>
          <li>
            <strong>National Council on Aging:</strong> Programs and support (US)
          </li>
          <li>Senior support groups and day {t('centres', 'centers')}</li>
          <li>Home care and {t('carer', 'caregiver')} support services</li>
        </ul>
      </ContentCard>
    </>
  );

// Parents Resources
const ParentsResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> =
  ({ language, t }) => (
    <>
      <ContentCard title="Supporting Your Child with Bipolar Disorder" icon="👨‍👩‍👧">
        <p>
          As a parent, you play a crucial role in your child's treatment and recovery. Your support
          and understanding are invaluable.
        </p>
        <p>
          <strong>What parents can do:</strong>
        </p>
        <ul>
          <li>Educate yourself about bipolar disorder</li>
          <li>Participate in family therapy</li>
          <li>Help monitor medications and symptoms</li>
          <li>Maintain consistent routines at home</li>
          <li>Advocate for school accommodations</li>
          <li>Create a crisis plan</li>
          <li>Take care of your own mental health</li>
        </ul>
      </ContentCard>

      <ContentCard title="School Support" icon="🏫">
        <ul>
          <li>Work with school to develop support plans (IEP/504 in US, EHCP in UK)</li>
          <li>Educate teachers about bipolar disorder</li>
          <li>Request accommodations for symptoms</li>
          <li>Maintain regular communication with school</li>
          <li>Plan for transitions between schools</li>
        </ul>
      </ContentCard>

      <ContentCard title="Family Well-being" icon="💚">
        <ul>
          <li>Join parent support groups</li>
          <li>Seek {t('counselling', 'counseling')} for yourself if needed</li>
          <li>Address sibling needs and concerns</li>
          <li>Maintain family routines and activities</li>
          <li>Practice self-care and stress management</li>
          <li>Connect with other families in similar situations</li>
        </ul>
      </ContentCard>

      <ContentCard title="Resources for Parents" icon="📖">
        <ul>
          <li>
            <strong>Bipolar UK - For Families:</strong> Dedicated resources and support
          </li>
          <li>
            <strong>Young Minds - Parents Helpline:</strong> 0808 802 5544 (UK)
          </li>
          <li>
            <strong>NAMI - Family Support:</strong> Education programs and support groups (US)
          </li>
          <li>
            <strong>Child Mind Institute:</strong> Parent resources and guides
          </li>
          <li>
            <strong>The Balanced Mind Parent Network:</strong> Peer support for parents (US)
          </li>
        </ul>
      </ContentCard>
    </>
  );

// Teachers Resources
const TeachersResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> =
  ({ language, t }) => (
    <>
      <ContentCard title="Supporting Students with Bipolar Disorder" icon="👩‍🏫">
        <p>
          Teachers play a vital role in supporting students with bipolar disorder. Understanding the
          condition and implementing appropriate accommodations can make a significant difference.
        </p>
        <p>
          <strong>What teachers should know:</strong>
        </p>
        <ul>
          <li>Bipolar disorder affects mood, energy, and concentration</li>
          <li>Symptoms are not within the student's control</li>
          <li>Treatment takes time and adjustment</li>
          <li>Academic performance may fluctuate</li>
          <li>Early identification of warning signs is important</li>
        </ul>
      </ContentCard>

      <ContentCard title="Classroom Strategies" icon="📚">
        <ul>
          <li>Provide clear, consistent routines and expectations</li>
          <li>Offer flexible deadlines during difficult periods</li>
          <li>Create a quiet space for breaks if needed</li>
          <li>Use positive {t('behaviour', 'behavior')} management strategies</li>
          <li>Monitor for signs of mood changes</li>
          <li>Maintain confidentiality</li>
          <li>Communicate regularly with parents/guardians</li>
        </ul>
      </ContentCard>

      <ContentCard title="Accommodations" icon="♿">
        <ul>
          <li>Extended time for assignments and tests</li>
          <li>Reduced workload during mood episodes</li>
          <li>Alternative assessment methods</li>
          <li>Access to {t('counsellor', 'counselor')} or safe space</li>
          <li>Preferential seating</li>
          <li>Permission to leave class if needed</li>
          <li>Modified attendance policies</li>
        </ul>
      </ContentCard>

      <ContentCard title="Resources for Educators" icon="🎓">
        <ul>
          <li>
            <strong>MindEd:</strong> Free educational resource on child mental health (UK)
          </li>
          <li>
            <strong>Anna Freud Centre:</strong> Schools resources (UK)
          </li>
          <li>
            <strong>NAMI - Educators Resources:</strong> Training and materials (US)
          </li>
          <li>
            <strong>Child Mind Institute - Educators:</strong> Guides and strategies
          </li>
          <li>Professional development training on mental health</li>
        </ul>
      </ContentCard>
    </>
  );

// Carers Resources
const CarersResources: React.FC<{ language: Language; t: (uk: string, us: string) => string }> = ({
  language,
  t,
}) => (
  <>
    <ContentCard title="Caring for Someone with Bipolar Disorder" icon="🤲">
      <p>
        Caring for someone with bipolar disorder can be challenging but also rewarding. Your support
        is crucial to their recovery and well-being.
      </p>
      <p>
        <strong>Key {t('carer', 'caregiver')} roles:</strong>
      </p>
      <ul>
        <li>Providing emotional support and understanding</li>
        <li>Helping with medication management</li>
        <li>Monitoring for warning signs of episodes</li>
        <li>Assisting with daily activities during severe episodes</li>
        <li>Attending appointments and therapy sessions</li>
        <li>Managing crisis situations</li>
        <li>Advocating for appropriate care</li>
      </ul>
    </ContentCard>

    <ContentCard title="Communication Strategies" icon="💬">
      <ul>
        <li>Listen without judgment</li>
        <li>Use calm, supportive language</li>
        <li>Validate their feelings while maintaining boundaries</li>
        <li>Avoid confrontation during mood episodes</li>
        <li>Discuss concerns during stable periods</li>
        <li>Involve them in treatment decisions</li>
        <li>Respect their autonomy and independence</li>
      </ul>
    </ContentCard>

    <ContentCard title="Self-Care for Carers" icon="💚">
      <p>
        <strong>Remember: You cannot pour from an empty cup.</strong>
      </p>
      <ul>
        <li>Set boundaries and know your limits</li>
        <li>Take regular breaks and respite care</li>
        <li>Maintain your own physical and mental health</li>
        <li>Join {t('carer', 'caregiver')} support groups</li>
        <li>Seek professional support if needed</li>
        <li>Stay connected with friends and hobbies</li>
        <li>Don't neglect your own needs</li>
      </ul>
    </ContentCard>

    <ContentCard title="Support for Carers" icon="🤝">
      <ul>
        <li>
          <strong>Carers UK:</strong> www.carersuk.org - Advice, support, benefits information (UK)
        </li>
        <li>
          <strong>{t('Carers Trust', 'National Alliance for Caregiving')}:</strong>{' '}
          {t('carers.org', 'caregiving.org')} - Local support services
        </li>
        <li>
          <strong>Rethink Mental Illness - {t('Carers', 'Caregivers')}:</strong> Specific support
          for mental health {t('carers', 'caregivers')}
        </li>
        <li>
          <strong>{t("Carer's Allowance", 'Caregiver tax credits and benefits')}:</strong>{' '}
          Financial support may be available
        </li>
        <li>Respite care services</li>
        <li>
          {t('Carer', 'Caregiver')} assessments and support plans
        </li>
      </ul>
    </ContentCard>
  </>
);

// Healthcare Resources
const HealthcareResources: React.FC<{
  language: Language;
  t: (uk: string, us: string) => string;
}> = ({ language, t }) => (
  <>
    <ContentCard title="Clinical Guidelines" icon="📋">
      <p>
        <strong>Evidence-based treatment guidelines:</strong>
      </p>
      <ul>
        <li>
          <strong>NICE Guidelines (UK):</strong> Bipolar disorder: assessment and management
          (CG185)
        </li>
        <li>
          <strong>APA Practice Guidelines (US):</strong> Treatment of patients with bipolar disorder
        </li>
        <li>
          <strong>CANMAT/ISBD Guidelines:</strong> Management of patients with bipolar disorder
        </li>
        <li>
          <strong>WHO mhGAP:</strong> Mental Health Gap Action Programme guidelines
        </li>
        <li>
          <strong>SIGN Guidelines:</strong> Bipolar affective disorder (Scotland)
        </li>
      </ul>
    </ContentCard>

    <ContentCard title="Assessment & Monitoring" icon="🔍">
      <ul>
        <li>Use validated assessment tools (YMRS, HAM-D, MDQ, CGI)</li>
        <li>Comprehensive psychiatric and medical history</li>
        <li>Rule out medical causes and substance-induced symptoms</li>
        <li>Assess suicide risk at every contact</li>
        <li>Monitor medication levels and side effects</li>
        <li>Regular physical health monitoring</li>
        <li>Functional assessment and quality of life measures</li>
      </ul>
    </ContentCard>

    <ContentCard title="Treatment Principles" icon="⚕️">
      <ul>
        <li>Individualized treatment plans</li>
        <li>Combination of pharmacotherapy and psychotherapy</li>
        <li>Shared decision-making with patients</li>
        <li>Regular monitoring and adjustment</li>
        <li>Management of comorbidities</li>
        <li>Psychoeducation for patients and families</li>
        <li>Crisis planning and relapse prevention</li>
        <li>Multidisciplinary team approach</li>
      </ul>
    </ContentCard>

    <ContentCard title="Professional Resources" icon="📚">
      <ul>
        <li>
          <strong>Royal College of Psychiatrists:</strong> CPD and resources (UK)
        </li>
        <li>
          <strong>American Psychiatric Association:</strong> Practice guidelines and CME (US)
        </li>
        <li>
          <strong>International Society for Bipolar Disorders (ISBD):</strong> Research and education
        </li>
        <li>
          <strong>PubMed/Cochrane:</strong> Latest research evidence
        </li>
        <li>
          <strong>BMJ Best Practice:</strong> Clinical decision support
        </li>
        <li>
          <strong>UpToDate:</strong> Evidence-based clinical information
        </li>
      </ul>
    </ContentCard>
  </>
);
