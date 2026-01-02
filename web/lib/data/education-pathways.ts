/**
 * Education Pathways Data
 * Comprehensive step-by-step guides for UK SEND/EHCP, US IEP/504, and EU inclusive education
 * Evidence-based information with official sources
 */

export interface PathwayStep {
  stepNumber: number;
  title: string;
  description: string;
  timeframe: string;
  keyActions: string[];
  tips: string[];
  commonPitfalls: string[];
  resources: { title: string; url: string }[];
}

export interface EducationPathway {
  id: string;
  country: 'UK' | 'US' | 'EU';
  pathwayName: string;
  shortDescription: string;
  legalBasis: string;
  whoIsEligible: string[];
  overview: string;
  steps: PathwayStep[];
  keyRights: string[];
  appealProcess: string;
  officialResources: { title: string; url: string }[];
}

export const educationPathways: EducationPathway[] = [
  // UK SEND Support
  {
    id: 'uk-send-support',
    country: 'UK',
    pathwayName: 'SEND Support (SEN Support)',
    shortDescription: 'First tier of support for children with special educational needs in UK schools',
    legalBasis: 'Children and Families Act 2014, SEND Code of Practice 2015',
    whoIsEligible: [
      'Children with learning difficulties or disabilities that make learning harder',
      'Children who need extra or different support from what is usually available',
      'All ages from early years through to age 25',
    ],
    overview:
      'SEND Support is the first level of support for children with special educational needs in England. It is school-based support that does not require an Education, Health and Care Plan (EHCP). Schools must use their "best endeavours" to meet needs.',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify Concerns',
        description: 'Concerns are raised about a child\'s progress, behavior, or wellbeing.',
        timeframe: 'Ongoing',
        keyActions: [
          'Parents, teachers, or professionals notice difficulties',
          'Compare child\'s progress against age-related expectations',
          'Consider whether difficulties are significant and persistent',
        ],
        tips: [
          'Keep a log of specific examples and dates',
          'Speak to class teacher first',
          'Request a meeting if concerns continue',
        ],
        commonPitfalls: [
          'Waiting too long to raise concerns',
          'Assuming difficulties will resolve without support',
        ],
        resources: [
          { title: 'SEND Code of Practice', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Initial Assessment & Discussion',
        description: 'School\'s Special Educational Needs Coordinator (SENCo) assesses the child.',
        timeframe: '2-4 weeks',
        keyActions: [
          'Meeting with SENCo, parents, and class teacher',
          'Gather information from observations and assessments',
          'Identify specific areas of need',
        ],
        tips: [
          'Prepare questions beforehand',
          'Bring examples of difficulties at home',
          'Ask about the Graduated Approach (Assess, Plan, Do, Review)',
        ],
        commonPitfalls: [
          'Not sharing full picture of difficulties',
          'Accepting vague explanations without specific actions',
        ],
        resources: [
          { title: 'IPSEA - SEND Support', url: 'https://www.ipsea.org.uk/what-is-sen-support' },
        ],
      },
      {
        stepNumber: 3,
        title: 'SEN Support Plan Created',
        description: 'School places child on SEND register and creates a support plan.',
        timeframe: 'Within 1 term',
        keyActions: [
          'Child added to school SEND register',
          'Individual support plan/provision map created',
          'SMART targets set (Specific, Measurable, Achievable, Relevant, Time-bound)',
          'Interventions and adjustments identified',
        ],
        tips: [
          'Request a written copy of the plan',
          'Ensure targets are specific and measurable',
          'Clarify what interventions will be provided and how often',
        ],
        commonPitfalls: [
          'Accepting generic plans without specific actions',
          'Not understanding what interventions entail',
        ],
        resources: [
          { title: 'National Autistic Society - Education Rights', url: 'https://www.autism.org.uk/advice-and-guidance/topics/education' },
        ],
      },
      {
        stepNumber: 4,
        title: 'Implement Support (Graduated Approach)',
        description: 'School delivers interventions and adjustments as outlined in the plan.',
        timeframe: 'Ongoing (usually 1-2 terms per cycle)',
        keyActions: [
          'Assess: Analyze child\'s needs',
          'Plan: Agree interventions and support',
          'Do: Implement the plan',
          'Review: Evaluate impact and adapt',
        ],
        tips: [
          'Ask for regular updates (not just at review meetings)',
          'Keep communication log with school',
          'Monitor child\'s wellbeing and progress at home',
        ],
        commonPitfalls: [
          'Assuming school is implementing plan without checking',
          'Not speaking up when interventions aren\'t happening',
        ],
        resources: [
          { title: 'Council for Disabled Children - Graduated Approach', url: 'https://councilfordisabledchildren.org.uk/' },
        ],
      },
      {
        stepNumber: 5,
        title: 'Regular Reviews',
        description: 'Progress is reviewed at least termly with parents.',
        timeframe: 'Every 10-12 weeks minimum',
        keyActions: [
          'Review meeting with SENCo and parents',
          'Evaluate progress towards targets',
          'Adjust support as needed',
          'Consider whether needs are being met or if EHCP assessment needed',
        ],
        tips: [
          'Request data/evidence of progress',
          'If little progress despite support, ask about EHCP assessment',
          'Document all meetings in writing',
        ],
        commonPitfalls: [
          'Accepting "they\'re making progress" without evidence',
          'Waiting years without escalating if needs aren\'t met',
        ],
        resources: [
          { title: 'IPSEA - When to request EHCP', url: 'https://www.ipsea.org.uk/requesting-an-ehc-needs-assessment' },
        ],
      },
    ],
    keyRights: [
      'Right to SEN Support if child has greater difficulty learning than peers',
      'Right to have views heard and participate in decisions',
      'Right to termly review meetings',
      'Right to request an EHCP assessment if needs cannot be met through SEN Support',
    ],
    appealProcess:
      'There is no formal appeal for SEN Support decisions. If unhappy, escalate to headteacher, then governors, then local authority. If considering EHCP assessment request, seek advice from IPSEA or SOSSEN.',
    officialResources: [
      { title: 'GOV.UK - SEND Code of Practice', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
      { title: 'IPSEA (Independent Provider of Special Education Advice)', url: 'https://www.ipsea.org.uk/' },
      { title: 'SOSSEN (SOS!SEN)', url: 'https://www.sossen.org.uk/' },
      { title: 'Contact (for families with disabled children)', url: 'https://contact.org.uk/' },
    ],
  },

  // UK EHCP
  {
    id: 'uk-ehcp',
    country: 'UK',
    pathwayName: 'Education, Health and Care Plan (EHCP)',
    shortDescription: 'Legal document securing additional support for children with complex SEND in England',
    legalBasis: 'Children and Families Act 2014, SEND Code of Practice 2015',
    whoIsEligible: [
      'Children and young people aged 0-25 with complex or severe SEND',
      'Those whose needs cannot be met through SEN Support alone',
      'Needs must be significantly greater than peers and require provision beyond what school can ordinarily provide',
    ],
    overview:
      'An EHCP is a legal document that describes a child\'s special educational, health, and social care needs, and the support required to meet those needs. It is legally binding and reviewed annually.',
    steps: [
      {
        stepNumber: 1,
        title: 'Request an EHC Needs Assessment',
        description: 'Parent, young person, or school requests assessment from local authority.',
        timeframe: 'Initial decision within 6 weeks',
        keyActions: [
          'Write formal request to LA SEN team',
          'Provide evidence of needs and interventions tried',
          'Explain why SEN Support is insufficient',
          'Include reports from professionals (e.g., EP, OT, SALT)',
        ],
        tips: [
          'Use IPSEA template letters',
          'Be specific about unmet needs',
          'Send via recorded delivery or email with read receipt',
          'Request decision in writing within 6 weeks',
        ],
        commonPitfalls: [
          'Not providing enough evidence',
          'Vague descriptions of needs',
          'Missing the 6-week deadline to appeal refusal',
        ],
        resources: [
          { title: 'IPSEA - Requesting Assessment', url: 'https://www.ipsea.org.uk/requesting-an-ehc-needs-assessment' },
          { title: 'Template Letters', url: 'https://www.ipsea.org.uk/resources' },
        ],
      },
      {
        stepNumber: 2,
        title: 'LA Decision: Assess or Not',
        description: 'Local authority decides whether to conduct assessment.',
        timeframe: '6 weeks from request',
        keyActions: [
          'LA reviews evidence',
          'LA issues decision notice',
          'If refused, parents have right to appeal to SEND Tribunal (2 months deadline)',
        ],
        tips: [
          'If refused, request detailed reasons',
          'Seek advice from IPSEA/SOSSEN immediately',
          'Consider mediation or tribunal appeal',
        ],
        commonPitfalls: [
          'Missing 2-month tribunal appeal deadline',
          'Accepting refusal without challenge when evidence supports assessment',
        ],
        resources: [
          { title: 'SEND Tribunal Information', url: 'https://www.gov.uk/courts-tribunals/first-tier-tribunal-special-educational-needs-and-disability' },
        ],
      },
      {
        stepNumber: 3,
        title: 'EHC Needs Assessment Process',
        description: 'LA gathers information from parents, school, and professionals.',
        timeframe: 'Up to 16 weeks total (from request to final plan)',
        keyActions: [
          'LA requests reports from school, health, social care',
          'Educational Psychologist assessment',
          'Parent/young person submits views',
          'All evidence compiled',
        ],
        tips: [
          'Submit comprehensive parent/child views',
          'Include independent reports if available',
          'Be honest about difficulties at home, not just school',
        ],
        commonPitfalls: [
          'Underestimating needs to appear "not demanding"',
          'Not submitting parent views on time',
        ],
        resources: [
          { title: 'Council for Disabled Children - Parent Guide', url: 'https://councilfordisabledchildren.org.uk/our-work/participation-and-engagement/send-participation/information-about-send' },
        ],
      },
      {
        stepNumber: 4,
        title: 'LA Decision: Issue Plan or Not',
        description: 'LA decides whether to issue EHCP based on evidence.',
        timeframe: '16 weeks from initial request (Week 16)',
        keyActions: [
          'LA reviews all evidence',
          'Decision: Issue EHCP or issue notice declining to issue',
          'If declined, right to appeal to tribunal',
        ],
        tips: [
          'If declined, appeal immediately (2-month deadline)',
          'Seek legal advice/support from IPSEA',
        ],
        commonPitfalls: [
          'Giving up after refusal',
          'Missing appeal deadline',
        ],
        resources: [
          { title: 'IPSEA - Appealing Decisions', url: 'https://www.ipsea.org.uk/what-you-need-to-know/first-tier-tribunal-send' },
        ],
      },
      {
        stepNumber: 5,
        title: 'Draft EHCP Issued',
        description: 'LA sends draft EHCP to parents for consultation.',
        timeframe: 'Week 12-16',
        keyActions: [
          'Parents have 15 days to comment on draft',
          'Request amendments if sections are vague or incorrect',
          'Name preferred school',
        ],
        tips: [
          'Section F (provision) must be specific, detailed, and quantified',
          'Check Section B (needs) describes all needs accurately',
          'Use IPSEA guidance to review each section',
        ],
        commonPitfalls: [
          'Accepting vague provision (e.g., "access to SALT as needed")',
          'Not requesting amendments',
        ],
        resources: [
          { title: 'IPSEA - Draft EHCP Guidance', url: 'https://www.ipsea.org.uk/what-you-need-to-know/education-health-and-care-plans-ehcps' },
        ],
      },
      {
        stepNumber: 6,
        title: 'Final EHCP Issued',
        description: 'LA issues final EHCP, legally binding.',
        timeframe: '20 weeks from initial request',
        keyActions: [
          'Final plan issued',
          'School named in Section I',
          'Right to appeal within 2 months if disagreements remain',
        ],
        tips: [
          'Read final plan carefully',
          'If provision still vague, appeal to tribunal',
        ],
        commonPitfalls: [
          'Assuming plan will be implemented without monitoring',
        ],
        resources: [
          { title: 'SEND Tribunal', url: 'https://www.gov.uk/courts-tribunals/first-tier-tribunal-special-educational-needs-and-disability' },
        ],
      },
      {
        stepNumber: 7,
        title: 'Annual Review',
        description: 'EHCP reviewed every 12 months (more frequently if needed).',
        timeframe: 'Annually',
        keyActions: [
          'School coordinates review meeting',
          'Gather updated reports',
          'Evaluate progress and amend plan if needed',
        ],
        tips: [
          'Request interim reviews if needs change',
          'Keep evidence of provision being delivered (or not)',
        ],
        commonPitfalls: [
          'Accepting lack of progress without escalation',
        ],
        resources: [
          { title: 'IPSEA - Annual Reviews', url: 'https://www.ipsea.org.uk/annual-reviews-of-ehc-plans' },
        ],
      },
    ],
    keyRights: [
      'Right to request assessment',
      'Right to appeal refusals and plan content to SEND Tribunal',
      'Right to annual review',
      'Right to have views heard',
      'Plan is legally binding on LA and school',
    ],
    appealProcess:
      'Appeals to First-tier Tribunal (Special Educational Needs and Disability). Free to appeal. 2-month deadline from decision. Mediation must be considered but not compulsory. IPSEA provides free legal support.',
    officialResources: [
      { title: 'GOV.UK - EHC Plans', url: 'https://www.gov.uk/children-with-special-educational-needs/extra-SEN-help' },
      { title: 'IPSEA', url: 'https://www.ipsea.org.uk/' },
      { title: 'SEND Tribunal', url: 'https://www.gov.uk/courts-tribunals/first-tier-tribunal-special-educational-needs-and-disability' },
      { title: 'SOSSEN', url: 'https://www.sossen.org.uk/' },
    ],
  },

  // US IEP
  {
    id: 'us-iep',
    country: 'US',
    pathwayName: 'Individualized Education Program (IEP)',
    shortDescription: 'Legal document for students with disabilities to receive special education services',
    legalBasis: 'Individuals with Disabilities Education Act (IDEA)',
    whoIsEligible: [
      'Children aged 3-21 with disabilities that affect educational performance',
      'Must qualify under one of 13 IDEA disability categories (including Autism)',
      'Disability must require special education and related services',
    ],
    overview:
      'An IEP is a legally binding document created for each eligible student that outlines special education services, accommodations, and measurable goals. Schools must provide a Free Appropriate Public Education (FAPE) in the Least Restrictive Environment (LRE).',
    steps: [
      {
        stepNumber: 1,
        title: 'Referral for Evaluation',
        description: 'Parent, teacher, or professional refers child for special education evaluation.',
        timeframe: 'Varies by state (typically 15-30 days for initial response)',
        keyActions: [
          'Submit written request to school district',
          'Describe concerns and why special education is needed',
          'Request comprehensive evaluation',
        ],
        tips: [
          'Send request via certified mail or email with receipt',
          'Keep copies of all correspondence',
          'State specific concerns clearly',
        ],
        commonPitfalls: [
          'Verbal requests only (always follow up in writing)',
          'Not following up if school doesn\'t respond',
        ],
        resources: [
          { title: 'Understood.org - IEP Guide', url: 'https://www.understood.org/en/articles/individualized-education-program-iep-what-you-need-to-know' },
          { title: 'Wrightslaw', url: 'https://www.wrightslaw.com/' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Consent for Evaluation',
        description: 'School obtains parental consent before conducting evaluation.',
        timeframe: 'School must request consent; parents should respond promptly',
        keyActions: [
          'School provides Prior Written Notice and consent form',
          'Parents review evaluation plan',
          'Parents sign consent (or request changes to evaluation)',
        ],
        tips: [
          'Ask what tests/assessments will be conducted',
          'Request evaluations in all areas of concern',
          'You can request additional evaluations if needed',
        ],
        commonPitfalls: [
          'Signing consent without understanding what evaluations are included',
          'Not requesting evaluation of all relevant areas',
        ],
        resources: [
          { title: 'Center for Parent Information and Resources', url: 'https://www.parentcenterhub.org/evaluation/' },
        ],
      },
      {
        stepNumber: 3,
        title: 'Comprehensive Evaluation',
        description: 'Multidisciplinary team evaluates child in all areas of suspected disability.',
        timeframe: '60 days from consent (or state timeline)',
        keyActions: [
          'Assessments by school psychologist, special educator, related service providers',
          'Review existing data',
          'Observations in classroom and other settings',
          'Parent input included',
        ],
        tips: [
          'Provide detailed information about home behaviors',
          'Share outside reports (medical, therapy, etc.)',
          'Ask for clarification if you don\'t understand assessment methods',
        ],
        commonPitfalls: [
          'Not sharing full picture of challenges',
          'Assuming school will automatically assess all areas',
        ],
        resources: [
          { title: 'PACER Center - Evaluation Process', url: 'https://www.pacer.org/' },
        ],
      },
      {
        stepNumber: 4,
        title: 'Eligibility Meeting',
        description: 'IEP team meets to review evaluation results and determine eligibility.',
        timeframe: 'Within 60 days of consent (or state timeline)',
        keyActions: [
          'Team reviews all evaluation data',
          'Determine if child has disability under IDEA',
          'Determine if disability affects educational performance',
          'Decide if special education is needed',
        ],
        tips: [
          'Bring an advocate or support person',
          'Ask questions if you don\'t understand',
          'Request written explanation of decision',
        ],
        commonPitfalls: [
          'Attending meeting without reviewing evaluation report first',
          'Not understanding eligibility criteria',
        ],
        resources: [
          { title: 'Wrightslaw - Eligibility', url: 'https://www.wrightslaw.com/info/eligibility.index.htm' },
        ],
      },
      {
        stepNumber: 5,
        title: 'IEP Development Meeting',
        description: 'Team creates IEP with goals, services, and accommodations.',
        timeframe: 'Within 30 days of eligibility determination',
        keyActions: [
          'Develop Present Levels of Academic Achievement and Functional Performance (PLAAFP)',
          'Create measurable annual goals',
          'Determine special education and related services',
          'Decide accommodations and modifications',
          'Determine placement (LRE)',
        ],
        tips: [
          'Goals must be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)',
          'Ensure services specify frequency, location, and duration',
          'Ask how progress will be measured and reported',
        ],
        commonPitfalls: [
          'Accepting vague goals ("will improve reading")',
          'Not specifying service minutes clearly',
          'Agreeing to services that don\'t match needs',
        ],
        resources: [
          { title: 'Understood.org - IEP Goals', url: 'https://www.understood.org/en/articles/smart-iep-goals' },
        ],
      },
      {
        stepNumber: 6,
        title: 'Parent Consent to Implement',
        description: 'Parents review IEP and consent (or disagree).',
        timeframe: 'Immediately after IEP meeting',
        keyActions: [
          'Review IEP document carefully',
          'Parents sign consent for IEP implementation',
          'Services begin once consent is given',
        ],
        tips: [
          'You can consent to part of IEP and disagree with other parts',
          'Request clarification or revisions before signing',
          'Keep copy of signed IEP',
        ],
        commonPitfalls: [
          'Feeling pressured to sign at meeting',
          'Not realizing you can request another meeting to revise',
        ],
        resources: [
          { title: 'COPAA (Council of Parent Attorneys and Advocates)', url: 'https://www.copaa.org/' },
        ],
      },
      {
        stepNumber: 7,
        title: 'IEP Implementation & Progress Monitoring',
        description: 'School provides services and monitors progress toward goals.',
        timeframe: 'Ongoing',
        keyActions: [
          'Services delivered as written in IEP',
          'Progress toward goals measured and reported (usually quarterly)',
          'Parents receive progress reports',
        ],
        tips: [
          'Keep log of services received',
          'Request IEP team meeting if concerns arise',
          'Review progress reports carefully',
        ],
        commonPitfalls: [
          'Assuming services are happening without verification',
          'Not requesting meeting when child isn\'t making progress',
        ],
        resources: [
          { title: 'Wrightslaw - Progress Monitoring', url: 'https://www.wrightslaw.com/' },
        ],
      },
      {
        stepNumber: 8,
        title: 'Annual Review',
        description: 'IEP reviewed at least once per year.',
        timeframe: 'At least annually (within 12 months of previous IEP)',
        keyActions: [
          'Team reviews progress on goals',
          'Update goals and services as needed',
          'Revise IEP based on current needs',
        ],
        tips: [
          'Prepare for meeting by reviewing current IEP',
          'Bring data/evidence to support requested changes',
          'Request meeting sooner if needs change significantly',
        ],
        commonPitfalls: [
          'Accepting "copy-paste" goals without updates',
          'Not advocating for increased services when needed',
        ],
        resources: [
          { title: 'PACER - Annual Reviews', url: 'https://www.pacer.org/' },
        ],
      },
      {
        stepNumber: 9,
        title: 'Reevaluation',
        description: 'Comprehensive evaluation at least every 3 years (or sooner if requested).',
        timeframe: 'At least every 3 years',
        keyActions: [
          'Team determines if reevaluation is needed',
          'Consent obtained',
          'Comprehensive evaluation conducted',
          'Eligibility and services reconsidered',
        ],
        tips: [
          'Request reevaluation sooner if needs change',
          'Ensure all areas of concern are reassessed',
        ],
        commonPitfalls: [
          'Accepting limited reevaluation when comprehensive is needed',
        ],
        resources: [
          { title: 'Center for Parent Information and Resources', url: 'https://www.parentcenterhub.org/reevaluation/' },
        ],
      },
    ],
    keyRights: [
      'Right to Free Appropriate Public Education (FAPE)',
      'Right to Least Restrictive Environment (LRE)',
      'Right to participate in IEP meetings',
      'Right to Prior Written Notice before any changes',
      'Right to request IEP meeting at any time',
      'Right to dispute resolution (mediation, due process)',
      'Right to Independent Educational Evaluation (IEE) at public expense if you disagree with school evaluation',
    ],
    appealProcess:
      'Dispute resolution options: 1) IEP Facilitation, 2) Mediation, 3) State Complaint, 4) Due Process Hearing. Contact state Parent Training and Information (PTI) center or COPAA for guidance.',
    officialResources: [
      { title: 'US Dept of Education - IDEA', url: 'https://sites.ed.gov/idea/' },
      { title: 'Center for Parent Information and Resources', url: 'https://www.parentcenterhub.org/' },
      { title: 'Wrightslaw', url: 'https://www.wrightslaw.com/' },
      { title: 'Understood.org', url: 'https://www.understood.org/' },
      { title: 'PACER Center', url: 'https://www.pacer.org/' },
      { title: 'COPAA', url: 'https://www.copaa.org/' },
    ],
  },

  // US 504 Plan
  {
    id: 'us-504',
    country: 'US',
    pathwayName: '504 Plan',
    shortDescription: 'Accommodations plan for students with disabilities under Section 504',
    legalBasis: 'Section 504 of the Rehabilitation Act of 1973',
    whoIsEligible: [
      'Students with physical or mental impairment that substantially limits one or more major life activities',
      'Broader eligibility than IDEA (includes students who don\'t need special education but need accommodations)',
      'Can include autism, ADHD, anxiety, diabetes, etc.',
    ],
    overview:
      'A 504 Plan provides accommodations and supports to ensure students with disabilities have equal access to education. Unlike an IEP, it does not provide specialized instruction or related services, but rather removes barriers to learning.',
    steps: [
      {
        stepNumber: 1,
        title: 'Referral/Request for 504 Evaluation',
        description: 'Parent or school requests 504 evaluation.',
        timeframe: 'Varies by district (reasonable time)',
        keyActions: [
          'Submit written request to school 504 coordinator or principal',
          'Describe disability and how it impacts major life activity (learning)',
          'Request evaluation',
        ],
        tips: [
          'Reference Section 504 specifically in request',
          'Include medical/diagnostic information if available',
          'Send via certified mail or email with receipt',
        ],
        commonPitfalls: [
          'Verbal request only',
          'Not providing documentation of disability',
        ],
        resources: [
          { title: 'Understood.org - 504 Plans', url: 'https://www.understood.org/en/articles/section-504-explained' },
          { title: 'Wrightslaw - Section 504', url: 'https://www.wrightslaw.com/info/sec504.index.htm' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Evaluation',
        description: 'School evaluates whether student has disability under Section 504.',
        timeframe: 'Reasonable time (not specified by law, often 30-60 days)',
        keyActions: [
          'Review existing information (grades, test scores, medical records)',
          'Gather input from teachers and parents',
          'May include observations or assessments',
        ],
        tips: [
          'Provide comprehensive information about challenges',
          'Include outside evaluations or medical documentation',
        ],
        commonPitfalls: [
          'Not providing enough evidence of impact on learning',
        ],
        resources: [
          { title: 'US Dept of Education - OCR 504 FAQs', url: 'https://www2.ed.gov/about/offices/list/ocr/504faq.html' },
        ],
      },
      {
        stepNumber: 3,
        title: 'Eligibility Determination',
        description: '504 team (including parents) meets to determine eligibility.',
        timeframe: 'After evaluation is complete',
        keyActions: [
          'Team reviews evaluation data',
          'Determine if student has disability under Section 504',
          'Determine if disability substantially limits major life activity',
        ],
        tips: [
          'Participate actively in meeting',
          'Ask questions about eligibility criteria',
          'Request written decision',
        ],
        commonPitfalls: [
          'Accepting denial without understanding reasoning',
        ],
        resources: [
          { title: 'Wrightslaw - 504 Eligibility', url: 'https://www.wrightslaw.com/info/sec504.faq.htm' },
        ],
      },
      {
        stepNumber: 4,
        title: '504 Plan Development',
        description: 'Team creates written 504 Plan with accommodations.',
        timeframe: 'Promptly after eligibility determination',
        keyActions: [
          'Identify needed accommodations',
          'Document accommodations in written plan',
          'Specify who is responsible for implementation',
        ],
        tips: [
          'Be specific about accommodations (not vague)',
          'Include accommodations for all settings (classroom, testing, lunch, etc.)',
          'Request copy of plan',
        ],
        commonPitfalls: [
          'Accepting generic accommodations that don\'t address specific needs',
          'Not specifying implementation details',
        ],
        resources: [
          { title: 'Understood.org - 504 Accommodations', url: 'https://www.understood.org/en/articles/at-a-glance-classroom-accommodations-for-autism' },
        ],
      },
      {
        stepNumber: 5,
        title: 'Implementation',
        description: 'School implements accommodations as written.',
        timeframe: 'Ongoing',
        keyActions: [
          'Teachers provide accommodations',
          'Monitor student progress',
          'Adjust as needed',
        ],
        tips: [
          'Communicate regularly with teachers',
          'Request meeting if accommodations not being implemented',
        ],
        commonPitfalls: [
          'Assuming accommodations are happening without checking',
        ],
        resources: [
          { title: 'Wrightslaw - Implementation', url: 'https://www.wrightslaw.com/' },
        ],
      },
      {
        stepNumber: 6,
        title: 'Periodic Review',
        description: '504 Plan reviewed periodically (annual or as needed).',
        timeframe: 'At least annually (best practice)',
        keyActions: [
          'Team reviews effectiveness of accommodations',
          'Update plan as needed',
        ],
        tips: [
          'Request review if needs change',
          'Bring data to support requested changes',
        ],
        commonPitfalls: [
          'Letting plan go years without update',
        ],
        resources: [
          { title: 'Understood.org - 504 Reviews', url: 'https://www.understood.org/' },
        ],
      },
      {
        stepNumber: 7,
        title: 'Reevaluation',
        description: 'Periodic reevaluation to determine continued eligibility.',
        timeframe: 'Before significant change in placement or periodically (best practice: every 3 years)',
        keyActions: [
          'Review current information',
          'Conduct additional evaluation if needed',
          'Determine continued eligibility',
        ],
        tips: [
          'Request reevaluation if needs change',
        ],
        commonPitfalls: [
          'Forgetting to reevaluate as student transitions',
        ],
        resources: [
          { title: 'OCR - Reevaluation', url: 'https://www2.ed.gov/about/offices/list/ocr/504faq.html' },
        ],
      },
    ],
    keyRights: [
      'Right to equal access to education',
      'Right to reasonable accommodations',
      'Right to participate in 504 meetings',
      'Right to notice before any changes',
      'Right to file complaint with Office for Civil Rights (OCR)',
      'Right to due process hearing',
    ],
    appealProcess:
      'If you disagree with 504 decisions: 1) Request reconsideration from school, 2) File complaint with school district, 3) File complaint with Office for Civil Rights (OCR), 4) Request due process hearing (check district policy), 5) File lawsuit.',
    officialResources: [
      { title: 'US Dept of Education - OCR', url: 'https://www2.ed.gov/about/offices/list/ocr/index.html' },
      { title: 'Understood.org - 504 Plans', url: 'https://www.understood.org/en/articles/section-504-explained' },
      { title: 'Wrightslaw - Section 504', url: 'https://www.wrightslaw.com/info/sec504.index.htm' },
    ],
  },

  // EU Inclusive Education
  {
    id: 'eu-inclusive-education',
    country: 'EU',
    pathwayName: 'Inclusive Education in the EU',
    shortDescription: 'Framework for inclusive education across European Union member states',
    legalBasis: 'UN Convention on the Rights of Persons with Disabilities (CRPD), EU disability strategy, national laws vary by country',
    whoIsEligible: [
      'All children with disabilities or special educational needs',
      'Right to inclusive education in mainstream settings',
      'Specific eligibility criteria vary by EU member state',
    ],
    overview:
      'The EU promotes inclusive education under the UN CRPD and EU disability strategy. Each member state has its own system for identifying and supporting children with SEN. While approaches vary, the core principle is inclusion in mainstream education with appropriate support.',
    steps: [
      {
        stepNumber: 1,
        title: 'Identification of Special Educational Needs',
        description: 'Concerns raised about child\'s learning, development, or behavior.',
        timeframe: 'Varies by country',
        keyActions: [
          'Parents or teachers notice difficulties',
          'Initial discussion with school',
          'Referral to support services or specialist',
        ],
        tips: [
          'Familiarize yourself with your country\'s SEN system',
          'Document concerns with specific examples',
          'Request information on assessment process',
        ],
        commonPitfalls: [
          'Not knowing your country\'s specific procedures',
          'Delays in seeking assessment',
        ],
        resources: [
          { title: 'European Agency for Special Needs and Inclusive Education', url: 'https://www.european-agency.org/' },
          { title: 'Autism-Europe', url: 'https://www.autismeurope.org/' },
        ],
      },
      {
        stepNumber: 2,
        title: 'Assessment/Evaluation',
        description: 'Formal assessment of needs by educational or medical professionals.',
        timeframe: 'Varies by country (weeks to months)',
        keyActions: [
          'Psychological/educational assessment',
          'Medical evaluation if needed',
          'Functional assessment',
        ],
        tips: [
          'Provide comprehensive information to assessors',
          'Keep copies of all reports',
          'Seek second opinion if needed',
        ],
        commonPitfalls: [
          'Not understanding assessment results',
        ],
        resources: [
          { title: 'European Agency - Assessment in Inclusive Settings', url: 'https://www.european-agency.org/' },
        ],
      },
      {
        stepNumber: 3,
        title: 'Individualized Support Plan',
        description: 'Development of personalized education plan (name varies by country: IEP, PEI, PPS, etc.).',
        timeframe: 'Varies by country',
        keyActions: [
          'Goals and objectives set',
          'Support measures identified',
          'Accommodations and adaptations specified',
          'Parents participate in planning',
        ],
        tips: [
          'Ensure plan is specific and measurable',
          'Ask for written plan',
          'Clarify roles and responsibilities',
        ],
        commonPitfalls: [
          'Accepting vague plans without specific actions',
        ],
        resources: [
          { title: 'European Agency - Individual Education Plans', url: 'https://www.european-agency.org/resources/publications/individual-education-plans' },
        ],
      },
      {
        stepNumber: 4,
        title: 'Implementation of Support',
        description: 'School provides agreed support and accommodations.',
        timeframe: 'Ongoing',
        keyActions: [
          'Classroom adaptations',
          'Specialist support (e.g., learning support teacher, teaching assistant)',
          'Related services (e.g., speech therapy, occupational therapy)',
        ],
        tips: [
          'Maintain regular communication with school',
          'Monitor child\'s progress and wellbeing',
          'Request updates on implementation',
        ],
        commonPitfalls: [
          'Assuming support is happening without verification',
        ],
        resources: [
          { title: 'European Agency - Inclusive Education in Action', url: 'https://www.european-agency.org/activities/ieip' },
        ],
      },
      {
        stepNumber: 5,
        title: 'Review and Evaluation',
        description: 'Regular review of plan and progress.',
        timeframe: 'Varies (typically annually or per term)',
        keyActions: [
          'Progress reviewed',
          'Plan updated as needed',
          'Adjustments to support',
        ],
        tips: [
          'Prepare for reviews with observations and concerns',
          'Request review if needs change',
        ],
        commonPitfalls: [
          'Not advocating for changes when support is insufficient',
        ],
        resources: [
          { title: 'European Agency', url: 'https://www.european-agency.org/' },
        ],
      },
      {
        stepNumber: 6,
        title: 'Transition Planning',
        description: 'Planning for transitions (between schools, to further education, employment).',
        timeframe: 'Well in advance of transition',
        keyActions: [
          'Discuss future plans',
          'Visit new settings',
          'Arrange support for transition',
        ],
        tips: [
          'Start transition planning early',
          'Involve young person in planning',
        ],
        commonPitfalls: [
          'Leaving transition planning to the last minute',
        ],
        resources: [
          { title: 'European Agency - Transition from School to Employment', url: 'https://www.european-agency.org/' },
        ],
      },
    ],
    keyRights: [
      'Right to inclusive education (UN CRPD Article 24)',
      'Right to reasonable accommodations',
      'Right to participate in decisions',
      'Right to non-discrimination',
      'Specific rights vary by EU member state',
    ],
    appealProcess:
      'Varies significantly by country. Generally: 1) Discuss concerns with school, 2) Formal complaint to school/local authority, 3) Appeal to regional or national education authority, 4) In some countries, appeal to tribunal or court. Consult national disability/education organizations for country-specific guidance.',
    officialResources: [
      { title: 'European Agency for Special Needs and Inclusive Education', url: 'https://www.european-agency.org/' },
      { title: 'Autism-Europe', url: 'https://www.autismeurope.org/' },
      { title: 'Inclusion Europe', url: 'https://www.inclusion-europe.eu/' },
      { title: 'European Disability Forum', url: 'https://www.edf-feph.org/' },
      { title: 'UN CRPD', url: 'https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html' },
    ],
  },
];
