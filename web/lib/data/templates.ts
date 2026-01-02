export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'email';
  placeholder: string;
  required: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  audience: 'parents' | 'teachers' | 'employers' | 'all';
  country: 'UK' | 'US' | 'EU' | 'all';
  category: 'assessment-request' | 'evidence' | 'meeting-prep' | 'classroom' | 'workplace' | 'appeal';
  fields: TemplateField[];
  templateText: string;
  evidenceLinks: { title: string; url: string }[];
  tips: string[];
}

export const TEMPLATES: Template[] = [
  // UK EHCP Request Letter
  {
    id: 'uk-ehcp-request',
    title: 'EHCP Assessment Request Letter (UK)',
    description: 'Formal letter to request an Education, Health and Care Plan assessment from your Local Authority',
    audience: 'parents',
    country: 'UK',
    category: 'assessment-request',
    fields: [
      { id: 'parentName', label: 'Your Full Name', type: 'text', placeholder: 'e.g., Jane Smith', required: true },
      { id: 'parentAddress', label: 'Your Address', type: 'textarea', placeholder: '123 Example Street\nCity, County\nPostcode', required: true },
      { id: 'parentEmail', label: 'Your Email', type: 'email', placeholder: 'your.email@example.com', required: true },
      { id: 'parentPhone', label: 'Your Phone', type: 'text', placeholder: '07123 456789', required: true },
      { id: 'childName', label: "Child's Full Name", type: 'text', placeholder: 'e.g., Alex Smith', required: true },
      { id: 'childDOB', label: "Child's Date of Birth", type: 'date', placeholder: 'DD/MM/YYYY', required: true },
      { id: 'schoolName', label: 'School/Setting Name', type: 'text', placeholder: 'e.g., Oakwood Primary School', required: true },
      { id: 'laName', label: 'Local Authority Name', type: 'text', placeholder: 'e.g., Manchester City Council', required: true },
      { id: 'laAddress', label: 'LA SEN Department Address', type: 'textarea', placeholder: 'SEN Department\nLocal Authority\nAddress', required: true },
      { id: 'needs', label: "Summary of Child's Needs", type: 'textarea', placeholder: 'Describe the specific difficulties your child experiences...', required: true },
      { id: 'currentSupport', label: 'Current Support Provided', type: 'textarea', placeholder: 'List any existing support, interventions, or adjustments...', required: false },
      { id: 'professionals', label: 'Involved Professionals', type: 'textarea', placeholder: 'Educational psychologist, speech therapist, etc.', required: false },
      { id: 'date', label: 'Today\'s Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
    ],
    templateText: `[parentAddress]
[parentEmail]
[parentPhone]

[date]

[laAddress]

Dear Sir/Madam,

**RE: Request for Education, Health and Care Plan Assessment – [childName] (DOB: [childDOB])**

I am writing to formally request an Education, Health and Care (EHC) needs assessment for my child, [childName], who currently attends [schoolName].

**Background and Needs:**
[needs]

**Current Provision:**
[currentSupport]

**Professional Involvement:**
[professionals]

**Reason for Request:**
Despite the support currently in place, [childName] continues to experience significant barriers to learning and development. I believe that [childName]'s needs are complex and long-term, requiring the coordinated provision of education, health, and care support that an EHCP would facilitate.

**Legal Basis:**
Under Section 36(1) of the Children and Families Act 2014, I am making this request as a parent. The Local Authority must decide within 6 weeks whether to conduct an EHC needs assessment.

**Supporting Evidence:**
I have attached the following evidence to support this request:
- [List any attached reports, letters, or assessments]
- Educational records and progress data
- Professional assessments and recommendations

**Request for Decision:**
I would be grateful if you could:
1. Confirm receipt of this request within 15 days
2. Provide a decision on whether to proceed with an EHC needs assessment within 6 weeks
3. Keep me informed throughout the process

If you decide not to carry out an assessment, please provide full written reasons for your decision, as I may wish to appeal to the First-tier Tribunal (Special Educational Needs and Disability).

**Contact Information:**
Please direct all correspondence to the address and contact details above. I am happy to provide any additional information required and to attend meetings as necessary.

Thank you for considering this request. I look forward to working constructively with the Local Authority to secure the best possible outcomes for [childName].

Yours sincerely,

[parentName]

**Enclosures:**
- Supporting evidence (as listed above)
- Copy of [childName]'s birth certificate
- Any other relevant documentation`,
    evidenceLinks: [
      { title: 'Children and Families Act 2014', url: 'https://www.legislation.gov.uk/ukpga/2014/6/contents' },
      { title: 'SEND Code of Practice', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
      { title: 'IPSEA EHCP Guide', url: 'https://www.ipsea.org.uk/what-is-an-ehc-needs-assessment' },
    ],
    tips: [
      'Keep a copy of all correspondence for your records',
      'Send via recorded delivery or email with read receipt',
      'Follow up if you don\'t receive acknowledgment within 15 days',
      'Gather all professional reports before submitting',
      'Contact SENDIASS for free local support',
    ],
  },

  // US IEP Request Letter
  {
    id: 'us-iep-request',
    title: 'IEP Evaluation Request Letter (US)',
    description: 'Formal letter to request an Individualized Education Program evaluation under IDEA',
    audience: 'parents',
    country: 'US',
    category: 'assessment-request',
    fields: [
      { id: 'parentName', label: 'Your Full Name', type: 'text', placeholder: 'e.g., Jane Smith', required: true },
      { id: 'parentAddress', label: 'Your Address', type: 'textarea', placeholder: '123 Example Street\nCity, State ZIP', required: true },
      { id: 'parentEmail', label: 'Your Email', type: 'email', placeholder: 'your.email@example.com', required: true },
      { id: 'parentPhone', label: 'Your Phone', type: 'text', placeholder: '(123) 456-7890', required: true },
      { id: 'childName', label: "Child's Full Name", type: 'text', placeholder: 'e.g., Alex Smith', required: true },
      { id: 'childDOB', label: "Child's Date of Birth", type: 'date', placeholder: 'MM/DD/YYYY', required: true },
      { id: 'schoolName', label: 'School Name', type: 'text', placeholder: 'e.g., Lincoln Elementary School', required: true },
      { id: 'districtName', label: 'School District', type: 'text', placeholder: 'e.g., Springfield Unified School District', required: true },
      { id: 'principalName', label: 'Principal\'s Name', type: 'text', placeholder: 'e.g., Dr. Johnson', required: false },
      { id: 'concerns', label: 'Areas of Concern', type: 'textarea', placeholder: 'Describe specific academic, behavioral, or developmental concerns...', required: true },
      { id: 'date', label: 'Today\'s Date', type: 'date', placeholder: 'MM/DD/YYYY', required: true },
    ],
    templateText: `[parentName]
[parentAddress]
[parentEmail]
[parentPhone]

[date]

[principalName]
[schoolName]
[districtName]

Dear [principalName],

**RE: Request for Special Education Evaluation – [childName] (DOB: [childDOB])**

I am writing to formally request a comprehensive evaluation of my child, [childName], to determine eligibility for special education services under the Individuals with Disabilities Education Act (IDEA).

**Areas of Concern:**
[concerns]

**Request for Evaluation:**
I am requesting that [childName] be evaluated in all areas of suspected disability, including but not limited to:
- Academic achievement and learning
- Cognitive abilities
- Communication skills
- Social-emotional development
- Behavioral functioning
- Adaptive skills
- [Add any other specific areas of concern]

**Legal Rights:**
Under IDEA (20 U.S.C. § 1414), I understand that:
- The school district must respond to this request within a reasonable timeframe
- If evaluation is approved, it must be completed within 60 days (or state timeline)
- I have the right to an Independent Educational Evaluation (IEE) if I disagree with the district's evaluation
- I must provide written consent before evaluation begins

**Consent and Cooperation:**
I hereby give my consent for the school district to evaluate [childName] for special education eligibility. I am committed to working cooperatively with the school team and will provide any additional information needed.

**Request for Written Response:**
Please provide a written response to this request, including:
- Whether the district agrees to evaluate [childName]
- The proposed evaluation plan and timeline
- Information about my procedural safeguards under IDEA
- Contact information for the special education coordinator

If the district denies this evaluation request, please provide a written explanation with the specific reasons for denial, as I may choose to exercise my right to dispute resolution.

**Contact Information:**
I can be reached at the phone number and email address above. I am available for meetings and willing to provide any additional information that would assist in this process.

Thank you for your prompt attention to this important matter. I look forward to working together to ensure [childName] receives appropriate educational support.

Sincerely,

[parentName]

**CC:**
- Special Education Director
- School District Superintendent`,
    evidenceLinks: [
      { title: 'IDEA - U.S. Department of Education', url: 'https://sites.ed.gov/idea/' },
      { title: 'Parent Rights Under IDEA', url: 'https://www.parentcenterhub.org/priority-iep/' },
      { title: 'Wrightslaw IEP Guide', url: 'https://www.wrightslaw.com/info/iep.index.htm' },
    ],
    tips: [
      'Keep copies of all written communication',
      'Document all phone calls and meetings with dates/times',
      'Submit request in writing via certified mail or email',
      'Follow up within 10 business days if no response',
      'Contact your state Parent Training and Information Center (PTI) for support',
    ],
  },

  // Evidence Gathering Checklist
  {
    id: 'evidence-checklist',
    title: 'Evidence Gathering Checklist',
    description: 'Comprehensive checklist to organize evidence and documentation for EHCP/IEP assessments',
    audience: 'parents',
    country: 'all',
    category: 'evidence',
    fields: [
      { id: 'childName', label: "Child's Name", type: 'text', placeholder: 'e.g., Alex Smith', required: true },
      { id: 'preparedBy', label: 'Prepared By', type: 'text', placeholder: 'Your name', required: true },
      { id: 'date', label: 'Date Prepared', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
    ],
    templateText: `**EVIDENCE GATHERING CHECKLIST**
**Child:** [childName]
**Prepared by:** [preparedBy]
**Date:** [date]

---

## MEDICAL EVIDENCE
☐ Diagnosis reports (autism, ADHD, dyslexia, etc.)
☐ Medical assessments and evaluations
☐ Pediatrician letters and reports
☐ Specialist reports (neurologist, psychiatrist, etc.)
☐ Therapy reports (OT, PT, speech therapy)
☐ Medication records and management plans
☐ Hospital discharge summaries (if applicable)
☐ Growth and developmental milestone records

## EDUCATIONAL EVIDENCE
☐ School reports (last 2-3 years)
☐ Progress reports and report cards
☐ Teacher observations and concerns
☐ Standardized test results
☐ Reading/math level assessments
☐ Attendance records
☐ Behavior incident reports
☐ Individual Education Plans (current and past)
☐ Intervention records (reading support, counseling, etc.)
☐ Educational psychologist reports
☐ SENCO/special education coordinator notes

## BEHAVIORAL & SOCIAL-EMOTIONAL EVIDENCE
☐ Behavioral assessments (FBA, BIP)
☐ Social skills assessments
☐ Mental health evaluations
☐ School counselor reports
☐ Sensory processing assessments
☐ Autism diagnostic reports (ADOS, ADI-R)
☐ ADHD rating scales (Conners, Vanderbilt)
☐ Anxiety/depression screenings
☐ Incident logs (meltdowns, aggression, self-harm)

## COMMUNICATION & SPEECH
☐ Speech and language therapy reports
☐ Communication assessments
☐ AAC (augmentative communication) evaluations
☐ Language development reports
☐ Social communication assessments

## DAILY FUNCTIONING
☐ Adaptive behavior assessments (ABAS, Vineland)
☐ Self-care and independence reports
☐ Parent questionnaires and rating scales
☐ Daily routine documentation
☐ Sleep diaries (if applicable)
☐ Eating/feeding reports (if applicable)

## PROFESSIONAL LETTERS
☐ Letter from GP/primary care physician
☐ Letter from pediatrician
☐ Letter from specialists (neurologist, psychiatrist)
☐ Letter from therapists (OT, PT, SLT)
☐ Letter from school staff (teachers, SENCO)
☐ Letter from mental health professionals

## PARENTAL EVIDENCE
☐ Parent statement (detailed concerns and observations)
☐ Daily diary/log of difficulties
☐ Photos/videos showing challenges
☐ Examples of work samples
☐ Comparison with peers (developmental differences)
☐ Impact on family life statement

## LEGAL & ADMINISTRATIVE
☐ Previous EHCP/IEP (if applicable)
☐ Previous assessment requests
☐ Meeting notes from school reviews
☐ Correspondence with school/LA/district
☐ Any refusal letters or decisions
☐ Birth certificate copy
☐ Proof of address

---

## ORGANIZATION TIPS:

1. **Create a Master Folder:**
   - Organize all documents chronologically
   - Use dividers for different categories
   - Keep originals safe; submit copies

2. **Create a One-Page Summary:**
   - Child's key strengths
   - Main areas of difficulty
   - Current support and gaps
   - Desired outcomes

3. **Highlight Key Information:**
   - Use sticky notes for important sections
   - Create a quick-reference sheet with dates
   - Note any urgent concerns or safety issues

4. **Digital Backup:**
   - Scan all documents
   - Save to cloud storage
   - Email copies to yourself

5. **Missing Evidence:**
   - Note any gaps in evidence
   - Request missing reports promptly
   - Don't delay submission while waiting

---

**REMEMBER:** Quality matters more than quantity. Focus on evidence that clearly demonstrates your child's needs and the impact on their education and daily life.

**NEXT STEPS:**
☐ Compile all gathered evidence
☐ Write cover letter/request
☐ Make complete copies
☐ Submit request via recorded delivery/certified mail
☐ Keep master copy for your records
☐ Follow up within 2 weeks

---

**Prepared by:** [preparedBy]
**Date:** [date]`,
    evidenceLinks: [
      { title: 'IPSEA Evidence Guide', url: 'https://www.ipsea.org.uk/' },
      { title: 'Understood.org IEP Evidence', url: 'https://www.understood.org/en/articles/what-is-an-iep' },
    ],
    tips: [
      'Start gathering evidence early—don\'t wait for a crisis',
      'Request copies of all school records regularly',
      'Keep a simple diary of incidents and concerns',
      'Don\'t assume the school will provide everything',
      'Ask professionals to include specific examples and impact',
    ],
  },

  // Meeting Preparation Guide
  {
    id: 'meeting-prep',
    title: 'EHCP/IEP Meeting Preparation Guide',
    description: 'Structured preparation template for EHCP, IEP, or annual review meetings',
    audience: 'parents',
    country: 'all',
    category: 'meeting-prep',
    fields: [
      { id: 'childName', label: "Child's Name", type: 'text', placeholder: 'e.g., Alex Smith', required: true },
      { id: 'meetingDate', label: 'Meeting Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
      { id: 'meetingType', label: 'Meeting Type', type: 'text', placeholder: 'e.g., EHCP Annual Review, IEP Meeting', required: true },
      { id: 'parentName', label: 'Your Name', type: 'text', placeholder: 'Your name', required: true },
    ],
    templateText: `**MEETING PREPARATION GUIDE**

**Child:** [childName]
**Meeting Date:** [meetingDate]
**Meeting Type:** [meetingType]
**Parent/Carer:** [parentName]

---

## BEFORE THE MEETING

### 1. REVIEW CURRENT PLAN
☐ Read current EHCP/IEP thoroughly
☐ Note all current goals and provisions
☐ Check what's been achieved
☐ Identify gaps in support

### 2. GATHER EVIDENCE
☐ Recent school reports
☐ Progress data
☐ New assessments or reports
☐ Examples of work
☐ Incident logs or behavior notes
☐ Parent observations diary

### 3. PREPARE YOUR VOICE
☐ Write list of successes to celebrate
☐ List ongoing concerns
☐ Note new needs or changes
☐ Prepare questions to ask
☐ Draft proposed goals

### 4. LOGISTICS
☐ Confirm meeting time and location
☐ Request agenda in advance
☐ Invite anyone you want to attend (advocate, supporter)
☐ Arrange childcare if needed
☐ Plan to arrive 10 minutes early
☐ Bring notebook, pen, and water

---

## KEY QUESTIONS TO ASK

### About Progress:
- What specific progress has [childName] made since the last review?
- What evidence/data supports this progress?
- How does [childName]'s progress compare to expected rates?
- What's working well? What isn't?

### About Goals:
- Have current goals been met, partially met, or not met?
- Are current goals still appropriate?
- What should the new goals be?
- Are goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound)?
- How will goals be measured?

### About Provision:
- Is current provision being delivered as specified?
- Is it having the desired impact?
- What additional support is needed?
- Are staff adequately trained?
- What adjustments need to be made?

### About Next Steps:
- What are the priorities for the coming year?
- What outcomes are we aiming for?
- Who is responsible for what?
- When will we review progress?
- What happens if goals aren't met?

---

## YOUR PRIORITIES FOR THIS MEETING

### TOP 3 CONCERNS:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### TOP 3 GOALS YOU WANT:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### TOP 3 SUPPORTS NEEDED:
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

---

## DURING THE MEETING

### DO:
☐ Take notes (or ask someone to take them for you)
☐ Ask for clarification if you don't understand
☐ Request breaks if needed
☐ Focus on your child's needs, not budget constraints
☐ Be specific about what you're asking for
☐ Stay solution-focused
☐ Ask how decisions will be recorded

### DON'T:
☐ Sign anything you're not happy with
☐ Agree to vague statements (e.g., "as appropriate")
☐ Let jargon confuse you—ask for plain English
☐ Feel rushed—request additional time if needed
☐ Agree to "we'll try" instead of "we will provide"

### IF YOU DISAGREE:
☐ Clearly state your disagreement
☐ Explain why
☐ Propose an alternative
☐ Request disagreement be recorded in minutes
☐ Ask about mediation or appeals process

---

## AFTER THE MEETING

☐ Request written minutes/notes within 10 days
☐ Check minutes match your understanding
☐ Request corrections if needed
☐ Ensure all agreed actions are recorded
☐ Note follow-up dates and deadlines
☐ Send thank-you email confirming actions
☐ Set reminder for next review date
☐ Follow up on any outstanding actions

---

## NOTES DURING MEETING:

**Who attended:**
_____________________________________________

**Key points discussed:**
_____________________________________________
_____________________________________________
_____________________________________________

**Agreed actions:**
_____________________________________________
_____________________________________________
_____________________________________________

**Items for follow-up:**
_____________________________________________
_____________________________________________

**Next review date:**
_____________________________________________

---

**Remember:**
- You are the expert on your child
- Your voice is equal to professionals'
- It's okay to ask for a break or more time
- You can bring a supporter or advocate
- You don't have to agree to anything on the spot
- Everything should be child-centered, not budget-driven

**Prepared by:** [parentName]
**Date:** [date]`,
    evidenceLinks: [
      { title: 'IPSEA Meeting Guide', url: 'https://www.ipsea.org.uk/' },
      { title: 'NDSS Meeting Tips', url: 'https://www.ndss.org/' },
    ],
    tips: [
      'Practice what you want to say beforehand',
      'Bring a friend or advocate for moral support',
      'Record the meeting (with permission) if it helps you',
      'Focus on outcomes, not just provision hours',
      'Don\'t be afraid to request a follow-up meeting',
    ],
  },

  // Teacher Classroom Adjustment Plan
  {
    id: 'teacher-adjustment-plan',
    title: 'Classroom Adjustment Plan Template',
    description: 'Structured plan for teachers to document and implement classroom adjustments for students with additional needs',
    audience: 'teachers',
    country: 'all',
    category: 'classroom',
    fields: [
      { id: 'studentName', label: "Student's Name", type: 'text', placeholder: 'Student name', required: true },
      { id: 'teacherName', label: 'Teacher Name', type: 'text', placeholder: 'Your name', required: true },
      { id: 'class', label: 'Class/Year Group', type: 'text', placeholder: 'e.g., Year 5, Grade 3', required: true },
      { id: 'date', label: 'Plan Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
      { id: 'reviewDate', label: 'Review Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
    ],
    templateText: `**CLASSROOM ADJUSTMENT PLAN**

**Student:** [studentName]
**Teacher:** [teacherName]
**Class/Year:** [class]
**Plan Date:** [date]
**Review Date:** [reviewDate]

---

## STUDENT STRENGTHS
- 
- 
- 

## AREAS OF NEED
- 
- 
- 

## PRIMARY DIAGNOSIS/CONDITION
(e.g., Autism, ADHD, Dyslexia, Anxiety)

---

## SENSORY & ENVIRONMENTAL ADJUSTMENTS

☐ **Seating:**
   - Position: ___________________________
   - Reason: ____________________________

☐ **Lighting:**
   - Natural light preferred
   - Dimmer lighting needed
   - Reduce fluorescent flicker
   - Other: _____________________________

☐ **Noise:**
   - Ear defenders available
   - Quiet workspace option
   - Advance warning of loud activities
   - Other: _____________________________

☐ **Visual Environment:**
   - Clutter-free workspace
   - Visual timetable at desk
   - Minimal wall displays nearby
   - Other: _____________________________

---

## COMMUNICATION ADJUSTMENTS

☐ **Instruction Delivery:**
   - Break down into smaller steps
   - Written instructions provided
   - Visual supports used
   - Check understanding individually
   - Allow processing time (__ seconds)
   - Repeat key information

☐ **Questioning:**
   - Provide advance notice
   - Offer response options
   - Allow written responses
   - Think-pair-share time
   - Other: _____________________________

☐ **Non-Verbal Communication:**
   - Use visual cues/signals
   - Hand signals for breaks
   - Traffic light cards (red/yellow/green)
   - Other: _____________________________

---

## CURRICULUM ACCESS

☐ **Reading:**
   - Colored overlays (color: _______)
   - Larger font (size: _______)
   - Dyslexia-friendly font
   - Reduced text per page
   - Audio versions available
   - Pre-teaching vocabulary

☐ **Writing:**
   - Laptop/tablet use permitted
   - Speech-to-text software
   - Writing slopes/grips
   - Reduced writing demands
   - Alternative recording methods
   - Extra time (__ minutes)

☐ **Tasks:**
   - Chunked into smaller parts
   - Visual task organizers
   - Step-by-step guides
   - Worked examples provided
   - Extra time for completion
   - Alternative formats offered

---

## BEHAVIORAL & EMOTIONAL SUPPORT

☐ **Self-Regulation:**
   - Sensory break options available
   - Fidget tools permitted
   - Movement breaks (frequency: ______)
   - Calm corner/safe space access
   - Self-monitoring tools

☐ **Transitions:**
   - 5-minute warnings given
   - Visual timers used
   - Transition objects/scripts
   - Buddy support
   - Extra time between activities

☐ **Social Support:**
   - Lunchtime/break support
   - Social skills group
   - Peer buddy system
   - Adult check-ins (frequency: ______)
   - Social stories for new situations

☐ **Emotional Support:**
   - Emotion check-ins (frequency: ______)
   - Feelings thermometer available
   - Designated safe person
   - Home-school communication book
   - Other: _____________________________

---

## ASSESSMENT ADJUSTMENTS

☐ Extra time: ____%
☐ Rest breaks
☐ Separate room
☐ Scribe
☐ Reader
☐ Laptop/word processor
☐ Simplified language
☐ Reduced questions
☐ Colored paper (color: _______)
☐ Other: _____________________________

---

## DAILY SCHEDULE ADJUSTMENTS

**Morning:**
- Arrival routine: _________________________
- Check-in process: _______________________

**Throughout Day:**
- Break schedule: _________________________
- Movement breaks: _______________________

**End of Day:**
- Pack-up support: ________________________
- Home communication: ____________________

---

## CRISIS/ESCALATION PLAN

**Early Warning Signs:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**De-escalation Strategies:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**Safe Space:**
- Location: _________________________________
- Supportive adult: __________________________

**Parent Contact:**
- When to contact: __________________________
- Contact details: ____________________________

---

## STAFF RESPONSIBILITIES

**Class Teacher:**
- ___________________________________________

**Teaching Assistant:**
- ___________________________________________

**SENCO:**
- ___________________________________________

**Other Staff:**
- ___________________________________________

---

## MONITORING & REVIEW

**How will we know adjustments are working?**
- 
- 
- 

**Data to collect:**
- ☐ Work samples
- ☐ Behavior logs
- ☐ Self-assessment data
- ☐ Observation notes
- ☐ Parent feedback
- ☐ Student feedback

**Review meeting scheduled for:** [reviewDate]

---

## PARENT/STUDENT INPUT

**What helps at home:**
_____________________________________________

**What doesn't work:**
_____________________________________________

**Student's preferences:**
_____________________________________________

---

**Signatures:**

Teacher: ___________________ Date: _________

Parent: ____________________ Date: _________

SENCO: _____________________ Date: _________

Student (if appropriate): ____________ Date: _________

---

**Distribution:**
☐ Copy to parent
☐ Copy to student file
☐ Copy to SENCO
☐ Copy to teaching assistant
☐ Copy to specialist staff

**Review Notes:**
_____________________________________________
_____________________________________________`,
    evidenceLinks: [
      { title: 'SEND Code of Practice', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' },
      { title: 'Autism Education Trust Resources', url: 'https://www.autismeducationtrust.org.uk/' },
    ],
    tips: [
      'Involve the student in creating this plan where possible',
      'Review and update regularly—needs change over time',
      'Share with all staff who work with the student',
      'Be specific—"as needed" is too vague',
      'Focus on enabling access, not just managing behavior',
    ],
  },

  // Teacher Observation Log
  {
    id: 'teacher-observation-log',
    title: 'Student Observation Log',
    description: 'Structured log for teachers to document student observations for EHCP/IEP evidence',
    audience: 'teachers',
    country: 'all',
    category: 'evidence',
    fields: [
      { id: 'studentName', label: "Student's Name", type: 'text', placeholder: 'Student name', required: true },
      { id: 'observerName', label: 'Observer Name', type: 'text', placeholder: 'Your name', required: true },
      { id: 'class', label: 'Class/Year Group', type: 'text', placeholder: 'e.g., Year 5', required: true },
    ],
    templateText: `**STUDENT OBSERVATION LOG**

**Student:** [studentName]
**Observer:** [observerName]
**Class:** [class]

---

## LOG ENTRY TEMPLATE
(Copy this section for each observation)

**Date:** _______________  **Time:** _______________
**Activity/Subject:** _______________________________
**Setting:** ☐ Classroom  ☐ Playground  ☐ Small group  ☐ Other: __________

### OBSERVATION:
**What I saw/heard:**
(Be factual and specific—describe exactly what happened)
_____________________________________________
_____________________________________________
_____________________________________________

**Context:**
(What was happening before? Who was nearby? Any triggers?)
_____________________________________________
_____________________________________________

**Student response:**
(How did the student react? What strategies did they use?)
_____________________________________________
_____________________________________________

**Adult support provided:**
_____________________________________________

**Outcome:**
_____________________________________________

**Impact on learning:**
☐ No impact
☐ Minimal impact (continued with task)
☐ Moderate impact (delayed completion)
☐ Significant impact (unable to complete)
☐ Extremely significant (removed from situation)

**Comparison with peers:**
_____________________________________________

**What worked well:**
_____________________________________________

**What didn't work:**
_____________________________________________

**Action needed:**
_____________________________________________

---

## FOCUS AREAS TO OBSERVE

### ACADEMIC SKILLS
☐ Reading fluency and comprehension
☐ Writing (handwriting, composition, stamina)
☐ Math (calculation, problem-solving, reasoning)
☐ Processing speed
☐ Following instructions
☐ Task completion
☐ Independent work
☐ Group work participation

### ATTENTION & EXECUTIVE FUNCTION
☐ Sustained attention (how long?)
☐ Distractibility (what distracts?)
☐ Organization (desk, materials, time)
☐ Planning and sequencing
☐ Starting tasks without prompts
☐ Shifting between activities
☐ Working memory

### COMMUNICATION
☐ Expressive language (clarity, vocabulary)
☐ Receptive language (understanding instructions)
☐ Social communication (turn-taking, topic maintenance)
☐ Non-verbal communication
☐ Asking for help
☐ Answering questions

### SOCIAL-EMOTIONAL
☐ Interactions with peers
☐ Interactions with adults
☐ Emotional regulation
☐ Response to frustration
☐ Response to changes
☐ Play skills
☐ Conflict resolution
☐ Empathy and perspective-taking

### SENSORY & MOTOR
☐ Sensory sensitivities (sound, light, touch, etc.)
☐ Sensory seeking behaviors
☐ Fine motor skills
☐ Gross motor skills
☐ Coordination
☐ Physical comfort (fidgeting, restlessness)

### BEHAVIORAL
☐ On-task behavior
☐ Off-task behavior (type and frequency)
☐ Response to redirection
☐ Compliance with routines
☐ Anxiety indicators
☐ Avoidance behaviors

---

## EVIDENCE-GATHERING TIPS

**Be Specific:**
❌ "[Student] had a difficult day"
✅ "During math (10:15-10:45am), [student] put head on desk after 5 minutes, requiring 3 verbal prompts to re-engage. Completed 2/10 problems while peers completed 8-10."

**Use Objective Language:**
❌ "[Student] was naughty and disrupted the class"
✅ "[Student] left seat 4 times without permission during 20-minute lesson, making loud vocalizations each time."

**Compare to Peers:**
❌ "[Student] struggles with reading"
✅ "[Student] reads at Book Band 3 level. Expected level for age is Book Band 7. Peers read independently for 15 minutes; [student] requires 1:1 support after 3 minutes."

**Quantify When Possible:**
- Number of prompts needed
- Time on task vs. time off task
- Number of break requests
- Frequency of behaviors
- Comparison to class average

**Note Patterns:**
- Time of day when difficulties occur
- Triggers (transitions, group work, noise)
- What helps (visuals, breaks, choice)
- Consistency across settings

---

## WEEKLY SUMMARY

**Week Beginning:** _______________

**Number of observations:** _________

**Key patterns identified:**
1. _________________________________________
2. _________________________________________
3. _________________________________________

**Strategies that helped:**
_____________________________________________

**Strategies that didn't help:**
_____________________________________________

**Concerns/escalations:**
_____________________________________________

**Recommendations:**
_____________________________________________

**Parent communication:**
_____________________________________________

---

**Remember:** These observations provide crucial evidence for EHCP/IEP assessments. The more specific and objective you can be, the more helpful the evidence will be in securing appropriate support for the student.

**Observer:** [observerName]
**Date:** _______________`,
    evidenceLinks: [
      { title: 'Autism Education Trust - Assessment Tools', url: 'https://www.autismeducationtrust.org.uk/' },
      { title: 'IPSEA Evidence Guide', url: 'https://www.ipsea.org.uk/' },
    ],
    tips: [
      'Observe at different times and in different contexts',
      'Record observations immediately while details are fresh',
      'Include positive observations, not just difficulties',
      'Note what helps as well as what doesn\'t',
      'Keep observations factual and professional',
    ],
  },
];
