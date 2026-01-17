"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, TrendingUp, Flame, Shield } from "lucide-react";

interface AssessmentResult {
  date: string;
  totalScore: number;
  severity: "low" | "moderate" | "high" | "severe";
}

type EnergyEntry = { currentEnergy?: number };
type ValueEntry = unknown;
type BoundaryEntry = { implemented?: boolean };

export function BurnoutProgressDashboard() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [energyData, setEnergyData] = useState<EnergyEntry[]>([]);
  const [values, setValues] = useState<ValueEntry[]>([]);
  const [boundaries, setBoundaries] = useState<BoundaryEntry[]>([]);

  useEffect(() => {
    try {
      const storedAssessments = JSON.parse(localStorage.getItem("burnout_assessments") || "[]");
      const storedEnergy = JSON.parse(localStorage.getItem("energy_accounting_data") || "[]");
      const storedValues = JSON.parse(localStorage.getItem("values_compass") || "[]");
      const storedBoundaries = JSON.parse(localStorage.getItem("workplace_boundaries") || "[]");

      setAssessments(Array.isArray(storedAssessments) ? (storedAssessments as AssessmentResult[]) : []);
      setEnergyData(Array.isArray(storedEnergy) ? (storedEnergy as EnergyEntry[]) : []);
      setValues(Array.isArray(storedValues) ? (storedValues as ValueEntry[]) : []);
      setBoundaries(Array.isArray(storedBoundaries) ? (storedBoundaries as BoundaryEntry[]) : []);
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  }, []);

  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
  const implementedBoundaries = boundaries.filter(b => b.implemented).length;
  const avgEnergy = energyData.length > 0 
    ? Math.round(energyData.reduce((sum, d) => sum + (d.currentEnergy || 100), 0) / energyData.length)
    : 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Flame className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {latestAssessment ? latestAssessment.totalScore : "—"}
                {latestAssessment && "%"}
              </div>
              <div className="text-xs text-muted-foreground">Burnout Level</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Battery className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{avgEnergy}%</div>
              <div className="text-xs text-muted-foreground">Avg Energy</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{implementedBoundaries}</div>
              <div className="text-xs text-muted-foreground">Boundaries Set</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{values.length}</div>
              <div className="text-xs text-muted-foreground">Core Values</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Assessment History */}
      {assessments.length > 0 && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Assessment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {assessments.slice(-5).reverse().map((assessment, idx) => {
                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case "low": return "bg-green-100 text-green-800";
                    case "moderate": return "bg-yellow-100 text-yellow-800";
                    case "high": return "bg-orange-100 text-orange-800";
                    case "severe": return "bg-red-100 text-red-800";
                    default: return "";
                  }
                };

                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border">
                    <span className="text-sm">
                      {new Date(assessment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{assessment.totalScore}%</span>
                      <Badge className={getSeverityColor(assessment.severity)}>
                        {assessment.severity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tips */}
      <Card className="bg-blue-50 border-blue-200 p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg">Recovery Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2 text-sm">
          <p>• <strong>Consistency matters:</strong> Regular use of these tools compounds over time.</p>
          <p>• <strong>Track patterns:</strong> Notice which activities drain vs. restore your energy.</p>
          <p>• <strong>Set boundaries early:</strong> Don't wait until you're exhausted.</p>
          <p>• <strong>Values alignment:</strong> Small actions toward your values add meaning.</p>
          <p>• <strong>Seek support:</strong> Consider professional help if burnout is severe.</p>
        </CardContent>
      </Card>
    </div>
  );
}

