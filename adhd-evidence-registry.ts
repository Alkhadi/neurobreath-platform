/**
 * ADHD Evidence Registry
 * 
 * Comprehensive evidence-based ADHD resource registry following UK-first approach.
 * All sources verified January 2025.
 * 
 * Structure:
 * - UK Primary Sources (NHS, NICE NG87, SEND Code, Equality Act)
 * - US Primary Sources (CDC, AAP, DSM-5, CHADD)
 * - PubMed Systematic Reviews & Meta-Analyses with PMIDs
 * - Evidence-based interventions with citations
 */

export interface EvidenceSource {
  id: string;
  title: string;
  organization: string;
  country: 'UK' | 'US' | 'International';
  type: 'guideline' | 'systematic_review' | 'meta_analysis' | 'legislation' | 'clinical_practice' | 'charity';
  url: string;
  pmid?: string; // PubMed ID for research papers
  yearPublished: number;
  lastUpdated?: number;
  keyFindings: string[];
  relevantFor: ('diagnosis' | 'treatment' | 'medication' | 'behavioral' | 'education' | 'workplace' | 'children' | 'adults' | 'comorbidity')[];
  summary: string;
}

export interface InterventionEvidence {
  id: string;
  intervention: string;
  category: 'medication' | 'behavioral' | 'educational' | 'workplace' | 'lifestyle' | 'psychological';
  ageGroup: 'preschool' | 'school_age' | 'adolescent' | 'adult' | 'all_ages';
  evidenceLevel: 'strong' | 'moderate' | 'emerging' | 'limited';
  description: string;
  effectiveness: string;
  citations: string[]; // Array of evidence source IDs
  keyStudies?: string[]; // PMIDs or study references
}

// ============================================================================
// UK PRIMARY SOURCES
// ============================================================================

export const UK_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'uk_nice_ng87',
    title: 'NICE Guideline NG87: Attention Deficit Hyperactivity Disorder: Diagnosis and Management',
    organization: 'National Institute for Health and Care Excellence (NICE)',
    country: 'UK',
    type: 'guideline',
    url: 'https://www.nice.org.uk/guidance/ng87',
    yearPublished: 2018,
    lastUpdated: 2019,
    keyFindings: [
      'Diagnosis must be made by specialist psychiatrist, pediatrician, or qualified healthcare professional',
      'Symptoms must meet DSM-5 or ICD-11 criteria with impairment in 2+ settings',
      'Symptoms present before age 12, lasting 6+ months',
      'For children 4-6: Parent training in behavior management is first-line treatment',
      'For children 6+: FDA-approved medications combined with behavioral interventions',
      'Methylphenidate is first-line pharmacological treatment for children/young people',
      'Multidisciplinary specialist ADHD teams recommended for complex cases',
      'Annual review required for those on medication'
    ],
    relevantFor: ['diagnosis', 'treatment', 'medication', 'behavioral', 'children', 'adults'],
    summary: 'Comprehensive UK clinical guideline covering recognition, diagnosis, and management of ADHD across all ages. Emphasizes multimodal treatment approach with behavioral interventions as first-line for young children, combined medication and behavioral therapy for school-aged children and adults. Scheduled for review May 2025.'
  },
  {
    id: 'uk_nhs_adhd',
    title: 'NHS ADHD Diagnosis and Treatment Services',
    organization: 'National Health Service (NHS)',
    country: 'UK',
    type: 'clinical_practice',
    url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/',
    yearPublished: 2024,
    keyFindings: [
      'Waiting times have escalated to 4+ years for children, 8+ years for adults',
      'ADHD is under-recognized, under-diagnosed, and under-treated in England',
      'Digital test approved for NHS use to accelerate diagnosis in children (2024)',
      'Independent ADHD Taskforce (2024) recommends holistic, stepped approach',
      'Shared care agreements allow transfer from specialist to primary care after stabilization',
      'Environmental modifications are first-line approach for all ages'
    ],
    relevantFor: ['diagnosis', 'treatment', 'children', 'adults'],
    summary: 'NHS ADHD services follow NICE NG87 guidelines. Recent 2024 taskforce highlighted major access issues and recommended cross-sector collaboration involving primary care, education, and social services. Digital diagnosis tools being implemented to reduce waiting times.'
  },
  {
    id: 'uk_send_code',
    title: 'SEND Code of Practice: 0 to 25 Years',
    organization: 'UK Department for Education and Department of Health',
    country: 'UK',
    type: 'legislation',
    url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25',
    yearPublished: 2015,
    keyFindings: [
      'ADHD classified under "Social, Emotional and Mental Health (SEMH) needs"',
      'Early identification and tailored support required',
      'Education, Health, and Care Plans (EHCPs) are legally binding',
      'Schools must have SEND policy and appoint SENCO',
      'Parents involved at every stage of assessment and planning',
      'Reasonable adjustments required by law',
      'Support should be outcome-focused, not just challenge management'
    ],
    relevantFor: ['education', 'children', 'diagnosis'],
    summary: 'Legal framework guiding educational settings in providing support for children with SEND, including ADHD. Emphasizes family-centered approach, early intervention, and collaboration between education, health, and care services. Updated following Children and Families Act 2014.'
  },
  {
    id: 'uk_equality_act',
    title: 'Equality Act 2010: Disability Provisions for ADHD',
    organization: 'UK Parliament',
    country: 'UK',
    type: 'legislation',
    url: 'https://www.legislation.gov.uk/ukpga/2010/15/contents',
    yearPublished: 2010,
    keyFindings: [
      'ADHD recognized as disability if long-term (12+ months) and has substantial adverse effect',
      'Employers must make reasonable adjustments for employees with ADHD',
      'Adjustments include workplace environment, work patterns, and support provisions',
      'Formal diagnosis helpful but not strictly required',
      'Focus on lived experience and practical effects of condition',
      'Schools automatically add diagnosed pupils to SEND register',
      'Failure to make reasonable adjustments is unlawful discrimination'
    ],
    relevantFor: ['workplace', 'education', 'adults', 'children'],
    summary: 'UK legislation protecting individuals with disabilities including ADHD. Mandates reasonable workplace and educational adjustments. Definition focuses on functional impact rather than diagnosis alone. Applies to employers, education providers, and service providers.'
  },
  {
    id: 'uk_addiss',
    title: 'ADDISS - National ADHD Information and Support Service',
    organization: 'ADDISS (Registered Charity)',
    country: 'UK',
    type: 'charity',
    url: 'https://www.addiss.co.uk/',
    yearPublished: 1997,
    keyFindings: [
      'Only national ADHD charity in the UK',
      'Operates helpline: 020 8952 2800',
      'Provides training programs including "123 Magic" for parents and practitioners',
      'Annual national conferences bringing together professionals and individuals',
      'Supports multidisciplinary assessment and treatment protocol',
      'Works with ADHD support groups across the UK',
      'Offers extensive bookshop with resources for all ages'
    ],
    relevantFor: ['education', 'children', 'adults', 'treatment'],
    summary: 'UK\'s primary ADHD charity providing people-friendly information, support services, training, and resources. Supports multimodal treatment approach including education, behavioral interventions, and medication. Operates volunteer-run helpline and maintains network of local support groups.'
  }
];

// ============================================================================
// US PRIMARY SOURCES
// ============================================================================

export const US_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'us_cdc_adhd',
    title: 'CDC ADHD Guidelines and Resources',
    organization: 'Centers for Disease Control and Prevention (CDC)',
    country: 'US',
    type: 'guideline',
    url: 'https://www.cdc.gov/adhd/',
    yearPublished: 2024,
    keyFindings: [
      'References AAP guidelines for children/adolescents diagnosis and treatment',
      'Uses DSM-5 criteria for ADHD diagnosis across all ages',
      '6+ symptoms required for children up to 16 years; 5+ for ages 17+',
      'Symptoms present in 2+ settings, onset before age 12',
      'Over 50% of adults with ADHD diagnosed in adulthood',
      'Approximately 46% of adults with ADHD received care via telehealth',
      'Medication shortages affected 71.5% of adults on stimulants in 2023',
      'Strong heritable component requires family history assessment'
    ],
    relevantFor: ['diagnosis', 'treatment', 'medication', 'adults', 'children'],
    summary: 'CDC provides ADHD information and resources, referencing AAP guidelines for pediatric care and DSM-5 for diagnosis. Recent data highlights telehealth role, medication shortage issues, and need for adult ADHD guidelines (expected from APSARD in late 2024/early 2025).'
  },
  {
    id: 'us_aap_guideline',
    title: 'AAP Clinical Practice Guideline for ADHD (2019 Update)',
    organization: 'American Academy of Pediatrics (AAP)',
    country: 'US',
    type: 'clinical_practice',
    url: 'https://publications.aap.org/pediatrics/article/144/4/e20192528/81590/Clinical-Practice-Guideline-for-the-Diagnosis',
    yearPublished: 2019,
    keyFindings: [
      'Applies to children and adolescents aged 4-18 years',
      'Most children with ADHD have at least one comorbidity; 18% have 3+',
      'For ages 4-6: Parent training in behavior management (PTBM) first-line',
      'For ages 6+: FDA-approved medications + PTBM and/or behavioral classroom interventions',
      'Methylphenidate first-line medication for children/young people',
      'Treatment should follow chronic care model and medical home principles',
      'Screening for coexisting conditions essential (anxiety, depression, learning disorders)',
      'School involvement critical: IEPs or 504 plans recommended'
    ],
    relevantFor: ['diagnosis', 'treatment', 'medication', 'behavioral', 'education', 'children', 'comorbidity'],
    summary: 'Updated AAP guideline emphasizing comorbidity assessment and multimodal treatment. Provides specific recommendations by age group. Acknowledges systemic barriers including limited mental health specialist access and inadequate pediatric mental health training.'
  },
  {
    id: 'us_dsm5_adhd',
    title: 'DSM-5 Diagnostic Criteria for ADHD',
    organization: 'American Psychiatric Association (APA)',
    country: 'US',
    type: 'guideline',
    url: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    yearPublished: 2013,
    lastUpdated: 2022,
    keyFindings: [
      'ADHD classified as neurodevelopmental disorder',
      '6+ symptoms (5+ for ages 17+) in inattention and/or hyperactivity-impulsivity domains',
      'Symptoms present before age 12 (raised from DSM-IV age 7)',
      'Symptoms occur in 2+ settings and cause significant impairment',
      'Changed from "subtypes" to "presentations" to reflect symptom variability',
      'Allows co-diagnosis with Autism Spectrum Disorder (not permitted in DSM-IV)',
      'Three presentations: Combined, Predominantly Inattentive, Predominantly Hyperactive-Impulsive',
      'Severity specifiers: Mild, Moderate, Severe'
    ],
    relevantFor: ['diagnosis', 'children', 'adults'],
    summary: 'Standard diagnostic manual used globally. DSM-5 made key changes from DSM-IV including later age of onset recognition (age 12 vs 7), lower symptom threshold for adults, and allowing ASD comorbidity. No biological markers diagnostic for ADHD; criteria remain behavioral.'
  },
  {
    id: 'us_chadd',
    title: 'CHADD - Children and Adults with ADHD',
    organization: 'CHADD (National Non-Profit)',
    country: 'US',
    type: 'charity',
    url: 'https://chadd.org/',
    yearPublished: 1987,
    keyFindings: [
      'Serves 17 million Americans with ADHD',
      'Operates National Resource Center on ADHD (funded by CDC)',
      'Helpline: 1-866-200-8098 (English and Spanish)',
      'Publishes "Attention Magazine" bimonthly',
      'Provides professional and ADHD center directories',
      'Hosts International Conference on ADHD and webinar series',
      'Advocacy Action Center for policy influence',
      'Contributing to adult ADHD guidelines development'
    ],
    relevantFor: ['education', 'treatment', 'children', 'adults'],
    summary: 'Primary US ADHD advocacy and support organization. Operates CDC-funded National Resource Center providing evidence-based information, training, and live helpline. Nationwide network of local chapters offering support groups and community programming.'
  },
  {
    id: 'us_adaa_anxiety',
    title: 'ADAA: Anxiety and ADHD Comorbidity Resources',
    organization: 'Anxiety and Depression Association of America (ADAA)',
    country: 'US',
    type: 'clinical_practice',
    url: 'https://adaa.org/understanding-anxiety/related-illnesses/other-related-conditions/adult-adhd',
    yearPublished: 2024,
    keyFindings: [
      'Over 2/3 of individuals with ADHD have at least one coexisting condition',
      '50% of adults with ADHD also have anxiety disorder',
      '15-35% of children with ADHD have anxiety (vs 5-15% general population)',
      'Overlapping symptoms: difficulty concentrating, restlessness, sleep issues',
      'Girls with ADHD more prone to depression, anxiety, and eating disorders',
      'Treatment: Address most impairing condition first',
      'CBT beneficial for both conditions',
      'Stimulant medications may exacerbate anxiety in some individuals'
    ],
    relevantFor: ['diagnosis', 'treatment', 'comorbidity', 'children', 'adults'],
    summary: 'ADAA provides specialized resources on anxiety-ADHD comorbidity. Highlights diagnostic challenges due to overlapping symptoms and emphasizes need for comprehensive assessment. Recommends treating most impairing condition first, with CBT as effective non-pharmacological intervention.'
  }
];

// ============================================================================
// PUBMED SYSTEMATIC REVIEWS & META-ANALYSES
// ============================================================================

export const PUBMED_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'pubmed_38523592',
    title: 'Systematic Review: ADHD Treatment in Children and Adolescents',
    organization: 'PubMed / Various Research Institutions',
    country: 'International',
    type: 'systematic_review',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38523592/',
    pmid: '38523592',
    yearPublished: 2024,
    keyFindings: [
      'Pharmacological interventions (stimulants) have strongest evidence base',
      'Non-pharmacological treatments show promise but need more robust blinded studies',
      'Combination therapies recommended but limited systematic superiority over monotherapy',
      'Gap in research for long-term outcomes and adolescent-specific treatments'
    ],
    relevantFor: ['treatment', 'medication', 'behavioral', 'children'],
    summary: 'Comprehensive systematic review examining pharmacological and non-pharmacological ADHD treatments. Confirms stimulants as most evidence-based but highlights need for more research on combination approaches and long-term effects.'
  },
  {
    id: 'pubmed_32845025',
    title: 'Meta-Analysis: ADHD Interventions for Children with Autism Spectrum Disorder',
    organization: 'PubMed / Research Team',
    country: 'International',
    type: 'meta_analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32845025/',
    pmid: '32845025',
    yearPublished: 2020,
    keyFindings: [
      'Methylphenidate reduced hyperactivity and inattention in children with ASD+ADHD',
      'Atomoxetine showed efficacy in reducing inattention in ASD+ADHD population',
      'Quality of evidence low to very low',
      'Lack of long-term continuation data',
      'Stimulants associated with adverse events including dropout rates'
    ],
    relevantFor: ['treatment', 'medication', 'children', 'comorbidity'],
    summary: 'Meta-analysis of ADHD treatments for children with co-occurring autism. Found methylphenidate and atomoxetine effective but highlighted quality concerns and need for long-term safety data in this population.'
  },
  {
    id: 'pubmed_30097390',
    title: 'Meta-Analysis: Comparative Efficacy of ADHD Medications Across Ages',
    organization: 'PubMed / International Research Consortium',
    country: 'International',
    type: 'meta_analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30097390/',
    pmid: '30097390',
    yearPublished: 2018,
    keyFindings: [
      'Methylphenidate preferred first-choice for children (efficacy + safety)',
      'Amphetamines preferred first-choice for adults (efficacy + safety)',
      'Amphetamines: SMD -1.02 for children, -0.79 for adults (clinician ratings)',
      'Atomoxetine, methylphenidate, modafinil less tolerated than placebo in adults',
      'Urgent need for long-term effects research in children'
    ],
    relevantFor: ['medication', 'treatment', 'children', 'adults'],
    summary: 'Large meta-analysis comparing ADHD medications across age groups. Provides age-specific recommendations: methylphenidate for children, amphetamines for adults. Highlights tolerability concerns and need for long-term data.'
  },
  {
    id: 'pubmed_32014701',
    title: 'Meta-Analysis: ADHD Medication Protective Effects on Functional Outcomes',
    organization: 'PubMed / Research Team',
    country: 'International',
    type: 'meta_analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32014701/',
    pmid: '32014701',
    yearPublished: 2020,
    keyFindings: [
      'ADHD medication shows robust protective effect on multiple functional outcomes',
      'Confirmed protection for: mood disorders, suicidality, criminality, substance use disorders',
      'Protection for: accidents/injuries (including TBI and motor vehicle crashes)',
      'Protection for: educational outcomes and academic performance',
      'Supports early diagnosis and treatment for individuals with ADHD'
    ],
    relevantFor: ['medication', 'treatment', 'children', 'adults'],
    summary: 'Meta-analysis examining real-world functional outcomes of ADHD medication. Found significant protective effects across multiple life domains including mental health, safety, education, and legal outcomes. Strong evidence supporting treatment benefits beyond symptom reduction.'
  },
  {
    id: 'pubmed_38178649',
    title: 'Systematic Review: Executive Function Interventions in ADHD Youth',
    organization: 'PubMed / Research Consortium',
    country: 'International',
    type: 'systematic_review',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38178649/',
    pmid: '38178649',
    yearPublished: 2024,
    keyFindings: [
      'Pharmacological interventions most effective for EF deficits',
      'Psychological and digital interventions show favorable outcomes',
      'Combination approaches recommended for optimal results',
      'Lack of outcome standardization limits treatment comparison',
      'Need for research on persistence of intervention effects'
    ],
    relevantFor: ['treatment', 'medication', 'behavioral', 'children'],
    summary: 'Review of interventions targeting executive function deficits in youth with ADHD. Pharmacological treatments most effective, with psychological and digital interventions showing promise. Highlights need for standardized outcomes and long-term follow-up.'
  },
  {
    id: 'pubmed_40010649',
    title: 'Meta-Analysis: Physical Activity Effects on Executive Functions in ADHD',
    organization: 'PubMed / Exercise Science Research Group',
    country: 'International',
    type: 'meta_analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40010649/',
    pmid: '40010649',
    yearPublished: 2024,
    keyFindings: [
      'Physical activity significantly improves EF in school-aged children with ADHD',
      'Moderate to large effects on cognitive flexibility and working memory',
      'Small to medium effect on inhibition switching',
      'Cognitively engaging exercises more effective than simple aerobic exercise',
      'Effects moderated by duration, frequency, and intervention length'
    ],
    relevantFor: ['behavioral', 'treatment', 'children'],
    summary: 'Meta-analysis examining physical activity interventions for ADHD. Found significant positive effects on executive functions, particularly with cognitively engaging exercises. Provides evidence for exercise as adjunct treatment.'
  },
  {
    id: 'pubmed_36794797',
    title: 'Meta-Analysis: Cognitive Behavioral Therapy for Adult ADHD',
    organization: 'PubMed / Clinical Psychology Research Team',
    country: 'International',
    type: 'meta_analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36794797/',
    pmid: '36794797',
    yearPublished: 2023,
    keyFindings: [
      'CBT effective in reducing core ADHD symptoms in adults',
      'Reduces depression and anxiety, increases self-esteem and quality of life',
      'Effective both individually and in groups',
      'Effective with or without medication (combined shows greater initial improvement)',
      'Traditional CBT as effective as specialized ADHD-CBT approaches'
    ],
    relevantFor: ['treatment', 'behavioral', 'adults'],
    summary: 'Meta-analysis of CBT for adult ADHD. Demonstrates effectiveness for core symptoms and comorbid emotional difficulties. CBT works with or without medication, though combination therapy shows faster initial gains.'
  },
  {
    id: 'pubmed_31411903',
    title: 'RCT: Behavioral Interventions Reduce Medication Need in Children',
    organization: 'PubMed / Pediatric Research Group',
    country: 'International',
    type: 'clinical_practice',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31411903/',
    pmid: '31411903',
    yearPublished: 2019,
    keyFindings: [
      'Behavioral consultation reduced medication initiation by approximately 50%',
      'Children with behavioral support used lower medication doses when needed',
      '40% reduction in total methylphenidate exposure over school year',
      'No significant difference in end-of-year behavior ratings vs no behavioral support',
      'Behavioral consultation costs offset by reduced medication use'
    ],
    relevantFor: ['behavioral', 'treatment', 'children', 'medication'],
    summary: 'Randomized trial showing behavioral interventions as viable first-line treatment for children with ADHD. Significantly reduced medication need without compromising outcomes, demonstrating cost-effectiveness of behavioral approaches.'
  },
  {
    id: 'pubmed_33528652',
    title: 'Study: ADHD Impact on Adult Workplace Functioning',
    organization: 'PubMed / Occupational Health Research',
    country: 'International',
    type: 'clinical_practice',
    url: 'https://pubmed.ncbi.nlm.nih.gov/33528652/',
    pmid: '33528652',
    yearPublished: 2021,
    keyFindings: [
      'Adults with ADHD report not meeting own standards and perceived potential',
      'Challenges with executive functioning, time management, organization',
      'Difficulty with sustained focus and task completion',
      'Higher stress levels and work-related mental health issues',
      'May struggle with setting personal boundaries leading to burnout'
    ],
    relevantFor: ['workplace', 'adults'],
    summary: 'Research examining workplace challenges faced by adults with ADHD. Highlights executive function deficits, time management issues, and increased mental health risks. Emphasizes need for workplace accommodations and support.'
  },
  {
    id: 'pubmed_36451126',
    title: 'Study: ADHD, Stress, and Workplace Mental Health',
    organization: 'PubMed / Occupational Psychology Research',
    country: 'International',
    type: 'clinical_practice',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36451126/',
    pmid: '36451126',
    yearPublished: 2022,
    keyFindings: [
      'Adults with ADHD prone to higher workplace stress levels',
      'Increased sickness absence days compared to non-ADHD adults',
      'Higher rates of work-related mental illness',
      'Disclosure decisions impact accommodation access',
      'Workplace accommodations can significantly improve outcomes'
    ],
    relevantFor: ['workplace', 'adults', 'treatment'],
    summary: 'Study examining stress and mental health outcomes for adults with ADHD in workplace settings. Found increased vulnerability to work-related stress and mental health issues, highlighting importance of accommodations and supportive work environments.'
  }
];

// ============================================================================
// EVIDENCE-BASED INTERVENTIONS
// ============================================================================

export const ADHD_INTERVENTIONS: InterventionEvidence[] = [
  // MEDICATION INTERVENTIONS
  {
    id: 'med_methylphenidate_children',
    intervention: 'Methylphenidate (Stimulant)',
    category: 'medication',
    ageGroup: 'school_age',
    evidenceLevel: 'strong',
    description: 'First-line pharmacological treatment for children and young people aged 6+. Available in immediate-release and long-acting formulations.',
    effectiveness: 'Strong evidence for reducing hyperactivity and inattention. SMD -0.78 (95% CI -0.93 to -0.62) for clinician ratings. Preferred first-choice considering both efficacy and safety profile.',
    citations: ['uk_nice_ng87', 'us_aap_guideline', 'pubmed_30097390', 'pubmed_32845025'],
    keyStudies: ['30097390', '32845025']
  },
  {
    id: 'med_amphetamines_adults',
    intervention: 'Amphetamines (Stimulant)',
    category: 'medication',
    ageGroup: 'adult',
    evidenceLevel: 'strong',
    description: 'First-line pharmacological treatment for adults with ADHD. Includes dextroamphetamine and mixed amphetamine salts.',
    effectiveness: 'Preferred first-choice for adults. SMD -0.79 (95% CI -0.99 to -0.58) for clinician ratings. Superior efficacy but monitor for tolerability (OR 3.26 for adverse events vs placebo).',
    citations: ['us_cdc_adhd', 'pubmed_30097390'],
    keyStudies: ['30097390']
  },
  {
    id: 'med_atomoxetine',
    intervention: 'Atomoxetine (Non-Stimulant)',
    category: 'medication',
    ageGroup: 'all_ages',
    evidenceLevel: 'strong',
    description: 'Non-stimulant medication option for those who cannot tolerate or do not respond to stimulants. Selective norepinephrine reuptake inhibitor.',
    effectiveness: 'Effective for reducing inattention. SMD -0.56 for children, -0.45 for adults. Lower efficacy than stimulants but useful alternative. Shows efficacy in children with ASD+ADHD.',
    citations: ['uk_nice_ng87', 'pubmed_30097390', 'pubmed_32845025'],
    keyStudies: ['30097390', '32845025']
  },

  // BEHAVIORAL INTERVENTIONS
  {
    id: 'behav_parent_training',
    intervention: 'Parent Training in Behavior Management (PTBM)',
    category: 'behavioral',
    ageGroup: 'preschool',
    evidenceLevel: 'strong',
    description: 'Structured programs teaching parents evidence-based behavior management techniques. First-line treatment for children aged 4-6.',
    effectiveness: 'Strong evidence as first-line treatment for preschool children. Reduces need for medication, improves parent-child interactions, and addresses challenging behaviors. Programs like "123 Magic" widely used.',
    citations: ['uk_nice_ng87', 'us_aap_guideline', 'uk_addiss', 'pubmed_31411903'],
    keyStudies: ['31411903']
  },
  {
    id: 'behav_classroom_interventions',
    intervention: 'Behavioral Classroom Interventions',
    category: 'educational',
    ageGroup: 'school_age',
    evidenceLevel: 'strong',
    description: 'School-based interventions including behavior charts, token economies, modified seating, structured routines, and teacher training.',
    effectiveness: 'Significant effects on teacher-rated ADHD symptoms (SMD = 0.25). Reduces disruptive behaviors and improves academic outcomes. Should be combined with medication for school-age children per AAP/NICE guidelines.',
    citations: ['uk_nice_ng87', 'us_aap_guideline', 'uk_send_code'],
    keyStudies: ['38523592']
  },
  {
    id: 'behav_cbt_adults',
    intervention: 'Cognitive Behavioral Therapy (CBT)',
    category: 'psychological',
    ageGroup: 'adult',
    evidenceLevel: 'strong',
    description: 'Structured therapy targeting ADHD-specific challenges including organization, time management, procrastination, and emotional regulation.',
    effectiveness: 'Effective for reducing core ADHD symptoms, depression, and anxiety. Increases self-esteem and quality of life. Works individually or in groups. Effective with or without medication (combined shows faster initial gains).',
    citations: ['us_cdc_adhd', 'pubmed_36794797', 'us_adaa_anxiety'],
    keyStudies: ['36794797', '28413900', '37483263']
  },
  {
    id: 'behav_executive_function_training',
    intervention: 'Executive Function Training',
    category: 'psychological',
    ageGroup: 'school_age',
    evidenceLevel: 'moderate',
    description: 'Computer-based and therapist-led programs targeting working memory, cognitive flexibility, planning, and organization skills.',
    effectiveness: 'Moderate evidence for improving executive skills. Metacognitive training shows promise for young children. Best results when combined with other interventions. Effects moderated by intervention duration and frequency.',
    citations: ['pubmed_38178649', 'pubmed_40010649'],
    keyStudies: ['38178649', '25559877']
  },

  // LIFESTYLE INTERVENTIONS
  {
    id: 'lifestyle_physical_activity',
    intervention: 'Physical Activity and Exercise',
    category: 'lifestyle',
    ageGroup: 'school_age',
    evidenceLevel: 'moderate',
    description: 'Regular physical activity, particularly cognitively engaging exercises like sports, martial arts, or structured games.',
    effectiveness: 'Moderate to large effects on cognitive flexibility and working memory. Small to medium effect on inhibition. Cognitively engaging exercises more effective than simple aerobic activity. Recommended as adjunct treatment.',
    citations: ['pubmed_40010649'],
    keyStudies: ['40010649', '39309731']
  },
  {
    id: 'lifestyle_dietary_interventions',
    intervention: 'Dietary Interventions',
    category: 'lifestyle',
    ageGroup: 'all_ages',
    evidenceLevel: 'emerging',
    description: 'Interventions including artificial food color exclusion, free fatty acid (omega-3) supplementation, and elimination diets for food sensitivities.',
    effectiveness: 'Small but significant reductions in ADHD symptoms. Free fatty acid supplementation shows consistent effects even in blinded assessments. Artificial food color exclusion yields larger effects in individuals selected for food sensitivities.',
    citations: ['pubmed_23360949'],
    keyStudies: ['23360949']
  },

  // WORKPLACE INTERVENTIONS
  {
    id: 'workplace_environmental_mods',
    intervention: 'Environmental Workplace Modifications',
    category: 'workplace',
    ageGroup: 'adult',
    evidenceLevel: 'strong',
    description: 'Modifications including quiet workspace, noise-canceling headphones, reduced visual distractions, flexible seating arrangements.',
    effectiveness: 'Legally mandated under Equality Act 2010 (UK) and ADA (US). Improves focus and productivity. Common accommodations include private offices, noise reduction tools, and minimized distractions.',
    citations: ['uk_equality_act', 'pubmed_33528652', 'pubmed_36451126'],
    keyStudies: ['33528652', '36451126']
  },
  {
    id: 'workplace_time_structure',
    intervention: 'Time Management and Organizational Support',
    category: 'workplace',
    ageGroup: 'adult',
    evidenceLevel: 'strong',
    description: 'Accommodations including task breakdown, flexible deadlines, regular check-ins, assistive technology for scheduling, and mentorship.',
    effectiveness: 'Addresses core executive function deficits. Reduces stress and improves job performance. Includes use of timers, apps, electronic organizers, and coaching. Regular supervisor check-ins improve clarity and prioritization.',
    citations: ['uk_equality_act', 'pubmed_33528652'],
    keyStudies: ['33528652']
  },
  {
    id: 'workplace_flexible_arrangements',
    intervention: 'Flexible Work Arrangements',
    category: 'workplace',
    ageGroup: 'adult',
    evidenceLevel: 'moderate',
    description: 'Flexible hours, remote work options, modified break schedules, and adjusted performance expectations.',
    effectiveness: 'Reduces stress and burnout risk. Allows adults with ADHD to work during peak focus periods. Telework particularly effective for reducing environmental distractions. Modified break schedules accommodate hyperactivity.',
    citations: ['uk_equality_act', 'pubmed_36451126'],
    keyStudies: ['36451126']
  },

  // EDUCATIONAL INTERVENTIONS
  {
    id: 'edu_iep_504_plans',
    intervention: 'Individualized Education Programs (IEPs) and 504 Plans',
    category: 'educational',
    ageGroup: 'school_age',
    evidenceLevel: 'strong',
    description: 'Legally binding educational accommodations under IDEA (IEP) or Section 504 (504 Plan) in the US, or EHCPs in the UK.',
    effectiveness: 'Essential for school-aged children with ADHD. Provides accommodations including extended time, preferential seating, modified assignments, and behavioral supports. Required by law when ADHD impacts educational performance.',
    citations: ['us_aap_guideline', 'uk_send_code'],
    keyStudies: []
  },
  {
    id: 'edu_environmental_modifications',
    intervention: 'Classroom Environmental Modifications',
    category: 'educational',
    ageGroup: 'all_ages',
    evidenceLevel: 'strong',
    description: 'Changes to physical classroom environment including seating arrangement, minimizing distractions, incorporating movement breaks, visual schedules.',
    effectiveness: 'First-line approach for all ages per NICE NG87. Reduces impact of ADHD symptoms without medication. Examples: preferential seating near teacher, standing desks, fidget tools, quiet zones for testing.',
    citations: ['uk_nice_ng87', 'uk_send_code'],
    keyStudies: []
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all evidence sources (UK + US + PubMed)
 */
export function getAllEvidenceSources(): EvidenceSource[] {
  return [...UK_EVIDENCE_SOURCES, ...US_EVIDENCE_SOURCES, ...PUBMED_EVIDENCE_SOURCES];
}

/**
 * Get evidence sources by country
 */
export function getEvidenceSourcesByCountry(country: 'UK' | 'US' | 'International'): EvidenceSource[] {
  return getAllEvidenceSources().filter(source => source.country === country);
}

/**
 * Get evidence sources by type
 */
export function getEvidenceSourcesByType(type: EvidenceSource['type']): EvidenceSource[] {
  return getAllEvidenceSources().filter(source => source.type === type);
}

/**
 * Get evidence sources relevant for specific topic
 */
export function getEvidenceSourcesForTopic(topic: EvidenceSource['relevantFor'][number]): EvidenceSource[] {
  return getAllEvidenceSources().filter(source => source.relevantFor.includes(topic));
}

/**
 * Get interventions by category
 */
export function getInterventionsByCategory(category: InterventionEvidence['category']): InterventionEvidence[] {
  return ADHD_INTERVENTIONS.filter(intervention => intervention.category === category);
}

/**
 * Get interventions by age group
 */
export function getInterventionsByAgeGroup(ageGroup: InterventionEvidence['ageGroup']): InterventionEvidence[] {
  return ADHD_INTERVENTIONS.filter(
    intervention => intervention.ageGroup === ageGroup || intervention.ageGroup === 'all_ages'
  );
}

/**
 * Get interventions by evidence level
 */
export function getInterventionsByEvidenceLevel(level: InterventionEvidence['evidenceLevel']): InterventionEvidence[] {
  return ADHD_INTERVENTIONS.filter(intervention => intervention.evidenceLevel === level);
}

/**
 * Get full evidence details for an intervention
 */
export function getInterventionWithSources(interventionId: string): {
  intervention: InterventionEvidence;
  sources: EvidenceSource[];
} | null {
  const intervention = ADHD_INTERVENTIONS.find(i => i.id === interventionId);
  if (!intervention) return null;

  const allSources = getAllEvidenceSources();
  const sources = intervention.citations
    .map(citationId => allSources.find(s => s.id === citationId))
    .filter((source): source is EvidenceSource => source !== undefined);

  return { intervention, sources };
}

/**
 * Get PMIDs from intervention
 */
export function getPMIDsForIntervention(interventionId: string): string[] {
  const intervention = ADHD_INTERVENTIONS.find(i => i.id === interventionId);
  return intervention?.keyStudies || [];
}

/**
 * Search evidence sources by keyword
 */
export function searchEvidenceSources(query: string): EvidenceSource[] {
  const lowerQuery = query.toLowerCase();
  return getAllEvidenceSources().filter(
    source =>
      source.title.toLowerCase().includes(lowerQuery) ||
      source.summary.toLowerCase().includes(lowerQuery) ||
      source.keyFindings.some(finding => finding.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get recommended interventions for age group and category
 */
export function getRecommendedInterventions(
  ageGroup: InterventionEvidence['ageGroup'],
  category?: InterventionEvidence['category']
): InterventionEvidence[] {
  let interventions = getInterventionsByAgeGroup(ageGroup);
  
  if (category) {
    interventions = interventions.filter(i => i.category === category);
  }
  
  // Sort by evidence level: strong > moderate > emerging > limited
  const evidenceOrder = { strong: 0, moderate: 1, emerging: 2, limited: 3 };
  return interventions.sort((a, b) => evidenceOrder[a.evidenceLevel] - evidenceOrder[b.evidenceLevel]);
}
