import type { RelatedContentItem, FAQItem } from '@/lib/seo/content-seo';

export interface InteractiveGuide {
  slug: string;
  title: string;
  description: string;
  pillar: {
    label: string;
    href: string;
  };
  intro: string;
  steps: string[];
  practicalTips: string[];
  safetyNotes?: string[];
  tryNow: {
    label: string;
    href: string;
  };
  related: RelatedContentItem[];
  faqs: FAQItem[];
  evidenceIds: string[];
  reviewedAt: string;
  nextReviewDue: string;
}

export const INTERACTIVE_GUIDES: InteractiveGuide[] = [
  {
    slug: 'quick-calm-in-5-minutes',
    title: 'Quick calm in 5 minutes',
    description: 'A short, practical reset using breathing, grounding, and gentle movement.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intro:
      'When stress builds up, a brief structured reset can help the body and mind settle. This 5-minute routine combines breathing, grounding (the 5-4-3-2-1 method), gentle movement, and a micro-planning step to reduce overwhelm. It is not a substitute for professional support but can help you regain a sense of steadiness in everyday moments.',
    steps: [
      'Find a comfortable seat or stand with feet flat on the floor.',
      'Start with 60 seconds of gentle paced breathing (in for 4, out for 6).',
      'Use the 5-4-3-2-1 grounding method: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.',
      'Gently roll your shoulders, unclench your jaw, stretch your neck from side to side.',
      'Return to slow breathing for another 60 seconds.',
      'Finish by naming the smallest next step you can take.',
    ],
    practicalTips: [
      'If you feel light-headed, slow the exhale and pause for a moment.',
      'Repeat this routine before meetings, exams, or transitions.',
      'Keep it brief — consistency matters more than duration.',
      'If one step feels unhelpful, skip it and move to the next.',
      'You do not need a quiet space; this can be done at a desk or in a car park (not while driving).',
    ],
    safetyNotes: [
      'Do not use this while driving or operating machinery.',
      'Stop and return to normal breathing if you feel panicky or dizzy.',
      'This routine is for everyday stress, not crisis moments. If you feel unsafe, contact a professional or emergency service.',
      'If grounding makes you feel worse, try focusing on your hands and feet only.',
    ],
    tryNow: {
      label: 'Open Stress Tools',
      href: '/tools/stress-tools',
    },
    related: [
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking in one hub.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Fast breathing routine for acute stress.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/body-scan-for-stress',
        label: 'Body scan for stress relief',
        description: 'A simple body scan to release tension.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/coherent',
        label: 'Coherent Breathing',
        description: 'Slow, steady rhythm for longer practice.',
        typeBadge: 'Technique',
      },
    ],
    faqs: [
      {
        question: 'Can I use this routine during a panic spike?',
        answer: 'It can help you slow down, but seek professional support if panic is frequent or severe.',
      },
      {
        question: 'Should I sit or stand?',
        answer: 'Either is fine. Choose a posture that feels stable and safe.',
      },
      {
        question: 'How often should I repeat this?',
        answer: 'Use it as needed and consider a short daily practice for prevention.',
      },
      {
        question: 'What if grounding makes me feel worse?',
        answer: 'Focus on hands and feet only, or switch to a simple slow exhale. Not all techniques suit everyone.',
      },
      {
        question: 'Is this based on evidence?',
        answer: 'Grounding (5-4-3-2-1) and paced breathing are supported by clinical guidance. See evidence sources below.',
      },
    ],
    evidenceIds: [
      'nhs_inform_grounding',
      'nhs_mindfulness',
      'nhs_breathing_stress',
      'pubmed_29616846',
    ],
    reviewedAt: '28 Jan 2026',
    nextReviewDue: '28 May 2026',
  },
  {
    slug: 'body-scan-for-stress',
    title: 'Body scan for stress relief',
    description: 'A simple body scan to release tension and reset your attention.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intro:
      'A body scan is a mindfulness-based practice where you focus attention on different parts of the body, noticing tension and gently letting it go. It can help with stress, improve body awareness, and support relaxation. However, body scans are not helpful for everyone — some people find them uncomfortable or triggering. That is completely normal, and other approaches (like grounding) may suit you better.',
    steps: [
      'Find a comfortable position — sitting or lying down.',
      'Close your eyes or soften your gaze.',
      'Start at your feet and ankles. Notice any tension and let it soften.',
      'Move attention up to your legs, then torso, then shoulders and arms.',
      'Scan your face and jaw — release any clenching.',
      'Finish with a slow breath, noticing your whole body at rest.',
    ],
    practicalTips: [
      'If scanning feels difficult, try one area at a time (just hands, or just feet).',
      'Pair the scan with a short breathing timer.',
      'Use the scan before sleep or after a stressful event.',
      'Keep your eyes open if closing them feels unsettling.',
      'The NHS Every Mind Matters website includes audio guides for body scans.',
    ],
    safetyNotes: [
      'Body scans involve inward attention, which is not comfortable for everyone.',
      'If you feel panicky or distressed, stop and try grounding (5-4-3-2-1) instead.',
      'If you have experienced trauma, consult a professional before using body awareness techniques.',
      'This is educational guidance, not therapy.',
    ],
    tryNow: {
      label: 'Open Stress Tools',
      href: '/tools/stress-tools',
    },
    related: [
      {
        href: '/tools/anxiety-tools',
        label: 'Anxiety Toolkit',
        description: 'Grounding and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick calm in 5 minutes',
        description: 'Short reset routine for busy days.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/coherent',
        label: 'Coherent Breathing',
        description: 'Slow, steady rhythm for balance.',
        typeBadge: 'Technique',
      },
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking.',
        typeBadge: 'Tool',
      },
    ],
    faqs: [
      {
        question: 'Is a body scan the same as meditation?',
        answer: 'It is a simple mindful practice, but you do not need to meditate to use it.',
      },
      {
        question: 'Can I do this at my desk?',
        answer: 'Yes, it can be done sitting down with minimal movement.',
      },
      {
        question: 'How long should it take?',
        answer: 'Start with 2–3 minutes and extend if it feels useful.',
      },
      {
        question: 'What if body scans make me feel worse?',
        answer: 'Not all approaches work for everyone. Try grounding or breathing exercises instead.',
      },
      {
        question: 'Is there evidence for body scans?',
        answer: 'Research shows body scans can reduce stress for many people, but effects vary. NHS guidance includes them as a beginner mindfulness practice.',
      },
      {
        question: 'Should I use audio guidance?',
        answer: 'Audio guides can help you stay focused. NHS Every Mind Matters offers free body scan audio.',
      },
    ],
    evidenceIds: [
      'nhs_every_mind_matters_meditation',
      'nhs_mindfulness',
      'pubmed_body_scan_2022',
    ],
    reviewedAt: '28 Jan 2026',
    nextReviewDue: '28 May 2026',
  },

  // ── Sleep guides ────────────────────────────────────────────────────────────

  {
    slug: 'wind-down-routine',
    title: 'Wind-down routine for better sleep',
    description: 'Evening routine to help your body and brain transition from active to rest mode.',
    pillar: { label: 'Sleep Support', href: '/sleep' },
    intro:
      'A consistent wind-down routine acts as a bridge between the demands of the day and restful sleep. Research shows that predictable pre-sleep habits help regulate the body\'s circadian rhythm and reduce sleep-onset time. You do not need a lengthy ritual — even 15–20 minutes of intentional winding down can make a meaningful difference. This guide walks through five practical steps you can adapt to suit your schedule.',
    steps: [
      'Set a consistent end-of-screen time — at least 30 minutes before you plan to sleep.',
      'Dim lights in your environment (use warm-toned lamps rather than overhead lighting).',
      'Do 5 minutes of slow, gentle breathing: inhale for 4 seconds, exhale for 6 seconds.',
      'Write down any lingering thoughts or tomorrow\'s tasks to clear your mind (a brief brain dump).',
      'Keep room temperature cool (around 16–18 °C / 60–65 °F) and ensure your space is quiet and dark.',
    ],
    practicalTips: [
      'Consistency matters more than perfection — even a shortened version on busy nights helps.',
      'Warm showers or baths 1–2 hours before bed can support the body\'s temperature drop.',
      'Avoid caffeine in the 6 hours before sleep.',
      'Use the same bedtime each night, even at weekends, to anchor your circadian rhythm.',
      'If your mind races, try the breathing tool at /tools/sleep-tools for a guided wind-down.',
    ],
    safetyNotes: [
      'If you have persistent insomnia lasting more than 3 months, consult your GP about CBT-I (Cognitive Behavioural Therapy for Insomnia).',
      'Do not use breathing exercises while taking medications that cause drowsiness unless cleared by a clinician.',
      'This is educational guidance only, not a substitute for professional medical advice.',
    ],
    tryNow: {
      label: 'Open Sleep Tools',
      href: '/tools/sleep-tools',
    },
    related: [
      {
        href: '/tools/sleep-tools',
        label: 'Sleep Tools',
        description: 'Guided wind-down and sleep support.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/sleep-reset-for-shift-workers',
        label: 'Sleep reset for shift workers',
        description: 'Adjustments for irregular schedules.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/4-7-8',
        label: '4-7-8 Breathing',
        description: 'Slow breathing technique for sleep.',
        typeBadge: 'Technique',
      },
      {
        href: '/guides/body-scan-for-stress',
        label: 'Body scan for stress relief',
        description: 'Release tension before bed.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How long should a wind-down routine be?',
        answer: 'Even 15 minutes is beneficial. Longer routines (30–60 minutes) may help in high-stress periods.',
      },
      {
        question: 'Can I use my phone for reading during wind-down?',
        answer: 'E-readers with warm light modes are better than bright phones. Physical books or audiobooks are ideal.',
      },
      {
        question: 'What if I have ADHD and struggle with routines?',
        answer: 'Pair the routine with an alarm, use visual cues, and start with just one step rather than all five at once.',
      },
      {
        question: 'Will this cure insomnia?',
        answer: 'Wind-down routines support sleep hygiene but are not a treatment for clinical insomnia. Speak to your GP if sleep problems persist.',
      },
    ],
    evidenceIds: ['nhs_insomnia'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  {
    slug: 'sleep-reset-for-shift-workers',
    title: 'Sleep reset for shift workers',
    description: 'Practical adjustments for irregular schedules to protect sleep quality.',
    pillar: { label: 'Sleep Support', href: '/sleep' },
    intro:
      'Shift work disrupts the body\'s natural circadian rhythm, making restorative sleep harder to achieve. Whether you work nights, rotating shifts, or early starts, small adjustments to light exposure, meal timing, and pre-sleep habits can significantly improve how well you sleep. This guide offers targeted strategies for people with non-traditional working hours.',
    steps: [
      'After a night shift, block out all light when you sleep — use blackout curtains or a sleep mask.',
      'Eat a light meal before your sleep window; avoid heavy, spicy, or high-sugar foods within 2 hours of sleep.',
      'Wind down for at least 20 minutes after your shift before attempting sleep.',
      'Keep sleep duration consistent (aim for 7–9 hours), even if the timing shifts day-to-day.',
      'If rotating shifts, adjust your bedtime gradually (30–60 minutes earlier or later each day) rather than all at once.',
    ],
    practicalTips: [
      'Use earplugs or white noise to block daytime noise during sleep.',
      'Tell household members your sleep window so they can minimise disturbances.',
      'Short naps (20 minutes) before a night shift can improve alertness without affecting your main sleep.',
      'Avoid alcohol as a sleep aid — it reduces sleep quality and fragments rest.',
      'Expose yourself to bright light when you wake up to signal your body that it is time to be alert.',
    ],
    safetyNotes: [
      'Persistent fatigue from shift work can increase accident risk. If you feel unsafe at work, speak to your manager or occupational health team.',
      'Shift work disorder is a recognised condition — seek medical advice if your sleep problems are severe or prolonged.',
      'This is educational guidance only.',
    ],
    tryNow: {
      label: 'Open Sleep Tools',
      href: '/tools/sleep-tools',
    },
    related: [
      {
        href: '/guides/wind-down-routine',
        label: 'Wind-down routine',
        description: 'Establish a calming pre-sleep habit.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/sleep-tools',
        label: 'Sleep Tools',
        description: 'Guided wind-down and sleep support.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick calm in 5 minutes',
        description: 'Short reset before your sleep window.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'What is the best sleep schedule for night shift workers?',
        answer: 'Consistency is key. Try to sleep at the same time after each shift, even on days off, to anchor your internal clock.',
      },
      {
        question: 'Can I use melatonin to help shift my sleep?',
        answer: 'Melatonin can help reset the body clock for shift workers. Consult your GP for appropriate dosing and timing.',
      },
      {
        question: 'How do I sleep during the day without being disturbed?',
        answer: 'Use blackout curtains, earplugs, a do-not-disturb sign, and communicate your sleep schedule clearly to others in your home.',
      },
      {
        question: 'Does shift work affect health in the long term?',
        answer: 'Long-term shift work is associated with increased health risks. NHS Occupational Health services can provide personalised guidance.',
      },
    ],
    evidenceIds: ['nhs_insomnia', 'nih_sleep'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  // ── Focus & ADHD guides ─────────────────────────────────────────────────────

  {
    slug: 'focus-sprints-for-adhd',
    title: 'Focus sprints for ADHD',
    description: 'Short, timed focus blocks with planned breaks to work with your brain, not against it.',
    pillar: { label: 'ADHD & Focus Support', href: '/conditions/adhd' },
    intro:
      'People with ADHD often struggle with sustained attention but can experience intense focus in short bursts — sometimes called hyperfocus. Focus sprints work with this natural rhythm by breaking tasks into brief, timed blocks (typically 10–25 minutes) followed by planned rest breaks. This structured approach reduces the feeling of overwhelm, provides a clear start and end point, and makes it easier to initiate tasks.',
    steps: [
      'Choose one single, specific task before you start the timer.',
      'Set a timer for 10–25 minutes (start shorter if initiation is hard).',
      'Work only on that task until the timer ends — if distracting thoughts arise, jot them on a sticky note and return to focus.',
      'Take a 5-minute break: stand up, move around, drink water, or do something enjoyable.',
      'After 3–4 sprints, take a longer break of 15–30 minutes.',
    ],
    practicalTips: [
      'Use a visible timer (physical or on screen) so you can see time passing rather than estimating it.',
      'Try a "body double" — working alongside another person (even virtually) can boost accountability.',
      'Reduce distractions first: silence notifications, use website blockers if needed.',
      'Celebrate completing sprints — ADHD brains respond well to immediate reward.',
      'Adjust sprint length based on your energy: shorter when dysregulated, longer when in flow.',
    ],
    safetyNotes: [
      'If anxiety or frustration spikes mid-sprint, stop and take a break — forced focus rarely helps.',
      'This strategy is educational. For comprehensive ADHD support, work with a specialist or your GP.',
    ],
    tryNow: {
      label: 'Open Focus Lab',
      href: '/tools/adhd-focus-lab',
    },
    related: [
      {
        href: '/tools/adhd-focus-lab',
        label: 'ADHD Focus Lab',
        description: 'Focus tools and timers for ADHD.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/adhd-break-planning',
        label: 'ADHD break planning',
        description: 'Plan breaks to sustain focus all day.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/focus-tiles',
        label: 'Focus Tiles',
        description: 'Visual task-pacing tool.',
        typeBadge: 'Tool',
      },
      {
        href: '/conditions/adhd',
        label: 'ADHD Hub',
        description: 'Resources and tools for ADHD.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How long should a focus sprint be?',
        answer: 'Start with 10 minutes and experiment up to 25 minutes. The right length varies by task and energy level.',
      },
      {
        question: 'What counts as a valid break?',
        answer: 'Any activity that rests your focused attention: stretching, snacking, a short walk, doodling, or chatting briefly.',
      },
      {
        question: 'What if I can\'t stop when the timer ends?',
        answer: 'If you\'re in flow, continue! Sprints are a starting framework, not a rigid rule. Stop only if you feel fatigued.',
      },
      {
        question: 'Is this the same as the Pomodoro Technique?',
        answer: 'It is similar, but adapted for ADHD with more flexibility on timing and an emphasis on movement breaks.',
      },
    ],
    evidenceIds: ['nhs_adhd', 'nimh_adhd'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  {
    slug: 'adhd-break-planning',
    title: 'ADHD break planning',
    description: 'Plan movement and reset breaks into your day to sustain attention and reduce overwhelm.',
    pillar: { label: 'ADHD & Focus Support', href: '/conditions/adhd' },
    intro:
      'For people with ADHD, unplanned breaks often arrive too late — after fatigue, frustration, or shutdown has already set in. Intentionally scheduling breaks before you need them keeps the nervous system regulated and prevents the crash-and-burn pattern. Movement breaks are especially powerful because physical activity increases dopamine, norepinephrine, and serotonin — neurotransmitters that support attention and emotional regulation.',
    steps: [
      'At the start of each day or work session, identify your planned break times and add them to your calendar or whiteboard.',
      'Alternate between short movement breaks (5 min) and longer reset breaks (15–20 min) throughout the day.',
      'For movement breaks: walk briskly, do jumping jacks, stretch, or dance — anything that raises your heart rate briefly.',
      'For reset breaks: step away from screens, drink water, do slow breathing, or do something sensory-soothing.',
      'After each break, use a brief re-entry ritual: 3 slow breaths and then state your next task aloud before returning to work.',
    ],
    practicalTips: [
      'Set recurring alarms for breaks so you don\'t forget — use a different alarm tone for "break" vs "start".',
      'Stock your break area with items that feel regulating: fidget tools, a cold drink, comfortable lighting.',
      'If you feel the urge to skip a break, notice it but still take 2 minutes to stand and move.',
      'Plan your most challenging tasks when your energy and medication (if applicable) are at their peak.',
      'Track how you feel before and after breaks to identify what works best for your nervous system.',
    ],
    safetyNotes: [
      'If you frequently feel overwhelmed or unable to complete daily tasks, discuss this with your GP or ADHD specialist.',
      'This guide offers strategies only and is not a substitute for ADHD assessment or professional support.',
    ],
    tryNow: {
      label: 'Try Focus Tools',
      href: '/tools/adhd-focus-lab',
    },
    related: [
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus sprints for ADHD',
        description: 'Structured focus blocks for better output.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/adhd-focus-lab',
        label: 'ADHD Focus Lab',
        description: 'Focus tools and timers for ADHD.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick calm in 5 minutes',
        description: 'Reset routine for stress and overwhelm.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/adhd',
        label: 'ADHD Hub',
        description: 'Guides, tools, and resources.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How many breaks should I plan in a day?',
        answer: 'A short break every 45–90 minutes is a good starting point. Adjust based on task demands and your energy levels.',
      },
      {
        question: 'What if my workplace doesn\'t allow movement breaks?',
        answer: 'Even a short walk to the water cooler, a bathroom break, or 2 minutes of stretching at your desk counts. Micro-movement adds up.',
      },
      {
        question: 'Can break planning work for children with ADHD?',
        answer: 'Yes — visual schedules showing break times are especially effective for children. Work with teachers and parents to coordinate.',
      },
      {
        question: 'What if I lose track of time and skip breaks?',
        answer: 'Use recurring phone alarms or a visual timer. External cues are much more reliable for time-blindness than internal reminders.',
      },
    ],
    evidenceIds: ['nhs_adhd', 'nimh_adhd'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  // ── Autism & Sensory guides ─────────────────────────────────────────────────

  {
    slug: 'autism-sensory-reset',
    title: 'Autism sensory reset',
    description: 'A gentle, predictable plan for moments of sensory overload or overwhelm.',
    pillar: { label: 'Autism Support', href: '/conditions/autism' },
    intro:
      'Sensory overload occurs when the nervous system receives more input than it can process — sounds, lights, textures, smells, or social demands can all contribute. For autistic people, this threshold is often lower than neurotypical norms, and the experience can range from discomfort to complete shutdown. A sensory reset plan does not aim to push through overload; instead, it creates a safe, predictable exit route that reduces duration and intensity of distress.',
    steps: [
      'Recognise the early signs: increased irritability, covering ears or eyes, rocking, withdrawing, or physical discomfort.',
      'Signal clearly and calmly to others that you need a break (a pre-agreed word, gesture, or card can help).',
      'Move to a lower-stimulation space — quiet room, outdoors, or a designated calm corner.',
      'Reduce sensory input: dim or block light, put on noise-cancelling headphones, remove uncomfortable clothing if possible.',
      'Use a regulating activity from your personal sensory kit: deep pressure, slow breathing, or a preferred fidget/texture.',
      'Allow as much time as needed before returning to the environment; avoid rushing the return.',
    ],
    practicalTips: [
      'Build a personal sensory kit in advance with items that reliably help (headphones, a weighted blanket, a preferred object).',
      'Practise the reset plan when calm so it feels familiar when overload strikes.',
      'Identify your warning signs early and act before overload peaks — it is much harder to recover from full shutdown.',
      'Let trusted people know your plan so they can support rather than escalate the situation.',
      'A sensory diet (regular sensory activities throughout the day) can reduce baseline overload risk.',
    ],
    safetyNotes: [
      'If a person becomes distressed or unresponsive, prioritise their safety and, where appropriate, contact a medical professional.',
      'This guide is educational. For tailored sensory support, work with an occupational therapist who specialises in autism.',
    ],
    tryNow: {
      label: 'Open Sensory Tools',
      href: '/tools/sensory-calm',
    },
    related: [
      {
        href: '/guides/breathing-for-sensory-overload',
        label: 'Breathing for sensory overload',
        description: 'Gentle breathing for overwhelm.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/autism-transition-support',
        label: 'Autism transition support',
        description: 'Predictable steps for smoother transitions.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/sensory-calm',
        label: 'Sensory Calm Tools',
        description: 'Calming activities for sensory regulation.',
        typeBadge: 'Tool',
      },
      {
        href: '/conditions/autism',
        label: 'Autism Hub',
        description: 'Guides and tools for autism support.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How do I know if someone is in sensory overload vs just being difficult?',
        answer: 'Sensory overload is an involuntary physiological response, not a choice. Look for sensory triggers in the environment and respond with empathy and reduced stimulation.',
      },
      {
        question: 'Can children use this plan?',
        answer: 'Yes — with adult support. Help children practise the steps when calm, and build a child-friendly sensory kit together.',
      },
      {
        question: 'What if there is no quiet space available?',
        answer: 'Noise-cancelling headphones and sunglasses can create a portable "sensory bubble" in public spaces.',
      },
      {
        question: 'How long does a sensory reset take?',
        answer: 'It varies. Some people need 10 minutes; others may need an hour or more. Avoid setting time limits on recovery.',
      },
    ],
    evidenceIds: ['nhs_autism', 'cdc_autism'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  {
    slug: 'breathing-for-sensory-overload',
    title: 'Breathing for sensory overload',
    description: 'Gentle breathing steps to help regulate the nervous system during sensory overwhelm.',
    pillar: { label: 'Autism Support', href: '/conditions/autism' },
    intro:
      'When sensory overload activates the nervous system\'s threat response, slow, deliberate breathing is one of the fastest ways to downregulate it. Extending the exhale activates the parasympathetic system, reducing heart rate and cortisol. For autistic people and those with sensory sensitivities, simple, low-effort breathing techniques that don\'t require focus on the body can be especially helpful — this guide keeps the steps minimal and predictable.',
    steps: [
      'Find a slightly less stimulating position or space if possible — you do not need complete quiet.',
      'Focus only on your exhale: breathe out slowly and fully, allowing the inhale to happen naturally.',
      'Count silently to 4 or 6 on each exhale to give your mind a simple anchor.',
      'Repeat for 10–15 breath cycles, staying only with the count — let everything else fade to background.',
      'When you feel even slightly calmer, pause and notice the difference before returning to your environment.',
    ],
    practicalTips: [
      'If focusing on breathing itself feels uncomfortable, hum gently on the exhale — the vibration has a similar calming effect.',
      'Pair breathing with a grounding object (hold something textured or weighted) to reduce the cognitive load.',
      'Practice this technique when you are calm so it becomes automatic under stress.',
      'Nose breathing is generally more calming than mouth breathing; but use whichever feels natural to you.',
    ],
    safetyNotes: [
      'Do not force deep breaths — this can cause dizziness or increase anxiety. Keep breathing gentle and effortless.',
      'If breathing exercises make you feel worse, stop and try a sensory grounding activity instead.',
      'Seek professional support if sensory overload is frequent, severe, or significantly impacting daily life.',
    ],
    tryNow: {
      label: 'Try a Breathing Reset',
      href: '/techniques/sos',
    },
    related: [
      {
        href: '/guides/autism-sensory-reset',
        label: 'Autism sensory reset',
        description: 'Full plan for sensory overload moments.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/sensory-calm',
        label: 'Sensory Calm Tools',
        description: 'Calming activities for sensory regulation.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick calm in 5 minutes',
        description: 'Short reset routine for stress.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/sos',
        label: 'SOS Breathing',
        description: 'One-minute breathing reset.',
        typeBadge: 'Technique',
      },
    ],
    faqs: [
      {
        question: 'Why extend the exhale specifically?',
        answer: 'A longer exhale stimulates the vagus nerve, activating the parasympathetic nervous system and reducing the stress response.',
      },
      {
        question: 'Can I use this during a meltdown?',
        answer: 'Breathing techniques work best in early-to-mid overload. During a full meltdown, focus on removing sensory triggers first; breathing can help in recovery.',
      },
      {
        question: 'Are there breathing techniques specifically for autistic people?',
        answer: 'Simple, predictable patterns with minimal sensory input (low counts, no complex postures) tend to work best. Humming or nasal breathing can also suit sensory sensitivities.',
      },
      {
        question: 'Is this safe for children?',
        answer: 'Yes, gentle exhale-focused breathing is safe for children. Keep instructions very simple and use visual cues where possible.',
      },
    ],
    evidenceIds: ['nhs_autism', 'nhs_breathing_stress'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  {
    slug: 'autism-transition-support',
    title: 'Autism transition support',
    description: 'Predictable steps and visual cues to support smoother activity or environment transitions.',
    pillar: { label: 'Autism Support', href: '/conditions/autism' },
    intro:
      'Transitions — moving from one activity, place, or expectation to another — are among the most challenging aspects of daily life for many autistic people. The shift requires rapid adaptation, often without adequate warning or context, and can trigger anxiety, resistance, or meltdowns. Structured transition support reduces uncertainty, provides advance notice, and creates a predictable sequence that makes the change feel safer and more manageable.',
    steps: [
      'Give advance notice: warn about the upcoming transition at least 5–10 minutes before it happens (longer for significant changes).',
      'Use a countdown: "5 more minutes, then we go" → "2 minutes" → "1 minute" → "time to finish".',
      'Provide a visual schedule or timer showing what comes next — predictability reduces anticipatory anxiety.',
      'Acknowledge the transition out loud: "You are doing really well finishing that. Next, we are going to [activity]."',
      'Allow a brief settling time at the start of the new activity before expecting full engagement.',
    ],
    practicalTips: [
      'Use a consistent transition object or ritual (a handshake, a specific phrase, a visual card) to signal the change reliably.',
      'Avoid abrupt endings to preferred activities — "we\'ll come back to this later" (and mean it) reduces resistance.',
      'Involve the autistic person in planning transitions where possible — agency reduces anxiety.',
      'If a transition is repeatedly difficult, consider whether the trigger is sensory, social, or unpredictability-related and adapt accordingly.',
      'Praise the transition specifically: "Great job moving to maths when the timer rang."',
    ],
    safetyNotes: [
      'Never physically force a transition unless there is an immediate safety concern — this can escalate distress significantly.',
      'Persistent transition difficulties may indicate unmet sensory or anxiety needs; seek occupational therapy or autism specialist advice.',
      'This guide is for educational use and does not replace specialist assessment or support.',
    ],
    tryNow: {
      label: 'Open Sensory Tools',
      href: '/tools/sensory-calm',
    },
    related: [
      {
        href: '/guides/autism-sensory-reset',
        label: 'Autism sensory reset',
        description: 'Plan for sensory overload moments.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/sensory-calm',
        label: 'Sensory Calm Tools',
        description: 'Calming tools for regulation.',
        typeBadge: 'Tool',
      },
      {
        href: '/conditions/autism',
        label: 'Autism Hub',
        description: 'Guides and tools for autism support.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Why are transitions so hard for autistic people?',
        answer: 'Transitions require rapid context-switching, tolerance of uncertainty, and interruption of predictable patterns — all of which are neurologically challenging for many autistic people.',
      },
      {
        question: 'What if the visual schedule doesn\'t help?',
        answer: 'Try different formats (photos, objects, written lists) to find what communicates most clearly for the individual. Some people respond better to auditory cues or tactile signals.',
      },
      {
        question: 'How can I support transitions at school?',
        answer: 'Work with the school\'s SENCO to introduce visual timetables, warning prompts, and dedicated settling time. Consistent language and cues across home and school are also important.',
      },
      {
        question: 'Does this apply to life transitions too (e.g. changing school)?',
        answer: 'Yes — the same principles (advance information, visual planning, gradual exposure) apply to major life transitions. Additional specialist support is often beneficial for these.',
      },
    ],
    evidenceIds: ['nhs_autism', 'cdc_autism'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  // ── Dyslexia & Reading guides ───────────────────────────────────────────────

  {
    slug: 'reading-routine-at-home',
    title: 'Reading routine at home',
    description: 'Short daily reading routines that build confidence and skills for children and adults with dyslexia.',
    pillar: { label: 'Dyslexia & Reading Support', href: '/conditions/dyslexia' },
    intro:
      'Consistent, low-pressure reading practice is one of the most effective ways to build literacy skills for people with dyslexia. Short daily sessions of 10–15 minutes are more beneficial than infrequent longer sessions, especially when paired with multi-sensory techniques. The goal is to create positive associations with reading rather than reinforce anxiety or avoidance. This guide outlines a simple, repeatable routine suitable for children and adults.',
    steps: [
      'Choose a regular, low-distraction time each day — after school, before bed, or in the morning.',
      'Select reading material at the person\'s comfortable reading level (not stretch level) to build fluency and confidence.',
      'Use multi-sensory support: follow along with a finger or ruler, read aloud, and use coloured overlays if helpful.',
      'Read for 10 minutes, taking turns if supporting a child (paired reading).',
      'Finish with a brief, positive conversation about what was read — focus on meaning and enjoyment rather than errors.',
    ],
    practicalTips: [
      'Keep sessions positive — stop before frustration builds, even if the full 10 minutes isn\'t complete.',
      'Audiobooks paired with text help readers follow along and build vocabulary while reducing decoding strain.',
      'Adjust font size, line spacing, and background colour on digital texts to improve readability.',
      'Celebrate consistency ("We\'ve read together every day this week!") rather than performance.',
      'British Dyslexia Association and NHS guidance recommend working with a specialist teacher for personalised phonics support.',
    ],
    safetyNotes: [
      'Never use reading practice as a punishment or withold breaks — this creates negative associations.',
      'If reading difficulties are significant or causing distress, seek a formal dyslexia assessment through your school or GP.',
      'This guide is educational; it does not replace specialist teaching or assessment.',
    ],
    tryNow: {
      label: 'Explore Dyslexia Support',
      href: '/conditions/dyslexia',
    },
    related: [
      {
        href: '/guides/reading-confidence-in-class',
        label: 'Reading confidence in class',
        description: 'Classroom strategies for reading support.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/dyslexia',
        label: 'Dyslexia Hub',
        description: 'Guides and tools for dyslexia support.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus sprints',
        description: 'Short focus blocks for learning tasks.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How long should daily reading practice be?',
        answer: '10–15 minutes of daily practice is generally more effective than a 1-hour session once a week. Little and often is the key principle.',
      },
      {
        question: 'What is paired reading?',
        answer: 'Paired reading involves a child and a fluent reader reading aloud together simultaneously. The child leads; the adult provides support and models fluency.',
      },
      {
        question: 'Should I correct every error during reading?',
        answer: 'Focus on errors that affect meaning. Minor errors often self-correct as fluency grows. Over-correction can increase reading anxiety.',
      },
      {
        question: 'At what age should reading support start?',
        answer: 'Early identification (age 5–7) is ideal, but reading support is beneficial at any age. Adults with dyslexia also benefit significantly from structured support.',
      },
    ],
    evidenceIds: ['nhs_dyslexia', 'cdc_dyslexia'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },

  {
    slug: 'reading-confidence-in-class',
    title: 'Reading confidence in class',
    description: 'Classroom strategies to reduce reading anxiety and build confidence for students with dyslexia.',
    pillar: { label: 'Dyslexia & Reading Support', href: '/conditions/dyslexia' },
    intro:
      'For students with dyslexia, the classroom reading experience can feel exposing and anxiety-provoking, especially when reading aloud or under time pressure. Strategies that reduce public failure and increase choice can transform reading from a source of stress into a manageable, even enjoyable activity. This guide is designed for teachers and supporters, with practical adaptations that can be implemented with minimal preparation.',
    steps: [
      'Give advance notice before asking a student to read aloud — warn them which paragraph they\'ll be reading so they can prepare.',
      'Offer choice: "Would you prefer to read this alone, with a partner, or shall I read while you follow along?"',
      'Reduce visual crowding by providing materials with larger print, increased line spacing, or on coloured paper.',
      'Avoid putting students on the spot in whole-class settings; use small-group or paired reading instead.',
      'Provide a positive, specific comment after reading: "I really liked how you read that character\'s voice."',
    ],
    practicalTips: [
      'Use reading buddies or paired reading to reduce the isolation of struggling with text independently.',
      'Allow extra processing time during assessments — this is a reasonable adjustment under the Equality Act 2010 (UK).',
      'Classroom overlays, tinted glasses, and dyslexia-friendly fonts (e.g. Arial, OpenDyslexic) can improve access.',
      'Display a "reading toolkit" card on the student\'s desk with reminders of strategies that work for them.',
      'Build awareness in the class — normalising learning differences reduces stigma and peer pressure.',
    ],
    safetyNotes: [
      'Avoid singling out students with dyslexia in front of peers in ways that may cause embarrassment.',
      'Work with the school\'s SENCO for formal access arrangements (e.g. reader, scribe, extra time) in exams.',
      'This guide is educational. Formal learning support should be coordinated with qualified education professionals.',
    ],
    tryNow: {
      label: 'Explore Dyslexia Support',
      href: '/conditions/dyslexia',
    },
    related: [
      {
        href: '/guides/reading-routine-at-home',
        label: 'Reading routine at home',
        description: 'Build daily reading habits at home.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/dyslexia',
        label: 'Dyslexia Hub',
        description: 'Guides and tools for dyslexia support.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus sprints',
        description: 'Short focus blocks for classroom tasks.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Is it better to have students with dyslexia read silently rather than aloud?',
        answer: 'Silent reading reduces anxiety for many students with dyslexia. If reading aloud is needed, always give advance notice and allow preparation time.',
      },
      {
        question: 'What font is best for students with dyslexia?',
        answer: 'Sans-serif fonts like Arial, Comic Sans, and Verdana, or specialist fonts like OpenDyslexic, are commonly recommended. Larger size (12–14 pt) and increased line spacing also help.',
      },
      {
        question: 'How do I support a student who refuses to read at all?',
        answer: 'Reading refusal often signals high anxiety or prior negative experiences. Start with low-stakes, high-interest reading material and build trust before increasing demands.',
      },
      {
        question: 'What reasonable adjustments are schools required to make?',
        answer: 'Under the Equality Act 2010 (UK), schools must make reasonable adjustments for students with dyslexia. Contact your SENCO or local authority for guidance on specific provisions.',
      },
    ],
    evidenceIds: ['nhs_dyslexia', 'cdc_dyslexia'],
    reviewedAt: '10 Mar 2026',
    nextReviewDue: '10 Sep 2026',
  },
];

export const INTERACTIVE_GUIDES_MAP = new Map(INTERACTIVE_GUIDES.map(guide => [guide.slug, guide]));
