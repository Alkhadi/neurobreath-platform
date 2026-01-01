// Myths & Facts data
// Ported from ZIP implementation

export interface MythFact {
  myth: string;
  fact: string;
  sources: {
    text: string;
    url: string;
    source: 'CDC' | 'NHS' | 'NICE' | 'Autism-Europe';
  }[];
}

export const mythsFacts: MythFact[] = [
  {
    myth: 'Vaccines cause autism',
    fact: 'There is no link between vaccines and autism. This has been thoroughly studied and disproven by major health organizations worldwide. The original study claiming a link was fraudulent and has been retracted.',
    sources: [
      {
        text: 'CDC: Vaccine Safety',
        url: 'https://www.cdc.gov/vaccinesafety/concerns/autism.html',
        source: 'CDC'
      },
      {
        text: 'NHS: Autism and MMR vaccine',
        url: 'https://www.nhs.uk/conditions/vaccinations/mmr-vaccine/',
        source: 'NHS'
      }
    ]
  },
  {
    myth: 'Autism can be cured',
    fact: 'Autism is a lifelong neurodevelopmental difference, not an illness to be cured. The goal of support is to help autistic people thrive and access their strengths, not to make them "less autistic".',
    sources: [
      {
        text: 'NICE CG170: Support and management',
        url: 'https://www.nice.org.uk/guidance/cg170',
        source: 'NICE'
      },
      {
        text: 'NHS Inform: Understanding autism',
        url: 'https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/autistic-spectrum-disorder-asd/',
        source: 'NHS'
      }
    ]
  },
  {
    myth: 'Autistic people lack empathy',
    fact: 'Autistic people experience and express empathy, but may do so differently. Many autistic people report feeling emotions very deeply and can be overwhelmed by others emotions.',
    sources: [
      {
        text: 'Autism-Europe: Understanding Autism',
        url: 'https://www.autismeurope.org/about-autism/what-is-autism/',
        source: 'Autism-Europe'
      }
    ]
  },
  {
    myth: 'All autistic people are the same',
    fact: 'Autism is a spectrum. Every autistic person is different with unique strengths, challenges, interests, and needs. As the saying goes: "If you have met one person with autism, you have met one person with autism".',
    sources: [
      {
        text: 'CDC: Facts About Autism',
        url: 'https://www.cdc.gov/autism/facts/',
        source: 'CDC'
      }
    ]
  },
  {
    myth: 'Autism only affects children',
    fact: 'Autism is lifelong. Autistic children become autistic adults. Many people are not diagnosed until adulthood. Support needs may change over time but autism itself does not go away.',
    sources: [
      {
        text: 'NICE CG142: Autism in adults',
        url: 'https://www.nice.org.uk/guidance/cg142',
        source: 'NICE'
      }
    ]
  }
];

