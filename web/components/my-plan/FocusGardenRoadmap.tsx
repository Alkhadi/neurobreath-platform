'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles, Loader2, Wand2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Topic, UserContext } from '@/types/user-context';
import type { AICoachAnswer, AICoachResponse } from '@/types/ai-coach';

type RoadmapStateV1 = {
  version: 1;
  updatedAtISO: string;
  inputs: {
    ageGroup?: UserContext['ageGroup'];
    setting?: UserContext['setting'];
    mainChallenge?: UserContext['mainChallenge'];
    goal?: UserContext['goal'];
    conditions: string[];
    minutesPerDay?: number;
    notes?: string;
  };
  answer?: Pick<AICoachAnswer, 'title' | 'plainEnglishSummary' | 'sevenDayPlan' | 'practicalActions' | 'followUpQuestions' | 'internalLinks' | 'safetyNotice'>;
};

const STORAGE_KEY = 'neurobreath.focusGardenRoadmap.v1';

const CONDITION_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'adhd', label: 'ADHD (focus, routines, executive function)' },
  { id: 'dyslexia', label: 'Dyslexia (reading, spelling, learning support)' },
  { id: 'autism', label: 'Autism (sensory, social communication, routines)' },
  { id: 'anxiety', label: 'Anxiety (worry, panic, morning stress)' },
  { id: 'mood', label: 'Low mood / burnout' },
  { id: 'sleep', label: 'Sleep (wind-down, insomnia support)' },
  { id: 'stress', label: 'Stress (regulation, workload balance)' },
];

function safeLoad(): RoadmapStateV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoadmapStateV1;
    if (!parsed || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

function safeSave(state: RoadmapStateV1) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clampMinutes(raw: string): number | undefined {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(5, Math.min(120, n));
}

function buildQuestion(inputs: RoadmapStateV1['inputs']): string {
  const parts: string[] = [];

  const who = inputs.ageGroup ? `Age group: ${inputs.ageGroup}.` : '';
  const setting = inputs.setting ? `Setting: ${inputs.setting}.` : '';
  const challenge = inputs.mainChallenge ? `Main challenge: ${inputs.mainChallenge}.` : '';
  const goal = inputs.goal ? `Goal: ${inputs.goal}.` : '';
  const time = inputs.minutesPerDay ? `Time available per day: ${inputs.minutesPerDay} minutes.` : '';

  const conditions = inputs.conditions?.length ? `Conditions / needs: ${inputs.conditions.join(', ')}.` : '';

  const notes = inputs.notes?.trim() ? `Notes: ${inputs.notes.trim()}` : '';

  parts.push(
    'Create a practical, evidence-informed 7-day plan that balances learning, focus, and wellbeing without overwhelming the user.',
    'Use NeuroBreath tools when helpful and include simple, concrete steps per day (with durations).',
    'If there are multiple conditions, coordinate the plan so it’s balanced (no overload) and adapts when a day is missed.',
    who,
    setting,
    challenge,
    goal,
    time,
    conditions,
    notes
  );

  return parts.filter(Boolean).join(' ');
}

export function FocusGardenRoadmap() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ageGroup, setAgeGroup] = useState<UserContext['ageGroup']>('children');
  const [setting, setSetting] = useState<UserContext['setting']>('home');
  const [mainChallenge, setMainChallenge] = useState<UserContext['mainChallenge']>('routines');
  const [goal, setGoal] = useState<UserContext['goal']>('this-week');
  const [minutesPerDay, setMinutesPerDay] = useState<string>('15');
  const [notes, setNotes] = useState<string>('');
  const [conditions, setConditions] = useState<string[]>(['adhd']);
  const [answer, setAnswer] = useState<RoadmapStateV1['answer'] | null>(null);

  useEffect(() => {
    const cached = safeLoad();
    if (!cached) return;
    setAgeGroup(cached.inputs.ageGroup || 'children');
    setSetting(cached.inputs.setting || 'home');
    setMainChallenge(cached.inputs.mainChallenge || 'routines');
    setGoal(cached.inputs.goal || 'this-week');
    setMinutesPerDay(String(cached.inputs.minutesPerDay || 15));
    setNotes(cached.inputs.notes || '');
    setConditions(Array.isArray(cached.inputs.conditions) && cached.inputs.conditions.length ? cached.inputs.conditions : ['adhd']);
    setAnswer(cached.answer || null);
  }, []);

  const userContext: UserContext = useMemo(
    () => ({
      ageGroup,
      setting,
      mainChallenge,
      goal,
      country: 'UK',
      topic: 'other',
    }),
    [ageGroup, goal, mainChallenge, setting]
  );

  const selectedSummary = useMemo(() => {
    const label = CONDITION_OPTIONS.filter((c) => conditions.includes(c.id)).map((c) => c.id);
    return label.length ? label.join(' + ') : 'general';
  }, [conditions]);

  const toggleCondition = useCallback((id: string) => {
    setConditions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }, []);

  const reset = useCallback(() => {
    setAgeGroup('children');
    setSetting('home');
    setMainChallenge('routines');
    setGoal('this-week');
    setMinutesPerDay('15');
    setNotes('');
    setConditions(['adhd']);
    setAnswer(null);
    setError(null);

    safeSave({
      version: 1,
      updatedAtISO: new Date().toISOString(),
      inputs: {
        ageGroup: 'children',
        setting: 'home',
        mainChallenge: 'routines',
        goal: 'this-week',
        conditions: ['adhd'],
        minutesPerDay: 15,
        notes: '',
      },
    });
  }, []);

  const generate = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const mins = clampMinutes(minutesPerDay);

    const state: RoadmapStateV1 = {
      version: 1,
      updatedAtISO: new Date().toISOString(),
      inputs: {
        ageGroup,
        setting,
        mainChallenge,
        goal,
        conditions,
        minutesPerDay: mins,
        notes,
      },
    };

    safeSave(state);

    try {
      const topic: Topic = 'other';
      const question = buildQuestion(state.inputs);

      const payload = {
        userQuestion: question,
        mode: 'typed' as const,
        userContext: { ...userContext, topic },
        topic,
      };

      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      const data = (await res.json().catch(() => null)) as AICoachResponse | { error?: string } | null;

      if (!res.ok) {
        const message = (data as { error?: string } | null)?.error || `Request failed (${res.status})`;
        throw new Error(message);
      }

      const nextAnswer = (data as AICoachResponse | null)?.answer;
      if (!nextAnswer) throw new Error('No answer returned');

      const storedAnswer: RoadmapStateV1['answer'] = {
        title: nextAnswer.title,
        plainEnglishSummary: nextAnswer.plainEnglishSummary,
        sevenDayPlan: nextAnswer.sevenDayPlan,
        practicalActions: nextAnswer.practicalActions,
        followUpQuestions: nextAnswer.followUpQuestions,
        internalLinks: nextAnswer.internalLinks,
        safetyNotice: nextAnswer.safetyNotice,
      };

      setAnswer(storedAnswer);
      safeSave({ ...state, answer: storedAnswer });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan.');
    } finally {
      setIsLoading(false);
    }
  }, [ageGroup, conditions, goal, isLoading, mainChallenge, minutesPerDay, notes, setting, userContext]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Focus Garden Roadmap (multi-condition)
          </CardTitle>
          <CardDescription>
            Build a coordinated weekly plan across focus, learning, and wellbeing. This uses the AI Coach endpoint and only stores a non-identifying summary on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Selected: {selectedSummary}</Badge>
            <Badge variant="outline">~{clampMinutes(minutesPerDay) || 15} min/day</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Age group</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'children', label: 'Child' },
                  { id: 'adolescence', label: 'Teen' },
                  { id: 'adult', label: 'Adult' },
                  { id: 'parent-caregiver', label: 'Parent' },
                ] as const).map((opt) => (
                  <Button
                    key={opt.id}
                    type="button"
                    variant={ageGroup === opt.id ? 'default' : 'outline'}
                    onClick={() => setAgeGroup(opt.id)}
                    className="justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Setting</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'home', label: 'Home' },
                  { id: 'school', label: 'School' },
                  { id: 'workplace', label: 'Work' },
                  { id: 'community', label: 'Community' },
                ] as const).map((opt) => (
                  <Button
                    key={opt.id}
                    type="button"
                    variant={setting === opt.id ? 'default' : 'outline'}
                    onClick={() => setSetting(opt.id)}
                    className="justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Main challenge</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'routines', label: 'Routines' },
                  { id: 'focus', label: 'Focus' },
                  { id: 'learning', label: 'Learning' },
                  { id: 'anxiety', label: 'Anxiety' },
                  { id: 'sleep', label: 'Sleep' },
                  { id: 'sensory', label: 'Sensory' },
                ] as const).map((opt) => (
                  <Button
                    key={opt.id}
                    type="button"
                    variant={mainChallenge === opt.id ? 'default' : 'outline'}
                    onClick={() => setMainChallenge(opt.id)}
                    className="justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'today', label: 'Today' },
                  { id: 'this-week', label: 'This week' },
                  { id: 'long-term', label: 'Long-term' },
                ] as const).map((opt) => (
                  <Button
                    key={opt.id}
                    type="button"
                    variant={goal === opt.id ? 'default' : 'outline'}
                    onClick={() => setGoal(opt.id)}
                    className="justify-start"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Conditions / needs</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {CONDITION_OPTIONS.map((c) => (
                <div key={c.id} className="flex items-start gap-2 rounded-md border border-border/50 p-3">
                  <Checkbox
                    id={`cond-${c.id}`}
                    checked={conditions.includes(c.id)}
                    onCheckedChange={() => toggleCondition(c.id)}
                  />
                  <Label htmlFor={`cond-${c.id}`} className="leading-snug">
                    {c.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Minutes per day (5–120)</Label>
              <Textarea
                value={minutesPerDay}
                onChange={(e) => setMinutesPerDay(e.target.value.replace(/\D+/g, ''))}
                rows={1}
                className="resize-none"
                placeholder="15"
              />
              <div className="text-xs text-muted-foreground">Keep it small. Consistency beats intensity.</div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
                placeholder="e.g., mornings are hard, school anxiety spikes, weekends are free of quests"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={generate} disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Generate 7-day plan
            </Button>
            <Button type="button" variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>{answer.title}</CardTitle>
            <CardDescription>Generated plan (stored locally)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {answer.plainEnglishSummary?.length ? (
              <div className="space-y-1">
                {answer.plainEnglishSummary.map((line, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">• {line}</div>
                ))}
              </div>
            ) : null}

            {answer.sevenDayPlan?.length ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold">7-day plan</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {answer.sevenDayPlan.slice(0, 7).map((d) => (
                    <div key={d.day} className="rounded-md border border-border/50 p-3">
                      <div className="text-xs font-semibold text-muted-foreground">Day {d.day}</div>
                      <div className="text-sm font-medium mt-1">{d.activity}</div>
                      <div className="text-xs text-muted-foreground mt-1">{d.duration}{d.notes ? ` · ${d.notes}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {answer.internalLinks?.length ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold">Suggested NeuroBreath tools</div>
                <div className="space-y-2">
                  {answer.internalLinks.slice(0, 8).map((l) => (
                    <div key={l.path} className="rounded-md border border-border/50 p-3">
                      <div className="text-sm font-medium">
                        <a href={l.path} className="underline text-primary">{l.title}</a>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{l.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {answer.safetyNotice ? (
              <div className="rounded-md border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground">
                {answer.safetyNotice}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
