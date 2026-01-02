// ADHD Myths & Facts
// Common misconceptions debunked with evidence

export interface ADHDMyth {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  sources: string[];
}

export const adhdMyths: ADHDMyth[] = [
  {
    id: 'just-try-harder',
    myth: '"You just need to try harder and be more disciplined"',
    fact: 'ADHD is a neurodevelopmental disorder with biological differences in the brain',
    explanation: 'ADHD involves structural and functional differences in brain regions responsible for executive function, attention, and impulse control. Neuroimaging studies show reduced activity in the prefrontal cortex and differences in dopamine regulation. Telling someone with ADHD to "just try harder" is like telling someone with poor vision to "just see better" without glasses.',
    sources: [
      'National Institute of Mental Health (NIMH) - ADHD Brain Research',
      'Barkley, R. (2015) - Executive Function Theory',
      'Volkow et al. (2009) - Brain Dopamine in ADHD (PubMed)'
    ]
  },
  {
    id: 'childhood-only',
    myth: '"ADHD is only a childhood disorder - you outgrow it"',
    fact: 'Up to 60% of children with ADHD continue to have symptoms as adults',
    explanation: 'While hyperactivity may decrease with age, core ADHD symptoms often persist into adulthood. Adult ADHD manifests differently - more internal restlessness, difficulty with organization, time management, and emotional regulation. Many adults are only diagnosed after their children receive ADHD diagnoses.',
    sources: [
      'Faraone et al. (2021) - ADHD Persistence Study',
      'CDC - Adult ADHD Statistics 2024',
      'CHADD - Adult ADHD Fact Sheet'
    ]
  },
  {
    id: 'cant-focus',
    myth: '"People with ADHD can\'t focus on anything"',
    fact: 'People with ADHD have difficulty regulating attention - they can hyperfocus intensely on interesting tasks',
    explanation: 'ADHD is better described as "attention dysregulation" rather than deficit. People with ADHD can experience hyperfocus - intense concentration on engaging tasks - sometimes for hours without breaks. The challenge is directing attention to less stimulating but necessary tasks.',
    sources: [
      'Ozel-Kizil et al. (2016) - Hyperfocus in ADHD',
      'How to ADHD - Hyperfocus Research 2023',
      'ADDitude Magazine - The Hyperfocus Phenomenon'
    ]
  },
  {
    id: 'excuse',
    myth: '"ADHD is just an excuse for laziness or bad behavior"',
    fact: 'ADHD is a legitimate medical condition recognized by major health organizations worldwide',
    explanation: 'ADHD is recognized by the WHO, APA (American Psychiatric Association), NICE (UK), and medical organizations globally. It has specific diagnostic criteria, genetic components (heritability ~75%), and responds to evidence-based treatments. People with ADHD often work harder than neurotypical people to achieve the same results.',
    sources: [
      'WHO - International Classification of Diseases (ICD-11)',
      'DSM-5-TR - ADHD Diagnostic Criteria',
      'Faraone & Larsson (2019) - Genetics of ADHD'
    ]
  },
  {
    id: 'medication-only',
    myth: '"Medication is the only effective treatment for ADHD"',
    fact: 'Effective ADHD management combines medication, behavioral strategies, lifestyle changes, and environmental modifications',
    explanation: 'While medication (stimulants or non-stimulants) is often helpful, the most effective approach is multimodal: medication + CBT + organizational strategies + exercise + sleep hygiene + dietary considerations + environmental accommodations. Many people successfully manage ADHD with non-medication approaches.',
    sources: [
      'NICE Guidelines - ADHD Treatment 2024',
      'MTA Study - Multimodal Treatment of ADHD',
      'CHADD - ADHD Treatment Options'
    ]
  },
  {
    id: 'sugar-causes',
    myth: '"Sugar and food dyes cause ADHD"',
    fact: 'No evidence supports that diet causes ADHD, though some individuals may be sensitive to certain foods',
    explanation: 'ADHD has genetic and neurobiological origins - it\'s not caused by parenting, diet, or screen time. However, a small percentage of people may experience symptom worsening with certain food additives. A balanced diet, adequate protein, and omega-3s may support overall brain health and medication effectiveness.',
    sources: [
      'Nigg et al. (2012) - Diet and ADHD Meta-analysis',
      'Mayo Clinic - ADHD Causes',
      'CDC - ADHD Facts'
    ]
  },
  {
    id: 'everyone-has-it',
    myth: '"Everyone is a little ADHD these days"',
    fact: 'Occasional distractibility is normal; ADHD involves pervasive, impairing symptoms across multiple settings',
    explanation: 'ADHD is diagnosed when symptoms are present for 6+ months, appear before age 12, occur in multiple settings (home, work, school), and significantly impair functioning. Occasional distraction or procrastination doesn\'t equal ADHD. Diagnostic criteria are specific and thorough.',
    sources: [
      'DSM-5-TR - ADHD Diagnostic Criteria',
      'NICE Guidelines - ADHD Assessment',
      'CHADD - What is ADHD?'
    ]
  },
  {
    id: 'overdiagnosed',
    myth: '"ADHD is overdiagnosed - it\'s just a trend"',
    fact: 'Research suggests ADHD is actually underdiagnosed, especially in women, adults, and minorities',
    explanation: 'Historical diagnostic bias focused on hyperactive boys. Girls often present with inattentive type (less disruptive, more internalized). Women, adults, and people of color face diagnostic barriers. Better awareness has improved detection of previously overlooked cases, not "overdiagnosis."',
    sources: [
      'Hinshaw et al. (2021) - ADHD in Girls & Women',
      'CDC - ADHD Diagnosis Disparities',
      'CHADD - Underdiagnosis in Women'
    ]
  }
];
