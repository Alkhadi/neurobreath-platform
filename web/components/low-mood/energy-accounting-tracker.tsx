"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Plus, Trash2, TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface EnergyActivity {
  id: string;
  name: string;
  energyLevel: "red" | "yellow" | "green"; // red=depleting, yellow=neutral, green=restorative
  energyCost: number; // 1-10 scale
  timestamp: string;
  notes?: string;
}

interface DailyEnergy {
  date: string;
  startingEnergy: number;
  activities: EnergyActivity[];
  currentEnergy: number;
}

const ENERGY_LEVELS = {
  red: { label: "High Energy Cost", color: "bg-red-100 text-red-800 border-red-300", icon: BatteryLow, description: "Draining activities" },
  yellow: { label: "Moderate Energy", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: BatteryMedium, description: "Neutral activities" },
  green: { label: "Energy Restoring", color: "bg-green-100 text-green-800 border-green-300", icon: BatteryFull, description: "Recharging activities" },
};

const EXAMPLE_ACTIVITIES = {
  red: [
    "Work meeting",
    "Difficult conversation",
    "Problem-solving task",
    "Public speaking",
    "Deadline pressure",
    "Social event (large group)",
    "Administrative tasks",
  ],
  yellow: [
    "Routine work tasks",
    "Light housework",
    "Cooking",
    "Shopping",
    "Email responses",
    "Walking",
  ],
  green: [
    "Meditation",
    "Napping",
    "Reading for pleasure",
    "Listening to music",
    "Gentle stretching",
    "Time in nature",
    "Creative hobby",
  ],
};

export function EnergyAccountingTracker() {
  const [dailyEnergyData, setDailyEnergyData] = useLocalStorage<DailyEnergy[]>("energy_accounting_data", []);
  const [activityName, setActivityName] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"red" | "yellow" | "green">("yellow");
  const [energyCost, setEnergyCost] = useState("5");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const todayData = dailyEnergyData.find(d => d.date === selectedDate);
  const currentEnergy = todayData?.currentEnergy || 100;

  useEffect(() => {
    // Initialize today's data if it doesn't exist
    setDailyEnergyData((prev) => {
      if (prev.find(d => d.date === selectedDate)) {
        return prev;
      }
      return [
        ...prev,
        {
          date: selectedDate,
          startingEnergy: 100,
          activities: [],
          currentEnergy: 100,
        },
      ];
    });
  }, [selectedDate, setDailyEnergyData]);

  const addActivity = () => {
    if (!activityName.trim()) return;

    const cost = parseInt(energyCost);
    const activity: EnergyActivity = {
      id: Date.now().toString(),
      name: activityName,
      energyLevel,
      energyCost: energyLevel === "red" ? -cost : energyLevel === "yellow" ? Math.round(-cost / 2) : cost,
      timestamp: new Date().toISOString(),
      notes,
    };

    const updatedData = dailyEnergyData.map(d => {
      if (d.date === selectedDate) {
        const newActivities = [...d.activities, activity];
        const newEnergy = Math.max(0, Math.min(100, d.currentEnergy + activity.energyCost));
        return {
          ...d,
          activities: newActivities,
          currentEnergy: newEnergy,
        };
      }
      return d;
    });

    setDailyEnergyData(updatedData);
    setActivityName("");
    setNotes("");
    setEnergyCost("5");
  };

  const deleteActivity = (activityId: string) => {
    const updatedData = dailyEnergyData.map(d => {
      if (d.date === selectedDate) {
        const filteredActivities = d.activities.filter(a => a.id !== activityId);
        
        // Recalculate energy
        let energy = d.startingEnergy;
        filteredActivities.forEach(a => {
          energy = Math.max(0, Math.min(100, energy + a.energyCost));
        });
        
        return {
          ...d,
          activities: filteredActivities,
          currentEnergy: energy,
        };
      }
      return d;
    });
    setDailyEnergyData(updatedData);
  };

  const getEnergyStatus = () => {
    if (currentEnergy >= 70) return { text: "Good Energy", color: "text-green-600", icon: BatteryFull };
    if (currentEnergy >= 40) return { text: "Moderate Energy", color: "text-yellow-600", icon: BatteryMedium };
    return { text: "Low Energy - Rest Needed", color: "text-red-600", icon: BatteryLow };
  };

  const getWeeklyStats = () => {
    const last7Days = dailyEnergyData.slice(-7);
    const avgEnergy = last7Days.reduce((sum, d) => sum + d.currentEnergy, 0) / (last7Days.length || 1);
    const redActivities = last7Days.reduce((sum, d) => sum + d.activities.filter(a => a.energyLevel === "red").length, 0);
    const greenActivities = last7Days.reduce((sum, d) => sum + d.activities.filter(a => a.energyLevel === "green").length, 0);
    
    return {
      avgEnergy: Math.round(avgEnergy),
      redActivities,
      greenActivities,
      balance: greenActivities >= redActivities ? "balanced" : "imbalanced",
    };
  };

  const status = getEnergyStatus();
  const weeklyStats = getWeeklyStats();
  const StatusIcon = status.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-6 w-6 text-amber-600" />
              Energy Accounting Tracker
            </CardTitle>
            <CardDescription>
              Evidence-based pacing system to balance activity with rest. Track your energy "budget" throughout the day.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="add">Add Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <Label htmlFor="energy-date">Date</Label>
                <Input
                  id="energy-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Current Energy Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-6 w-6 ${status.color}`} />
                  <span className={`font-semibold ${status.color}`}>{status.text}</span>
                </div>
                <span className="text-2xl font-bold">{currentEnergy}%</span>
              </div>
              <Progress value={currentEnergy} className="h-3" />
            </div>

            {/* Traffic Light System Guide */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Pacing Tip:</strong> Balance high-energy (red) activities with restorative (green) activities. Take rest breaks before energy drops below 40%.
              </AlertDescription>
            </Alert>

            {/* Today's Activities */}
            <div className="space-y-2">
              <h3 className="font-semibold">Today's Activities ({format(new Date(selectedDate), "d MMM yyyy")})</h3>
              {todayData?.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activities logged yet today.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {todayData?.activities.map((activity) => {
                    const levelInfo = ENERGY_LEVELS[activity.energyLevel];
                    const Icon = levelInfo.icon;
                    return (
                      <div
                        key={activity.id}
                        className={`p-3 rounded-lg border-2 ${levelInfo.color} flex items-start justify-between`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{activity.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.energyCost > 0 ? "+" : ""}{activity.energyCost}
                            </Badge>
                          </div>
                          {activity.notes && (
                            <p className="text-xs mt-1 opacity-75">{activity.notes}</p>
                          )}
                          <p className="text-xs mt-1 opacity-60">
                            {format(new Date(activity.timestamp), "h:mm a")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActivity(activity.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-4">
              {/* Energy Level Selection */}
              <div className="space-y-2">
                <Label>Energy Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(ENERGY_LEVELS) as Array<keyof typeof ENERGY_LEVELS>).map((level) => {
                    const levelInfo = ENERGY_LEVELS[level];
                    const Icon = levelInfo.icon;
                    return (
                      <button
                        key={level}
                        onClick={() => setEnergyLevel(level)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          energyLevel === level
                            ? levelInfo.color + " ring-2 ring-offset-2"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{levelInfo.label}</div>
                            <div className="text-xs opacity-75">{levelInfo.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Name */}
              <div className="space-y-2">
                <Label htmlFor="activityName">Activity Name</Label>
                <Input
                  id="activityName"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="e.g., Team meeting, Meditation, Email responses"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-muted-foreground">Quick add:</span>
                  {EXAMPLE_ACTIVITIES[energyLevel].slice(0, 4).map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setActivityName(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Energy Cost */}
              <div className="space-y-2">
                <Label htmlFor="energyCost">
                  {energyLevel === "green" ? "Energy Gain" : "Energy Cost"}: {energyCost}
                </Label>
                <input
                  type="range"
                  id="energyCost"
                  min="1"
                  max="10"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did this activity feel?"
                />
              </div>

              <Button onClick={addActivity} className="w-full" disabled={!activityName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {/* Weekly Average */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">7-Day Energy Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{weeklyStats.avgEnergy}%</span>
                    <Badge variant={weeklyStats.avgEnergy >= 60 ? "default" : "destructive"}>
                      {weeklyStats.avgEnergy >= 60 ? "Good" : "Low"}
                    </Badge>
                  </div>
                  <Progress value={weeklyStats.avgEnergy} className="mt-2" />
                </CardContent>
              </Card>

              {/* Activity Balance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Activity Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-sm">High-cost activities</span>
                    </div>
                    <span className="font-semibold">{weeklyStats.redActivities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Restorative activities</span>
                    </div>
                    <span className="font-semibold">{weeklyStats.greenActivities}</span>
                  </div>
                  <Alert className={weeklyStats.balance === "balanced" ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"}>
                    {weeklyStats.balance === "balanced" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                    <AlertDescription>
                      {weeklyStats.balance === "balanced"
                        ? "Great! You're balancing draining activities with restorative ones."
                        : "Consider adding more restorative (green) activities to balance your energy."}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pacing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• <strong>Red activities:</strong> Limit to 2-3 per day. Schedule breaks after each.</p>
                  <p>• <strong>Yellow activities:</strong> Space them out throughout the day.</p>
                  <p>• <strong>Green activities:</strong> Use these to recharge. Schedule at least 3-4 daily.</p>
                  <p>• <strong>Rest before you're exhausted:</strong> Don't wait until energy drops to 0%.</p>
                  <p>• <strong>Consistency over intensity:</strong> Sustainable pacing prevents boom-bust cycles.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

