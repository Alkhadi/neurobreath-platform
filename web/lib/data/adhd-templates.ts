// ADHD-Specific Templates and Resources
// Letters, plans, and documents for ADHD management

export interface ADHDTemplate {
  id: string;
  title: string;
  description: string;
  category: 'school' | 'work' | 'medical' | 'personal';
  audience: 'parent' | 'teacher' | 'adult' | 'employer' | 'all';
  fields: {
    label: string;
    type: 'text' | 'textarea' | 'date' | 'select';
    placeholder: string;
    options?: string[];
    required: boolean;
  }[];
  template: string;
  tips: string[];
  citations: string[];
}

export const adhdTemplates: ADHDTemplate[] = [
  {
    id: '504-request',
    title: '504 Plan Request Letter (US)',
    description: 'Request accommodations for ADHD under Section 504 of the Rehabilitation Act',
    category: 'school',
    audience: 'parent',
    fields: [
      { label: 'Parent Name', type: 'text', placeholder: 'Your full name', required: true },
      { label: 'Child Name', type: 'text', placeholder: 'Child\'s full name', required: true },
      { label: 'Child Grade', type: 'text', placeholder: 'e.g., 5th Grade', required: true },
      { label: 'School Name', type: 'text', placeholder: 'School name', required: true },
      { label: 'Principal Name', type: 'text', placeholder: 'Principal\'s name', required: false },
      { label: 'Date of Diagnosis', type: 'date', placeholder: 'MM/DD/YYYY', required: false },
      { label: 'Diagnosing Professional', type: 'text', placeholder: 'Dr. Name, Title', required: false },
      { label: 'Current Challenges', type: 'textarea', placeholder: 'Describe specific challenges in school', required: true },
      { label: 'Requested Accommodations', type: 'textarea', placeholder: 'List specific accommodations needed', required: true }
    ],
    template: `[Date]

[Principal Name]
[School Name]
[School Address]

Dear [Principal Name],

I am writing to formally request a 504 Plan evaluation for my child, [Child Name], who is currently in [Child Grade] at [School Name]. [Child Name] has been diagnosed with Attention-Deficit/Hyperactivity Disorder (ADHD) by [Diagnosing Professional] on [Date of Diagnosis].

ADHD is recognized as a disability under Section 504 of the Rehabilitation Act of 1973, as it substantially limits major life activities including learning, reading, concentrating, thinking, and communicating.

**Current Educational Challenges:**
[Current Challenges]

**Requested Accommodations:**
I am requesting that [Child Name] be evaluated for a 504 Plan that may include accommodations such as:
[Requested Accommodations]

I am requesting that this evaluation be conducted as soon as possible. Per Section 504 regulations, I understand that the school must complete the evaluation and hold a 504 meeting within a reasonable time frame.

I am happy to provide additional documentation from [Child Name]'s healthcare providers and to participate in the 504 meeting. Please contact me at [Contact Information] to schedule the evaluation and meeting.

Thank you for your attention to this matter. I look forward to working collaboratively to support [Child Name]'s educational success.

Sincerely,
[Parent Name]
[Contact Information]`,
    tips: [
      'Send via certified mail or request email confirmation',
      'Keep copies of all correspondence',
      'Include recent psychological or medical evaluations',
      'Be specific about how ADHD impacts learning',
      'Request a response timeline (typically 2-4 weeks)'
    ],
    citations: [
      'Section 504 of the Rehabilitation Act',
      'US Dept of Education - 504 Guidance',
      'CHADD - 504 Plan Resource'
    ]
  },
  {
    id: 'workplace-accommodation',
    title: 'Workplace Accommodation Request',
    description: 'Request ADHD accommodations under ADA (US) or Equality Act (UK)',
    category: 'work',
    audience: 'adult',
    fields: [
      { label: 'Your Name', type: 'text', placeholder: 'Your full name', required: true },
      { label: 'Job Title', type: 'text', placeholder: 'Your position', required: true },
      { label: 'Manager Name', type: 'text', placeholder: 'Manager\'s name', required: true },
      { label: 'HR Contact', type: 'text', placeholder: 'HR representative name', required: false },
      { label: 'Company Name', type: 'text', placeholder: 'Company name', required: true },
      { label: 'Requested Accommodations', type: 'textarea', placeholder: 'List specific accommodations', required: true },
      { label: 'How Accommodations Help', type: 'textarea', placeholder: 'Explain benefit to job performance', required: true }
    ],
    template: `[Date]

[Manager Name] / [HR Contact]
[Company Name]

Re: Request for Workplace Accommodations under the ADA

Dear [Manager Name],

I am writing to formally request workplace accommodations for a medical condition under the Americans with Disabilities Act (ADA) [or Equality Act 2010 for UK]. I have been diagnosed with Attention-Deficit/Hyperactivity Disorder (ADHD), which is recognized as a disability under the ADA.

To perform my job duties as [Job Title] effectively, I am requesting the following reasonable accommodations:

[Requested Accommodations]

**How These Accommodations Will Help:**
[How Accommodations Help]

These accommodations will enable me to perform the essential functions of my position more effectively. I am committed to my role and to contributing to [Company Name]'s success.

I am happy to provide additional medical documentation if needed and to discuss these accommodations further. I can be reached at [Contact Information].

Thank you for your understanding and support.

Sincerely,
[Your Name]
[Job Title]`,
    tips: [
      'Focus on job performance, not medical details',
      'Suggest specific, reasonable accommodations',
      'Emphasize mutual benefit to you and employer',
      'Know your rights under ADA or local disability law',
      'Consider consulting with HR or disability advocate first'
    ],
    citations: [
      'Americans with Disabilities Act (ADA)',
      'Job Accommodation Network (JAN) - ADHD Accommodations',
      'Equality Act 2010 (UK)'
    ]
  },
  {
    id: 'dopamine-menu-template',
    title: 'Personalized Dopamine Menu',
    description: 'Create your custom menu of dopamine-boosting activities',
    category: 'personal',
    audience: 'all',
    fields: [
      { label: 'Your Name', type: 'text', placeholder: 'Optional', required: false },
      { label: 'Starters (5 min boosts)', type: 'textarea', placeholder: 'Quick activities: stretch, song, cold water, walk', required: true },
      { label: 'Mains (30-60 min)', type: 'textarea', placeholder: 'Exercise, hobby, creative project, learning', required: true },
      { label: 'Sides (alongside work)', type: 'textarea', placeholder: 'Music, fidget toy, gum, coffee', required: true },
      { label: 'Desserts (rewards)', type: 'textarea', placeholder: 'Gaming, social media, treats (with timer!)', required: true },
      { label: 'Emergency Resets', type: 'textarea', placeholder: 'Go-to activities when overwhelmed', required: true }
    ],
    template: `🍽️ ${''} DOPAMINE MENU
Created: [Date]

🥤 STARTERS (Quick 5-min Dopamine Hits)
[Starters]

🍔 MAINS (30-60 min Dopamine Feasts)
[Mains]

🍟 SIDES (Activities to Pair with Work)
[Sides]

🍰 DESSERTS (Guilt-Free Rewards - Use Timer!)
[Desserts]

🚨 EMERGENCY RESET MENU (When Overwhelmed)
[Emergency Resets]

💡 HOW TO USE:
1. Feeling stuck? Check your menu!
2. Choose based on time available and energy level
3. No guilt - these are ADHD-friendly tools
4. Update menu monthly as interests change
5. Share with family/friends for accountability

🧠 Remember: Dopamine regulation is PART of ADHD management, not procrastination!`,
    tips: [
      'Include mix of physical, creative, and social activities',
      'Update regularly as interests change (ADHD trait!)',
      'Keep visible - phone notes, printed on wall',
      'Share with trusted people for accountability',
      'No judgment - include "guilty pleasures" mindfully'
    ],
    citations: [
      'Dopamine and ADHD - Neurobiological Research',
      'How to ADHD - Dopamine Menu Concept',
      'ADHD Nutritionist - Dopamine Regulation'
    ]
  },
  {
    id: 'focus-block-plan',
    title: 'Daily Focus Block Planner',
    description: 'Visual time-blocking schedule for ADHD-friendly productivity',
    category: 'personal',
    audience: 'all',
    fields: [
      { label: 'Date', type: 'date', placeholder: 'MM/DD/YYYY', required: true },
      { label: 'Peak Focus Time', type: 'select', options: ['Early Morning (6-9am)', 'Mid-Morning (9-12pm)', 'Afternoon (12-3pm)', 'Evening (3-6pm)', 'Night (6pm+)'], placeholder: 'When do you focus best?', required: true },
      { label: 'Top 3 Priorities', type: 'textarea', placeholder: 'What MUST get done today?', required: true },
      { label: 'Body Doubling Time', type: 'text', placeholder: 'When will you use body doubling?', required: false },
      { label: 'Movement Breaks', type: 'text', placeholder: 'Planned break times', required: true },
      { label: 'Dopamine Rewards', type: 'textarea', placeholder: 'Rewards after completing tasks', required: true }
    ],
    template: `📅 FOCUS BLOCK PLAN - [Date]

⭐ TODAY'S ENERGY LEVEL: [Rate 1-10 at start of day]
🎯 PEAK FOCUS TIME: [Peak Focus Time]

🏆 TOP 3 PRIORITIES (Do These First!):
[Top 3 Priorities]

⏰ TIME BLOCKS:
━━━━━━━━━━━━━━━━━━━━━
Morning Block:
• [Time]: [Task]
• Break: [Movement/Dopamine]

Afternoon Block:
• [Time]: [Task]
• Break: [Movement/Dopamine]

Evening Block:
• [Time]: [Task]
• Break: [Movement/Dopamine]

👥 BODY DOUBLING:
[Body Doubling Time]

🏃 MOVEMENT BREAKS:
[Movement Breaks]

🎁 DOPAMINE REWARDS:
[Dopamine Rewards]

💭 END OF DAY REFLECTION:
• What went well?
• What was challenging?
• Adjust for tomorrow?
• Wins to celebrate 🎉

━━━━━━━━━━━━━━━━━━━━━
💡 ADHD PRO TIPS:
✓ Start with smallest task to build momentum
✓ Use website blockers during focus time
✓ Phone in another room or on DND
✓ Tell someone your plan (accountability!)
✓ Be flexible - hyperfocus when it hits!`,
    tips: [
      'Plan the night before when possible',
      'Time-block in pencil - expect changes!',
      'Include buffer time between tasks',
      'Schedule hardest task during peak focus time',
      'Review and adjust what works/doesn\'t'
    ],
    citations: [
      'Time Management for ADHD - Research',
      'Cal Newport - Time Blocking Method',
      'ADDitude - ADHD Planning Strategies'
    ]
  },
  {
    id: 'medication-tracker',
    title: 'ADHD Medication & Symptom Tracker',
    description: 'Track medication effectiveness, side effects, and symptom patterns',
    category: 'medical',
    audience: 'all',
    fields: [
      { label: 'Medication Name', type: 'text', placeholder: 'e.g., Adderall, Vyvanse, Ritalin', required: true },
      { label: 'Dosage', type: 'text', placeholder: 'e.g., 20mg', required: true },
      { label: 'Time Taken', type: 'text', placeholder: 'e.g., 7:00 AM', required: true },
      { label: 'Focus Level (1-10)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], placeholder: 'Rate focus', required: true },
      { label: 'Side Effects', type: 'textarea', placeholder: 'Any side effects noticed?', required: false },
      { label: 'Mood', type: 'select', options: ['Great', 'Good', 'Okay', 'Low', 'Irritable'], placeholder: 'How do you feel?', required: true },
      { label: 'Sleep Quality', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'], placeholder: 'How did you sleep?', required: false },
      { label: 'Notes', type: 'textarea', placeholder: 'Other observations', required: false }
    ],
    template: `💊 ADHD MEDICATION TRACKER

Date: [Date]
Medication: [Medication Name]
Dosage: [Dosage]
Time Taken: [Time Taken]

📊 EFFECTIVENESS:
• Focus Level: [Focus Level]/10
• Mood: [Mood]
• Sleep Quality: [Sleep Quality]

⚠️ SIDE EFFECTS:
[Side Effects]

📝 NOTES:
[Notes]

━━━━━━━━━━━━━━━━━━━━━
💡 WHAT TO TRACK:
✓ When medication "kicks in" and "wears off"
✓ Appetite changes
✓ Sleep patterns
✓ Emotional regulation
✓ Physical side effects (headache, nausea, heart rate)
✓ Task completion and productivity

🩺 SHARE WITH DOCTOR:
Bring this log to appointments to adjust dosage/timing!`,
    tips: [
      'Track daily for 2-4 weeks when starting new med',
      'Note time medication takes effect and wears off',
      'Track meals, water intake, and exercise too',
      'Bring to doctor appointments for adjustments',
      'Be honest about side effects - alternatives exist!'
    ],
    citations: [
      'CHADD - ADHD Medication Management',
      'NICE Guidelines - ADHD Medication Monitoring',
      'ADDitude - Medication Tracking Guide'
    ]
  },
  {
    id: 'parent-teacher-collab',
    title: 'Parent-Teacher Collaboration Plan',
    description: 'Structured communication plan between parents and teachers for ADHD support',
    category: 'school',
    audience: 'parent',
    fields: [
      { label: 'Child Name', type: 'text', placeholder: 'Student name', required: true },
      { label: 'Teacher Name', type: 'text', placeholder: 'Teacher name', required: true },
      { label: 'Grade', type: 'text', placeholder: 'e.g., 3rd Grade', required: true },
      { label: 'Communication Frequency', type: 'select', options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'], placeholder: 'How often to check in?', required: true },
      { label: 'Preferred Method', type: 'select', options: ['Email', 'App (ClassDojo, etc.)', 'Phone', 'In-person'], placeholder: 'Communication method', required: true },
      { label: 'Strengths to Build On', type: 'textarea', placeholder: 'What is child good at?', required: true },
      { label: 'Challenge Areas', type: 'textarea', placeholder: 'Areas needing support', required: true },
      { label: 'Home Strategies That Work', type: 'textarea', placeholder: 'What works at home?', required: true },
      { label: 'School Strategies to Try', type: 'textarea', placeholder: 'Suggested classroom strategies', required: true }
    ],
    template: `🤝 PARENT-TEACHER COLLABORATION PLAN

Student: [Child Name]
Teacher: [Teacher Name]
Grade: [Grade]
Date: [Date]

📞 COMMUNICATION:
• Frequency: [Communication Frequency]
• Method: [Preferred Method]
• Purpose: Share successes, challenges, and strategies

⭐ STRENGTHS TO BUILD ON:
[Strengths to Build On]

🎯 CHALLENGE AREAS:
[Challenge Areas]

🏠 WHAT WORKS AT HOME:
[Home Strategies That Work]

🏫 STRATEGIES TO TRY AT SCHOOL:
[School Strategies to Try]

✅ ACTION ITEMS:
Parent:
• [List parent action items]

Teacher:
• [List teacher action items]

📊 PROGRESS INDICATORS:
• [How will we measure success?]

📅 NEXT CHECK-IN: [Date]

━━━━━━━━━━━━━━━━━━━━━
💡 COLLABORATION TIPS:
✓ Focus on strengths first
✓ Share what works, not just problems
✓ Be specific with examples
✓ Celebrate small wins together
✓ Adjust plan as needed - flexibility is key!`,
    tips: [
      'Frame as partnership, not complaint',
      'Share specific examples of challenges and successes',
      'Offer to help implement strategies',
      'Keep communication positive and solution-focused',
      'Document conversations and agreements'
    ],
    citations: [
      'CHADD - School Collaboration Resources',
      'Understood.org - Parent-Teacher Communication',
      'ADDitude - Working with Teachers'
    ]
  }
];
