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
  FileText, Search, Printer, Download, Minimize2, Maximize2,
  RotateCcw, Copy, Check, ExternalLink, History, Settings
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [pageContent, setPageContent] = useState<{
    headings: { text: string; id: string; level: number }[];
    buttons: { text: string; id: string }[];
    sections: { name: string; id: string }[];
    features: string[];
  }>({ headings: [], buttons: [], sections: [], features: [] });
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
      // Scan page content
      scanPageContent();
      
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: generateDynamicWelcome(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setCurrentTourStep(0);
      setShowTour(false);
    }
  }, [pathname, mounted]);
  
  // Scan page content dynamically
  const scanPageContent = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Give the page time to render
    setTimeout(() => {
      const headings: { text: string; id: string; level: number }[] = [];
      const buttons: { text: string; id: string }[] = [];
      const sections: { name: string; id: string }[] = [];
      const features: string[] = [];
      
      // Scan headings
      document.querySelectorAll('h1, h2, h3').forEach((heading) => {
        const text = heading.textContent?.trim();
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        const level = parseInt(heading.tagName.substring(1));
        if (text) headings.push({ text, id, level });
      });
      
      // Scan interactive buttons and links
      document.querySelectorAll('button[aria-label], a[href^="/"]').forEach((el, idx) => {
        const text = el.getAttribute('aria-label') || el.textContent?.trim();
        const id = el.id || `element-${idx}`;
        if (text && text.length < 50) buttons.push({ text, id });
      });
      
      // Scan sections with IDs or data attributes
      document.querySelectorAll('section[id], [data-section], [role="region"]').forEach((section) => {
        const name = section.getAttribute('aria-label') || 
                    section.querySelector('h2, h3')?.textContent?.trim() ||
                    section.id.replace(/-/g, ' ');
        const id = section.id || section.getAttribute('data-section') || '';
        if (name && id) sections.push({ name, id });
      });
      
      // Detect page features
      if (document.querySelector('[data-timer], [class*="timer"]')) features.push('Timer');
      if (document.querySelector('[data-quest], [class*="quest"]')) features.push('Quests');
      if (document.querySelector('form')) features.push('Form');
      if (document.querySelector('[class*="chart"], canvas')) features.push('Chart/Visualization');
      if (document.querySelector('[data-download], [download]')) features.push('Downloads');
      if (document.querySelector('video, audio')) features.push('Media Player');
      
      setPageContent({ headings, buttons, sections, features });
    }, 500);
  }, []);
  
  // Generate dynamic welcome message based on page content
  const generateDynamicWelcome = useCallback(() => {
    const baseWelcome = config.welcomeMessage;
    
    // Add page-specific context if we have detected content
    if (pageContent.sections.length > 0 || pageContent.features.length > 0) {
      let dynamicAddition = '\n\n**I can see on this page:**';
      
      if (pageContent.features.length > 0) {
        dynamicAddition += `\n• ${pageContent.features.join(', ')}`;
      }
      
      if (pageContent.sections.length > 0 && pageContent.sections.length <= 5) {
        dynamicAddition += `\n• ${pageContent.sections.length} main sections: ${pageContent.sections.map(s => s.name).join(', ')}`;
      }
      
      dynamicAddition += '\n\nAsk me about any of these, or I can give you a guided tour!';
      
      return baseWelcome + dynamicAddition;
    }
    
    return baseWelcome;
  }, [config.welcomeMessage, pageContent]);
  
  // Scroll to section helper
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight the section briefly
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 2000);
      return true;
    }
    return false;
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open/close buddy
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Text-to-speech - only reads plain text
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Clean text: remove all non-text elements
    const cleanText = text
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
  
  // Copy message to clipboard
  const copyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  }, []);
  
  // Export chat history
  const exportChat = useCallback(() => {
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'You' : 'NeuroBreath Buddy'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurobreath-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);
  
  // Clear chat history
  const clearChat = useCallback(() => {
    scanPageContent();
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: generateDynamicWelcome(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setShowTour(false);
    setCurrentTourStep(0);
  }, [generateDynamicWelcome, scanPageContent]);
  
  // Render markdown-like formatting
  const renderMessage = (content: string) => {
    // Split by links first to handle them specially
    const parts = content.split(/(\[.*?\]\(.*?\))/);
    
    return parts.map((part, i) => {
      // Handle markdown links
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return (
          <a 
            key={i} 
            href={url} 
            className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1"
            target={url.startsWith('http') ? '_blank' : '_self'}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {text}
            {url.startsWith('http') && <ExternalLink className="h-3 w-3" />}
          </a>
        );
      }
      
      // Handle bold text
      return part.split(/\*\*(.*?)\*\*/).map((segment, j) => 
        j % 2 === 1 ? <strong key={`${i}-${j}`}>{segment}</strong> : segment
      );
    });
  };
  
  // Smart local response generator
  const getLocalResponse = (query: string, cfg: PageBuddyConfig): string => {
    const q = query.toLowerCase().trim();
    
    // === DYNAMIC SECTION NAVIGATION ===
    // Check if user is asking about a specific section on the page
    const mentionedSection = pageContent.sections.find(s => 
      q.includes(s.name.toLowerCase()) || q.includes(s.id.toLowerCase())
    );
    
    if (mentionedSection && (q.includes('show') || q.includes('find') || q.includes('where') || q.includes('take me'))) {
      setTimeout(() => scrollToSection(mentionedSection.id), 500);
      return `**${mentionedSection.name}** section found! 📍\n\nI'm scrolling to it now and highlighting it for you.\n\n**Tip:** You can ask me about any section you see on this page!`;
    }
    
    // === DYNAMIC PAGE CONTENT ===
    if (q.includes('what\'s on this page') || q.includes('what can i see') || q.includes('page content')) {
      let response = `**${cfg.pageName} Content** 📋\n\n`;
      
      if (pageContent.features.length > 0) {
        response += `**Available Features:**\n${pageContent.features.map(f => `• ${f}`).join('\n')}\n\n`;
      }
      
      if (pageContent.sections.length > 0) {
        response += `**Main Sections (${pageContent.sections.length}):**\n${pageContent.sections.map(s => `• ${s.name}`).join('\n')}\n\n`;
      }
      
      if (pageContent.headings.length > 0) {
        const topHeadings = pageContent.headings.filter(h => h.level <= 2).slice(0, 5);
        if (topHeadings.length > 0) {
          response += `**Key Topics:**\n${topHeadings.map(h => `• ${h.text}`).join('\n')}\n\n`;
        }
      }
      
      response += `**Tip:** Ask me to "show me [section name]" to navigate directly!`;
      return response;
    }
    
    // === SECTION LISTING ===
    if ((q.includes('section') || q.includes('part')) && (q.includes('what') || q.includes('list') || q.includes('show'))) {
      if (pageContent.sections.length > 0) {
        return `**Sections on ${cfg.pageName}:** 📑\n\n${pageContent.sections.map((s, i) => `${i + 1}. **${s.name}**`).join('\n')}\n\n**Tip:** Click on any section name or ask me to "take me to [section name]"!`;
      }
    }
    
    // === HELP WITH SPECIFIC FEATURES ===
    if (pageContent.features.length > 0) {
      const mentionedFeature = pageContent.features.find(f => q.includes(f.toLowerCase()));
      if (mentionedFeature) {
        const featureHelp: Record<string, string> = {
          'Timer': '**Timer Feature** ⏱️\n\nI can see there\'s a timer on this page. You can use it to track focus sessions or practice time.\n\n**Tips:**\n• Set a duration that works for you\n• Use it consistently to build habits\n• Track your progress over time',
          'Quests': '**Daily Quests** 🏆\n\nThis page has quests you can complete! Quests help build habits through gamification.\n\n**Tips:**\n• Complete quests daily for streaks\n• Start with easier quests\n• Earn XP to level up',
          'Form': '**Form Detected** 📝\n\nThere\'s a form on this page. Fill it out to customize your experience or request resources.\n\n**Tips:**\n• All fields marked with * are required\n• Your data is stored securely\n• Look for helpful hints near each field',
          'Downloads': '**Download Resources** 📥\n\nThis page offers downloadable content!\n\n**Tips:**\n• Check file formats before downloading\n• Resources are free to use\n• Share with your support network',
          'Chart/Visualization': '**Progress Visualization** 📊\n\nYou can view your progress with charts on this page.\n\n**Tips:**\n• Check regularly to see trends\n• Use data to inform your strategies\n• Celebrate your progress!',
          'Media Player': '**Media Content** 🎥\n\nThis page includes video or audio content.\n\n**Tips:**\n• Adjust volume to your comfort\n• Use captions if available\n• Pause anytime you need'
        };
        
        if (featureHelp[mentionedFeature]) {
          return featureHelp[mentionedFeature];
        }
      }
    }
    
    // === PLATFORM IDENTITY ===
    if (q.includes('what is neurobreath') || q.includes('what\'s neurobreath') || q.includes('about neurobreath')) {
      let response = `**NeuroBreath** is a neurodiversity support platform designed to empower neurodivergent people, parents, teachers, and carers. 🧠✨\n\n**Our Mission:** ${platformInfo.mission}\n\n**What we offer:**\n• 🎯 **ADHD Hub** – Focus timers, gamified quests, skill strategies\n• 🌟 **Autism Hub** – Calming tools, education pathways, printable resources\n• 📊 Safe progress tracking\n• 🏠 Home-school collaboration tools\n\nAll content is evidence-informed from NICE, CDC, NHS, and peer-reviewed research.`;
      
      // If on home page, include breathing techniques first, then all conditions
      if (cfg.pageId === 'home') {
        response += `\n\n**🌬️ Breathing Techniques Available:**\n• **Box Breathing (4-4-4-4)** – Equal count breathing for calm and focus\n• **Coherent Breathing** – Balance your nervous system with 5-5 rhythm\n• **60-Second SOS Reset** – Quick emergency calm technique\n• **Extended Exhale** – Activate relaxation response\n• **No-Hold Variants** – Safer options for those with breathing sensitivities\n\n**🧩 Neurodevelopmental Support:**\n\n**Autism** – Comprehensive support for autistic individuals:\n• Calm Toolkit with sensory-friendly breathing exercises\n• Skills Library with age adaptations (child, teen, adult)\n• Education Pathways (UK EHCP, US IEP/504, EU frameworks)\n• Workplace Adjustments Generator (15+ templates)\n• Crisis Support Resources (UK/US/EU)\n• PubMed Research Search (35M+ articles)\n• Printable templates for home-school collaboration\n\n**Autism Support for Parents** 👨‍👩‍👧:\n• EHCP/IEP request guidance & templates\n• Evidence gathering checklists\n• School meeting preparation guides\n• Understanding sensory needs\n• Communication strategies\n• Daily routine support\n\n**Autism Support for Teachers** 🎓:\n• Classroom adaptations & strategies\n• Visual schedule templates\n• Sensory accommodation plans\n• Behavior support guidance\n• Parent communication templates\n• Legal rights & responsibilities\n\n**Autism Support for Carers** ❤️:\n• Day-to-day support strategies\n• Self-care for carers\n• Managing challenging behaviors\n• Communication techniques\n• Respite resources\n• Support networks\n\n**ADHD** – Evidence-based ADHD management:\n• Focus Pomodoro Timer (5-50 min sessions)\n• Daily Quests with XP & gamification\n• Skills Library (focus, organization, time management)\n• Treatment Decision Tree (NICE/AAP guidelines)\n• Myths vs Facts (research-backed)\n• Progress tracking with streaks\n\n**ADHD Support for Parents** 👨‍👩‍👧:\n• Homework & routine strategies\n• Behavior management techniques\n• School collaboration tools\n• Medication guidance (when appropriate)\n• Understanding executive function\n• Positive reinforcement systems\n\n**ADHD Support for Teachers** 🎓:\n• Classroom management strategies\n• Attention support techniques\n• Movement breaks guidance\n• Differentiation strategies\n• Progress monitoring tools\n• Parent communication templates\n\n**ADHD Support for Carers** ❤️:\n• Daily structure support\n• Attention management tips\n• Self-regulation strategies\n• Carer wellbeing resources\n• Understanding ADHD needs\n• Practical daily strategies\n\n**Dyslexia** – Reading & learning support:\n• Reading Training Program (evidence-based)\n• Phonics & decoding strategies\n• Multi-sensory learning techniques\n• Text-to-speech tools\n• Dyslexia-friendly formatting\n• Progress tracking & celebration\n\n**Dyslexia Support for Parents** 👨‍👩‍👧:\n• At-home reading practice\n• Assessment guidance\n• Rights & accommodations\n• Homework support strategies\n• Building confidence\n• School collaboration\n\n**Dyslexia Support for Teachers** 🎓:\n• Classroom accommodations\n• Multi-sensory teaching methods\n• Assessment modifications\n• Technology tools\n• Reading intervention strategies\n• IEP/504 guidance\n\n**Dyslexia Support for Carers** ❤️:\n• Daily learning support\n• Confidence building\n• Understanding learning differences\n• Assistive technology guidance\n• Carer resources\n• Advocacy support\n\n**😰 Mental Health Support:**\n\n**Anxiety** – Calm & coping strategies:\n• 5-4-3-2-1 Grounding technique\n• Breathing exercises for panic\n• Worry time scheduling\n• Cognitive reframing tools\n• Progressive muscle relaxation\n• Crisis resources (24/7 helplines)\n\n**Depression** 💙 – Daily support tools:\n• Mood tracking & patterns\n• Activity scheduling\n• Behavioral activation strategies\n• Sleep hygiene guidance\n• Professional support pathways\n• Self-compassion exercises\n\n**Bipolar** ⚡ – Mood management:\n• Mood tracking & early warning signs\n• Sleep routine importance\n• Medication adherence support\n• Crisis planning\n• Professional resources\n• Family/carer guidance\n\n**Stress** 😓 – Daily stress management:\n• Quick stress relief techniques\n• Time management strategies\n• Boundary setting guidance\n• Relaxation practices\n• Work-life balance tips\n• Burnout prevention\n\n**Sleep Issues** 💤 – Better sleep tools:\n• Sleep hygiene checklist\n• Bedtime routine builder\n• Relaxation techniques\n• Sleep-onset strategies\n• Morning routine guidance\n• Sleep tracking tools\n\n**Low Mood & Burnout** 🌧️ – Recovery support:\n• Energy management strategies\n• Gentle activity suggestions\n• Self-care planning\n• Setting realistic expectations\n• Recovery timeline guidance\n• Professional support pathways\n\n**🏠 Universal Features:**\n• Home-school collaboration tools\n• Printable resources & templates\n• Progress tracking (all local, private)\n• Evidence-based guidance (NICE, CDC, NHS)\n• Dyslexia-friendly design options\n• Multi-age adaptations (child, teen, adult)\n\n**Where would you like to start? Ask me about any condition or breathing technique!**`;
      } else {
        // For other pages, provide abbreviated version
        response += `\n\n**🧩 All Conditions We Support:**\n\n**Neurodevelopmental:**\n• Autism (+ Parent/Teacher/Carer support)\n• ADHD (+ Parent/Teacher/Carer support)\n• Dyslexia (+ Parent/Teacher/Carer support)\n\n**Mental Health:**\n• Anxiety • Depression • Bipolar\n• Stress • Sleep Issues • Low Mood & Burnout\n\n**🌬️ Breathing Techniques:**\n• Box Breathing • Coherent Breathing\n• 60-Second SOS • Extended Exhale\n\n**Ask me about any condition or technique for detailed information!**`;
      }
      
      return response;
    }
    
    // === EVIDENCE-BASED QUESTIONS ===
    if (q.includes('evidence') || q.includes('research') || q.includes('scientific') || q.includes('sources')) {
      return `**NeuroBreath is evidence-informed!** 🔬\n\nWe draw from:\n• **NICE Guidelines** (UK National Institute for Health and Care Excellence)\n• **CDC** (US Centers for Disease Control and Prevention)\n• **AAP** (American Academy of Pediatrics)\n• **NHS** resources\n• **PubMed** peer-reviewed research\n\nEvery strategy, fact, and recommendation includes citations. In the Autism Hub, you can even search 35+ million research articles directly!`;
    }
    
    // === BREATHING TECHNIQUES ===
    if (q.includes('breathing') || q.includes('breath') && (q.includes('what') || q.includes('technique') || q.includes('available'))) {
      return `**🌬️ Breathing Techniques Available:**\n\n**Box Breathing (4-4-4-4)** – Square breathing pattern:\n• Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4\n• Perfect for focus and anxiety management\n• Used by athletes and military\n\n**Coherent Breathing (5-5)** – Balanced nervous system:\n• Inhale 5 counts → Exhale 5 counts\n• Activates vagal tone (calm response)\n• 5-10 minutes daily recommended\n\n**60-Second SOS Reset** – Emergency calm:\n• Quick technique for acute stress/panic\n• 6 deep breaths in 60 seconds\n• Works in any situation\n\n**Extended Exhale (4-6 or 4-8)** – Deep relaxation:\n• Longer exhale activates parasympathetic\n• Excellent for sleep onset\n• Reduces anxiety quickly\n\n**No-Hold Variants** – Safer options:\n• Continuous breathing without holds\n• Better for those with breathing issues\n• Still highly effective\n\n**🎯 All techniques include:**\n• Guided timers\n• Visual & audio cues\n• Safety warnings\n• Age adaptations\n• Mood tracking\n\n**Visit /breathing to try them!**`;
    }
    
    // === SPECIFIC CONDITIONS ===
    if (q.includes('autism') && !q.includes('adhd')) {
      if (q.includes('parent')) {
        return `**🧩 Autism Parent Support** 👨‍👩‍👧\n\nComprehensive resources for parents of autistic children:\n\n**Education Support:**\n• EHCP (UK) / IEP & 504 (US) request templates\n• Step-by-step application guidance\n• Evidence gathering checklists\n• Meeting preparation guides\n• Appeal process information\n\n**Daily Life:**\n• Understanding sensory needs\n• Communication strategies (verbal & non-verbal)\n• Visual schedule templates\n• Meltdown prevention & support\n• Routine building tools\n\n**Home Strategies:**\n• Sensory-friendly environment setup\n• Social skills support\n• Homework adaptations\n• Self-care planning\n• Sleep support strategies\n\n**Collaboration:**\n• School communication templates\n• Progress sharing tools\n• Professional meeting prep\n• Advocacy resources\n\n**Visit /autism for full parent toolkit!**`;
      } else if (q.includes('teacher')) {
        return `**🧩 Autism Teacher Support** 🎓\n\nEvidence-based classroom strategies:\n\n**Classroom Adaptations:**\n• Sensory accommodation plans\n• Visual schedule templates\n• Quiet space provision\n• Clear routine structures\n• Predictable transitions\n\n**Teaching Strategies:**\n• Visual instruction methods\n• Clear, concrete language\n• Step-by-step task breakdown\n• Processing time allowances\n• Alternative assessment options\n\n**Behavior Support:**\n• Understanding meltdowns vs tantrums\n• De-escalation techniques\n• Sensory break planning\n• Positive reinforcement systems\n• Function-based support\n\n**Legal & Rights:**\n• SEND Code of Practice (UK)\n• IDEA requirements (US)\n• Reasonable adjustments\n• Documentation requirements\n\n**Collaboration:**\n• Parent communication templates\n• Progress reporting tools\n• Multi-agency working guidance\n\n**Visit /conditions/autism-teacher for full resources!**`;
      } else if (q.includes('carer')) {
        return `**🧩 Autism Carer Support** ❤️\n\nPractical guidance for day-to-day care:\n\n**Understanding Autism:**\n• Sensory processing differences\n• Communication variations\n• Social interaction needs\n• Routine importance\n• Special interests value\n\n**Daily Support:**\n• Personal care adaptations\n• Activity planning\n• Managing transitions\n• Sensory regulation strategies\n• Communication tools\n\n**Challenging Times:**\n• Meltdown support\n• Anxiety management\n• Sleep difficulties\n• Eating challenges\n• Medical appointments\n\n**Carer Wellbeing:**\n• Self-care importance\n• Respite resources\n• Support networks\n• Managing stress\n• Celebrating successes\n\n**Crisis Support:**\n• Emergency contacts (UK/US/EU)\n• Crisis planning\n• Professional services\n• 24/7 helplines\n\n**Visit /conditions/autism-carer for comprehensive support!**`;
      } else {
        return `**🧩 Autism Hub** – Comprehensive support\n\n**For Autistic Individuals:**\n• Calm Toolkit (breathing, grounding, sensory)\n• Skills Library (age-adapted strategies)\n• Self-advocacy tools\n• Workplace adjustments generator\n• Crisis support resources\n\n**For Parents:** EHCP/IEP guidance, home strategies\n**For Teachers:** Classroom adaptations, behavior support\n**For Carers:** Daily support, wellbeing resources\n\n**Key Features:**\n• 35M+ research articles searchable\n• Printable templates (50+)\n• Education pathway guides\n• Home-school collaboration tools\n\n**Visit /autism or ask about parent/teacher/carer support!**`;
      }
    }
    
    if (q.includes('adhd') && !q.includes('autism')) {
      if (q.includes('parent')) {
        return `**🎯 ADHD Parent Support** 👨‍👩‍👧\n\nHelping parents support ADHD children:\n\n**Understanding ADHD:**\n• Executive function challenges\n• Attention variations\n• Impulsivity & hyperactivity\n• Emotional regulation\n• Strengths & superpowers\n\n**Daily Strategies:**\n• Homework support systems\n• Routine building tools\n• Behavior management (positive focus)\n• Time management aids\n• Organization strategies\n\n**School Support:**\n• IEP/504 plan guidance (US)\n• UK support plan templates\n• Parent-teacher collaboration\n• Progress monitoring\n• Accommodation requests\n\n**Treatment Information:**\n• Medication guidance (when appropriate)\n• Behavioral interventions\n• Therapy options\n• Combined approaches\n• Decision-making support\n\n**Family Life:**\n• Reducing conflicts\n• Building confidence\n• Celebrating strengths\n• Sibling support\n• Parent self-care\n\n**Visit /conditions/adhd-parent for full toolkit!**`;
      } else if (q.includes('teacher')) {
        return `**🎯 ADHD Teacher Support** 🎓\n\nClassroom strategies that work:\n\n**Classroom Management:**\n• Seating arrangements\n• Movement breaks (essential!)\n• Fidget tool guidance\n• Clear expectations\n• Visual schedules\n\n**Attention Support:**\n• Chunk tasks into smaller steps\n• Use timers & countdowns\n• Minimize distractions\n• Engage multiple senses\n• Frequent check-ins\n\n**Executive Function:**\n• Organization systems\n• Planning supports\n• Memory aids\n• Time awareness tools\n• Prioritization guidance\n\n**Behavior:**\n• Positive reinforcement (key!)\n• Understanding impulsivity\n• Redirect, don't punish\n• Function-based support\n• Consistent consequences\n\n**Assessment:**\n• Extended time options\n• Alternative formats\n• Reduced distractions\n• Oral responses\n• Demonstrate learning differently\n\n**Visit /conditions/adhd-teacher for classroom resources!**`;
      } else if (q.includes('carer')) {
        return `**🎯 ADHD Carer Support** ❤️\n\nDay-to-day ADHD care guidance:\n\n**Understanding ADHD:**\n• It's neurological, not behavioral\n• Executive function impacts\n• Attention regulation differences\n• Impulsivity management\n• Hyperfocus phenomenon\n\n**Daily Structure:**\n• Consistent routines\n• Visual reminders\n• Time management tools\n• Organization systems\n• Transition warnings\n\n**Practical Strategies:**\n• Breaking tasks into steps\n• Using timers effectively\n• Reward systems (immediate)\n• Physical activity importance\n• Reducing overstimulation\n\n**Communication:**\n• Clear, concise instructions\n• Eye contact when speaking\n• Repeat key information\n• Written backup helpful\n• Positive language focus\n\n**Carer Wellbeing:**\n• Self-care necessity\n• Support networks\n• Managing frustration\n• Celebrating small wins\n• Professional support\n\n**Visit /conditions/adhd-carer for complete guidance!**`;
      } else {
        return `**🎯 ADHD Hub** – Evidence-based management\n\n**For Individuals:**\n• Focus Pomodoro Timer (5-50 min)\n• Daily Quests (gamified habits)\n• Skills Library (focus, organization, time)\n• Treatment Decision Tree\n• Progress tracking\n\n**For Parents:** Homework strategies, behavior support\n**For Teachers:** Classroom adaptations, attention tools\n**For Carers:** Daily structure, practical strategies\n\n**Key Features:**\n• NICE & AAP guidelines\n• Myths vs Facts (research-backed)\n• XP & level system\n• Dopamine-friendly design\n\n**Visit /adhd or ask about parent/teacher/carer support!**`;
      }
    }
    
    if (q.includes('dyslexia')) {
      if (q.includes('parent')) {
        return `**📖 Dyslexia Parent Support** 👨‍👩‍👧\n\n**Understanding Dyslexia:**\n• Reading & decoding challenges\n• Phonological processing\n• Working memory impacts\n• Strengths (creativity, problem-solving)\n• Not related to intelligence\n\n**Assessment & Rights:**\n• Screening tools\n• Educational psychologist referral\n• IEP/504 plan guidance\n• Legal rights & protections\n• Accommodation requests\n\n**Home Reading Support:**\n• Multi-sensory learning\n• Paired reading techniques\n• Audiobooks & text-to-speech\n• Building confidence\n• Celebrating progress\n\n**Technology Tools:**\n• Text-to-speech software\n• Dyslexia-friendly fonts\n• Colored overlays\n• Speech-to-text tools\n• Reading apps\n\n**Emotional Support:**\n• Building self-esteem\n• Understanding frustration\n• Highlighting strengths\n• Finding successful dyslexics\n• Advocacy skills\n\n**Visit /conditions/dyslexia-parent for resources!**`;
      } else if (q.includes('teacher')) {
        return `**📖 Dyslexia Teacher Support** 🎓\n\n**Teaching Strategies:**\n• Multi-sensory instruction (see, hear, touch)\n• Phonics-based approach\n• Structured literacy programs\n• Explicit instruction\n• Overlearning & repetition\n\n**Classroom Accommodations:**\n• Extra reading time\n• Audiobooks access\n• Reduced text volume\n• Oral responses option\n• Assistive technology\n\n**Reading Support:**\n• Decodable texts\n• High-interest/low-level books\n• Reading buddies\n• Pre-teaching vocabulary\n• Context clues emphasis\n\n**Assessment Modifications:**\n• Extended time (typically 50%)\n• Read-aloud options\n• Scribe support\n• Alternative formats\n• Focus on content, not spelling\n\n**Building Confidence:**\n• Celebrate effort, not just achievement\n• Private feedback\n• Strength-based approach\n• Success opportunities\n• Peer support\n\n**Visit /conditions/dyslexia-teacher for full toolkit!**`;
      } else if (q.includes('carer')) {
        return `**📖 Dyslexia Carer Support** ❤️\n\n**Daily Learning Support:**\n• Reading practice routines\n• Homework adaptations\n• Memory aids & strategies\n• Organization systems\n• Time management tools\n\n**Technology Support:**\n• Setting up text-to-speech\n• Using dyslexia-friendly fonts\n• Speech-to-text for writing\n• Educational apps\n• Audiobook access\n\n**Building Confidence:**\n• Focus on strengths\n• Celebrate all progress\n• Reduce reading pressure\n• Share famous dyslexics\n• Encourage interests\n\n**Practical Strategies:**\n• Break tasks into steps\n• Use visual aids\n• Multi-sensory learning\n• Consistent practice (little & often)\n• Patience & encouragement\n\n**Carer Wellbeing:**\n• Managing frustration\n• Celebrating small wins\n• Support networks\n• Self-care importance\n• Professional guidance\n\n**Visit /conditions/dyslexia-carer for complete support!**`;
      } else {
        return `**📖 Dyslexia Hub** – Reading & learning support\n\n**Reading Training:**\n• Evidence-based program\n• Phonics & decoding focus\n• Multi-sensory techniques\n• Progress tracking\n• Confidence building\n\n**For Parents:** Home strategies, assessment guidance\n**For Teachers:** Classroom accommodations, instruction methods\n**For Carers:** Daily support, technology tools\n\n**Key Features:**\n• Dyslexia-friendly formatting\n• Text-to-speech integration\n• Interactive exercises\n• Structured literacy approach\n\n**Visit /conditions/dyslexia or /dyslexia-reading-training!**`;
      }
    }
    
    if (q.includes('anxiety')) {
      return `**😰 Anxiety Support** – Calm & coping strategies\n\n**Available Techniques:**\n• **5-4-3-2-1 Grounding** – Use senses to calm\n• **Breathing Exercises** – Box, coherent, extended exhale\n• **Progressive Muscle Relaxation** – Body tension release\n• **Worry Time** – Schedule anxiety (not suppress it)\n• **Cognitive Reframing** – Challenge anxious thoughts\n\n**Quick Calm Tools:**\n• 60-second SOS breathing\n• Cold water technique\n• Movement breaks\n• Distraction activities\n• Safe person contact\n\n**Daily Management:**\n• Regular routine\n• Sleep hygiene\n• Limit caffeine\n• Exercise (proven effective)\n• Mindfulness practice\n\n**When to Get Help:**\n• Panic attacks frequent\n• Avoiding daily activities\n• Physical symptoms persist\n• Impacting relationships\n• Self-harm thoughts\n\n**Crisis Support:**\n• UK: Samaritans 116 123\n• US: 988 Lifeline\n• EU: 112\n\n**Visit /conditions/anxiety for full toolkit!**`;
    }
    
    if (q.includes('depression')) {
      return `**💙 Depression Support** – Daily support tools\n\n**Understanding Depression:**\n• It's a medical condition\n• Not just "feeling sad"\n• Chemical & neurological\n• Treatable & manageable\n• Recovery is possible\n\n**Daily Strategies:**\n• **Behavioral Activation** – Small activities\n• **Mood Tracking** – Identify patterns\n• **Sleep Routine** – Consistent times\n• **Gentle Exercise** – Even 10 min walks\n• **Social Connection** – Even brief contact\n\n**Self-Care:**\n• Basic needs first (eat, sleep, hygiene)\n• Set tiny, achievable goals\n• Celebrate micro-wins\n• Be self-compassionate\n• Accept help offered\n\n**Professional Support:**\n• GP/Doctor consultation\n• Therapy options (CBT, IPT)\n• Medication (if recommended)\n• Support groups\n• Crisis services\n\n**Crisis Support:**\n• UK: Samaritans 116 123, Text SHOUT to 85258\n• US: 988 Suicide & Crisis Lifeline\n• EU: 112\n\n**Visit /conditions/depression for resources!**`;
    }
    
    if (q.includes('stress')) {
      return `**😓 Stress Management** – Daily relief tools\n\n**Quick Stress Relief:**\n• **Breathing** – 60-second reset, box breathing\n• **Movement** – Walk, stretch, shake it out\n• **Cold Water** – Face splash, cold drink\n• **Music** – Calming playlist\n• **Nature** – Even 5 minutes outside\n\n**Daily Prevention:**\n• Time management systems\n• Boundary setting (saying no)\n• Regular breaks (Pomodoro)\n• Physical activity routine\n• Sleep priority\n\n**Work/School Stress:**\n• Task prioritization\n• Break large tasks down\n• Realistic expectations\n• Ask for help early\n• Separate work/home time\n\n**Long-term:**\n• Identify stressors\n• Eliminate/reduce when possible\n• Build stress tolerance gradually\n• Support network\n• Professional help if chronic\n\n**Burnout Warning Signs:**\n• Exhaustion despite rest\n• Cynicism/detachment\n• Reduced performance\n• Physical symptoms\n• Need intervention\n\n**Visit /stress for complete toolkit!**`;
    }
    
    if (q.includes('sleep')) {
      return `**💤 Sleep Support** – Better sleep tools\n\n**Sleep Hygiene Essentials:**\n• **Consistent Times** – Bed & wake (even weekends)\n• **Dark & Cool** – Bedroom environment\n• **No Screens** – 1 hour before bed\n• **Limit Caffeine** – After 2pm\n• **Exercise** – But not near bedtime\n\n**Bedtime Routine:**\n• Wind-down hour\n• Relaxing activity\n• Breathing exercises\n• Progressive muscle relaxation\n• Worry journal (write & close)\n\n**Sleep-Onset Strategies:**\n• 4-7-8 breathing\n• Body scan meditation\n• Visualization\n• Audio stories/meditations\n• Get up if can't sleep (20-min rule)\n\n**Morning Routine:**\n• Natural light exposure\n• Consistent wake time\n• Light exercise/stretch\n• Healthy breakfast\n• Avoid snoozing\n\n**When to Get Help:**\n• Insomnia > 3 weeks\n• Snoring/breathing stops\n• Excessive daytime sleepiness\n• Leg movements/restlessness\n\n**Visit /sleep for full sleep toolkit!**`;
    }
    
    if (q.includes('bipolar')) {
      return `**⚡ Bipolar Support** – Mood management tools\n\n**Understanding Bipolar:**\n• Mood disorder with highs (mania/hypomania) and lows (depression)\n• Medical condition requiring professional care\n• Highly treatable with proper support\n• Affects energy, activity, sleep, behavior\n• Not the same as normal mood swings\n\n**Daily Mood Tracking:**\n• **Monitor Daily** – Track mood, sleep, energy\n• **Identify Patterns** – Spot early warning signs\n• **Share with Doctor** – Help guide treatment\n• **Note Triggers** – Stress, sleep loss, life changes\n• **Medication Tracking** – Record adherence & side effects\n\n**Sleep is Critical:**\n• Consistent sleep/wake times (essential!)\n• Sleep disruption can trigger episodes\n• 7-9 hours nightly recommended\n• Avoid all-nighters\n• Report sleep changes to doctor immediately\n\n**Early Warning Signs:**\n**Mania/Hypomania:**\n• Decreased need for sleep\n• Racing thoughts\n• Increased activity/energy\n• Impulsive decisions\n• Irritability\n\n**Depression:**\n• Excessive sleep or insomnia\n• Loss of interest\n• Low energy\n• Hopelessness\n• Difficulty concentrating\n\n**Crisis Planning:**\n• Emergency contacts list\n• Warning signs documented\n• Preferred hospital/doctor\n• Medication information\n• Support person designated\n\n**Professional Support Essential:**\n• Psychiatrist for medication management\n• Therapist (CBT, DBT, IPSRT)\n• Support groups\n• Family involvement helpful\n\n**Crisis Contacts:**\n• UK: NHS 111, Samaritans 116 123\n• US: 988 Lifeline, Crisis Text 741741\n• EU: 112\n\n**Visit /conditions/bipolar for complete toolkit!**`;
    }
    
    if (q.includes('low mood') || q.includes('burnout')) {
      return `**🌧️ Low Mood & Burnout** – Recovery support\n\n**Understanding Burnout:**\n• Physical, emotional, mental exhaustion\n• Often work/study/care-related\n• Different from regular tiredness\n• Recovery takes time (weeks to months)\n• Not a personal failure\n\n**Three Core Signs:**\n1. **Exhaustion** – Depleted, drained, can't recharge\n2. **Cynicism** – Detachment, negative feelings about work/life\n3. **Inefficacy** – Reduced performance, sense of inadequacy\n\n**Recovery Strategies:**\n\n**Energy Management:**\n• **Pacing** – Break tasks into tiny steps\n• **Rest Actively** – Not just sleep, but restoration\n• **Say No** – Protect your limited energy\n• **Prioritize Ruthlessly** – Only essentials for now\n• **Celebrate Tiny Wins** – Getting up counts!\n\n**Daily Self-Care:**\n• Basic needs first (eat, sleep, hygiene)\n• Micro-activities (5-10 min max)\n• Gentle movement (short walks)\n• Connection (even brief texts)\n• Nature exposure (even windows)\n\n**What NOT to Do:**\n• Don't push through – makes it worse\n• Don't expect quick recovery\n• Don't compare to others\n• Don't take on new commitments\n• Don't ignore warning signs\n\n**Gentle Activities:**\n• Listen to calming music\n• Simple breathing exercises\n• Read light content\n• Sit in nature\n• Pet an animal\n• Watch comfort shows\n• Color or doodle\n• Warm bath/shower\n\n**When to Get Help:**\n• Symptoms persist > 2 weeks\n• Affecting daily functioning\n• Physical symptoms worsen\n• Thoughts of self-harm\n• Unable to work/care for self\n\n**Recovery Timeline:**\n• Weeks 1-2: Rest, basic self-care\n• Weeks 3-6: Gentle activities, boundaries\n• Months 2-3: Gradual return to activities\n• Months 3-6: Sustained recovery, prevention\n\n**Professional Support:**\n• GP/Doctor consultation\n• Therapy (especially CBT)\n• Occupational health (if work-related)\n• Support groups\n• Consider time off work if severe\n\n**Remember:** Recovery is not linear. Bad days don't erase progress.\n\n**Visit /conditions/low-mood-burnout for full support!**`;
    }
    
    if (q.includes('parent') && q.includes('support')) {
      return `**👨‍👩‍👧 Parent Support Available** – Comprehensive resources\n\n**For Parents Supporting:**\n\n**ADHD:**\n• Homework & routine strategies\n• Positive behavior management\n• School collaboration tools\n• IEP/504 plan guidance\n• Medication decision support\n• Understanding executive function\n• Organization systems\n• Parent-child communication\n\n**Autism:**\n• EHCP (UK) / IEP & 504 (US) guides\n• Understanding sensory needs\n• Communication strategies\n• Visual schedule templates\n• Meltdown support & prevention\n• School meeting preparation\n• Evidence gathering checklists\n• Social skills support\n\n**Dyslexia:**\n• Home reading strategies\n• Assessment guidance\n• Rights & accommodations\n• Multi-sensory learning\n• Building confidence\n• Technology tools\n• School advocacy\n\n**Mental Health Conditions:**\n• Age-appropriate explanations\n• When to seek help\n• Supporting anxiety/depression\n• Building resilience\n• Family communication\n• Crisis planning\n\n**Universal Parent Tools:**\n\n**Education Support:**\n• Request letter templates (EHCP/IEP/504)\n• Meeting preparation guides\n• Progress tracking templates\n• Rights & legal information\n• Appeal process guidance\n\n**Home Strategies:**\n• Routine building tools\n• Visual schedules\n• Reward systems\n• Communication techniques\n• Homework support\n• Life skills teaching\n\n**Self-Care for Parents:**\n• Managing stress\n• Setting boundaries\n• Finding support networks\n• Celebrating small wins\n• Respite resources\n• Partner/family support\n\n**School Collaboration:**\n• Parent-teacher communication templates\n• Shared progress tracking\n• Consistent strategies\n• Meeting documentation\n• Advocacy skills\n\n**Evidence-Based Guidance:**\nAll strategies backed by NICE, CDC, NHS, AAP guidelines.\n\n**Where to Find:**\n• **/adhd** – ADHD parent section\n• **/autism** – Autism parent section  \n• **/conditions/dyslexia** – Dyslexia parent resources\n• Each hub has dedicated parent support!\n\n**Ask me:** "Show me ADHD parent support" or "Autism resources for parents"`;
    }
    
    if (q.includes('teacher') && q.includes('resource')) {
      return `**🎓 Teacher Resources Available** – Classroom tools & strategies\n\n**For Teachers Supporting:**\n\n**ADHD:**\n• Classroom management strategies\n• Seating & environment adaptations\n• Movement break guidance (essential!)\n• Attention support techniques\n• Fidget tool guidance\n• Task chunking strategies\n• Time awareness tools\n• Positive reinforcement systems\n• Assessment accommodations\n\n**Autism:**\n• Sensory accommodation plans\n• Visual schedule templates\n• Clear instruction strategies\n• Transition support\n• Quiet space provision\n• Behavior function understanding\n• Social skills support\n• Meltdown prevention & response\n• Communication adaptations\n\n**Dyslexia:**\n• Multi-sensory teaching methods\n• Structured literacy approaches\n• Reading accommodations\n• Assessment modifications\n• Assistive technology\n• Confidence building\n• Phonics-based instruction\n• Text format adaptations\n\n**Universal Teacher Tools:**\n\n**Classroom Adaptations:**\n• Visual supports library\n• Behavior support plans\n• Sensory toolkits\n• Differentiation strategies\n• Flexible seating options\n• Quiet zones\n• Movement breaks\n• Clear routines\n\n**Assessment & Planning:**\n• Accommodation checklists\n• IEP/504 guidance\n• Progress monitoring tools\n• Goal-setting templates\n• Documentation systems\n• Evidence collection\n\n**Communication Tools:**\n• Parent communication templates\n• Meeting preparation guides\n• Progress report formats\n• Positive feedback systems\n• Concern reporting templates\n\n**Professional Development:**\n• Evidence-based strategies (NICE, DfE)\n• Neurodiversity-affirming approaches\n• Legal rights & responsibilities\n• SEND Code of Practice guidance\n• Inclusive teaching methods\n\n**Quick Classroom Strategies:**\n• Clear, concise instructions\n• Visual + verbal information\n• Consistent routines\n• Positive reinforcement (4:1 ratio)\n• Proactive, not reactive\n• Understanding > punishment\n• Strengths-based approach\n\n**Downloadable Resources:**\n• Visual schedules (customizable)\n• Behavior tracking sheets\n• Sensory diet plans\n• Classroom modification guides\n• Parent communication templates\n• IEP/504 templates\n\n**Where to Find:**\n• **/teacher-quick-pack** – Ready-to-use strategies\n• **/schools** – Education sector resources\n• **/adhd** → Teacher section\n• **/autism** → Teacher section\n• **/conditions/dyslexia** → Teacher resources\n\n**Legal Frameworks:**\n• UK: SEND Code of Practice\n• US: IDEA, Section 504\n• EU: Inclusive Education Acts\n\n**Ask me:** "Show me ADHD classroom strategies" or "Autism teacher resources"`;
    }
    
    if (q.includes('carer') && q.includes('support')) {
      return `**❤️ Carer Support Available** – Tools & wellbeing resources\n\n**For Carers Supporting:**\n\n**ADHD:**\n• Daily structure systems\n• Time management tools\n• Organization strategies\n• Clear communication techniques\n• Attention management tips\n• Impulsivity support\n• Positive reinforcement\n• Self-regulation strategies\n• Understanding executive function\n\n**Autism:**\n• Day-to-day support strategies\n• Sensory needs understanding\n• Communication techniques (verbal & non-verbal)\n• Routine building & maintaining\n• Meltdown support & prevention\n• Managing change & transitions\n• Self-care activities support\n• Social situations guidance\n\n**Dyslexia:**\n• Daily learning support\n• Confidence building strategies\n• Homework assistance\n• Technology tools setup\n• Reading practice routines\n• Understanding challenges\n• Celebrating progress\n• Advocacy support\n\n**Mental Health Conditions:**\n• Supporting daily mood\n• Recognizing warning signs\n• When to seek help\n• Crisis management\n• Medication support\n• Building resilience\n• Communication strategies\n\n**Universal Carer Tools:**\n\n**Daily Support:**\n• Routine templates\n• Visual supports\n• Communication boards\n• Activity planning\n• Medication tracking\n• Appointment management\n• Emergency plans\n\n**Understanding Needs:**\n• Condition-specific guides\n• Behavior understanding\n• Sensory processing\n• Executive function\n• Communication differences\n• Learning styles\n\n**Practical Strategies:**\n• Clear instructions (simple language)\n• Visual + verbal information\n• Consistent routines\n• Positive reinforcement\n• Patience & understanding\n• Celebrating small wins\n• Breaking tasks down\n\n**Carer Wellbeing (Essential!):**\n\n**Self-Care:**\n• Regular breaks (non-negotiable)\n• Personal hobbies/interests\n• Physical health priority\n• Mental health support\n• Social connections\n• Setting boundaries\n• Asking for help\n\n**Respite & Support:**\n• Respite care options\n• Support groups (local & online)\n• Professional support access\n• Family/friend networks\n• Emergency backup plans\n• Shared care arrangements\n\n**Managing Stress:**\n• Breathing exercises\n• Quick relaxation techniques\n• Stress triggers identification\n• Coping strategies\n• Professional therapy access\n• Burnout prevention\n\n**Resources for Carers:**\n• Condition-specific guides\n• Emergency contact lists\n• Medication information sheets\n• Crisis support numbers\n• Professional services directory\n• Legal rights information\n\n**Communication Tools:**\n• Healthcare professional templates\n• School communication guides\n• Family support discussions\n• Progress sharing tools\n\n**Remember:**\n• You can't pour from an empty cup\n• Asking for help is strength, not weakness\n• Your wellbeing matters too\n• Celebrate your care & dedication\n• Small steps are still progress\n\n**Where to Find:**\n• **/adhd** → Carer section\n• **/autism** → Carer section\n• **/conditions/dyslexia** → Carer resources\n• Each hub has dedicated carer support!\n\n**Crisis Support Available 24/7:**\n• UK: Samaritans 116 123, Carers UK 0808 808 7777\n• US: 988 Lifeline, Caregiver Action Network\n• EU: 112 Emergency, local carer organizations\n\n**Ask me:** "Show me ADHD carer strategies" or "Support for autism carers"`;
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
      let response = `**Available Tools on NeuroBreath:** 🛠️\n\n`;
      
      // If on home page, provide comprehensive overview
      if (cfg.pageId === 'home') {
        response += `**🌬️ Breathing Techniques & Tools:**\n• **Box Breathing (4-4-4-4)** – Equal count breathing for calm and focus\n• **Coherent Breathing (5-5)** – Balance your nervous system with guided timers\n• **60-Second SOS Reset** – Quick emergency calm technique with visual cues\n• **Extended Exhale (4-6/4-8)** – Activate relaxation response for sleep & anxiety\n• **No-Hold Variants** – Safer options for those with breathing sensitivities\n• Guided timers with visual & audio cues\n• Mood tracking before/after exercises\n• Age adaptations (child, teen, adult)\n\n**🧩 Neurodevelopmental Tools:**\n\n**Autism Hub (/autism):**\n• **Calm Toolkit** – Breathing, grounding, sensory regulation\n• **Skills Library** – 50+ strategies with age adaptations\n• **Education Pathways** – EHCP (UK), IEP/504 (US), EU frameworks\n• **Workplace Adjustments Generator** – 15+ professional templates\n• **PubMed Research Search** – Access 35M+ peer-reviewed articles\n• **Printable Resources** – 50+ templates for home-school collaboration\n• **Crisis Support** – UK/US/EU emergency contacts & resources\n• **Progress Tracker** – XP, levels, streaks (all local & private)\n\n**ADHD Hub (/adhd):**\n• **Focus Pomodoro Timer** – 5-50 min sessions with ADHD-friendly intervals\n• **Daily Quests System** – Gamified habit building with XP rewards\n• **Skills Library** – Focus, organization, time management strategies\n• **Treatment Decision Tree** – NICE/AAP evidence-based guidance\n• **Myths vs Facts** – Research-backed myth-busting with citations\n• **Progress Tracking** – Streaks, levels, achievements\n• **Dopamine Tips** – Break activity suggestions\n\n**Dyslexia Hub (/conditions/dyslexia):**\n• **Reading Training Program** – Evidence-based phonics & decoding\n• **Multi-sensory Learning Tools** – Visual, auditory, kinesthetic\n• **Text-to-Speech Integration** – Read-aloud support\n• **Dyslexia-friendly Formatting** – Font, spacing, color options\n• **Progress Tracking** – Celebrate reading improvements\n• **Interactive Exercises** – Engaging practice activities\n\n**😰 Mental Health Tools:**\n\n**Anxiety Support (/conditions/anxiety):**\n• **5-4-3-2-1 Grounding** – Sensory awareness technique\n• **Breathing Exercises** – Guided panic relief techniques\n• **Worry Time Scheduler** – Contain anxiety to specific times\n• **Cognitive Reframing Tools** – Challenge anxious thoughts\n• **Progressive Muscle Relaxation** – Body-based calm technique\n• **Crisis Support Access** – 24/7 helplines (UK/US/EU)\n\n**Depression Support (/conditions/depression):**\n• **Mood Tracker** – Identify patterns & triggers\n• **Activity Scheduler** – Behavioral activation planning\n• **Sleep Hygiene Tools** – Improve sleep quality\n• **Self-compassion Exercises** – Reduce self-criticism\n• **Professional Support Pathways** – Find help resources\n\n**Stress Management (/stress):**\n• **Quick Stress Relief** – 60-second reset techniques\n• **Time Management Tools** – Prioritization & planning\n• **Boundary Setting Guidance** – Learn to say no\n• **Relaxation Library** – Multiple techniques available\n• **Burnout Prevention** – Warning signs & recovery\n\n**Sleep Support (/sleep):**\n• **Sleep Hygiene Checklist** – Evidence-based sleep practices\n• **Bedtime Routine Builder** – Create consistent wind-down\n• **Sleep-onset Techniques** – 4-7-8 breathing, body scan\n• **Morning Routine Tools** – Wake-up support\n• **Sleep Tracker** – Monitor patterns\n\n**Bipolar Support (/conditions/bipolar):**\n• **Mood Tracker** – Daily monitoring with trend analysis\n• **Early Warning Signs** – Recognize episode triggers\n• **Sleep Routine Tools** – Critical for mood stability\n• **Crisis Planning** – Prepare for emergencies\n• **Medication Adherence Support** – Reminder systems\n\n**Low Mood & Burnout (/conditions/low-mood-burnout):**\n• **Energy Management** – Pacing & conservation strategies\n• **Gentle Activity Suggestions** – Achievable micro-goals\n• **Self-care Planning** – Realistic daily care\n• **Recovery Timeline** – Understanding healing process\n\n**👥 Role-Specific Support Tools:**\n\n**For Parents (all conditions):**\n• EHCP/IEP/504 request templates & step-by-step guidance\n• Evidence gathering checklists\n• School meeting preparation guides\n• Home strategy libraries\n• Progress sharing tools\n• Advocacy resource libraries\n\n**For Teachers (all conditions):**\n• Classroom adaptation templates\n• Visual schedule builders\n• Behavior support plans\n• Assessment modification guides\n• Parent communication templates\n• Legal rights & responsibilities guides\n\n**For Carers (all conditions):**\n• Daily support strategy guides\n• Communication technique libraries\n• Self-care planning tools\n• Respite resource directories\n• Professional support pathways\n• Support network connections\n\n**🏠 Universal Features:**\n• **Home-School Collaboration** – Shared templates & progress reports\n• **Printable Resources** – 100+ downloadable templates\n• **Progress Tracking** – All data stored locally & privately\n• **Evidence-Based Guidance** – NICE, CDC, NHS, AAP, peer-reviewed research\n• **Dyslexia-Friendly Design** – Font, spacing, color customization\n• **Multi-Age Adaptations** – Child (5-11), Teen (12-17), Adult (18+)\n• **Accessibility Features** – Screen reader support, keyboard navigation\n• **Multi-Language Support** – Content available in multiple languages\n\n**🎯 Interactive Features:**\n• XP & Leveling System – Gamified progress across all hubs\n• Streak Tracking – Build consistency habits\n• Achievement Badges – Celebrate milestones\n• Visual Progress Charts – See your journey\n• Custom Goal Setting – Personalized targets\n• Reminder Systems – Stay on track\n\n**📱 Platform Features:**\n• Mobile-responsive design\n• Offline capability (PWA)\n• Print-friendly formats\n• Export data options\n• Share resources easily\n• Bookmark favorites\n\n**Where would you like to start? Ask me about any specific tool, condition, or support type!**`;
      } else if (cfg.pageId === 'adhd') {
        response += `**ADHD Hub Tools:** 🎯\n\n${platformInfo.features.adhd.map((f: string) => `• ${f}`).join('\n')}\n\n**Available Now:**\n• Focus Pomodoro Timer (5-50 min customizable sessions)\n• Daily Quests (XP rewards, streak tracking)\n• Skills Library (50+ ADHD strategies)\n• Treatment Decision Tree (NICE/AAP guidelines)\n• Myths vs Facts (research citations)\n• Progress Dashboard (levels, achievements)\n\n**For Parents:** Homework support, behavior strategies, school tools\n**For Teachers:** Classroom management, attention techniques, assessments\n**For Carers:** Daily structure, practical strategies, wellbeing support\n\n**Tip:** Start with a short focus session or check today's quests!`;
      } else if (cfg.pageId === 'autism') {
        response += `**Autism Hub Tools:** 🌟\n\n${platformInfo.features.autism.map((f: string) => `• ${f}`).join('\n')}\n\n**Available Now:**\n• Calm Toolkit (breathing, grounding, sensory)\n• Skills Library (50+ strategies, age-adapted)\n• Education Pathways (EHCP/IEP/504 complete guides)\n• Workplace Adjustments (15+ professional templates)\n• PubMed Search (35M+ research articles)\n• Printable Resources (50+ templates)\n• Crisis Support (UK/US/EU contacts)\n\n**For Parents:** EHCP/IEP guidance, home strategies, school collaboration\n**For Teachers:** Classroom adaptations, visual schedules, behavior support\n**For Carers:** Daily support, communication techniques, self-care\n\n**Tip:** Try the Calm Toolkit for regulation or browse printable resources!`;
      } else {
        response += `**Page-Specific Tools:**\n${cfg.sections.map((s: any) => `• **${s.name}** – ${s.description}`).join('\n')}\n\n**Platform-Wide Features:**\n• Breathing exercises (5 techniques)\n• Progress tracking (XP, levels, streaks)\n• Printable resources (100+ templates)\n• Evidence-based guidance (NICE, CDC, NHS)\n\n**Main Hubs:**\n• **ADHD Hub (/adhd)** – Focus tools, quests, strategies\n• **Autism Hub (/autism)** – Calm toolkit, education pathways\n• **Breathing (/breathing)** – Guided breathing exercises\n\n**Ask me about:**\n• Specific tools on this page\n• Navigation to other hubs\n• How to use any feature`;
      }
      
      return response;
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
    const q = question.toLowerCase();
    
    // Handle navigation questions
    if (q.includes('take me to') || q.includes('go to')) {
      if (q.includes('adhd')) {
        // Add confirmation message before navigating
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🎯 Taking you to the **ADHD Hub** now!\n\nYou\'ll find Focus Timer, Daily Quests, Skills Library, and more...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/adhd'), 800);
        return;
      }
      if (q.includes('autism')) {
        // Add confirmation message before navigating
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🌟 Taking you to the **Autism Hub** now!\n\nYou\'ll find Calm Toolkit, Education Pathways, Printable Resources, and more...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/autism'), 800);
        return;
      }
      if (q.includes('dyslexia')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '📖 Taking you to the **Dyslexia Hub** now!\n\nYou\'ll find Reading Training, Multi-sensory Tools, and support resources...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/conditions/dyslexia'), 800);
        return;
      }
      if (q.includes('breathing')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '🌬️ Taking you to **Breathing Exercises** now!\n\nTry Box Breathing, Coherent Breathing, and more guided techniques...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/breathing'), 800);
        return;
      }
      if (q.includes('sleep')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '💤 Taking you to **Sleep Support** now!\n\nTrack your sleep, check hygiene tips, and earn achievements...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/sleep'), 800);
        return;
      }
      if (q.includes('anxiety')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '😰 Taking you to **Anxiety Support** now!\n\nGrounding techniques, breathing exercises, and coping strategies await...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/conditions/anxiety'), 800);
        return;
      }
      if (q.includes('depression')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '💙 Taking you to **Depression Support** now!\n\nMood tracking, behavioral activation, and professional support resources...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/conditions/depression'), 800);
        return;
      }
      if (q.includes('stress')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '😓 Taking you to **Stress Management** now!\n\nQuick relief techniques, daily prevention, and burnout guidance...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/stress'), 800);
        return;
      }
      if (q.includes('bipolar')) {
        const confirmMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚡ Taking you to **Bipolar Support** now!\n\nMood tracking, sleep routines, and crisis planning tools...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, { id: (Date.now() - 1).toString(), role: 'user', content: question, timestamp: new Date() }, confirmMessage]);
        setTimeout(() => router.push('/conditions/bipolar'), 800);
        return;
      }
    }
    
    handleSend(question);
  };
  
  // Page tour - now using actual page content
  const startTour = () => {
    // Don't start a new tour if one is already in progress
    if (showTour) {
      const alreadyActiveMessage: Message = {
        id: `tour-already-active-${Date.now()}`,
        role: 'assistant',
        content: `📍 **Tour In Progress**\n\nA page tour is already running! Click "Next Section" below to continue, or ask me to restart the tour if you'd like to start over.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, alreadyActiveMessage]);
      return;
    }
    
    // Use detected sections if available, otherwise fall back to config
    const sectionsToTour = pageContent.sections.length > 0 
      ? pageContent.sections.map(s => ({
          id: s.id,
          name: s.name,
          description: `Navigate and explore the ${s.name} section`,
          tips: [`Look for interactive elements in this section`, `This content is tailored to ${config.audiences.join(', ')}`]
        }))
      : config.sections;
    
    setShowTour(true);
    setCurrentTourStep(0);
    
    const firstSection = sectionsToTour[0];
    if (firstSection && pageContent.sections.length > 0) {
      setTimeout(() => scrollToSection(firstSection.id), 500);
    }
    
    const tourIntro: Message = {
      id: `tour-start-${Date.now()}`,
      role: 'assistant',
      content: `🎯 **Live Page Tour Started!**\n\nI've scanned this page and found ${sectionsToTour.length} sections to explore.\n\n**Step 1/${sectionsToTour.length}: ${firstSection?.name}**\n${firstSection?.description}\n\n💡 **Tips:**\n${firstSection?.tips.map((t: string) => `• ${t}`).join('\n')}\n\n**Note:** I'm scrolling to each section as we go!`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tourIntro]);
  };
  
  const nextTourStep = () => {
    const sectionsToTour = pageContent.sections.length > 0 
      ? pageContent.sections.map(s => ({
          id: s.id,
          name: s.name,
          description: `Explore the ${s.name} section and its features`,
          tips: [`This section is specifically designed for ${config.pageName}`, `Interact with the elements you find here`]
        }))
      : config.sections;
      
    const nextStep = currentTourStep + 1;
    if (nextStep >= sectionsToTour.length) {
      setShowTour(false);
      const tourEnd: Message = {
        id: `tour-end-${Date.now()}`,
        role: 'assistant',
        content: `🎉 **Live Tour Complete!**\n\nYou've explored all ${sectionsToTour.length} sections of ${config.pageName}!\n\n**What I detected on this page:**\n${pageContent.features.length > 0 ? `• Features: ${pageContent.features.join(', ')}\n` : ''}• Sections: ${sectionsToTour.length}\n• Interactive elements: ${pageContent.buttons.length}\n\n**Next steps:**\n• Try out a feature that interests you\n• Ask me about specific sections\n• I'm here whenever you need help! 🤝`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tourEnd]);
      return;
    }
    
    setCurrentTourStep(nextStep);
    const section = sectionsToTour[nextStep];
    
    // Scroll to the actual section if it exists
    if (pageContent.sections.length > 0 && section.id) {
      setTimeout(() => scrollToSection(section.id), 500);
    }
    
    const tourStep: Message = {
      id: `tour-step-${nextStep}-${Date.now()}`,
      role: 'assistant',
      content: `**Step ${nextStep + 1}/${sectionsToTour.length}: ${section.name}**\n\n${section.description}\n\n💡 **Tips:**\n${section.tips.map((t: string) => `• ${t}`).join('\n')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tourStep]);
  };
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Floating trigger button */}
      <div className={cn("fixed bottom-6 right-6 z-50", isOpen && "hidden")}>
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90",
            "transition-all duration-300 hover:scale-110",
            "relative group"
          )}
          size="icon"
          aria-label="Open NeuroBreath Buddy assistant (Cmd+K)"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute -top-8 right-0 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            Press ⌘K
          </span>
        </Button>
      </div>
      
      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(
          "sm:max-w-[500px] p-0 flex flex-col transition-all",
          isMinimized ? "h-[120px]" : "max-h-[85vh]"
        )}>
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
              <div className="flex items-center gap-1">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={exportChat}
                  title="Export chat history"
                  aria-label="Export chat history"
                  disabled={messages.length <= 1}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={clearChat}
                  title="Clear chat history"
                  aria-label="Clear chat history"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {/* Messages */}
          {!isMinimized && (
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
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm group relative flex flex-col",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2 flex-shrink min-h-0">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content.split('\n').map((line, i) => (
                          <span key={i}>
                            {renderMessage(line)}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 pt-1 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {message.role === 'assistant' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => speak(message.content)}
                          aria-label="Listen to this message"
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          Listen
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => copyMessage(message.id, message.content)}
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <><Check className="h-3 w-3 mr-1" /> Copied</>
                        ) : (
                          <><Copy className="h-3 w-3 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
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
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:300ms]" />
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
          )}
          
          {/* Quick questions */}
          {!isMinimized && (
          <div className="px-4 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {config.quickQuestions.map((question: string, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-3 flex-shrink-0"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
          )}
          
          {/* Input area */}
          {!isMinimized && (
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
          )}
          
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
              <span>{pageContent.sections.length > 0 ? `${pageContent.sections.length} detected sections` : `${config.sections.length} sections`}</span>
              {pageContent.features.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {pageContent.features.length} features
                  </span>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
