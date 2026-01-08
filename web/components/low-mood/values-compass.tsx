"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Compass, Heart, Users, Briefcase, BookOpen, Flower2, Star, Plus, Calendar, CheckCircle2 } from "lucide-react";

interface Value {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface MeaningfulActivity {
  id: string;
  activity: string;
  linkedValues: string[]; // IDs of values this activity aligns with
  scheduledDate?: string;
  completed: boolean;
  reflection?: string;
}

const VALUE_CATEGORIES = {
  relationships: {
    icon: Heart,
    label: "Relationships",
    examples: ["Love", "Connection", "Compassion", "Kindness", "Support"],
  },
  community: {
    icon: Users,
    label: "Community & Contribution",
    examples: ["Service", "Generosity", "Belonging", "Helping others", "Making a difference"],
  },
  work: {
    icon: Briefcase,
    label: "Work & Achievement",
    examples: ["Excellence", "Integrity", "Growth", "Purpose", "Contribution"],
  },
  learning: {
    icon: BookOpen,
    label: "Learning & Growth",
    examples: ["Curiosity", "Wisdom", "Creativity", "Learning", "Development"],
  },
  wellbeing: {
    icon: Flower2,
    label: "Personal Well-being",
    examples: ["Health", "Balance", "Peace", "Self-care", "Authenticity"],
  },
  meaning: {
    icon: Star,
    label: "Meaning & Spirituality",
    examples: ["Purpose", "Gratitude", "Faith", "Hope", "Mindfulness"],
  },
};

export function ValuesCompass() {
  const [selectedValues, setSelectedValues] = useLocalStorage<Value[]>("values_compass", []);
  const [activities, setActivities] = useLocalStorage<MeaningfulActivity[]>("meaningful_activities", []);
  const [customValue, setCustomValue] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customCategory, setCustomCategory] = useState<keyof typeof VALUE_CATEGORIES>("wellbeing");
  
  const [newActivity, setNewActivity] = useState("");
  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");

  const addCustomValue = () => {
    if (!customValue.trim()) return;

    const newValue: Value = {
      id: Date.now().toString(),
      name: customValue,
      description: customDescription,
      category: customCategory,
    };

    setSelectedValues([...selectedValues, newValue]);
    setCustomValue("");
    setCustomDescription("");
  };

  const toggleExampleValue = (example: string, category: keyof typeof VALUE_CATEGORIES) => {
    const existing = selectedValues.find(v => v.name === example);
    if (existing) {
      setSelectedValues(selectedValues.filter(v => v.id !== existing.id));
    } else {
      const newValue: Value = {
        id: Date.now().toString(),
        name: example,
        description: `A core value in ${VALUE_CATEGORIES[category].label.toLowerCase()}`,
        category,
      };
      setSelectedValues([...selectedValues, newValue]);
    }
  };

  const removeValue = (id: string) => {
    setSelectedValues(selectedValues.filter(v => v.id !== id));
  };

  const addActivity = () => {
    if (!newActivity.trim() || selectedValueIds.length === 0) return;

    const activity: MeaningfulActivity = {
      id: Date.now().toString(),
      activity: newActivity,
      linkedValues: selectedValueIds,
      scheduledDate: scheduledDate || undefined,
      completed: false,
    };

    setActivities([...activities, activity]);
    setNewActivity("");
    setSelectedValueIds([]);
    setScheduledDate("");
  };

  const toggleActivity = (id: string) => {
    setActivities(
      activities.map(a =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const completedActivities = activities.filter(a => a.completed).length;
  const totalActivities = activities.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-blue-600" />
              Values Compass
            </CardTitle>
            <CardDescription>
              Identify what truly matters to you and plan meaningful activities aligned with your core values.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="values" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="values">My Values</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="values" className="space-y-4">
            <Alert>
              <Star className="h-4 w-4" />
              <AlertDescription>
                <strong>What are values?</strong> Values are your chosen life directions - how you want to show up in the world. Unlike goals, they can never be "completed" - they guide your actions continuously.
              </AlertDescription>
            </Alert>

            {/* Selected Values */}
            {selectedValues.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Your Core Values ({selectedValues.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedValues.map((value) => {
                    const categoryInfo = VALUE_CATEGORIES[value.category as keyof typeof VALUE_CATEGORIES];
                    const Icon = categoryInfo.icon;
                    return (
                      <div key={value.id} className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Icon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-blue-900">{value.name}</div>
                              {value.description && (
                                <p className="text-xs text-blue-700 mt-1">{value.description}</p>
                              )}
                              <Badge variant="outline" className="mt-1 text-xs">
                                {categoryInfo.label}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeValue(value.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-900"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Choose from Examples */}
            <div className="space-y-3">
              <h3 className="font-semibold">Choose Values by Category</h3>
              {(Object.keys(VALUE_CATEGORIES) as Array<keyof typeof VALUE_CATEGORIES>).map((category) => {
                const info = VALUE_CATEGORIES[category];
                const Icon = info.icon;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{info.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-7">
                      {info.examples.map((example) => {
                        const isSelected = selectedValues.some(v => v.name === example);
                        return (
                          <Button
                            key={example}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleExampleValue(example, category)}
                          >
                            {example}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Value */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold">Add Your Own Value</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="customValue">Value Name</Label>
                  <Input
                    id="customValue"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="e.g., Adventure, Courage, Balance"
                  />
                </div>
                <div>
                  <Label htmlFor="customDescription">Why is this important to you? (optional)</Label>
                  <Textarea
                    id="customDescription"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Describe what this value means to you..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="customCategory">Category</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(Object.keys(VALUE_CATEGORIES) as Array<keyof typeof VALUE_CATEGORIES>).map((cat) => {
                      const Icon = VALUE_CATEGORIES[cat].icon;
                      return (
                        <button
                          key={cat}
                          onClick={() => setCustomCategory(cat)}
                          className={`p-2 rounded border-2 text-sm flex items-center gap-2 ${
                            customCategory === cat
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="truncate">{VALUE_CATEGORIES[cat].label.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Button onClick={addCustomValue} disabled={!customValue.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {selectedValues.length === 0 ? (
              <Alert>
                <AlertDescription>
                  First, identify your core values in the "My Values" tab. Then you can plan activities aligned with them.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Add New Activity */}
                <div className="space-y-3 p-4 rounded-lg border-2 border-dashed">
                  <h3 className="font-semibold">Plan a Meaningful Activity</h3>
                  <div>
                    <Label htmlFor="newActivity">What would you like to do?</Label>
                    <Textarea
                      id="newActivity"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="e.g., Call a friend, Take a nature walk, Work on creative project"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Which values does this activity honor?</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {selectedValues.map((value) => (
                        <div key={value.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`value-${value.id}`}
                            checked={selectedValueIds.includes(value.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedValueIds([...selectedValueIds, value.id]);
                              } else {
                                setSelectedValueIds(selectedValueIds.filter(id => id !== value.id));
                              }
                            }}
                          />
                          <label htmlFor={`value-${value.id}`} className="text-sm cursor-pointer">
                            {value.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="scheduledDate">When? (optional)</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={addActivity}
                    disabled={!newActivity.trim() || selectedValueIds.length === 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>

                {/* Activity List */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Your Planned Activities ({activities.length})</h3>
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No activities planned yet. Add one above!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className={`p-3 rounded-lg border-2 ${
                            activity.completed
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={activity.completed}
                              onCheckedChange={() => toggleActivity(activity.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className={`font-medium ${
                                activity.completed ? "line-through text-muted-foreground" : ""
                              }`}>
                                {activity.activity}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {activity.linkedValues.map((valueId) => {
                                  const value = selectedValues.find(v => v.id === valueId);
                                  return value ? (
                                    <Badge key={valueId} variant="outline" className="text-xs">
                                      {value.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                              {activity.scheduledDate && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(activity.scheduledDate).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {/* Values Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Your Values Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Core values identified</span>
                      <span className="font-semibold">{selectedValues.length}</span>
                    </div>
                    {selectedValues.length === 0 ? (
                      <Alert>
                        <AlertDescription>
                          Start by identifying 3-5 core values that are most important to you right now.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-blue-300 bg-blue-50">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          You've identified {selectedValues.length} core value{selectedValues.length > 1 ? "s" : ""}. These can guide your daily decisions and activities.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Values-Aligned Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activities completed</span>
                      <span className="font-semibold">{completedActivities} / {totalActivities}</span>
                    </div>
                    {totalActivities > 0 && (
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Guidance */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Values-Based Living Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• <strong>Values ≠ Goals:</strong> Values are directions ("be more present"), goals are destinations ("meditate for 10 minutes").</p>
                  <p>• <strong>Small steps count:</strong> Any action aligned with your values matters, no matter how small.</p>
                  <p>• <strong>Review regularly:</strong> Values can shift over time. Revisit your compass every few months.</p>
                  <p>• <strong>When stuck, ask:</strong> "What would I do right now if I was living according to my values?"</p>
                  <p>• <strong>Self-compassion:</strong> You won't always act in line with values - that's human. What matters is noticing and returning.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

