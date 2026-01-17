'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, Award, Target, Heart, Zap } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number; // 1-10
  energy: number; // 1-10
  activities: string[];
  notes?: string;
}

export const ProgressDashboard = ({ onReset: _onReset }: { onReset?: () => void }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [currentEnergy, setCurrentEnergy] = useState<number>(5);
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [completedSkills, setCompletedSkills] = useState(0);
  const [usedTools, setUsedTools] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    try {
      const entries = JSON.parse(localStorage.getItem('low-mood-entries') || '[]');
      const skills = JSON.parse(localStorage.getItem('low-mood-completed-skills') || '[]');
      const tools = JSON.parse(localStorage.getItem('low-mood-used-tools') || '[]');
      
      setMoodEntries(Array.isArray(entries) ? entries : []);
      setTotalEntries(Array.isArray(entries) ? entries.length : 0);
      setCompletedSkills(Array.isArray(skills) ? skills.length : 0);
      setUsedTools(Array.isArray(tools) ? tools.length : 0);
      
      // Calculate streak
      if (Array.isArray(entries)) {
        calculateStreak(entries);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      // Set defaults on error
      setMoodEntries([]);
      setTotalEntries(0);
      setCompletedSkills(0);
      setUsedTools(0);
      setStreak(0);
    }
  }, []);

  const calculateStreak = (entries: MoodEntry[]) => {
    if (entries.length === 0) {
      setStreak(0);
      return;
    }

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if there's an entry today or yesterday
    if (sortedEntries[0]?.date === today || sortedEntries[0]?.date === yesterday) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedEntries.length; i++) {
        const prevDate = new Date(sortedEntries[i - 1].date);
        const currDate = new Date(sortedEntries[i].date);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setStreak(currentStreak);
  };

  const logMood = () => {
    const today = new Date().toDateString();
    const newEntry: MoodEntry = {
      date: today,
      mood: currentMood,
      energy: currentEnergy,
      activities: []
    };

    const existingEntries = JSON.parse(localStorage.getItem('low-mood-entries') || '[]');
    const filteredEntries = existingEntries.filter((e: MoodEntry) => e.date !== today);
    const updatedEntries = [newEntry, ...filteredEntries];
    
    localStorage.setItem('low-mood-entries', JSON.stringify(updatedEntries));
    setMoodEntries(updatedEntries);
    setTotalEntries(updatedEntries.length);
    calculateStreak(updatedEntries);
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / moodEntries.length) * 10) / 10;
  };

  const getAverageEnergy = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.energy, 0);
    return Math.round((sum / moodEntries.length) * 10) / 10;
  };

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return 'neutral';
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((acc, e) => acc + e.mood, 0) / recent.length;
    const olderAvg = older.reduce((acc, e) => acc + e.mood, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'up';
    if (recentAvg < olderAvg - 0.5) return 'down';
    return 'neutral';
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return 'Very Low';
    if (mood <= 4) return 'Low';
    if (mood <= 6) return 'Moderate';
    if (mood <= 8) return 'Good';
    return 'Excellent';
  };

  const trend = getMoodTrend();
  const avgMood = getAverageMood();
  const avgEnergy = getAverageEnergy();

  return (
    <div className="mx-auto w-[86vw] max-w-[86vw] px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Progress Dashboard</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Track your mood, energy, and activities to identify patterns and celebrate progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Streak</span>
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{streak} days</div>
          <p className="text-xs text-muted-foreground">Keep tracking daily!</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Skills Practiced</span>
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{completedSkills}</div>
          <p className="text-xs text-muted-foreground">Building your toolkit</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tools Used</span>
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{usedTools}</div>
          <p className="text-xs text-muted-foreground">Active self-care</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Total Entries</span>
            <Heart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-3xl font-bold mb-1">{totalEntries}</div>
          <p className="text-xs text-muted-foreground">Tracking journey</p>
        </Card>
      </div>

      {/* Mood & Energy Averages */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Average Mood
            </h3>
            {trend === 'up' && <Badge className="bg-green-500"><TrendingUp className="h-3 w-3 mr-1" /> Improving</Badge>}
            {trend === 'down' && <Badge className="bg-red-500"><TrendingDown className="h-3 w-3 mr-1" /> Declining</Badge>}
            {trend === 'neutral' && <Badge variant="outline"><Minus className="h-3 w-3 mr-1" /> Stable</Badge>}
          </div>
          <div className="text-4xl font-bold mb-2">{avgMood || '-'} / 10</div>
          <Progress value={avgMood * 10} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {moodEntries.length > 0 ? `Based on ${moodEntries.length} entries` : 'Log your first mood entry'}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Average Energy
            </h3>
          </div>
          <div className="text-4xl font-bold mb-2">{avgEnergy || '-'} / 10</div>
          <Progress value={avgEnergy * 10} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {moodEntries.length > 0 ? 'Track patterns over time' : 'Start tracking your energy'}
          </p>
        </Card>
      </div>

      {/* Log Today's Mood */}
      <Card className="p-6 mb-8">
        <h3 className="text-xl font-bold mb-6">Log Today's Mood</h3>
        
        <div className="space-y-6">
          {/* Mood Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="low-mood-mood" className="text-sm font-medium">How is your mood today?</label>
              <Badge variant="outline">{currentMood} / 10 - {getMoodLabel(currentMood)}</Badge>
            </div>
            <input
              id="low-mood-mood"
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Very Low</span>
              <span>Moderate</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="low-mood-energy" className="text-sm font-medium">How is your energy level?</label>
              <Badge variant="outline">{currentEnergy} / 10</Badge>
            </div>
            <input
              id="low-mood-energy"
              type="range"
              min="1"
              max="10"
              value={currentEnergy}
              onChange={(e) => setCurrentEnergy(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Exhausted</span>
              <span>Moderate</span>
              <span>Energized</span>
            </div>
          </div>

          <Button onClick={logMood} className="w-full" size="lg">
            Log Mood Entry
          </Button>
        </div>
      </Card>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {moodEntries.slice(0, 7).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">
                    {new Date(entry.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mood: {entry.mood}/10 • Energy: {entry.energy}/10
                  </div>
                </div>
                <Badge variant={entry.mood >= 7 ? 'default' : entry.mood >= 5 ? 'secondary' : 'outline'}>
                  {getMoodLabel(entry.mood)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

