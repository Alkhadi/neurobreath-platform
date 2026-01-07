"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClipboardList, AlertCircle, TrendingUp, CheckCircle2, Info } from "lucide-react";
import { format } from "date-fns";

interface AssessmentQuestion {
  id: string;
  question: string;
  dimension: "exhaustion" | "cynicism" | "efficacy";
}

interface AssessmentResult {
  date: string;
  scores: {
    exhaustion: number;
    cynicism: number;
    efficacy: number;
  };
  totalScore: number;
  severity: "low" | "moderate" | "high" | "severe";
}

const QUESTIONS: AssessmentQuestion[] = [
  // Emotional Exhaustion (7 questions)
  { id: "ex1", question: "I feel emotionally drained from my work", dimension: "exhaustion" },
  { id: "ex2", question: "I feel used up at the end of the workday", dimension: "exhaustion" },
  { id: "ex3", question: "I feel fatigued when I get up in the morning and have to face another day", dimension: "exhaustion" },
  { id: "ex4", question: "Working all day is really a strain for me", dimension: "exhaustion" },
  { id: "ex5", question: "I feel burned out from my work", dimension: "exhaustion" },
  { id: "ex6", question: "I feel frustrated by my work", dimension: "exhaustion" },
  { id: "ex7", question: "I feel I'm working too hard", dimension: "exhaustion" },
  
  // Cynicism/Depersonalisation (6 questions)
  { id: "cy1", question: "I have become more cynical about whether my work contributes anything", dimension: "cynicism" },
  { id: "cy2", question: "I have lost enthusiasm for my work", dimension: "cynicism" },
  { id: "cy3", question: "I doubt the significance of my work", dimension: "cynicism" },
  { id: "cy4", question: "I just want to do my job and not be bothered", dimension: "cynicism" },
  { id: "cy5", question: "I feel disconnected from my colleagues or clients", dimension: "cynicism" },
  { id: "cy6", question: "I have become less interested in my work since I started this job", dimension: "cynicism" },
  
  // Professional Efficacy (reversed - 6 questions)
  { id: "ef1", question: "I can effectively solve problems that arise in my work", dimension: "efficacy" },
  { id: "ef2", question: "I feel I am making an effective contribution to the organisation", dimension: "efficacy" },
  { id: "ef3", question: "In my opinion, I am good at my job", dimension: "efficacy" },
  { id: "ef4", question: "I feel exhilarated when I accomplish something at work", dimension: "efficacy" },
  { id: "ef5", question: "I have accomplished many worthwhile things in this job", dimension: "efficacy" },
  { id: "ef6", question: "At my work, I feel confident that I am effective", dimension: "efficacy" },
];

const FREQUENCY_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "A few times a year" },
  { value: 2, label: "Once a month" },
  { value: 3, label: "A few times a month" },
  { value: 4, label: "Once a week" },
  { value: 5, label: "A few times a week" },
  { value: 6, label: "Every day" },
];

export function BurnoutAssessment() {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useLocalStorage<AssessmentResult[]>("burnout_assessments", []);

  const currentQuestion = QUESTIONS.findIndex(q => responses[q.id] === undefined);
  const isComplete = Object.keys(responses).length === QUESTIONS.length;

  const calculateScores = () => {
    let exhaustionScore = 0;
    let cynicismScore = 0;
    let efficacyScore = 0;

    QUESTIONS.forEach(q => {
      const response = responses[q.id] || 0;
      if (q.dimension === "exhaustion") {
        exhaustionScore += response;
      } else if (q.dimension === "cynicism") {
        cynicismScore += response;
      } else if (q.dimension === "efficacy") {
        // Efficacy questions are reversed - lower scores indicate problems
        efficacyScore += (6 - response);
      }
    });

    // Normalize to percentages
    const exhaustionPercent = Math.round((exhaustionScore / 42) * 100); // 7 questions * 6 max
    const cynicismPercent = Math.round((cynicismScore / 36) * 100); // 6 questions * 6 max
    const efficacyPercent = Math.round((efficacyScore / 36) * 100); // 6 questions * 6 max (reversed)

    const totalScore = Math.round((exhaustionPercent + cynicismPercent + efficacyPercent) / 3);

    let severity: "low" | "moderate" | "high" | "severe";
    if (totalScore < 25) severity = "low";
    else if (totalScore < 50) severity = "moderate";
    else if (totalScore < 75) severity = "high";
    else severity = "severe";

    return {
      exhaustion: exhaustionPercent,
      cynicism: cynicismPercent,
      efficacy: efficacyPercent,
      totalScore,
      severity,
    };
  };

  const saveAssessment = () => {
    const scores = calculateScores();
    const result: AssessmentResult = {
      date: new Date().toISOString(),
      scores: {
        exhaustion: scores.exhaustion,
        cynicism: scores.cynicism,
        efficacy: scores.efficacy,
      },
      totalScore: scores.totalScore,
      severity: scores.severity,
    };
    setAssessmentHistory([...assessmentHistory, result]);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setResponses({});
    setShowResults(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-600 bg-green-50 border-green-300";
      case "moderate": return "text-yellow-600 bg-yellow-50 border-yellow-300";
      case "high": return "text-orange-600 bg-orange-50 border-orange-300";
      case "severe": return "text-red-600 bg-red-50 border-red-300";
      default: return "";
    }
  };

  const getDimensionInfo = (dimension: string) => {
    switch (dimension) {
      case "exhaustion":
        return {
          title: "Emotional Exhaustion",
          description: "Feeling emotionally drained and depleted",
          color: "bg-red-100 text-red-800",
        };
      case "cynicism":
        return {
          title: "Cynicism & Detachment",
          description: "Negative attitudes and emotional distance from work",
          color: "bg-orange-100 text-orange-800",
        };
      case "efficacy":
        return {
          title: "Reduced Efficacy",
          description: "Decreased sense of accomplishment and competence",
          color: "bg-amber-100 text-amber-800",
        };
      default:
        return { title: "", description: "", color: "" };
    }
  };

  if (showResults) {
    const scores = calculateScores();
    const latestResult = assessmentHistory[assessmentHistory.length - 1];

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Your Burnout Assessment Results
          </CardTitle>
          <CardDescription>
            Based on the Maslach Burnout Inventory framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Overall Burnout Level</h3>
              <Badge className={`${getSeverityColor(scores.severity)} text-lg px-4 py-1`}>
                {scores.severity.toUpperCase()}
              </Badge>
            </div>
            <Progress value={scores.totalScore} className="h-4" />
            <p className="text-sm text-muted-foreground">
              Your overall burnout score: <strong>{scores.totalScore}%</strong>
            </p>
          </div>

          {/* Dimension Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold">Burnout Dimensions</h3>
            {(["exhaustion", "cynicism", "efficacy"] as const).map((dim) => {
              const info = getDimensionInfo(dim);
              const score = dim === "exhaustion" ? scores.exhaustion : dim === "cynicism" ? scores.cynicism : scores.efficacy;
              return (
                <div key={dim} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{info.title}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                    <Badge className={info.color}>{score}%</Badge>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              );
            })}
          </div>

          {/* Interpretation */}
          <Alert className={getSeverityColor(scores.severity)}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>What This Means</AlertTitle>
            <AlertDescription className="space-y-2">
              {scores.severity === "low" && (
                <p>Your burnout levels are currently low. You're managing workplace stress relatively well. Continue your self-care practices and maintain healthy boundaries.</p>
              )}
              {scores.severity === "moderate" && (
                <p>You're experiencing moderate burnout symptoms. This is a good time to implement recovery strategies before symptoms worsen. Focus on work-life boundaries, energy management, and stress reduction techniques.</p>
              )}
              {scores.severity === "high" && (
                <p>You're experiencing significant burnout. It's important to take action now. Consider speaking with your GP, accessing workplace support, and implementing recovery strategies. Use the tools on this page to help manage symptoms.</p>
              )}
              {scores.severity === "severe" && (
                <p><strong>You're experiencing severe burnout.</strong> We strongly recommend speaking with your GP or a mental health professional. Consider taking time off work if possible, and access professional support. You may benefit from CBT, counselling, or other therapeutic interventions.</p>
              )}
            </AlertDescription>
          </Alert>

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="font-semibold">Recommended Actions</h3>
            <div className="space-y-2 text-sm">
              {scores.exhaustion >= 50 && (
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <strong>Address emotional exhaustion:</strong> Use the Energy Accounting Tracker to manage your daily energy. Prioritise rest breaks and restorative activities.
                  </div>
                </div>
              )}
              {scores.cynicism >= 50 && (
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <strong>Reconnect with meaning:</strong> Use the Values Compass to identify what matters to you and engage in meaningful activities aligned with your values.
                  </div>
                </div>
              )}
              {scores.efficacy >= 50 && (
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <strong>Rebuild confidence:</strong> Start with small, achievable tasks. Track wins and accomplishments. Consider behavioural activation approaches.
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <strong>Set boundaries:</strong> Use the Workplace Boundary Builder to establish healthy work-life separation.
                </div>
              </div>
              {scores.totalScore >= 50 && (
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <strong>Seek professional support:</strong> Consider speaking with your GP, accessing NHS talking therapies, or workplace counselling services.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {assessmentHistory.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Assessment History</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {assessmentHistory.slice(-5).reverse().map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm">{format(new Date(result.date), "d MMM yyyy, h:mm a")}</span>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.totalScore}% - {result.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={resetAssessment} className="flex-1">
              Take Assessment Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-600" />
          Burnout Self-Assessment
        </CardTitle>
        <CardDescription>
          A scientifically-validated tool based on the Maslach Burnout Inventory. Answer honestly about your experiences over the past month.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This assessment covers three dimensions: <strong>Emotional Exhaustion</strong>, <strong>Cynicism/Detachment</strong>, and <strong>Professional Efficacy</strong>. It takes about 5 minutes to complete.
          </AlertDescription>
        </Alert>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {Object.keys(responses).length} / {QUESTIONS.length}
            </span>
          </div>
          <Progress value={(Object.keys(responses).length / QUESTIONS.length) * 100} />
        </div>

        {/* Current Question */}
        {currentQuestion < QUESTIONS.length ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                  {currentQuestion + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg mb-1">
                    {QUESTIONS[currentQuestion].question}
                  </p>
                  <Badge className={getDimensionInfo(QUESTIONS[currentQuestion].dimension).color}>
                    {getDimensionInfo(QUESTIONS[currentQuestion].dimension).title}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>How often do you experience this?</Label>
              <RadioGroup
                value={responses[QUESTIONS[currentQuestion].id]?.toString()}
                onValueChange={(value) => {
                  setResponses({
                    ...responses,
                    [QUESTIONS[currentQuestion].id]: parseInt(value),
                  });
                }}
              >
                {FREQUENCY_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="cursor-pointer font-normal">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {responses[QUESTIONS[currentQuestion].id] !== undefined && currentQuestion < QUESTIONS.length - 1 && (
              <Button
                onClick={() => {
                  // Just update the UI to show next question
                  const nextQ = QUESTIONS.findIndex(q => responses[q.id] === undefined);
                  if (nextQ !== -1) {
                    // Scroll to top of card
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="w-full"
              >
                Next Question
              </Button>
            )}
          </div>
        ) : null}

        {/* Submit */}
        {isComplete && (
          <div className="space-y-4">
            <Alert className="border-green-300 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Assessment Complete</AlertTitle>
              <AlertDescription className="text-green-800">
                You've answered all questions. Click below to see your results and personalised recommendations.
              </AlertDescription>
            </Alert>
            <Button onClick={saveAssessment} className="w-full" size="lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              View My Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

