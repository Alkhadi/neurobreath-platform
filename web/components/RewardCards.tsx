import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Star, 
  Sparkles, 
  Trophy,
  Zap,
  Heart,
  Brain,
  Lightbulb,
  Target,
  Rocket,
  Crown,
  Medal,
  Lock,
  Check,
  Copy,
  Printer,
  BookOpen,
  Smile,
  Code,
  Palette,
  Shield,
  Compass,
  Sun,
  Moon,
  Dumbbell,
  MessageCircle,
  Puzzle,
  Layers,
  Cpu,
  FileCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useProgress } from '@/contexts/ProgressContext';
// import { RewardTrading } from '@/components/RewardTrading';
// import { useUserProfile } from '@/contexts/UserProfileContext';

// Icon map for trading component
const ICON_MAP: Record<string, string> = {
  'coupon-break': '❤️',
  'coupon-choice': '✨',
  'coupon-helper': '⭐',
  'coupon-extra': '⚡',
  'reward-focus': '🎯',
  'reward-perseverance': '🏅',
  'reward-explorer': '🚀',
  'reward-dedication': '🏆',
  'learn-thinker': '💡',
  'learn-brain': '🧠',
  'learn-reader': '📖',
  'learn-coach': '💬',
  'learn-flashcard': '📚',
  'learn-roadmap': '🧭',
  'well-calm': '☀️',
  'well-reflect': '🌙',
  'well-balance': '💪',
  'well-smile': '😊',
  'tech-builder': '💻',
  'tech-detective': '🧩',
  'tech-explainer': '📄',
  'tech-architect': '🔧',
  'achieve-master': '👑',
  'achieve-superstar': '⭐',
  'achieve-champion': '🛡️',
  'achieve-creator': '🎨',
};

// Expanded reward cards based on NeuroBreath Prompt Engineering cards
const REWARD_CARDS = [
  // Coupons / Treats
  {
    id: 'coupon-break',
    category: 'coupons',
    title: '5-Minute Break Coupon',
    description: 'Take a well-deserved 5-minute break!',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    requirement: { type: 'games', count: 5 },
    tagline: 'You earned a breather!'
  },
  {
    id: 'coupon-choice',
    category: 'coupons',
    title: 'Activity Choice',
    description: 'Choose your next learning activity!',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500',
    requirement: { type: 'streak', count: 3 },
    tagline: 'Your choice, your pace'
  },
  {
    id: 'coupon-helper',
    category: 'coupons',
    title: 'Helper Badge',
    description: 'Help a classmate with their learning today.',
    icon: Star,
    color: 'from-amber-500 to-orange-500',
    requirement: { type: 'letters', count: 10 },
    tagline: 'Spread the knowledge'
  },
  {
    id: 'coupon-extra',
    category: 'coupons',
    title: 'Extra Game Time',
    description: '10 extra minutes of your favorite game!',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    requirement: { type: 'minutes', count: 30 },
    tagline: 'Game on!'
  },

  // Hard Work Rewards
  {
    id: 'reward-focus',
    category: 'rewards',
    title: 'Focus Champion',
    description: 'You stayed focused and completed challenges!',
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    requirement: { type: 'games', count: 10 },
    tagline: 'Laser focus achieved'
  },
  {
    id: 'reward-perseverance',
    category: 'rewards',
    title: 'Perseverance Star',
    description: 'You never gave up, even when it was hard.',
    icon: Medal,
    color: 'from-violet-500 to-purple-500',
    requirement: { type: 'streak', count: 5 },
    tagline: 'Kept going strong'
  },
  {
    id: 'reward-explorer',
    category: 'rewards',
    title: 'Letter Explorer',
    description: 'You explored and mastered new letters!',
    icon: Rocket,
    color: 'from-blue-500 to-indigo-500',
    requirement: { type: 'letters', count: 15 },
    tagline: 'Alphabet adventurer'
  },
  {
    id: 'reward-dedication',
    category: 'rewards',
    title: 'Dedication Award',
    description: 'Your consistent practice is paying off!',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-500',
    requirement: { type: 'minutes', count: 60 },
    tagline: 'Practice makes progress'
  },

  // Learning Skills
  {
    id: 'learn-thinker',
    category: 'learning',
    title: 'Creative Thinker',
    description: 'You approach problems with creativity!',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-500',
    requirement: { type: 'games', count: 15 },
    tagline: 'Bright ideas flowing'
  },
  {
    id: 'learn-brain',
    category: 'learning',
    title: 'Brain Builder',
    description: 'Your brain is growing stronger every day!',
    icon: Brain,
    color: 'from-pink-500 to-purple-500',
    requirement: { type: 'letters', count: 20 },
    tagline: 'Neural pathways activated'
  },
  {
    id: 'learn-reader',
    category: 'learning',
    title: 'Key Takeaways Expert',
    description: 'You know how to pull insights from what you learn!',
    icon: BookOpen,
    color: 'from-emerald-500 to-green-500',
    requirement: { type: 'games', count: 20 },
    tagline: 'Extract the essentials'
  },
  {
    id: 'learn-coach',
    category: 'learning',
    title: 'Language Practice Coach',
    description: 'Practice speaking with confidence!',
    icon: MessageCircle,
    color: 'from-sky-500 to-blue-500',
    requirement: { type: 'minutes', count: 45 },
    tagline: 'Words flow naturally'
  },
  {
    id: 'learn-flashcard',
    category: 'learning',
    title: 'Flashcard Master',
    description: 'You use spaced repetition to remember better!',
    icon: Layers,
    color: 'from-indigo-500 to-violet-500',
    requirement: { type: 'streak', count: 4 },
    tagline: 'Memory champion'
  },
  {
    id: 'learn-roadmap',
    category: 'learning',
    title: 'Study Roadmap Pro',
    description: 'You follow structured learning paths!',
    icon: Compass,
    color: 'from-teal-500 to-cyan-500',
    requirement: { type: 'games', count: 25 },
    tagline: 'Navigating knowledge'
  },

  // Wellbeing
  {
    id: 'well-calm',
    category: 'wellbeing',
    title: 'Calm Mind',
    description: 'You take time to breathe and find clarity.',
    icon: Sun,
    color: 'from-amber-400 to-orange-400',
    requirement: { type: 'minutes', count: 20 },
    tagline: 'Peace within'
  },
  {
    id: 'well-reflect',
    category: 'wellbeing',
    title: 'Reflection Partner',
    description: 'You organise your thoughts calmly and clearly.',
    icon: Moon,
    color: 'from-slate-500 to-indigo-500',
    requirement: { type: 'streak', count: 6 },
    tagline: 'Clarity achieved'
  },
  {
    id: 'well-balance',
    category: 'wellbeing',
    title: 'Balance Keeper',
    description: 'You maintain a healthy balance in your day!',
    icon: Dumbbell,
    color: 'from-green-500 to-emerald-500',
    requirement: { type: 'games', count: 12 },
    tagline: 'Body and mind aligned'
  },
  {
    id: 'well-smile',
    category: 'wellbeing',
    title: 'Joy Finder',
    description: 'You find moments of happiness in learning.',
    icon: Smile,
    color: 'from-yellow-400 to-amber-400',
    requirement: { type: 'minutes', count: 50 },
    tagline: 'Smile bright'
  },

  // Technical / Coding
  {
    id: 'tech-builder',
    category: 'technical',
    title: 'Function Builder',
    description: 'You create small, testable solutions!',
    icon: Code,
    color: 'from-slate-600 to-gray-700',
    requirement: { type: 'games', count: 18 },
    tagline: 'Code crafted clean'
  },
  {
    id: 'tech-detective',
    category: 'technical',
    title: 'Bug Detective',
    description: 'You find and fix problems like a pro!',
    icon: Puzzle,
    color: 'from-red-500 to-orange-500',
    requirement: { type: 'letters', count: 22 },
    tagline: 'Bugs squashed'
  },
  {
    id: 'tech-explainer',
    category: 'technical',
    title: 'Code Explainer',
    description: 'You understand and explain how things work!',
    icon: FileCode,
    color: 'from-blue-600 to-indigo-600',
    requirement: { type: 'minutes', count: 70 },
    tagline: 'Making sense of code'
  },
  {
    id: 'tech-architect',
    category: 'technical',
    title: 'System Architect',
    description: 'You think about the big picture!',
    icon: Cpu,
    color: 'from-purple-600 to-violet-600',
    requirement: { type: 'games', count: 30 },
    tagline: 'Building with vision'
  },

  // Achievements (kept from original)
  {
    id: 'achieve-master',
    category: 'achievements',
    title: 'Alphabet Master',
    description: 'You have mastered the entire alphabet!',
    icon: Crown,
    color: 'from-amber-400 to-yellow-500',
    requirement: { type: 'letters', count: 26 },
    tagline: 'A to Z conquered'
  },
  {
    id: 'achieve-superstar',
    category: 'achievements',
    title: 'Learning Superstar',
    description: 'You are a true learning superstar!',
    icon: Star,
    color: 'from-rose-500 to-pink-500',
    requirement: { type: 'streak', count: 7 },
    tagline: 'Week of excellence'
  },
  {
    id: 'achieve-champion',
    category: 'achievements',
    title: 'Practice Champion',
    description: 'Over 100 minutes of dedicated practice!',
    icon: Shield,
    color: 'from-indigo-500 to-blue-600',
    requirement: { type: 'minutes', count: 100 },
    tagline: 'True dedication'
  },
  {
    id: 'achieve-creator',
    category: 'achievements',
    title: 'Creative Creator',
    description: 'You bring creativity to everything you do!',
    icon: Palette,
    color: 'from-fuchsia-500 to-pink-500',
    requirement: { type: 'games', count: 35 },
    tagline: 'Art meets learning'
  },
];

interface RewardCardsProps {
  className?: string;
  compact?: boolean;
}

export function RewardCards({ className, compact = false }: RewardCardsProps) {
  const { gamesCompleted, streakDays, hydrated } = useProgress();
  // const { currentProfile } = useUserProfile();
  const currentProfile = null;
  const [selectedCard, setSelectedCard] = useState<typeof REWARD_CARDS[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Calculate progress stats - safe for SSR/hydration
  const stats = useMemo(() => {
    // Always return zeros until hydrated to match SSR
    if (!hydrated) {
      return {
        games: 0,
        streak: 0,
        letters: 0,
        minutes: 0
      };
    }

    // After hydration, load from localStorage
    const storageKey = localStorage.getItem('dlx_current_profile');
    const profileId = storageKey || 'default';
    const progressKey = `dlx_progress_${profileId}`;
    const storedData = localStorage.getItem(progressKey);
    const progressData = storedData ? JSON.parse(storedData) : null;

    const letterProgress = progressData?.letterProgress || {};
    const masteredLetters = Object.values(letterProgress).filter((l): l is { mastered: boolean } =>
      typeof l === 'object' && l !== null && 'mastered' in l && (l as { mastered?: boolean }).mastered === true
    ).length;

    return {
      games: gamesCompleted,
      streak: streakDays,
      letters: masteredLetters,
      minutes: progressData?.totalMinutes || 0
    };
  }, [gamesCompleted, streakDays, hydrated]);

  const isUnlocked = (card: typeof REWARD_CARDS[0]) => {
    const { type, count } = card.requirement;
    return stats[type as keyof typeof stats] >= count;
  };

  const getProgress = (card: typeof REWARD_CARDS[0]) => {
    const { type, count } = card.requirement;
    const current = stats[type as keyof typeof stats];
    return Math.min(100, (current / count) * 100);
  };

  const filteredCards = activeCategory === 'all' 
    ? REWARD_CARDS 
    : REWARD_CARDS.filter(c => c.category === activeCategory);

  const unlockedCount = REWARD_CARDS.filter(isUnlocked).length;

  // Get unlocked cards for trading
  const unlockedCardsForTrading = REWARD_CARDS.filter(isUnlocked).map(card => ({
    id: card.id,
    title: card.title,
    icon: ICON_MAP[card.id] || '🎁',
    color: card.color,
  }));

  const copyCardText = (card: typeof REWARD_CARDS[0]) => {
    const text = `🎉 ${card.title}\n${card.description}\n\n"${card.tagline}"`;
    navigator.clipboard.writeText(text);
    toast.success('Reward card copied!');
  };

  const printCard = (card: typeof REWARD_CARDS[0]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${card.title}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
              background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
            }
            .card {
              width: 400px;
              padding: 40px;
              background: white;
              border-radius: 24px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              text-align: center;
              border: 4px solid #8b5cf6;
            }
            .icon {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              background: linear-gradient(135deg, #8b5cf6, #6366f1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }
            h1 { color: #5b21b6; margin: 0 0 10px; font-size: 1.8rem; }
            p { color: #6b7280; margin: 0 0 20px; font-size: 1.1rem; }
            .tagline {
              font-style: italic;
              color: #8b5cf6;
              font-size: 1rem;
              padding: 15px;
              background: #f5f3ff;
              border-radius: 12px;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.9rem;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">🏆</div>
            <h1>${card.title}</h1>
            <p>${card.description}</p>
            <div class="tagline">"${card.tagline}"</div>
            <div class="footer">NeuroBreath Learning Reward</div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (compact) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="w-5 h-5 text-purple-500" />
            Reward Cards
          </CardTitle>
          <CardDescription>
            {unlockedCount}/{REWARD_CARDS.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {REWARD_CARDS.slice(0, 12).map(card => {
              const Icon = card.icon;
              const unlocked = isUnlocked(card);
              return (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  title={card.title}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center transition-all",
                    unlocked 
                      ? `bg-gradient-to-br ${card.color} text-white shadow-md hover:scale-105` 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {unlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-3 text-sm"
            onClick={() => setSelectedCard(REWARD_CARDS[0])}
          >
            View All Rewards →
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card data-tutorial="rewards" className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            NeuroBreath Reward Cards
          </CardTitle>
          <CardDescription>
            Earn rewards for your hard work! {unlockedCount}/{REWARD_CARDS.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reward Trading Section */}
          {currentProfile && unlockedCardsForTrading.length > 0 && (
            <div>
              {/* <RewardTrading unlockedCards={unlockedCardsForTrading} /> */}
              <p className="text-sm text-muted-foreground text-center py-8">Trading feature coming soon!</p>
            </div>
          )}
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-max gap-1 p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value={activeCategory} className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCards.map(card => {
                  const Icon = card.icon;
                  const unlocked = isUnlocked(card);
                  const progress = getProgress(card);

                  return (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={cn(
                        "relative p-4 rounded-xl text-left transition-all hover:scale-[1.02]",
                        unlocked
                          ? `bg-gradient-to-br ${card.color} text-white shadow-lg`
                          : "bg-muted/50 border-2 border-dashed"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          unlocked ? "bg-white/20" : "bg-muted"
                        )}>
                          {unlocked ? (
                            <Icon className="w-5 h-5" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        {unlocked && (
                          <Badge className="bg-white/20 text-white border-0">
                            <Check className="w-3 h-3 mr-1" /> Earned
                          </Badge>
                        )}
                      </div>
                      <h3 className={cn(
                        "font-semibold text-sm mb-1",
                        !unlocked && "text-muted-foreground"
                      )}>
                        {card.title}
                      </h3>
                      <p className={cn(
                        "text-xs line-clamp-2",
                        unlocked ? "text-white/80" : "text-muted-foreground"
                      )}>
                        {card.description}
                      </p>
                      
                      {!unlocked && (
                        <div className="mt-3">
                          <progress
                            className="h-1.5 w-full overflow-hidden rounded-full"
                            value={Math.round(progress)}
                            max={100}
                            aria-label="Badge progress"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Card Detail Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedCard.icon className="w-6 h-6" />
                  {selectedCard.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className={cn(
                  "p-6 rounded-xl text-center",
                  isUnlocked(selectedCard)
                    ? `bg-gradient-to-br ${selectedCard.color} text-white`
                    : "bg-muted"
                )}>
                  <selectedCard.icon className={cn(
                    "w-16 h-16 mx-auto mb-4",
                    isUnlocked(selectedCard) ? "text-white" : "text-muted-foreground"
                  )} />
                  <p className="text-lg font-medium mb-2">{selectedCard.description}</p>
                  <p className={cn(
                    "italic",
                    isUnlocked(selectedCard) ? "text-white/80" : "text-muted-foreground"
                  )}>
                    "{selectedCard.tagline}"
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-2">Requirement:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCard.requirement.type === 'games' && `Complete ${selectedCard.requirement.count} games`}
                    {selectedCard.requirement.type === 'streak' && `${selectedCard.requirement.count} day streak`}
                    {selectedCard.requirement.type === 'letters' && `Master ${selectedCard.requirement.count} letters`}
                    {selectedCard.requirement.type === 'minutes' && `Practice for ${selectedCard.requirement.count} minutes`}
                  </p>
                  {!isUnlocked(selectedCard) && (
                    <div className="mt-2">
                      <progress
                        className="h-2 w-full overflow-hidden rounded-full"
                        value={Math.round(getProgress(selectedCard))}
                        max={100}
                        aria-label="Badge completion progress"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {Math.round(getProgress(selectedCard))}% complete
                      </p>
                    </div>
                  )}
                </div>

                {isUnlocked(selectedCard) && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => copyCardText(selectedCard)}
                    >
                      <Copy className="w-4 h-4" /> Copy
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => printCard(selectedCard)}
                    >
                      <Printer className="w-4 h-4" /> Print
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
