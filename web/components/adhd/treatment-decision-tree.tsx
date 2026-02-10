'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { 
  getRecommendedInterventions,
  getInterventionWithSources 
} from '@/lib/data/adhd-evidence-registry';

type AgeGroup = 'preschool' | 'school_age' | 'adolescent' | 'adult';

interface DecisionStep {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    value: string;
    icon?: string;
    description?: string;
  }[];
}

const AGE_GROUPS = [
  { value: 'preschool', label: 'Preschool (4-6 years)', icon: '👶', description: 'Young children ages 4-6' },
  { value: 'school_age', label: 'School Age (7-12 years)', icon: '🎒', description: 'Elementary/primary school' },
  { value: 'adolescent', label: 'Adolescent (13-17 years)', icon: '🧑', description: 'Teenagers and young adults' },
  { value: 'adult', label: 'Adult (18+ years)', icon: '👤', description: 'Adults 18 and older' }
];

const SYMPTOM_SEVERITY = [
  { value: 'mild', label: 'Mild', icon: '🟢', description: 'Some impairment in 1-2 settings' },
  { value: 'moderate', label: 'Moderate', icon: '🟡', description: 'Significant impairment in 2+ settings' },
  { value: 'severe', label: 'Severe', icon: '🔴', description: 'Severe impairment in multiple settings' }
];

const TREATMENT_GOALS = [
  { value: 'symptom_reduction', label: 'Reduce Core Symptoms', icon: '🎯' },
  { value: 'academic', label: 'Improve Academic Performance', icon: '📚' },
  { value: 'social', label: 'Enhance Social Skills', icon: '🤝' },
  { value: 'executive_function', label: 'Improve Organization/Planning', icon: '🧠' },
  { value: 'workplace', label: 'Workplace Success', icon: '💼' },
  { value: 'emotional', label: 'Emotional Regulation', icon: '❤️' }
];

export function TreatmentDecisionTree() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  type Intervention = ReturnType<typeof getRecommendedInterventions>[number];
  type Source = NonNullable<ReturnType<typeof getInterventionWithSources>>['sources'][number];

  const steps: DecisionStep[] = [
    {
      id: 'age',
      question: 'What is the age of the person with ADHD?',
      description: 'Treatment approaches vary significantly by age group',
      options: AGE_GROUPS
    },
    {
      id: 'severity',
      question: 'What is the severity of ADHD symptoms?',
      description: 'Based on DSM-5 criteria and functional impairment',
      options: SYMPTOM_SEVERITY
    },
    {
      id: 'goal',
      question: 'What is the primary treatment goal?',
      description: 'Select the most important area to address',
      options: TREATMENT_GOALS
    }
  ];

  const handleSelection = (stepId: string, value: string) => {
    setSelections({ ...selections, [stepId]: value });
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowResults(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelections({});
    setShowResults(false);
  };

  const getRecommendations = () => {
    const ageGroup = selections.age as AgeGroup;
    const severity = selections.severity;
    const goal = selections.goal;

    const recommendedInterventions = getRecommendedInterventions(ageGroup);

    // Generate recommendations based on selections
    const recommendations = {
      firstLine: [] as Intervention[],
      additional: [] as Intervention[],
      guidelines: [] as string[]
    };

    // Age-specific first-line recommendations
    if (ageGroup === 'preschool') {
      recommendations.guidelines.push('NICE NG87: Parent training in behavior management is FIRST-LINE for ages 4-6');
      recommendations.guidelines.push('AAP 2019: Behavioral interventions before medication for preschool children');
      
      const ptbm = recommendedInterventions.find(i => i.id === 'behav_parent_training');
      if (ptbm) recommendations.firstLine.push(ptbm);
      
      if (severity === 'severe') {
        recommendations.guidelines.push('Methylphenidate may be considered if behavioral interventions insufficient (NICE NG87)');
        const meth = recommendedInterventions.find(i => i.id === 'med_methylphenidate_children');
        if (meth) recommendations.additional.push(meth);
      }
    } else if (ageGroup === 'school_age' || ageGroup === 'adolescent') {
      recommendations.guidelines.push('NICE NG87 & AAP 2019: Combined medication + behavioral therapy recommended');
      
      const meth = recommendedInterventions.find(i => i.id === 'med_methylphenidate_children');
      const behavioral = recommendedInterventions.find(i => i.id === 'behav_classroom_interventions');
      if (meth) recommendations.firstLine.push(meth);
      if (behavioral) recommendations.firstLine.push(behavioral);
      
      if (goal === 'academic') {
        const iep = recommendedInterventions.find(i => i.id === 'edu_iep_504_plans');
        if (iep) recommendations.additional.push(iep);
      }
      
      if (goal === 'executive_function') {
        const ef = recommendedInterventions.find(i => i.id === 'behav_executive_function_training');
        if (ef) recommendations.additional.push(ef);
      }
      
      if (goal === 'social' || goal === 'emotional') {
        const physical = recommendedInterventions.find(i => i.id === 'lifestyle_physical_activity');
        if (physical) recommendations.additional.push(physical);
      }
    } else if (ageGroup === 'adult') {
      recommendations.guidelines.push('CDC & Meta-analysis (PMID 30097390): Amphetamines preferred first-choice for adults');
      recommendations.guidelines.push('CBT effective with or without medication (PMID 36794797)');
      
      const amph = recommendedInterventions.find(i => i.id === 'med_amphetamines_adults');
      const cbt = recommendedInterventions.find(i => i.id === 'behav_cbt_adults');
      if (amph) recommendations.firstLine.push(amph);
      if (cbt) recommendations.firstLine.push(cbt);
      
      if (goal === 'workplace') {
        const env = recommendedInterventions.find(i => i.id === 'workplace_environmental_mods');
        const time = recommendedInterventions.find(i => i.id === 'workplace_time_structure');
        if (env) recommendations.additional.push(env);
        if (time) recommendations.additional.push(time);
        recommendations.guidelines.push('UK Equality Act 2010 / US ADA: Reasonable workplace adjustments required by law');
      }
    }

    return recommendations;
  };

  const currentStepData = steps[currentStep];

  if (showResults) {
    const recommendations = getRecommendations();
    const ageGroup = AGE_GROUPS.find(a => a.value === selections.age);
    const severity = SYMPTOM_SEVERITY.find(s => s.value === selections.severity);
    const goal = TREATMENT_GOALS.find(g => g.value === selections.goal);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Treatment Recommendations</h2>
            <p className="text-muted-foreground">Evidence-based guidance from NICE NG87, AAP, CDC, and PubMed</p>
          </div>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Start Over
          </Button>
        </div>

        {/* Selections Summary */}
        <Card className="border-2 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Your Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Age Group</div>
                <Badge variant="secondary" className="gap-1">
                  <span>{ageGroup?.icon}</span>
                  {ageGroup?.label}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Severity</div>
                <Badge variant="secondary" className="gap-1">
                  <span>{severity?.icon}</span>
                  {severity?.label}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Primary Goal</div>
                <Badge variant="secondary" className="gap-1">
                  <span>{goal?.icon}</span>
                  {goal?.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        {recommendations.guidelines.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold text-foreground">Clinical Guidelines:</div>
                <ul className="space-y-1 text-sm">
                  {recommendations.guidelines.map((guideline, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* First-Line Treatments */}
        {recommendations.firstLine.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold">First-Line Treatments (STRONG Evidence)</h3>
            </div>
            <div className="grid gap-4">
              {recommendations.firstLine.map((intervention) => {
                const details = getInterventionWithSources(intervention.id);
                return (
                  <Card key={intervention.id} className="border-2 border-green-200 bg-green-50/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{intervention.intervention}</CardTitle>
                        <Badge className="bg-green-600">{intervention.category}</Badge>
                      </div>
                      <CardDescription>{intervention.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold mb-1">Effectiveness:</div>
                        <p className="text-sm text-muted-foreground">{intervention.effectiveness}</p>
                      </div>
                      {details?.sources && details.sources.length > 0 && (
                        <div>
                          <div className="text-sm font-semibold mb-2">Evidence Sources:</div>
                          <div className="space-y-1">
                            {details.sources.map((source: Source) => (
                              <div key={source.id} className="text-xs">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                  {source.organization} ({source.country})
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Treatments */}
        {recommendations.additional.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Additional Recommended Interventions</h3>
            <div className="grid gap-4">
              {recommendations.additional.map((intervention) => (
                <Card key={intervention.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{intervention.intervention}</CardTitle>
                      <Badge variant="outline">{intervention.evidenceLevel}</Badge>
                    </div>
                    <CardDescription>{intervention.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{intervention.effectiveness}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Important Notes */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This tool provides evidence-based guidance only. Always consult
            qualified healthcare professionals (psychiatrist, pediatrician, or ADHD specialist) for
            proper diagnosis and personalized treatment planning. NICE NG87 requires diagnosis by
            specialist healthcare professionals with ADHD expertise.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">ADHD Treatment Decision Tree</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Get evidence-based treatment recommendations from NICE NG87, AAP 2019, CDC, and PubMed research
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                idx < currentStep
                  ? 'bg-green-600 text-white'
                  : idx === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx < currentStep ? <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> : idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 ${
                idx < currentStep ? 'bg-green-600' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <Card className="border-2">
        <CardHeader className="space-y-1 sm:space-y-2 pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl md:text-2xl leading-tight">{currentStepData.question}</CardTitle>
          {currentStepData.description && (
            <CardDescription className="text-sm sm:text-base">{currentStepData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:gap-3 grid-cols-1">
            {currentStepData.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="h-auto py-3 sm:py-4 px-3 sm:px-4 md:px-6 justify-start text-left hover:border-primary hover:bg-primary/5 min-h-[3.5rem] sm:min-h-[4rem]"
                onClick={() => handleSelection(currentStepData.id, option.value)}
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full">
                  {option.icon && <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0 mt-0.5 sm:mt-0">{option.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs sm:text-sm md:text-base break-words leading-tight">{option.label}</div>
                    {option.description && (
                      <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground break-words mt-0.5">{option.description}</div>
                    )}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0 mt-1 sm:mt-0" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-1.5 sm:gap-2 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Back</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleReset}
          className="gap-1.5 sm:gap-2 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4"
        >
          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
