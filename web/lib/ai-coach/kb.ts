export interface NeuroBreathTool {
  title: string
  url: string
  why: string
}

const INTERNAL_TOOLS: Record<string, NeuroBreathTool[]> = {
  autism: [
    { title: 'Focus Garden', url: '/autism/focus-garden', why: 'Interactive attention training designed for autistic learners' },
    { title: 'Autism Tools', url: '/tools/autism-tools', why: 'Comprehensive toolkit for daily support' }
  ],
  adhd: [
    { title: 'ADHD Focus Lab', url: '/tools/adhd-focus-lab', why: 'Evidence-based games for attention training' },
    { title: 'ADHD Tools', url: '/tools/adhd-tools', why: 'Timer strategies and executive function supports' }
  ],
  breathing: [
    { title: 'Breathing Techniques', url: '/breathing/techniques', why: 'Guided exercises for calm and regulation' },
    { title: 'Breath Tools', url: '/tools/breath-tools', why: 'Interactive breathing practices' }
  ],
  anxiety: [
    { title: 'Anxiety Tools', url: '/tools/anxiety-tools', why: 'Practical grounding and coping strategies' },
    { title: 'Breathing for Anxiety', url: '/breathing/techniques', why: 'Calm your nervous system' }
  ],
  sleep: [
    { title: 'Sleep Tools', url: '/tools/sleep-tools', why: 'Routines and wind-down practices' }
  ],
  stress: [
    { title: 'Stress Tools', url: '/tools/stress-tools', why: 'Quick stress-relief techniques' }
  ],
  mood: [
    { title: 'Mood Tools', url: '/tools/mood-tools', why: 'Mood tracking and behavioral activation' }
  ],
  dyslexia: [
    { title: 'Dyslexia Reading Training', url: '/dyslexia-reading-training', why: 'Structured literacy practice' }
  ]
}

export function getNeuroBreathTools(question: string, topic?: string): NeuroBreathTool[] {
  const questionLower = question.toLowerCase()
  const tools: NeuroBreathTool[] = []
  
  if (topic) {
    const topicKey = topic.toLowerCase()
    if (INTERNAL_TOOLS[topicKey]) {
      tools.push(...INTERNAL_TOOLS[topicKey])
    }
  }
  
  for (const [key, toolList] of Object.entries(INTERNAL_TOOLS)) {
    if (questionLower.includes(key) && !tools.some(t => toolList.some(tl => tl.url === t.url))) {
      tools.push(...toolList.slice(0, 2))
    }
  }
  
  return tools.slice(0, 4) // Max 4 tools
}




