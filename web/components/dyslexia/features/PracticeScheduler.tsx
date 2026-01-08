'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, Plus, Trash2, CheckCircle } from 'lucide-react';

interface PracticeSession {
  id: string;
  day: string;
  time: string;
  duration: number;
  activity: string;
  completed: boolean;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const activities = ['Reading Practice', 'Phonics Games', 'Sight Words', 'Comprehension', 'Writing', 'Vocabulary'];

export function PracticeScheduler() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [newSession, setNewSession] = useState({
    day: days[0],
    time: '09:00',
    duration: 15,
    activity: activities[0],
  });
  const [dailyGoal, setDailyGoal] = useState(30); // minutes
  const [weeklyStreak, setWeeklyStreak] = useState(0);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    const saved = localStorage.getItem('dyslexia-practice-schedule');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  };

  const saveSchedule = (updatedSessions: PracticeSession[]) => {
    localStorage.setItem('dyslexia-practice-schedule', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  const addSession = () => {
    const session: PracticeSession = {
      id: Date.now().toString(),
      ...newSession,
      completed: false,
    };
    saveSchedule([...sessions, session]);
  };

  const deleteSession = (id: string) => {
    saveSchedule(sessions.filter(s => s.id !== id));
  };

  const toggleComplete = (id: string) => {
    saveSchedule(sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const todaysSessions = sessions.filter(s => {
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    return s.day === today;
  });

  const todaysMinutes = todaysSessions
    .filter(s => s.completed)
    .reduce((total, s) => total + s.duration, 0);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Practice Scheduler
          </h3>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Today's Progress</span>
            <span className="text-2xl font-bold">{todaysMinutes} / {dailyGoal} min</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
              style={{ width: `${Math.min((todaysMinutes / dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Sessions */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Today's Schedule</h4>
          {todaysSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sessions scheduled for today</p>
          ) : (
            todaysSessions.map(session => (
              <div
                key={session.id}
                className={`p-4 rounded-lg border-2 ${
                  session.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500'
                    : 'bg-white dark:bg-gray-800 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{session.time}</span>
                      <span className="text-sm text-muted-foreground">({session.duration} min)</span>
                    </div>
                    <p className="text-sm mt-1">{session.activity}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={session.completed ? "default" : "outline"}
                    onClick={() => toggleComplete(session.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Session */}
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <h4 className="text-lg font-semibold">Add Practice Session</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Day</label>
              <select
                value={newSession.day}
                onChange={(e) => setNewSession({ ...newSession, day: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Time</label>
              <input
                type="time"
                value={newSession.time}
                onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Duration (min)</label>
              <input
                type="number"
                min="5"
                max="60"
                step="5"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Activity</label>
              <select
                value={newSession.activity}
                onChange={(e) => setNewSession({ ...newSession, activity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {activities.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
          </div>

          <Button onClick={addSession} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Session
          </Button>
        </div>

        {/* Weekly View */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Weekly Schedule</h4>
          <div className="space-y-2">
            {days.map(day => {
              const daySessions = sessions.filter(s => s.day === day);
              return (
                <div key={day} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="font-semibold text-sm mb-2">{day}</div>
                  {daySessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No sessions</p>
                  ) : (
                    <div className="space-y-2">
                      {daySessions.map(session => (
                        <div key={session.id} className="flex items-center justify-between text-xs">
                          <span>{session.time} - {session.activity} ({session.duration}min)</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSession(session.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>📅 Schedule regular practice sessions to build consistent learning habits</p>
        </div>
      </CardContent>
    </Card>
  );
}
