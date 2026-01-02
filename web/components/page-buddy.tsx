'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, X, Send, Mic, Volume2, VolumeX, Sparkles, 
  MessageCircle, Map, ChevronRight, Lightbulb, HelpCircle,
  Brain, Heart, BookOpen, Target, Users, School, Home,
  FileText, Search, Printer
} from 'lucide-react';
import { getPageConfig, platformInfo, type PageBuddyConfig } from '@/lib/page-buddy-configs';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PageBuddyProps {
  defaultOpen?: boolean;
}

export function PageBuddy({ defaultOpen = false }: PageBuddyProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const config = getPageConfig(pathname);
  
  // Initialize on mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Reset messages when page changes
  useEffect(() => {
    if (mounted) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: config.welcomeMessage,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setCurrentTourStep(0);
      setShowTour(false);
    }
  }, [pathname, mounted, config.welcomeMessage]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Text-to-speech - only reads plain text
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Clean text: remove all non-text elements
    let cleanText = text
      // Remove markdown formatting
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/__/g, '')
      .replace(/\x7e\x7e/g, '')
      .replace(/`/g, '')
      // Remove markdown links [text](url) - keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/\/[a-z]+/g, ' ')
      // Remove emojis and symbols
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      // Remove common symbols and bullets
      .replace(/[•◦▪▸►→←↑↓✓✔✗✘★☆⭐🎯🏆📚🔬📈💡🎉👉🛠️📄🏠🌟🧠✨🧘🎓💼🆘📊🤝🚀ℹ️⚠️]/g, '')
      // Remove special characters
      .replace(/[#@&%^$!?;:{}[\]<>|\\]/g, '')
      // Clean up whitespace
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanText) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);
  
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);
  
  // Smart local response generator
  const getLocalResponse = (query: string, cfg: PageBuddyConfig): string => {
    const q = query.toLowerCase().trim();
    
    // === PLATFORM IDENTITY ===
    if (q.includes('what is neurobreath') || q.includes('what\'s neurobreath') || q.includes('about neurobreath')) {
      return `**NeuroBreath** is a neurodiversity support platform designed to empower neurodivergent people, parents, teachers, and carers. 🧠✨\n\n**Our Mission:** ${platformInfo.mission}\n\n**What we offer:**\n• 🎯 **ADHD Hub** – Focus timers, gamified quests, skill strategies\n• 🌟 **Autism Hub** – Calming tools, education pathways, printable resources\n• 📊 Safe progress tracking\n• 🏠 Home-school collaboration tools\n\nAll content is evidence-informed from NICE, CDC, NHS, and peer-reviewed research.`;
    }
    
    // === EVIDENCE-BASED QUESTIONS ===
    if (q.includes('evidence') || q.includes('research') || q.includes('scientific') || q.includes('sources')) {
      return `**NeuroBreath is evidence-informed!** 🔬\n\nWe draw from:\n• **NICE Guidelines** (UK National Institute for Health and Care Excellence)\n• **CDC** (US Centers for Disease Control and Prevention)\n• **AAP** (American Academy of Pediatrics)\n• **NHS** resources\n• **PubMed** peer-reviewed research\n\nEvery strategy, fact, and recommendation includes citations. In the Autism Hub, you can even search 35+ million research articles directly!`;
    }
    
    // === NAVIGATION - ADHD HUB ===
    if ((q.includes('take me to') || q.includes('go to') || q.includes('visit') || q.includes('show me')) && q.includes('adhd')) {
      return `**ADHD Hub** is ready for you! 🎯\n\n**What you'll find:**\n• ⏱️ Focus Pomodoro Timer (5-50 min sessions)\n• 🏆 Daily Quests with XP rewards\n• 📚 Skills Library with practical strategies\n• 🔬 Myths vs Facts section\n• 📈 Progress tracking with streaks\n\n👉 **[Click here to visit /adhd](/adhd)**\n\nPerfect for individuals, parents, teachers, and carers supporting ADHD!`;
    }
    
    // === NAVIGATION - AUTISM HUB ===
    if ((q.includes('take me to') || q.includes('go to') || q.includes('visit') || q.includes('show me')) && q.includes('autism')) {
      return `**Autism Hub** is ready for you! 🌟\n\n**What you'll find:**\n• 🧘 Calm Toolkit with breathing exercises\n• 📚 Skills Library with age adaptations\n• 🎓 Education Pathways (EHCP/IEP/504)\n• 💼 Workplace Adjustments Generator\n• 📄 Printable Templates & Resources\n• 🔬 PubMed Research Search\n\n👉 **[Click here to visit /autism](/autism)**\n\nDesigned for autistic individuals, parents, teachers, carers, and employers!`;
    }
    
    // === TOOLS & FEATURES ===
    if (q.includes('tools') || q.includes('features') || q.includes('what can i do') || q.includes('what\'s available')) {
      if (cfg.pageId === 'home') {
        return `**Available Tools on NeuroBreath:** 🛠️\n\n**ADHD Hub (/adhd):**\n${platformInfo.features.adhd.map((f: string) => `• ${f}`).join('\n')}\n\n**Autism Hub (/autism):**\n${platformInfo.features.autism.map((f: string) => `• ${f}`).join('\n')}\n\n**Shared Features:**\n${platformInfo.features.shared.map((f: string) => `• ${f}`).join('\n')}\n\nWhich hub would you like to explore?`;
      }
      if (cfg.pageId === 'adhd') {
        return `**ADHD Hub Tools:** 🎯\n\n${platformInfo.features.adhd.map((f: string) => `• ${f}`).join('\n')}\n\n**Tip:** Start with a short focus session or check today's quests!`;
      }
      if (cfg.pageId === 'autism') {
        return `**Autism Hub Tools:** 🌟\n\n${platformInfo.features.autism.map((f: string) => `• ${f}`).join('\n')}\n\n**Tip:** Try the Calm Toolkit for regulation or browse printable resources!`;
      }
    }
    
    // === PRINTABLE RESOURCES ===
    if (q.includes('print') || q.includes('download') || q.includes('template') || q.includes('pdf')) {
      return `**Printable Resources** 📄\n\nNeuroBreath offers downloadable templates and resources:\n\n**In the Autism Hub (/autism):**\n• EHCP/IEP request letter templates\n• Evidence gathering checklists\n• Classroom adjustment plans\n• Meeting preparation guides\n• Workplace adjustment requests\n\n**How to use:**\n1. Go to the **Resources Library** section\n2. Filter by audience (Parent/Teacher/Employer)\n3. Fill in the template\n4. Download as PDF or TXT\n\nPerfect for home-school collaboration!`;
    }
    
    // === EDUCATION PATHWAYS ===
    if (q.includes('ehcp') || q.includes('iep') || q.includes('504') || q.includes('education') || q.includes('school support')) {
      return `**Education Pathways Guide** 🎓\n\nNeuroBreath helps navigate education support systems:\n\n**🇬🇧 UK:** EHCP (Education, Health and Care Plan)\n**🇺🇸 US:** IEP (Individualized Education Program) & 504 Plans\n**🇪🇺 EU:** Inclusive Education frameworks\n\n**What we provide:**\n• Step-by-step application guides\n• Legal references and rights\n• Template request letters\n• Progress tracking checklists\n• Appeal process information\n\n👉 Visit **/autism** → **Education Pathways** section`;
    }
    
    // === WORKPLACE ===
    if (q.includes('workplace') || q.includes('work') || q.includes('job') || q.includes('employer') || q.includes('accommodation')) {
      return `**Workplace Adjustments** 💼\n\nNeuroBreath helps with workplace support:\n\n**What we offer:**\n• 15+ adjustment templates\n• UK Equality Act / US ADA guidance\n• Formal request letter generator\n• Evidence-based examples\n• Employer-friendly explanations\n\n**Examples:**\n• Flexible working hours\n• Quiet workspace options\n• Written instructions preference\n• Sensory accommodations\n\n👉 Visit **/autism** → **Workplace Adjustments** section`;
    }
    
    // === FOCUS / POMODORO ===
    if (q.includes('focus') || q.includes('pomodoro') || q.includes('timer') || q.includes('concentrate')) {
      return `**Focus Pomodoro Timer** ⏱️\n\nOur ADHD-friendly focus timer helps manage attention:\n\n**Features:**\n• Flexible durations (5-50 minutes)\n• ADHD-optimized intervals\n• Dopamine tips during breaks\n• Session streak tracking\n• Audio/visual notifications\n\n**Tips for success:**\n• Start with shorter sessions (15-25 min)\n• Take proper breaks\n• Use the dopamine tips!\n\n👉 Visit **/adhd** → **Focus Timer** section`;
    }
    
    // === QUESTS / GAMIFICATION ===
    if (q.includes('quest') || q.includes('xp') || q.includes('level') || q.includes('gamif') || q.includes('reward') || q.includes('streak')) {
      return `**Daily Quests & Gamification** 🏆\n\nNeuroBreath uses gamification to build habits:\n\n**How it works:**\n• Complete daily quests to earn XP\n• Level up as you accumulate XP\n• Build streaks for consistency\n• Earn badges and achievements\n\n**Why gamification?**\nResearch shows dopamine-driven rewards help ADHD brains stay motivated and build lasting habits.\n\n**Tips:**\n• Check quests each morning\n• Start with easier quests\n• Don't break the streak!\n\n👉 Available in both **/adhd** and **/autism** hubs`;
    }
    
    // === CALMING / BREATHING ===
    if (q.includes('calm') || q.includes('breath') || q.includes('relax') || q.includes('anxiety') || q.includes('stress') || q.includes('regulation')) {
      return `**Calm Toolkit** 🧘\n\nEvidence-based calming techniques:\n\n**Breathing Exercises:**\n• Box Breathing (4-4-4-4)\n• Coherent Breathing\n• No-Hold Variants (safer)\n\n**Other Techniques:**\n• 5-4-3-2-1 Grounding\n• Sensory Reset\n• Movement Breaks\n\n**Features:**\n• Guided timers\n• Safety warnings\n• Age adaptations\n• Mood tracking before/after\n\n👉 Visit **/autism** → **Calm Toolkit** section`;
    }
    
    // === CRISIS SUPPORT ===
    if (q.includes('crisis') || q.includes('emergency') || q.includes('help now') || q.includes('urgent')) {
      return `**Crisis Support** 🆘\n\nIf you or someone needs immediate help:\n\n**🇬🇧 UK:**\n• NHS 111 (non-emergency)\n• Samaritans: 116 123\n• Crisis Text: Text SHOUT to 85258\n\n**🇺🇸 US:**\n• 988 Suicide & Crisis Lifeline\n• Crisis Text: Text HOME to 741741\n\n**🇪🇺 EU:**\n• 112 (Emergency)\n\n👉 Full resources at **/autism** → **Crisis Support** section\n\n⚠️ If in immediate danger, call emergency services.`;
    }
    
    // === PROGRESS TRACKING ===
    if (q.includes('progress') || q.includes('track') || q.includes('data') || q.includes('privacy') || q.includes('safe')) {
      return `**Progress Tracking** 📊\n\nNeuroBreath tracks your journey safely:\n\n**What's tracked:**\n• Practice sessions & minutes\n• Quests completed\n• XP & level progression\n• Streaks & personal bests\n• Badges earned\n\n**Privacy:**\n• Data stored locally on your device\n• No account required\n• You control your data\n• Reset anytime\n\n**Why track?**\nSee what strategies work for you and celebrate progress!`;
    }
    
    // === HOME-SCHOOL ===
    if (q.includes('home') && q.includes('school') || q.includes('parent') && q.includes('teacher') || q.includes('collaborat')) {
      return `**Home-School Collaboration** 🏠🏫\n\nNeuroBreath supports consistency between home and school:\n\n**Tools for collaboration:**\n• Printable strategy cards\n• Progress reports to share\n• Meeting preparation templates\n• Consistent skill language\n• Shared daily quests\n\n**For Parents:**\n• Understand what works at school\n• Reinforce strategies at home\n\n**For Teachers:**\n• Evidence-based classroom tools\n• Parent communication templates\n\n👉 Explore the **Resources Library** in the Autism Hub`;
    }
    
    // === GETTING STARTED ===
    if (q.includes('start') || q.includes('begin') || q.includes('first') || q.includes('new here') || q.includes('how do i use')) {
      if (cfg.pageId === 'home') {
        return `**Getting Started with NeuroBreath** 🚀\n\n**Step 1:** Choose your hub:\n• **/adhd** – For ADHD support\n• **/autism** – For autism support\n\n**Step 2:** Explore the tools\n• Try the Focus Timer or Calm Toolkit\n• Check Daily Quests\n• Browse the Skills Library\n\n**Step 3:** Track your progress\n• Complete activities to earn XP\n• Build streaks\n• See what works for you\n\n**Tip:** Click the 🗺️ map icon for a guided tour of any page!`;
      }
      return `**Getting Started on ${cfg.pageName}** 🚀\n\nI'd suggest starting with:\n\n**1. ${cfg.sections[0]?.name}**\n${cfg.sections[0]?.description}\n\n**2. Daily Quests**\nComplete small tasks to build habits and earn XP!\n\n**3. Skills Library**\nExplore evidence-based strategies\n\n💡 **Tip:** Click the 🗺️ map icon above for a guided tour!`;
    }
    
    // === SECTION-SPECIFIC HELP ===
    for (const section of cfg.sections) {
      const sectionWords = section.name.toLowerCase().split(' ');
      if (sectionWords.some((w: string) => w.length > 3 && q.includes(w))) {
        return `**${section.name}** ℹ️\n\n${section.description}\n\n**Tips:**\n${section.tips.map((t: string) => `• ${t}`).join('\n')}\n\n👉 Scroll to find this section on the page!`;
      }
    }
    
    // === DEFAULT HELPFUL RESPONSE ===
    return `I'm here to help you navigate **${cfg.pageName}**! 🤝\n\n**Popular questions:**\n• "What tools are available?"\n• "How do I get started?"\n• "What is NeuroBreath?"\n• "Show me printable resources"\n\n**This page includes:**\n${cfg.sections.slice(0, 3).map((s: any) => `• **${s.name}**: ${s.description}`).join('\n')}\n\n💡 **Tip:** Click the 🗺️ map icon for a guided tour!`;
  };
  
  // Generate AI response
  const generateResponse = async (userMessage: string): Promise<string> => {
    // First try local response for common questions
    const localResponse = getLocalResponse(userMessage, config);
    const isGenericResponse = localResponse.includes('I\'m here to help you navigate');
    
    // If we have a specific local response, use it
    if (!isGenericResponse) {
      return localResponse;
    }
    
    // Otherwise try AI
    const systemPrompt = `You are NeuroBreath Buddy, a friendly and supportive AI assistant for the ${config.pageName} page of the NeuroBreath neurodiversity support platform.

Platform Mission: ${platformInfo.mission}

Current page: ${config.pageName} (${pathname})
Audiences: ${config.audiences.join(', ')}

Your role:
1. Help users understand and navigate this page
2. Explain features and how to use them
3. Provide supportive, evidence-based information about ${config.pageId === 'adhd' ? 'ADHD' : config.pageId === 'autism' ? 'autism' : 'neurodiversity'}
4. Guide users to relevant sections based on their needs
5. Support parents, teachers, carers, and neurodivergent individuals equally
6. Promote home-school collaboration

Guidelines:
- Keep responses concise (3-5 sentences usually)
- Use emoji sparingly for friendliness
- Reference specific page sections when relevant
- Always remind users to consult healthcare providers for medical advice
- Be neurodiversity-affirming (not deficit-focused)
- Mention printable resources when relevant
- Support home-school collaboration

Page sections:
${config.sections.map((s: any) => `- ${s.name}: ${s.description}`).join('\n')}`;

    try {
      const response = await fetch('/api/ai-chat/buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      return data.content || localResponse;
    } catch (error) {
      console.error('AI response error:', error);
      return localResponse;
    }
  };
  
  // Handle sending message
  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await generateResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (autoSpeak) {
        speak(response);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };
  
  // Page tour
  const startTour = () => {
    setShowTour(true);
    setCurrentTourStep(0);
    const tourIntro: Message = {
      id: 'tour-start',
      role: 'assistant',
      content: `🎯 **Page Tour Started!**\n\nLet me walk you through the **${config.pageName}**. There are ${config.sections.length} main sections to explore.\n\n**Step 1/${config.sections.length}: ${config.sections[0]?.name}**\n${config.sections[0]?.description}\n\n💡 **Tips:**\n${config.sections[0]?.tips.map((t: string) => `• ${t}`).join('\n')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tourIntro]);
  };
  
  const nextTourStep = () => {
    const nextStep = currentTourStep + 1;
    if (nextStep >= config.sections.length) {
      setShowTour(false);
      const tourEnd: Message = {
        id: 'tour-end',
        role: 'assistant',
        content: `🎉 **Tour Complete!**\n\nYou've seen all ${config.sections.length} sections of the ${config.pageName}!\n\n**Next steps:**\n• Try out a feature that interests you\n• Complete a Daily Quest\n• Ask me any questions\n\nI'm here whenever you need help! 🤝`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tourEnd]);
      return;
    }
    
    setCurrentTourStep(nextStep);
    const section = config.sections[nextStep];
    const tourStep: Message = {
      id: `tour-${nextStep}`,
      role: 'assistant',
      content: `**Step ${nextStep + 1}/${config.sections.length}: ${section.name}**\n\n${section.description}\n\n💡 **Tips:**\n${section.tips.map((t: string) => `• ${t}`).join('\n')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tourStep]);
  };
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Floating trigger button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
          "transition-all duration-300 hover:scale-110",
          isOpen && "hidden"
        )}
        size="icon"
        aria-label="Open NeuroBreath Buddy assistant"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
      
      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 flex flex-col max-h-[85vh]">
          {/* Header */}
          <DialogHeader className="p-4 pb-2 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">NeuroBreath Buddy</DialogTitle>
                  <p className="text-xs text-muted-foreground">{config.pageName} Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  title={autoSpeak ? 'Auto-speak on' : 'Auto-speak off'}
                  aria-label={autoSpeak ? 'Turn off auto-speak' : 'Turn on auto-speak'}
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={startTour}
                  title="Start page tour"
                  aria-label="Start guided page tour"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs opacity-70 hover:opacity-100"
                        onClick={() => speak(message.content)}
                        aria-label="Listen to this message"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Listen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tour navigation */}
              {showTour && (
                <div className="flex justify-center">
                  <Button
                    onClick={nextTourStep}
                    className="gap-2"
                    size="sm"
                  >
                    {currentTourStep + 1 >= config.sections.length ? 'Finish Tour' : 'Next Section'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Quick questions */}
          <div className="px-4 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {config.quickQuestions.slice(0, 4).map((question: string, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-3"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Input area */}
          <div className="p-4 pt-2 border-t border-border">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about this page..."
                className="flex-1"
                disabled={isLoading}
                aria-label="Type your question"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* Page indicator */}
          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {config.pageId === 'adhd' && <Brain className="h-3 w-3 mr-1" />}
                {config.pageId === 'autism' && <Heart className="h-3 w-3 mr-1" />}
                {config.pageId === 'home' && <Home className="h-3 w-3 mr-1" />}
                {config.pageName}
              </Badge>
              <span>•</span>
              <span>{config.sections.length} sections</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                For all audiences
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
