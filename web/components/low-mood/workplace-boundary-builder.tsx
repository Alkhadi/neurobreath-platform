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
import { Shield, Clock, Mail, Phone, Home, Briefcase, Plus, Check, AlertCircle } from "lucide-react";

interface Boundary {
  id: string;
  category: "time" | "communication" | "tasks" | "emotional" | "physical";
  boundary: string;
  reason: string;
  communicationScript?: string;
  implemented: boolean;
  createdAt: string;
}

const BOUNDARY_CATEGORIES = {
  time: {
    icon: Clock,
    label: "Time Boundaries",
    color: "bg-blue-100 text-blue-800",
    examples: [
      "No work emails after 7pm",
      "Lunch break is protected time",
      "No weekend work unless emergency",
      "Leave work on time 3 days per week",
    ],
  },
  communication: {
    icon: Mail,
    label: "Communication Boundaries",
    color: "bg-green-100 text-green-800",
    examples: [
      "Turn off work notifications after hours",
      "Don't respond to non-urgent messages immediately",
      "Set 'out of office' when on leave",
      "Batch process emails at set times",
    ],
  },
  tasks: {
    icon: Briefcase,
    label: "Task & Workload Boundaries",
    color: "bg-purple-100 text-purple-800",
    examples: [
      "Say no to non-essential projects",
      "Delegate tasks when possible",
      "Don't take on others' responsibilities",
      "Set realistic deadlines",
    ],
  },
  emotional: {
    icon: Shield,
    label: "Emotional Boundaries",
    color: "bg-amber-100 text-amber-800",
    examples: [
      "Don't take work stress home",
      "Separate work identity from personal identity",
      "Not responsible for others' emotions",
      "Practice emotional detachment from work drama",
    ],
  },
  physical: {
    icon: Home,
    label: "Physical Boundaries",
    color: "bg-rose-100 text-rose-800",
    examples: [
      "Dedicated workspace at home",
      "Take regular breaks to move",
      "Don't work from bed",
      "Physically leave work building during breaks",
    ],
  },
};

const SCRIPT_TEMPLATES = {
  time: [
    "I've made a commitment to maintain work-life balance by finishing at [time]. I'll pick this up first thing tomorrow.",
    "I'm not available after [time] for work matters. Is this something that can wait until tomorrow?",
    "I need to protect my lunch break for my wellbeing. Can we schedule this for another time?",
  ],
  communication: [
    "I'm implementing a new system where I check emails at [specific times]. I'll respond to your message during my next check-in.",
    "I'm focusing on reducing interruptions. Could you please send this via email so I can address it properly?",
    "I'm currently unavailable. If this is urgent, please contact [alternative person/method].",
  ],
  tasks: [
    "I'd like to help, but I'm at capacity right now. Can we discuss prioritising my current workload first?",
    "I don't have the bandwidth to take this on and maintain quality. Could we explore other options?",
    "This isn't within my role responsibilities. Perhaps [appropriate person] would be better suited?",
  ],
  emotional: [
    "I understand this is frustrating, but I need to focus on solutions rather than venting.",
    "I'm keeping work and personal matters separate for my mental health.",
    "I care about the work, but I'm learning not to take things personally.",
  ],
  physical: [
    "I'm taking my full break time to recharge - I'll be back at [time].",
    "I've set up a dedicated workspace to help me separate work and personal life.",
    "I need to step away from my desk for a few minutes to stay productive.",
  ],
};

export function WorkplaceBoundaryBuilder() {
  const [boundaries, setBoundaries] = useLocalStorage<Boundary[]>("workplace_boundaries", []);
  const [category, setCategory] = useState<keyof typeof BOUNDARY_CATEGORIES>("time");
  const [boundaryText, setBoundaryText] = useState("");
  const [reason, setReason] = useState("");
  const [script, setScript] = useState("");
  const [showScriptBuilder, setShowScriptBuilder] = useState(false);

  const addBoundary = () => {
    if (!boundaryText.trim()) return;

    const newBoundary: Boundary = {
      id: Date.now().toString(),
      category,
      boundary: boundaryText,
      reason,
      communicationScript: script || undefined,
      implemented: false,
      createdAt: new Date().toISOString(),
    };

    setBoundaries([...boundaries, newBoundary]);
    setBoundaryText("");
    setReason("");
    setScript("");
    setShowScriptBuilder(false);
  };

  const toggleImplemented = (id: string) => {
    setBoundaries(
      boundaries.map(b =>
        b.id === id ? { ...b, implemented: !b.implemented } : b
      )
    );
  };

  const deleteBoundary = (id: string) => {
    setBoundaries(boundaries.filter(b => b.id !== id));
  };

  const implementedCount = boundaries.filter(b => b.implemented).length;
  const totalCount = boundaries.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              Workplace Boundary Builder
            </CardTitle>
            <CardDescription>
              Set and protect healthy boundaries to prevent burnout and maintain work-life balance.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="build" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="build">Build Boundaries</TabsTrigger>
            <TabsTrigger value="my-boundaries">My Boundaries ({totalCount})</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="space-y-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Boundary Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(Object.keys(BOUNDARY_CATEGORIES) as Array<keyof typeof BOUNDARY_CATEGORIES>).map((cat) => {
                  const catInfo = BOUNDARY_CATEGORIES[cat];
                  const Icon = catInfo.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        category === cat
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{catInfo.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-2">
              <Label>Examples (click to use)</Label>
              <div className="flex flex-wrap gap-2">
                {BOUNDARY_CATEGORIES[category].examples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setBoundaryText(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            {/* Boundary Text */}
            <div className="space-y-2">
              <Label htmlFor="boundaryText">Your Boundary</Label>
              <Textarea
                id="boundaryText"
                value={boundaryText}
                onChange={(e) => setBoundaryText(e.target.value)}
                placeholder="e.g., I will not check work emails after 8pm"
                rows={2}
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Why is this boundary important? (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., I need evening time to recharge and spend with family"
                rows={2}
              />
            </div>

            {/* Communication Script Builder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Communication Script (optional)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowScriptBuilder(!showScriptBuilder)}
                >
                  {showScriptBuilder ? "Hide" : "Create Script"}
                </Button>
              </div>
              {showScriptBuilder && (
                <div className="space-y-3 p-3 rounded-lg border bg-gray-50">
                  <p className="text-sm text-muted-foreground">
                    Having a prepared script makes it easier to communicate your boundary clearly and confidently.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-xs">Template examples:</Label>
                    <div className="space-y-1">
                      {SCRIPT_TEMPLATES[category].map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => setScript(template)}
                          className="block w-full text-left p-2 rounded border bg-white hover:bg-gray-50 text-xs"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Write or edit your communication script..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            <Button onClick={addBoundary} disabled={!boundaryText.trim()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Boundary
            </Button>
          </TabsContent>

          <TabsContent value="my-boundaries" className="space-y-4">
            {boundaries.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You haven't created any boundaries yet. Start building them in the "Build Boundaries" tab.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Implementation Progress</span>
                    <span className="text-muted-foreground">
                      {implementedCount} / {totalCount} boundaries active
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${totalCount > 0 ? (implementedCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Boundaries List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {boundaries.map((boundary) => {
                    const catInfo = BOUNDARY_CATEGORIES[boundary.category];
                    const Icon = catInfo.icon;
                    return (
                      <div
                        key={boundary.id}
                        className={`p-4 rounded-lg border-2 ${
                          boundary.implemented
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={boundary.implemented}
                            onCheckedChange={() => toggleImplemented(boundary.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <Badge className={`${catInfo.color} mb-2`}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {catInfo.label}
                                </Badge>
                                <p className={`font-medium ${
                                  boundary.implemented ? "text-green-900" : ""
                                }`}>
                                  {boundary.boundary}
                                </p>
                                {boundary.reason && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    <strong>Why:</strong> {boundary.reason}
                                  </p>
                                )}
                                {boundary.communicationScript && (
                                  <div className="mt-2 p-2 rounded bg-blue-50 border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-900 mb-1">
                                      📝 Communication Script:
                                    </p>
                                    <p className="text-xs text-blue-800">
                                      "{boundary.communicationScript}"
                                    </p>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteBoundary(boundary.id)}
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Alert className="border-purple-300 bg-purple-50">
              <Shield className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-900">
                <strong>Remember:</strong> Boundaries are not selfish - they're essential for sustainable work performance and preventing burnout.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How to Implement Boundaries Successfully</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold mb-1">1. Start Small</p>
                  <p className="text-muted-foreground">
                    Begin with one or two boundaries. Trying to change everything at once can be overwhelming.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">2. Be Clear and Specific</p>
                  <p className="text-muted-foreground">
                    Vague boundaries are hard to maintain. "I'll try to work less" becomes "I stop work at 6pm on weekdays."
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">3. Communicate Assertively</p>
                  <p className="text-muted-foreground">
                    Use "I" statements. "I need to leave by 5:30pm" rather than apologetic explanations.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">4. Expect Pushback Initially</p>
                  <p className="text-muted-foreground">
                    Others may be used to your availability. Stay firm - consistency is key.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">5. Use Technology</p>
                  <p className="text-muted-foreground">
                    Set auto-replies, schedule emails, turn off notifications, use "Do Not Disturb" features.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">6. Review and Adjust</p>
                  <p className="text-muted-foreground">
                    Check in weekly - are your boundaries working? Do they need tweaking?
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">7. Model the Behavior</p>
                  <p className="text-muted-foreground">
                    If you manage others, demonstrate healthy boundaries. Don't send emails at midnight.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Common Boundary Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>"I feel guilty:"</strong> Guilt is common but remember - you can't pour from an empty cup. Your wellbeing enables better work.
                </p>
                <p>
                  <strong>"My manager won't respect it:"</strong> Document your boundaries professionally. If violated repeatedly, escalate to HR or consider if this workplace aligns with your values.
                </p>
                <p>
                  <strong>"I'll miss out/fall behind:"</strong> Boundaries actually improve productivity by preventing burnout. Quality over quantity.
                </p>
                <p>
                  <strong>"It's just my personality:"</strong> Boundaries can be learned. They're skills, not fixed traits.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

