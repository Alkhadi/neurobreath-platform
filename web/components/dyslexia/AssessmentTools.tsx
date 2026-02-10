'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ClipboardCheck, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

type AgeGroup = 'preschool' | 'primary' | 'secondary' | 'adult';
type Answer = 'never' | 'sometimes' | 'often' | 'always';

interface Question {
  id: string;
  text: string;
  category: string;
}

const questions: Record<AgeGroup, Question[]> = {
  preschool: [
    { id: 'p1', text: 'Has delayed speech development or mispronounces words', category: 'speech' },
    { id: 'p2', text: 'Struggles to learn nursery rhymes or recognize rhyming words', category: 'phonological' },
    { id: 'p3', text: 'Has difficulty learning letter names or sounds', category: 'literacy' },
    { id: 'p4', text: 'Struggles with sequencing (e.g., days of week, counting)', category: 'memory' },
    { id: 'p5', text: 'Finds it hard to follow multi-step instructions', category: 'processing' },
    { id: 'p6', text: 'Has trouble remembering names of familiar objects', category: 'memory' },
    { id: 'p7', text: 'Shows little interest in books or letters', category: 'literacy' },
    { id: 'p8', text: 'Struggles to copy patterns or shapes', category: 'visual' },
  ],
  primary: [
    { id: 's1', text: 'Reads significantly below grade level', category: 'reading' },
    { id: 's2', text: 'Has difficulty sounding out unfamiliar words', category: 'phonics' },
    { id: 's3', text: 'Confuses similar-looking letters (b/d, p/q)', category: 'visual' },
    { id: 's4', text: 'Spells the same word differently in the same piece of work', category: 'spelling' },
    { id: 's5', text: 'Struggles to remember what was just read', category: 'comprehension' },
    { id: 's6', text: 'Avoids reading aloud', category: 'reading' },
    { id: 's7', text: 'Takes a long time to complete homework involving reading/writing', category: 'processing' },
    { id: 's8', text: 'Has difficulty learning times tables or sequences', category: 'memory' },
    { id: 's9', text: 'Struggles to organize thoughts for writing', category: 'writing' },
    { id: 's10', text: 'Finds it hard to copy from the board', category: 'visual' },
  ],
  secondary: [
    { id: 't1', text: 'Reads slowly and finds reading tiring', category: 'reading' },
    { id: 't2', text: 'Frequently misspells common words', category: 'spelling' },
    { id: 't3', text: 'Prefers to listen to information rather than read it', category: 'reading' },
    { id: 't4', text: 'Has difficulty summarizing what was read', category: 'comprehension' },
    { id: 't5', text: 'Struggles with essay planning and structure', category: 'writing' },
    { id: 't6', text: 'Has poor time management and organization skills', category: 'executive' },
    { id: 't7', text: 'Finds learning foreign languages particularly challenging', category: 'language' },
    { id: 't8', text: 'Has difficulty following complex verbal instructions', category: 'processing' },
    { id: 't9', text: 'Confuses similar-sounding words', category: 'phonological' },
    { id: 't10', text: 'Takes longer than peers to complete written work', category: 'processing' },
  ],
  adult: [
    { id: 'a1', text: 'Avoids tasks involving reading and writing', category: 'reading' },
    { id: 'a2', text: 'Reads slowly and needs to re-read text multiple times', category: 'reading' },
    { id: 'a3', text: 'Has difficulty with spelling, even common words', category: 'spelling' },
    { id: 'a4', text: 'Struggles to take notes effectively', category: 'writing' },
    { id: 'a5', text: 'Has poor time management despite efforts to organize', category: 'executive' },
    { id: 'a6', text: 'Finds it hard to learn new procedures or systems at work', category: 'learning' },
    { id: 'a7', text: 'Experiences anxiety about reading aloud or presenting', category: 'emotional' },
    { id: 'a8', text: 'Has difficulty following written instructions', category: 'comprehension' },
    { id: 'a9', text: 'Confuses left and right or has directional difficulties', category: 'spatial' },
    { id: 'a10', text: 'Relies heavily on spell-check and grammar tools', category: 'spelling' },
  ],
};

const scoreInterpretation = {
  low: {
    title: 'Low Likelihood',
    description: 'Based on your responses, signs of dyslexia are minimal. However, if you have concerns, consider consulting a professional.',
    color: 'emerald',
    icon: CheckCircle2,
  },
  moderate: {
    title: 'Moderate Indicators',
    description: 'Some signs suggest possible dyslexia. Consider seeking a professional assessment for a comprehensive evaluation.',
    color: 'amber',
    icon: AlertTriangle,
  },
  high: {
    title: 'Significant Indicators',
    description: 'Multiple indicators suggest dyslexia may be present. We strongly recommend seeking a professional assessment from an educational psychologist.',
    color: 'red',
    icon: AlertTriangle,
  },
};

export function AssessmentTools() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestions = selectedAge ? questions[selectedAge] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = selectedAge ? ((currentQuestionIndex / currentQuestions.length) * 100) : 0;

  const handleAnswer = (answer: Answer) => {
    if (!currentQuestion) return;
    
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const scores: Record<Answer, number> = {
      never: 0,
      sometimes: 1,
      often: 2,
      always: 3,
    };

    const total = Object.values(answers).reduce((sum, answer) => sum + scores[answer], 0);
    const maxScore = currentQuestions.length * 3;
    const percentage = (total / maxScore) * 100;

    if (percentage < 33) return 'low';
    if (percentage < 66) return 'moderate';
    return 'high';
  };

  const resetAssessment = () => {
    setSelectedAge(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (!selectedAge) {
    return (
      <section id="assessment" className="space-y-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Interactive Assessment Tools</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Take a screening questionnaire to identify potential signs of dyslexia. 
                  This is <strong>not a diagnosis</strong>—only a professional assessment can diagnose dyslexia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Select Age Group</h3>
              <p className="text-sm text-muted-foreground">
                Choose the age group that best describes the person being assessed:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setSelectedAge('preschool')}
                  className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-left"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-2">Preschool (3-5 years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Early screening for young children showing potential signs
                  </p>
                </button>

                <button
                  onClick={() => setSelectedAge('primary')}
                  className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all text-left"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-2">Primary School (5-11 years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Assessment for primary school age children
                  </p>
                </button>

                <button
                  onClick={() => setSelectedAge('secondary')}
                  className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all text-left"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-2">Secondary School (11-18 years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Screening for teenagers and young adults
                  </p>
                </button>

                <button
                  onClick={() => setSelectedAge('adult')}
                  className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all text-left"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-2">Adult (18+ years)</h4>
                  <p className="text-sm text-muted-foreground">
                    Self-assessment for adults who suspect dyslexia
                  </p>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-muted-foreground">
                <strong>Important Disclaimer:</strong> This screening tool is for informational purposes only and cannot diagnose dyslexia. 
                Only a qualified professional (educational psychologist, specialist teacher, or medical professional) can provide a formal diagnosis. 
                If this screening suggests dyslexia, please seek a professional assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (showResults) {
    const scoreLevel = calculateScore();
    const result = scoreInterpretation[scoreLevel];
    const IconComponent = result.icon;

    return (
      <section id="assessment" className="space-y-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Assessment Results</h2>
                <p className="text-sm text-muted-foreground">
                  Based on your responses to {currentQuestions.length} questions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className={`p-6 rounded-lg bg-${result.color}-50 dark:bg-${result.color}-950/30 border-2 border-${result.color}-200 dark:border-${result.color}-800`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-full bg-${result.color}-100 dark:bg-${result.color}-900/50`}>
                  <IconComponent className={`w-8 h-8 text-${result.color}-600 dark:text-${result.color}-400`} />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-foreground">{result.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Next Steps:</h4>
              
              {scoreLevel === 'low' && (
                <ul className="space-y-2 pl-5">
                  <li className="text-sm text-muted-foreground">✓ Continue monitoring reading development</li>
                  <li className="text-sm text-muted-foreground">✓ Maintain regular reading practice</li>
                  <li className="text-sm text-muted-foreground">✓ If concerns persist, consult a professional</li>
                </ul>
              )}

              {(scoreLevel === 'moderate' || scoreLevel === 'high') && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <h5 className="font-semibold text-foreground mb-2">1. Seek Professional Assessment</h5>
                    <p className="text-sm text-muted-foreground mb-2">Contact:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-5">
                      <li>• Educational psychologist</li>
                      <li>• Specialist dyslexia teacher</li>
                      <li>• Your GP for referral</li>
                      <li>• School SENCO (Special Educational Needs Coordinator)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <h5 className="font-semibold text-foreground mb-2">2. Start Using Support Strategies</h5>
                    <p className="text-sm text-muted-foreground">
                      While awaiting assessment, explore the learning games, evidence-based strategies, and resources on this page.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <h5 className="font-semibold text-foreground mb-2">3. Connect with Support Organizations</h5>
                    <p className="text-sm text-muted-foreground mb-2">Useful resources:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-5">
                      <li>• British Dyslexia Association (BDA)</li>
                      <li>• Dyslexia Action</li>
                      <li>• NHS Learning Disabilities support</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button onClick={resetAssessment} variant="outline" className="w-full sm:w-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Assessment
              </Button>
            </div>

            <div className="text-xs text-muted-foreground italic">
              <strong>Remember:</strong> This is a screening tool only. A professional assessment is required for diagnosis and to access formal support and accommodations.
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="assessment" className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Dyslexia Screening Assessment</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% Complete</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                How often does the following occur?
              </h3>
              <p className="text-base text-foreground p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                {currentQuestion?.text}
              </p>
            </div>

            <RadioGroup className="space-y-3">
              <div
                onClick={() => handleAnswer('never')}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
              >
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Never</p>
                    <p className="text-xs text-muted-foreground">Does not apply or very rarely observed</p>
                  </div>
                </Label>
              </div>

              <div
                onClick={() => handleAnswer('sometimes')}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
              >
                <RadioGroupItem value="sometimes" id="sometimes" />
                <Label htmlFor="sometimes" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Sometimes</p>
                    <p className="text-xs text-muted-foreground">Occasionally observed, not consistent</p>
                  </div>
                </Label>
              </div>

              <div
                onClick={() => handleAnswer('often')}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
              >
                <RadioGroupItem value="often" id="often" />
                <Label htmlFor="often" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Often</p>
                    <p className="text-xs text-muted-foreground">Frequently observed, fairly consistent</p>
                  </div>
                </Label>
              </div>

              <div
                onClick={() => handleAnswer('always')}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
              >
                <RadioGroupItem value="always" id="always" />
                <Label htmlFor="always" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">Always</p>
                    <p className="text-xs text-muted-foreground">Consistently observed in most situations</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button 
                variant="ghost"
                onClick={resetAssessment}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
