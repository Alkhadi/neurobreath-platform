/**
 * NeuroBreath Buddy Evidence-Based Knowledge System
 * 
 * Provides accurate, research-backed responses with citations from:
 * - UK: NHS, NICE, SEND Code of Practice
 * - US: CDC, AAP, NIH
 * - International: PubMed peer-reviewed research
 * - World Health Organization (WHO)
 */

import { getNHSLinks } from './ai-coach/nhs'

export interface KnowledgeSource {
  title: string
  organization: string
  url: string
  type: 'clinical_guideline' | 'research' | 'government_health' | 'charity' | 'systematic_review'
  year?: number
  pmid?: string
  credibility: 'high' | 'moderate'
}

export interface EvidenceBasedResponse {
  answer: string
  sources: KnowledgeSource[]
  confidence: 'high' | 'moderate' | 'low'
  lastUpdated: string
}

/**
 * ADHD Evidence-Based Knowledge Base
 */
export const ADHDKnowledge: Record<string, EvidenceBasedResponse> = {
  'what_is_adhd': {
    answer: `**ADHD (Attention-Deficit/Hyperactivity Disorder)** is a neurodevelopmental condition characterized by persistent patterns of inattention, hyperactivity, and impulsivity that interfere with functioning or development.

**Key Facts:**
• **Neurological basis**: ADHD involves differences in brain structure and function, particularly in areas controlling executive function, attention, and impulse control
• **Hereditary**: 70-80% genetic heritability – strongest genetic component of all psychiatric conditions
• **Onset**: Symptoms must be present before age 12 (DSM-5 criteria)
• **Prevalence**: Affects 5% of children and 2.5% of adults worldwide
• **Chronic condition**: Continues into adulthood in 60-70% of cases

**Three Presentations:**
1. **Predominantly Inattentive** – Difficulty sustaining attention, easily distracted, forgetful
2. **Predominantly Hyperactive-Impulsive** – Fidgeting, restlessness, impulsive decisions
3. **Combined Presentation** – Both inattentive and hyperactive-impulsive symptoms

**Important**: ADHD is NOT caused by poor parenting, too much screen time, or dietary factors. It is a recognized medical condition supported by decades of research.`,
    sources: [
      { title: 'NICE Guideline NG87: ADHD Diagnosis and Management', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/ng87', type: 'clinical_guideline', year: 2018, credibility: 'high' },
      { title: 'CDC: What is ADHD?', organization: 'US CDC', url: 'https://www.cdc.gov/ncbddd/adhd/facts.html', type: 'government_health', credibility: 'high' },
      { title: 'DSM-5 ADHD Diagnostic Criteria', organization: 'American Psychiatric Association', url: 'https://www.psychiatry.org/patients-families/adhd', type: 'clinical_guideline', year: 2013, credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  },
  
  'adhd_treatment': {
    answer: `**Evidence-Based ADHD Treatment** follows a multimodal approach combining medication, behavioral interventions, and environmental modifications.

**UK NICE Guideline NG87 Recommendations:**

**Ages 4-6 (Preschool):**
• **First-line**: Parent training in behavior management (10+ week programs)
• **Medication**: Only considered if severe impairment persists after environmental modifications

**Ages 6-18 (School-Age):**
• **First-line**: Methylphenidate (Ritalin, Concerta) combined with behavioral interventions
• **Alternative**: Lisdexamfetamine (Vyvanse) if methylphenidate ineffective
• **Non-stimulants**: Atomoxetine, guanfacine for those who can't tolerate stimulants

**Adults:**
• **First-line**: Methylphenidate or lisdexamfetamine
• **Combination**: Medication + CBT or coaching for executive function support
• **Regular monitoring**: Annual reviews required for all on medication

**Behavioral Interventions (All Ages):**
• Cognitive Behavioral Therapy (CBT)
• Parent training programs (e.g., Triple P, Incredible Years)
• School-based interventions (daily report cards, behavior plans)
• Organizational skills training
• Social skills groups

**Effectiveness:**
• **Medication**: 70-80% response rate for stimulants
• **Behavioral interventions**: Moderate to large effect sizes when combined with medication
• **Combined treatment**: Superior outcomes to medication alone

**Important**: Treatment should be individualized. Regular monitoring essential. Always consult qualified healthcare professionals.`,
    sources: [
      { title: 'NICE NG87: ADHD Treatment Recommendations', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/ng87/chapter/Recommendations', type: 'clinical_guideline', year: 2018, credibility: 'high' },
      { title: 'AAP Clinical Practice Guideline for ADHD', organization: 'American Academy of Pediatrics', url: 'https://publications.aap.org/pediatrics/article/144/4/e20192528/81590', type: 'clinical_guideline', year: 2019, credibility: 'high' },
      { title: 'Multimodal Treatment Study of ADHD (MTA)', organization: 'NIMH', url: 'https://pubmed.ncbi.nlm.nih.gov/10517495/', type: 'research', pmid: '10517495', credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  },

  'adhd_medication': {
    answer: `**ADHD Medications** are the most evidence-based treatment for moderate-to-severe ADHD, with decades of research supporting safety and effectiveness.

**Stimulant Medications (First-Line):**

**Methylphenidate-based:**
• **Immediate-release**: Ritalin (3-4 hours), taken 2-3x daily
• **Extended-release**: Concerta (10-12 hours), once daily
• **Mechanism**: Increases dopamine and norepinephrine in prefrontal cortex
• **Response rate**: 70-80% effectiveness

**Amphetamine-based:**
• **Lisdexamfetamine**: Vyvanse/Elvanse (12-14 hours), once daily
• **Mixed amphetamine salts**: Adderall (4-6 hours immediate, 12 hours extended)
• **Response rate**: 70-80% effectiveness

**Non-Stimulant Medications (Second-Line):**
• **Atomoxetine** (Strattera): For those who can't tolerate stimulants. Takes 4-6 weeks for full effect
• **Guanfacine** (Intuniv): Helps with impulsivity and hyperactivity
• **Bupropion**: Off-label, helps with comorbid depression

**Safety Profile:**
• **Decades of research**: Stimulants are among the most studied medications in child psychiatry
• **Side effects**: Usually mild – reduced appetite, sleep difficulty, increased heart rate
• **Monitoring**: Blood pressure, heart rate, growth (children), mental health checked regularly
• **NOT addictive**: When taken as prescribed under medical supervision
• **Cardiovascular**: Comprehensive cardiac screening if family history of heart conditions

**UK Prescribing (NICE NG87):**
• Must be initiated by specialist (psychiatrist, pediatrician)
• Annual medication review required
• Shared care agreements allow GP continuation after stabilization
• "Drug holidays" (medication breaks) may be tried but not routinely recommended

**Important**: Medication should be part of comprehensive treatment plan including behavioral support and environmental modifications.`,
    sources: [
      { title: 'NICE NG87: Medication for ADHD', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/ng87/chapter/Recommendations#medication', type: 'clinical_guideline', year: 2018, credibility: 'high' },
      { title: 'Long-term Safety of Stimulant Medications', organization: 'Journal of Child Psychology', url: 'https://pubmed.ncbi.nlm.nih.gov/31411903/', type: 'systematic_review', pmid: '31411903', year: 2019, credibility: 'high' },
      { title: 'FDA: ADHD Medication Guide', organization: 'US FDA', url: 'https://www.fda.gov/drugs/information-drug-class/adhd-medication-guide', type: 'government_health', credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  }
}

/**
 * Autism Evidence-Based Knowledge Base
 */
export const AutismKnowledge: Record<string, EvidenceBasedResponse> = {
  'what_is_autism': {
    answer: `**Autism** (Autism Spectrum Disorder, ASD) is a lifelong neurodevelopmental condition characterized by differences in social communication, interaction, and patterns of behavior, interests, or activities.

**Key Characteristics:**
• **Social communication differences**: Understanding social cues, maintaining conversations, interpreting non-verbal communication
• **Sensory sensitivities**: Heightened or reduced responses to sensory input (sounds, lights, textures, tastes)
• **Repetitive behaviors**: Stimming (self-stimulatory behaviors), need for routine and predictability
• **Special interests**: Intense, focused interests in specific topics

**"Spectrum" Means:**
• Autism presents differently in every individual
• Support needs vary widely – from minimal to substantial
• Strengths AND challenges – many autistic people have exceptional abilities
• NOT a linear "mild to severe" scale

**Prevalence:**
• **Worldwide**: 1 in 100 children (WHO, 2022)
• **UK**: 1 in 100 people (700,000 autistic adults and children)
• **US**: 1 in 36 children (CDC, 2023)
• More commonly identified in males, but increasingly recognized in females (often masked)

**Causes:**
• **Genetic**: Highly heritable, multiple genes involved
• **Neurodevelopmental**: Brain develops and functions differently from neurotypical individuals
• **NOT caused by**: Vaccines, parenting, diet, or trauma

**Identity-First vs Person-First Language:**
• Many autistic people prefer "autistic person" (identity-first) over "person with autism" (person-first)
• Reflects autism as core part of identity, not separate condition to "have"
• Respect individual preferences

**Important**: Autism is not a disease or disorder to be "cured." It's a different way of experiencing and interacting with the world. Focus on support and accommodation, not elimination.`,
    sources: [
      { title: 'NICE Guideline CG128: Autism Recognition, Referral, Diagnosis and Management', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/cg128', type: 'clinical_guideline', year: 2021, credibility: 'high' },
      { title: 'CDC: Autism Spectrum Disorder Data & Statistics', organization: 'US CDC', url: 'https://www.cdc.gov/ncbddd/autism/data.html', type: 'government_health', year: 2023, credibility: 'high' },
      { title: 'WHO: Autism Fact Sheet', organization: 'World Health Organization', url: 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders', type: 'government_health', year: 2022, credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  },

  'autism_support': {
    answer: `**Evidence-Based Autism Support** focuses on understanding individual needs, building on strengths, and providing appropriate accommodations rather than trying to "normalize" autistic people.

**UK NICE Guideline CG170 Recommendations:**

**Children & Young People:**
• **Early intervention**: Intensive, structured, individualized programs (25+ hours/week recommended)
• **Communication support**: Speech and language therapy, visual supports, AAC (Augmentative and Alternative Communication)
• **Social skills**: Small group interventions in naturalistic settings
• **Sensory support**: Occupational therapy for sensory processing differences
• **Educational**: Individualized education plans (IEPs), EHCP in UK, specialized provisions

**Effective Interventions:**
• **TEACCH** (Treatment and Education of Autistic and Communication-Handicapped Children): Structured teaching
• **PECS** (Picture Exchange Communication System): For communication development
• **Social Stories**: Visual narratives for social understanding
• **Sensory integration therapy**: Occupational therapy-led
• **Parent-mediated interventions**: Training parents in interaction strategies

**What DOESN'T Work (and may be harmful):**
❌ **ABA (Applied Behavior Analysis)** – Controversial; many autistic adults report trauma from compliance-focused ABA
❌ **Conversion therapies** – Attempting to make autistic people act "normal"
❌ **Dietary interventions** (gluten-free, casein-free) – No robust evidence supports effectiveness
❌ **Chelation, hyperbaric oxygen, MMS** – Dangerous, no scientific basis

**Adults:**
• **Workplace adjustments**: Flexible hours, quiet workspace, clear instructions, written communication
• **Mental health support**: High rates of anxiety and depression require specialized support
• **Social support groups**: Peer support from other autistic adults
• **Independent living skills**: Occupational therapy, support workers where needed

**Best Practice Principles:**
✅ **Neurodiversity-affirming**: Accept and support autistic identity
✅ **Strengths-based**: Build on interests and abilities
✅ **Individualized**: Tailor support to person's unique profile
✅ **Collaborative**: Involve autistic person in all decisions
✅ **Communication**: Multiple modes (verbal, written, visual)
✅ **Sensory-friendly**: Reduce sensory overload, provide sensory tools

**UK Services:**
• **NHS autism assessment**: Via GP referral (long waiting lists)
• **Local authority support**: Social care, education support
• **Charities**: National Autistic Society, Ambitious about Autism, local groups`,
    sources: [
      { title: 'NICE CG170: Autism Management and Support', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/cg170', type: 'clinical_guideline', year: 2013, credibility: 'high' },
      { title: 'National Autistic Society: Support and Services', organization: 'UK National Autistic Society', url: 'https://www.autism.org.uk/', type: 'charity', credibility: 'high' },
      { title: 'Systematic Review of Autism Interventions', organization: 'Journal of Autism', url: 'https://pubmed.ncbi.nlm.nih.gov/32754780/', type: 'systematic_review', pmid: '32754780', year: 2020, credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  }
}

/**
 * Mental Health Evidence-Based Knowledge Base
 */
export const MentalHealthKnowledge: Record<string, EvidenceBasedResponse> = {
  'anxiety_treatment': {
    answer: `**Evidence-Based Anxiety Treatment** combines psychological therapies, self-help strategies, and medication when needed.

**NICE-Recommended Treatments:**

**First-Line (Mild-Moderate Anxiety):**
• **Guided self-help**: Structured CBT-based programs (6-8 weeks)
• **Psychoeducation**: Understanding anxiety, identifying triggers
• **Exercise**: 30+ minutes moderate activity 3-5x/week
• **Sleep hygiene**: Consistent sleep schedule, wind-down routine

**Second-Line (Moderate-Severe):**
• **Cognitive Behavioral Therapy (CBT)**: Gold standard – 12-20 sessions
  - Identifies unhelpful thought patterns
  - Gradual exposure to feared situations
  - Develops coping strategies
  - 50-75% significant improvement rate

• **Mindfulness-Based Cognitive Therapy (MBCT)**: For generalized anxiety, recurrent anxiety
• **Applied relaxation**: Progressive muscle relaxation, breathing techniques

**Medications (if psychological therapies insufficient):**
• **SSRIs (Selective Serotonin Reuptake Inhibitors)**: Sertraline, escitalopram – first-line
• **SNRIs**: Venlafaxine, duloxetine – if SSRIs ineffective
• **Pregabalin**: For generalized anxiety disorder
• **Short-term benzodiazepines**: ONLY for crisis situations (2-4 weeks maximum) – risk of dependence

**Self-Help Strategies:**
• **5-4-3-2-1 Grounding**: Use 5 senses to anchor in present moment
• **Box breathing**: 4-4-4-4 pattern (inhale-hold-exhale-hold)
• **Worry time**: Schedule 15 minutes daily to address worries, postpone at other times
• **Challenge catastrophic thinking**: "What's the evidence?" "What's the worst that could happen, realistically?"
• **Reduce caffeine and alcohol**: Both exacerbate anxiety

**When to Seek Professional Help:**
⚠️ Anxiety interfering with daily life (work, relationships, activities)
⚠️ Physical symptoms (chest pain, dizziness, panic attacks)
⚠️ Avoiding situations due to anxiety
⚠️ Self-medicating with alcohol/drugs
⚠️ Thoughts of self-harm

**UK Access:**
• **NHS Talking Therapies**: Free, GP referral or self-referral
• **Crisis support**: Samaritans 116 123, SHOUT text 85258`,
    sources: [
      { title: 'NICE Guideline CG113: Generalised Anxiety Disorder', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/cg113', type: 'clinical_guideline', year: 2011, credibility: 'high' },
      { title: 'NHS: Generalised Anxiety Disorder in Adults', organization: 'NHS', url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/', type: 'government_health', credibility: 'high' },
      { title: 'Efficacy of CBT for Anxiety: Meta-Analysis', organization: 'JAMA Psychiatry', url: 'https://pubmed.ncbi.nlm.nih.gov/29800103/', type: 'systematic_review', pmid: '29800103', year: 2018, credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  },

  'depression_treatment': {
    answer: `**Evidence-Based Depression Treatment** follows a stepped-care approach based on severity.

**NICE Stepped Care Model for Depression:**

**Step 1: Mild Depression**
• **Watchful waiting**: Monitor for 2 weeks
• **Sleep hygiene**: Consistent routine
• **Exercise**: 30 minutes moderate activity 3x/week (as effective as medication for mild depression)
• **Guided self-help**: CBT-based programs, online tools

**Step 2: Mild-Moderate Depression**
• **Low-intensity psychological interventions**:
  - Guided self-help (6-8 sessions)
  - Computerized CBT (e.g., Beating the Blues)
  - Group CBT or behavioral activation
• **Structured exercise programs**: Supervised 3x/week for 10-14 weeks

**Step 3: Moderate-Severe Depression**
• **High-intensity psychological therapy**:
  - **CBT**: 16-20 sessions over 3-4 months
  - **Interpersonal Therapy (IPT)**: Focuses on relationships
  - **Behavioral Activation**: Scheduling rewarding activities
  
• **Antidepressant Medication**:
  - **SSRIs**: Sertraline, fluoxetine, citalopram (first-line)
  - **SNRIs**: Venlafaxine, duloxetine
  - **Mirtazapine**: If sleep/appetite affected
  - Takes 2-4 weeks to work; continue 6-12 months after recovery

• **Combined treatment**: Medication + therapy more effective than either alone for moderate-severe depression

**Step 4: Severe/Complex Depression**
• **Crisis Team** or inpatient care if needed
• **Specialist mental health services**
• **Intensive psychological therapy**
• **Medication combinations** or alternative medications
• **ECT (Electroconvulsive Therapy)**: For severe, treatment-resistant depression or immediate risk

**Lifestyle Interventions (All Severities):**
• **Sleep**: 7-9 hours, consistent schedule
• **Exercise**: Single most effective self-help strategy
• **Nutrition**: Balanced diet, omega-3 fatty acids
• **Social connection**: Maintain relationships even when difficult
• **Avoid alcohol**: Depressant that worsens mood

**What TO DO:**
✅ Talk to someone you trust
✅ Contact GP for assessment
✅ Self-refer to NHS Talking Therapies
✅ Use crisis helplines when needed
✅ Practice self-compassion – depression is illness, not weakness

**What NOT to do:**
❌ Isolate yourself completely
❌ Make major life decisions during episode
❌ Self-medicate with alcohol/drugs
❌ Ignore thoughts of self-harm

**Crisis Support (UK):**
• **999** or **112** if immediate danger
• **Samaritans**: 116 123 (24/7)
• **SHOUT Crisis Text**: Text 85258
• **NHS 111** (option 2 for mental health)`,
    sources: [
      { title: 'NICE Guideline CG90: Depression in Adults', organization: 'UK NICE', url: 'https://www.nice.org.uk/guidance/cg90', type: 'clinical_guideline', year: 2009, credibility: 'high' },
      { title: 'NHS: Clinical Depression', organization: 'NHS', url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/', type: 'government_health', credibility: 'high' },
      { title: 'Exercise for Depression: Cochrane Review', organization: 'Cochrane', url: 'https://pubmed.ncbi.nlm.nih.gov/32493046/', type: 'systematic_review', pmid: '32493046', year: 2020, credibility: 'high' }
    ],
    confidence: 'high',
    lastUpdated: '2025-01-15'
  }
}

/**
 * Query knowledge base or fallback to APIs
 */
export async function getEvidenceBasedAnswer(
  question: string,
  topic?: string
): Promise<EvidenceBasedResponse | null> {
  const q = question.toLowerCase()
  
  // Search ADHD knowledge
  for (const [key, response] of Object.entries(ADHDKnowledge)) {
    if (q.includes(key.replace(/_/g, ' ')) || 
        (key.includes('treatment') && q.includes('treat')) ||
        (key.includes('medication') && (q.includes('medication') || q.includes('medicine')))) {
      return response
    }
  }
  
  // Search Autism knowledge
  for (const [key, response] of Object.entries(AutismKnowledge)) {
    if (q.includes(key.replace(/_/g, ' '))) {
      return response
    }
  }
  
  // Search Mental Health knowledge
  for (const [key, response] of Object.entries(MentalHealthKnowledge)) {
    if (q.includes(key.replace(/_/g, ' '))) {
      return response
    }
  }
  
  // Fallback: Try to get NHS links
  const nhsLinks = getNHSLinks(question, topic)
  if (nhsLinks.length > 0) {
    return {
      answer: `For evidence-based information about your question, please see these trusted NHS resources:`,
      sources: nhsLinks.map(link => ({
        title: link.title,
        organization: 'NHS',
        url: link.url,
        type: 'government_health',
        credibility: 'high'
      } as KnowledgeSource)),
      confidence: 'moderate',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  }
  
  return null
}

/**
 * Format response with citations
 */
export function formatResponseWithCitations(response: EvidenceBasedResponse): string {
  let formatted = response.answer
  
  if (response.sources.length > 0) {
    formatted += `\n\n**Evidence Sources:**\n`
    response.sources.forEach((source, idx) => {
      formatted += `${idx + 1}. [${source.title}](${source.url}) – ${source.organization}`
      if (source.year) formatted += ` (${source.year})`
      if (source.pmid) formatted += ` [PubMed: ${source.pmid}]`
      formatted += `\n`
    })
  }
  
  formatted += `\n_Last updated: ${response.lastUpdated}_`
  
  return formatted
}
