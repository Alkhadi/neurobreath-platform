import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useProgress } from '@/contexts/ProgressContext';
import { Volume2, Star, ChevronRight, MapPin, Building2, GitBranch, Waves, SlidersHorizontal, CheckCircle2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface VowelPattern {
  id: string;
  pattern: string;
  sound: string;
  examples: string[];
  tip: string;
}

interface VowelZone {
  id: string;
  name: string;
  levels: string;
  description: string;
  tip: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  patterns: VowelPattern[];
}

const VOWEL_ZONES: VowelZone[] = [
  {
    id: 'short-street',
    name: 'Short Street',
    levels: 'Levels 1–3',
    description: 'Short vowels (a, e, i, o, u). Keep sounds clipped and calm.',
    tip: 'Build CVC + VC words with lots of repetition.',
    icon: MapPin,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    patterns: [
      { id: 'short-a', pattern: 'a', sound: 'short a', examples: ['cat', 'hat', 'bat', 'man'], tip: 'Say "ah" like when the doctor checks your throat!' },
      { id: 'short-e', pattern: 'e', sound: 'short e', examples: ['bed', 'pen', 'red', 'wet'], tip: 'Say "eh" like in "egg"!' },
      { id: 'short-i', pattern: 'i', sound: 'short i', examples: ['sit', 'pin', 'big', 'fix'], tip: 'Say "ih" like in "itch"!' },
      { id: 'short-o', pattern: 'o', sound: 'short o', examples: ['hot', 'dog', 'pot', 'fox'], tip: 'Say "ah" with rounded lips like in "octopus"!' },
      { id: 'short-u', pattern: 'u', sound: 'short u', examples: ['cup', 'run', 'bus', 'hug'], tip: 'Say "uh" like in "up"!' },
    ]
  },
  {
    id: 'skyline-towers',
    name: 'Skyline Towers',
    levels: 'Levels 4–6',
    description: 'Long vowels + common digraphs. Use tower visuals and tracing.',
    tip: 'Long vowels say their name! A says "ay", E says "ee", etc.',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    patterns: [
      { id: 'long-a-silent-e', pattern: 'a_e', sound: 'long a', examples: ['make', 'cake', 'lake', 'name'], tip: 'Silent E makes the A say its name!' },
      { id: 'long-e-silent-e', pattern: 'e_e', sound: 'long e', examples: ['eve', 'these', 'Pete'], tip: 'Silent E makes the first E say its name!' },
      { id: 'long-i-silent-e', pattern: 'i_e', sound: 'long i', examples: ['bike', 'kite', 'five', 'time'], tip: 'Silent E makes the I say its name!' },
      { id: 'long-o-silent-e', pattern: 'o_e', sound: 'long o', examples: ['home', 'rope', 'nose', 'bone'], tip: 'Silent E makes the O say its name!' },
      { id: 'long-u-silent-e', pattern: 'u_e', sound: 'long u', examples: ['cute', 'mule', 'tube', 'huge'], tip: 'Silent E makes the U say its name!' },
      { id: 'y-long-e', pattern: 'y', sound: 'long e', examples: ['happy', 'sunny', 'baby', 'funny'], tip: 'Y at the end of words often says "ee"!' },
      { id: 'y-long-i', pattern: 'y', sound: 'long i', examples: ['my', 'fly', 'sky', 'try'], tip: 'Y at the end of short words says "eye"!' },
    ]
  },
  {
    id: 'team-bridge',
    name: 'Team Bridge',
    levels: 'Levels 5–7',
    description: 'Vowel teams + diphthongs. Learn who "talks" and who "walks".',
    tip: 'When two vowels go walking, the first one does the talking!',
    icon: GitBranch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    patterns: [
      { id: 'ai', pattern: 'ai', sound: 'long a', examples: ['rain', 'train', 'wait', 'mail'], tip: 'AI says "ay" - the A talks, the I walks!' },
      { id: 'ay', pattern: 'ay', sound: 'long a', examples: ['day', 'play', 'say', 'stay'], tip: 'AY usually comes at the end of words!' },
      { id: 'ea-long', pattern: 'ea', sound: 'long e', examples: ['read', 'beach', 'team', 'eat'], tip: 'EA makes the "ee" sound like in "eat"!' },
      { id: 'ee', pattern: 'ee', sound: 'long e', examples: ['tree', 'see', 'feet', 'green'], tip: 'Two E\'s always say their name!' },
      { id: 'ey', pattern: 'ey', sound: 'long e', examples: ['key', 'monkey', 'honey', 'turkey'], tip: 'EY at the end says "ee"!' },
      { id: 'ie-long-e', pattern: 'ie', sound: 'long e', examples: ['field', 'chief', 'thief', 'piece'], tip: 'IE can say "ee" in the middle of words!' },
      { id: 'ie-long-i', pattern: 'ie', sound: 'long i', examples: ['pie', 'tie', 'lie', 'die'], tip: 'IE at the end says "eye"!' },
      { id: 'oa', pattern: 'oa', sound: 'long o', examples: ['boat', 'coat', 'road', 'soap'], tip: 'OA says "oh" - O talks, A walks!' },
      { id: 'oe', pattern: 'oe', sound: 'long o', examples: ['toe', 'hoe', 'Joe', 'doe'], tip: 'OE at the end says "oh"!' },
      { id: 'ow-long', pattern: 'ow', sound: 'long o', examples: ['snow', 'grow', 'show', 'bow'], tip: 'OW can say "oh" like in "snow"!' },
      { id: 'ue', pattern: 'ue', sound: 'long u', examples: ['blue', 'true', 'glue', 'clue'], tip: 'UE says "oo" or "yoo"!' },
      { id: 'ui', pattern: 'ui', sound: 'long u', examples: ['fruit', 'suit', 'juice', 'cruise'], tip: 'UI says "oo" like in "fruit"!' },
      // Diphthongs
      { id: 'oi', pattern: 'oi', sound: 'oy', examples: ['oil', 'coin', 'join', 'boil'], tip: 'OI makes the "oy" sound!' },
      { id: 'oy', pattern: 'oy', sound: 'oy', examples: ['boy', 'toy', 'joy', 'enjoy'], tip: 'OY at the end says "oy"!' },
      { id: 'ou-ow', pattern: 'ou', sound: 'ow', examples: ['house', 'cloud', 'out', 'loud'], tip: 'OU says "ow" like when you hurt yourself!' },
      { id: 'ow-ow', pattern: 'ow', sound: 'ow', examples: ['cow', 'how', 'now', 'brown'], tip: 'OW can say "ow" like a hurt sound!' },
      { id: 'oo-long', pattern: 'oo', sound: 'oo', examples: ['moon', 'food', 'cool', 'pool'], tip: 'Long OO says "oo" like in "moon"!' },
      { id: 'oo-short', pattern: 'oo', sound: 'ʊ', examples: ['book', 'look', 'good', 'wood'], tip: 'Short OO says "uh" like in "book"!' },
      { id: 'ew', pattern: 'ew', sound: 'oo/yoo', examples: ['new', 'flew', 'chew', 'grew'], tip: 'EW says "oo" or "yoo"!' },
      { id: 'au', pattern: 'au', sound: 'aw', examples: ['sauce', 'cause', 'fault', 'haunt'], tip: 'AU makes the "aw" sound!' },
      { id: 'aw', pattern: 'aw', sound: 'aw', examples: ['saw', 'paw', 'draw', 'straw'], tip: 'AW says "aw" like in "saw"!' },
    ]
  },
  {
    id: 'r-river',
    name: 'R-River',
    levels: 'Levels 7–8',
    description: 'R-controlled patterns. Keep the tongue relaxed.',
    tip: 'R is bossy! When R follows a vowel, it changes the sound.',
    icon: Waves,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 border-cyan-200',
    patterns: [
      { id: 'ar', pattern: 'ar', sound: 'ar', examples: ['car', 'star', 'farm', 'park'], tip: 'AR says "ar" like a pirate!' },
      { id: 'er', pattern: 'er', sound: 'er', examples: ['her', 'fern', 'term', 'herd'], tip: 'ER says "er" - most common spelling!' },
      { id: 'ir', pattern: 'ir', sound: 'er', examples: ['bird', 'girl', 'first', 'shirt'], tip: 'IR sounds just like ER!' },
      { id: 'ur', pattern: 'ur', sound: 'er', examples: ['burn', 'turn', 'fur', 'hurt'], tip: 'UR sounds just like ER and IR!' },
      { id: 'or', pattern: 'or', sound: 'or', examples: ['corn', 'fork', 'storm', 'short'], tip: 'OR says "or" like in "more"!' },
      { id: 'ore', pattern: 'ore', sound: 'or', examples: ['more', 'store', 'shore', 'core'], tip: 'ORE also says "or"!' },
      { id: 'oar', pattern: 'oar', sound: 'or', examples: ['roar', 'board', 'soar'], tip: 'OAR says "or" too!' },
      { id: 'air', pattern: 'air', sound: 'air', examples: ['hair', 'fair', 'chair', 'pair'], tip: 'AIR says "air"!' },
      { id: 'are', pattern: 'are', sound: 'air', examples: ['care', 'share', 'rare', 'square'], tip: 'ARE says "air" too!' },
      { id: 'ear-eer', pattern: 'ear', sound: 'eer', examples: ['ear', 'hear', 'near', 'dear'], tip: 'EAR can say "eer"!' },
      { id: 'ear-er', pattern: 'ear', sound: 'er', examples: ['earth', 'learn', 'early', 'search'], tip: 'EAR can also say "er"!' },
      { id: 'eer', pattern: 'eer', sound: 'eer', examples: ['deer', 'steer', 'cheer', 'peer'], tip: 'EER says "eer"!' },
    ]
  },
  {
    id: 'slide-park',
    name: 'Slide Park',
    levels: 'Levels 9–10',
    description: 'Rare spellings and flexible patterns. Slide between spellings.',
    tip: 'Some patterns have multiple sounds - context helps you choose!',
    icon: SlidersHorizontal,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    patterns: [
      { id: 'ea-short', pattern: 'ea', sound: 'short e', examples: ['bread', 'head', 'spread', 'thread'], tip: 'EA can say "eh" like in "bread"!' },
      { id: 'ei-long-a', pattern: 'ei', sound: 'long a', examples: ['vein', 'rein', 'eight', 'weight'], tip: 'EI can say "ay"!' },
      { id: 'ei-long-e', pattern: 'ei', sound: 'long e', examples: ['receive', 'ceiling', 'seize'], tip: 'EI after C usually says "ee"!' },
      { id: 'eigh', pattern: 'eigh', sound: 'long a', examples: ['eight', 'weigh', 'neighbor', 'sleigh'], tip: 'EIGH says "ay"!' },
      { id: 'ough-o', pattern: 'ough', sound: 'long o', examples: ['though', 'dough'], tip: 'OUGH can say "oh"!' },
      { id: 'ough-oo', pattern: 'ough', sound: 'oo', examples: ['through'], tip: 'OUGH can say "oo"!' },
      { id: 'ough-uff', pattern: 'ough', sound: 'uff', examples: ['tough', 'rough', 'enough'], tip: 'OUGH can say "uff"!' },
      { id: 'ough-off', pattern: 'ough', sound: 'off', examples: ['cough'], tip: 'OUGH can say "off"!' },
      { id: 'ough-ow', pattern: 'ough', sound: 'ow', examples: ['plough', 'bough'], tip: 'OUGH can say "ow"!' },
      { id: 'augh', pattern: 'augh', sound: 'aw', examples: ['caught', 'taught', 'daughter', 'naughty'], tip: 'AUGH says "aw"!' },
      { id: 'igh', pattern: 'igh', sound: 'long i', examples: ['light', 'night', 'high', 'sight'], tip: 'IGH says "eye" - GH is silent!' },
      { id: 'tion', pattern: 'tion', sound: 'shun', examples: ['nation', 'station', 'action', 'motion'], tip: 'TION says "shun"!' },
      { id: 'sion-zhun', pattern: 'sion', sound: 'zhun', examples: ['vision', 'decision', 'television'], tip: 'SION can say "zhun"!' },
      { id: 'sion-shun', pattern: 'sion', sound: 'shun', examples: ['mission', 'passion', 'session'], tip: 'SION can say "shun" too!' },
      { id: 'cian', pattern: 'cian', sound: 'shun', examples: ['musician', 'magician', 'electrician'], tip: 'CIAN says "shun"!' },
      { id: 'ous', pattern: 'ous', sound: 'us', examples: ['famous', 'nervous', 'curious', 'serious'], tip: 'OUS says "us"!' },
      { id: 'ious', pattern: 'ious', sound: 'ee-us', examples: ['curious', 'serious', 'previous'], tip: 'IOUS can say "ee-us"!' },
      { id: 'eous', pattern: 'eous', sound: 'ee-us', examples: ['gorgeous', 'courageous'], tip: 'EOUS says "ee-us" or "jus"!' },
    ]
  },
];

export function VowelUniverse() {
  const [activeZone, setActiveZone] = useState<VowelZone>(VOWEL_ZONES[0]);
  const [activePattern, setActivePattern] = useState<VowelPattern | null>(null);
  const [completedPatterns, setCompletedPatterns] = useState<Set<string>>(new Set());
  const { speak, speaking, supported } = useSpeechSynthesis();
  const { incrementGameCompleted } = useProgress();
  const handlePatternClick = (pattern: VowelPattern) => {
    setActivePattern(pattern);
    playPatternAudio(pattern);
  };

  const playPatternAudio = (pattern: VowelPattern) => {
    // Use speech synthesis with Dorothy-like pacing for all patterns
    if (supported) {
      speak(`${pattern.pattern}. This makes the ${pattern.sound} sound. Like in ${pattern.examples.join(', ')}.`, { rate: 0.75, pitch: 1.1 });
    }
  };

  const playPatternSoundOnly = (pattern: VowelPattern, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // Use speech synthesis with Dorothy-like pacing
    if (supported) {
      speak(`${pattern.pattern}. ${pattern.sound}. ${pattern.examples[0]}.`, { rate: 0.7, pitch: 1.1 });
    }
  };

  const handleExampleClick = (word: string, patternId: string) => {
    if (supported) {
      speak(word, { rate: 0.65, pitch: 1.0 });
    }
    setCompletedPatterns(prev => new Set([...prev, patternId]));
    incrementGameCompleted();
  };

  const getZoneProgress = (zone: VowelZone) => {
    const completed = zone.patterns.filter(p => completedPatterns.has(p.id)).length;
    return Math.round((completed / zone.patterns.length) * 100);
  };
  
  const isAnySoundPlaying = speaking;

  return (
    <Card data-tutorial="vowels" className="p-6 shadow-medium animate-slide-up">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
          Grapheme–Phoneme Mapping
        </p>
        <h2 className="text-xl font-semibold">Vowel Universe Map</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore 5 zones to master all vowel sounds. The story stays consistent across lessons!
        </p>
      </div>

      {/* Zone Navigation */}
      <Tabs value={activeZone.id} onValueChange={(v) => {
        const zone = VOWEL_ZONES.find(z => z.id === v);
        if (zone) {
          setActiveZone(zone);
          setActivePattern(null);
        }
      }}>
        <TabsList className="w-full h-auto flex-wrap gap-1 bg-muted/50 p-2 mb-4">
          {VOWEL_ZONES.map((zone) => {
            const Icon = zone.icon;
            const progress = getZoneProgress(zone);
            return (
              <TabsTrigger
                key={zone.id}
                value={zone.id}
                className={cn(
                  "flex-1 min-w-[140px] flex flex-col items-center gap-1 py-2 px-3 text-xs",
                  "data-[state=active]:shadow-sm"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", zone.color)} />
                  <span className="font-medium">{zone.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{zone.levels}</span>
                {progress > 0 && (
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {VOWEL_ZONES.map((zone) => {
          const Icon = zone.icon;
          return (
            <TabsContent key={zone.id} value={zone.id} className="mt-0">
              {/* Zone Header */}
              <div className={cn("p-4 rounded-xl border-2 mb-4", zone.bgColor)}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-12 h-12 rounded-full bg-background flex items-center justify-center", zone.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {zone.name}
                      <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded">
                        {zone.levels}
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{zone.description}</p>
                    <p className="text-sm mt-2 flex items-start gap-2">
                      <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="italic">{zone.tip}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Patterns Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 mb-4">
                {zone.patterns.map((pattern) => {
                  const isCompleted = completedPatterns.has(pattern.id);
                  return (
                    <div
                      key={pattern.id}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all duration-200 relative",
                        "hover:scale-102 hover:shadow-medium",
                        activePattern?.id === pattern.id
                          ? "bg-primary/10 border-primary shadow-glow"
                          : cn(zone.bgColor, "hover:bg-opacity-80")
                      )}
                    >
                      {isCompleted && (
                        <CheckCircle2 className="w-3 h-3 text-green-500 absolute top-1 right-1" />
                      )}
                      <button
                        onClick={() => handlePatternClick(pattern)}
                        className="w-full text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                      >
                        <div className="text-lg font-bold text-foreground">{pattern.pattern}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{pattern.sound}</div>
                      </button>
                      <button
                        onClick={(e) => playPatternSoundOnly(pattern, e)}
                        disabled={isAnySoundPlaying}
                        className={cn(
                          "w-full mt-2 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-xs",
                          "bg-primary/10 hover:bg-primary/20 text-primary transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          isAnySoundPlaying && "animate-pulse"
                        )}
                        aria-label={`Listen to ${pattern.pattern} sound`}
                      >
                        {isAnySoundPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isAnySoundPlaying ? 'Playing...' : 'Listen'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Active Pattern Detail */}
              {activePattern && (
                  <div className="p-5 rounded-xl bg-muted/50 border border-border animate-fade-in">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn("w-16 h-16 rounded-full border-2 flex items-center justify-center", zone.bgColor)}>
                      <span className="text-2xl font-bold">{activePattern.pattern}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {activePattern.pattern.toUpperCase()} Pattern
                        <span className="text-sm font-normal text-muted-foreground">
                          · {activePattern.sound}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => playPatternAudio(activePattern)}
                          disabled={isAnySoundPlaying}
                          className="ml-2"
                        >
                          {isAnySoundPlaying ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
                          {isAnySoundPlaying ? 'Playing...' : 'Listen'}
                        </Button>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        {activePattern.tip}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Tap to hear each word:</p>
                    <div className="flex flex-wrap gap-2">
                      {activePattern.examples.map((word) => (
                        <Button
                          key={word}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExampleClick(word, activePattern.id)}
                          disabled={isAnySoundPlaying}
                          className="group"
                        >
                          <Volume2 className="w-3 h-3 mr-2 group-hover:text-primary transition-colors" />
                          {word}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = zone.patterns.findIndex(p => p.id === activePattern.id);
                        if (currentIndex > 0) {
                          handlePatternClick(zone.patterns[currentIndex - 1]);
                        }
                      }}
                      disabled={zone.patterns.findIndex(p => p.id === activePattern.id) === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        const currentIndex = zone.patterns.findIndex(p => p.id === activePattern.id);
                        if (currentIndex < zone.patterns.length - 1) {
                          handlePatternClick(zone.patterns[currentIndex + 1]);
                        } else {
                          // Move to next zone
                          const zoneIndex = VOWEL_ZONES.findIndex(z => z.id === zone.id);
                          if (zoneIndex < VOWEL_ZONES.length - 1) {
                            const nextZone = VOWEL_ZONES[zoneIndex + 1];
                            setActiveZone(nextZone);
                            handlePatternClick(nextZone.patterns[0]);
                          }
                        }
                      }}
                    >
                      {zone.patterns.findIndex(p => p.id === activePattern.id) === zone.patterns.length - 1
                        ? 'Next Zone'
                        : 'Next Pattern'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {!activePattern && (
                <p className="text-center text-muted-foreground py-4">
                  Select a pattern above to start learning!
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </Card>
  );
}
