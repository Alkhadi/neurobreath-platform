'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Sparkles, Sun, Heart, Users, Zap, Book } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'movement' | 'connection' | 'mindfulness' | 'self-care' | 'learning';
  icon: any;
  points: number;
}

const challenges: Challenge[] = [
  {
    id: 'morning-sunlight',
    title: 'Morning Sunlight',
    description: 'Get 10 minutes of natural light within 1 hour of waking',
    category: 'movement',
    icon: Sun,
    points: 10
  },
  {
    id: 'reach-out',
    title: 'Reach Out',
    description: 'Send a message or make a call to someone you care about',
    category: 'connection',
    icon: Users,
    points: 15
  },
  {
    id: 'gratitude-moment',
    title: 'Gratitude Moment',
    description: 'Write down three things you\'re grateful for today',
    category: 'mindfulness',
    icon: Heart,
    points: 10
  },
  {
    id: 'breathing-practice',
    title: 'Breathing Practice',
    description: 'Complete 5 minutes of coherent breathing (5-5 rhythm)',
    category: 'self-care',
    icon: Sparkles,
    points: 15
  },
  {
    id: 'movement-break',
    title: 'Movement Break',
    description: 'Take a 10-minute walk or do gentle stretching',
    category: 'movement',
    icon: Zap,
    points: 15
  },
  {
    id: 'learning-moment',
    title: 'Learning Moment',
    description: 'Read or watch something educational about mental health',
    category: 'learning',
    icon: Book,
    points: 10
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion',
    description: 'Practice a self-compassion break when facing difficulty',
    category: 'mindfulness',
    icon: Heart,
    points: 15
  },
  {
    id: 'pleasant-activity',
    title: 'Pleasant Activity',
    description: 'Do one small thing you enjoy, even for just 5 minutes',
    category: 'self-care',
    icon: Sparkles,
    points: 10
  },
  {
    id: 'nature-dose',
    title: 'Nature Dose',
    description: 'Spend 10 minutes in nature or with a window view',
    category: 'movement',
    icon: Sun,
    points: 10
  },
  {
    id: 'boundary-practice',
    title: 'Boundary Practice',
    description: 'Say no to one thing that drains your energy',
    category: 'self-care',
    icon: Heart,
    points: 20
  }
];

export const DailyChallenges = ({ onUpdate }: { onUpdate?: () => void }) => {
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // Load today's progress
    loadDailyProgress();
    
    // Select 5 random challenges for today
    selectDailyChallenges();
  }, []);

  const loadDailyProgress = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('low-mood-daily-challenges');
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setCompletedToday(new Set(data.completed || []));
          setTotalPoints(data.points || 0);
          setStreak(data.streak || 0);
          return;
        }
      } catch (error) {
        console.error('Error loading daily progress:', error);
      }
    }
    
    // New day - reset completed but maintain streak
    try {
      const allTimeData = JSON.parse(localStorage.getItem('low-mood-challenge-history') || '[]');
      calculateStreak(allTimeData);
    } catch (error) {
      console.error('Error loading challenge history:', error);
      setStreak(0);
    }
  };

  const selectDailyChallenges = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('low-mood-todays-challenges');
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today && data.challengeIds && Array.isArray(data.challengeIds)) {
          // Use stored challenge IDs for today and look up full challenge data
          const selectedChallenges = data.challengeIds
            .map((id: string) => challenges.find(c => c.id === id))
            .filter(Boolean) as Challenge[];
          
          if (selectedChallenges.length > 0) {
            setDailyChallenges(selectedChallenges);
            return;
          }
        }
      } catch (error) {
        // If parsing fails or data is invalid, generate new challenges
        console.error('Error loading stored challenges:', error);
      }
    }
    
    // Generate new challenges for today
    const shuffled = [...challenges].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    
    // Store only the IDs, not the full challenge objects (which contain React components)
    localStorage.setItem('low-mood-todays-challenges', JSON.stringify({
      date: today,
      challengeIds: selected.map(c => c.id)
    }));
    
    setDailyChallenges(selected);
  };

  const calculateStreak = (history: any[]) => {
    if (history.length === 0) {
      setStreak(0);
      return;
    }

    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedHistory[0]?.date === today || sortedHistory[0]?.date === yesterday) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedHistory.length; i++) {
        const prevDate = new Date(sortedHistory[i - 1].date);
        const currDate = new Date(sortedHistory[i].date);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
        
        if (diffDays === 1 && sortedHistory[i].completed > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setStreak(currentStreak);
  };

  const toggleChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const today = new Date().toDateString();
    const newCompleted = new Set(completedToday);
    let newPoints = totalPoints;

    if (newCompleted.has(challengeId)) {
      newCompleted.delete(challengeId);
      newPoints -= challenge.points;
    } else {
      newCompleted.add(challengeId);
      newPoints += challenge.points;
    }

    setCompletedToday(newCompleted);
    setTotalPoints(newPoints);

    // Update streak if completing first challenge of the day
    if (newCompleted.size === 1 && !completedToday.has(challengeId)) {
      const newStreak = streak + 1;
      setStreak(newStreak);
    }

    // Save progress
    localStorage.setItem('low-mood-daily-challenges', JSON.stringify({
      date: today,
      completed: [...newCompleted],
      points: newPoints,
      streak: completedToday.size === 0 && newCompleted.size === 1 ? streak + 1 : streak
    }));

    // Update history
    const history = JSON.parse(localStorage.getItem('low-mood-challenge-history') || '[]');
    const existingIndex = history.findIndex((h: any) => h.date === today);
    
    if (existingIndex >= 0) {
      history[existingIndex] = {
        date: today,
        completed: newCompleted.size,
        points: newPoints
      };
    } else {
      history.push({
        date: today,
        completed: newCompleted.size,
        points: newPoints
      });
    }
    
    localStorage.setItem('low-mood-challenge-history', JSON.stringify(history));
    onUpdate?.();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'connection': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mindfulness': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'self-care': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'learning': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = dailyChallenges.length > 0 
    ? (completedToday.size / dailyChallenges.length) * 100 
    : 0;

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Daily Challenges</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Build consistent self-care habits with daily challenges. Complete challenges to earn points and maintain your streak!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{completedToday.size} / {dailyChallenges.length}</div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
            <div className="mt-3 bg-white dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Points Today</div>
            <Badge variant="outline" className="mt-3">
              <Sparkles className="h-3 w-3 mr-1" />
              Keep going!
            </Badge>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
            {streak > 0 && (
              <Badge variant="outline" className="mt-3">
                🔥 On fire!
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Today's Challenges */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6">Today's Challenges</h3>
        
        {dailyChallenges.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Loading today's challenges...
          </p>
        ) : (
          <div className="space-y-4">
            {dailyChallenges.map(challenge => {
              const Icon = challenge.icon;
              const isCompleted = completedToday.has(challenge.id);
              
              return (
                <div
                  key={challenge.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => toggleChallenge(challenge.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <Badge variant="outline" className="ml-auto">
                          {challenge.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {challenge.description}
                      </p>
                      <Badge className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completionPercentage === 100 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg text-center">
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              🎉 Amazing! You completed all challenges today!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Come back tomorrow for new challenges
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

