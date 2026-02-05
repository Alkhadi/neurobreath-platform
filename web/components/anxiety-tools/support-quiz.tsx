"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Award, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { trackProgress } from "@/lib/progress/track"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "recognition" | "validation" | "exposure" | "professional"
}

interface QuizResult {
  quizId: string
  score: number
  totalQuestions: number
  completedDate: string
}

const quizQuestions: Question[] = [
  {
    id: "q1",
    question: "A child says 'I'm scared to go to school.' What's the BEST first response?",
    options: [
      "Don't worry, there's nothing to be scared of!",
      "I can see you're really worried. That must feel hard.",
      "You'll be fine once you get there.",
      "Everyone goes to school, you have to go."
    ],
    correctAnswer: 1,
    explanation: "Validation acknowledges feelings without dismissing them. 'I can see you're worried' shows empathy and understanding.",
    category: "validation"
  },
  {
    id: "q2",
    question: "What does research show about avoidance and anxiety?",
    options: [
      "Avoidance reduces anxiety long-term",
      "Avoidance temporarily reduces anxiety but maintains it long-term",
      "Avoidance has no effect on anxiety",
      "Avoidance should always be allowed"
    ],
    correctAnswer: 1,
    explanation: "Avoidance provides short-term relief but prevents learning that the feared situation is safe, thus maintaining anxiety.",
    category: "exposure"
  },
  {
    id: "q3",
    question: "Physical symptoms like stomachaches and headaches in anxious children are:",
    options: [
      "Usually fake/attention-seeking",
      "Real physical manifestations of anxiety",
      "Unrelated to their anxiety",
      "A sign they're trying to avoid school"
    ],
    correctAnswer: 1,
    explanation: "Anxiety causes real physical symptoms due to the stress response (fight-or-flight). These are genuine, not fabricated.",
    category: "recognition"
  },
  {
    id: "q4",
    question: "When should you seek professional help for anxiety?",
    options: [
      "Only if there's self-harm or suicidal thoughts",
      "After trying home strategies for 1 week",
      "When anxiety interferes with school, friendships, or family life",
      "Never, anxiety always goes away on its own"
    ],
    correctAnswer: 2,
    explanation: "Professional help is recommended when anxiety significantly impacts daily functioning, even without crisis symptoms.",
    category: "professional"
  },
  {
    id: "q5",
    question: "What's the most effective approach to excessive reassurance-seeking?",
    options: [
      "Always reassure to make them feel better",
      "Ignore the question completely",
      "Ask 'What do you think?' or 'How have you handled this before?'",
      "Tell them to stop asking"
    ],
    correctAnswer: 2,
    explanation: "Limiting reassurance and prompting self-reflection helps build confidence in their own judgment rather than dependence.",
    category: "validation"
  },
  {
    id: "q6",
    question: "Which breathing pattern is most evidence-based for anxiety reduction?",
    options: [
      "Fast, shallow breaths",
      "5-6 breaths per minute with extended exhale",
      "Holding breath as long as possible",
      "Breathing through the mouth only"
    ],
    correctAnswer: 1,
    explanation: "Research shows 5-6 breaths/min (e.g., 4-7-8, coherent breathing) maximizes HRV and activates the parasympathetic system.",
    category: "recognition"
  },
  {
    id: "q7",
    question: "What does gradual exposure mean?",
    options: [
      "Immediately facing the biggest fear",
      "Avoiding all anxiety triggers",
      "Breaking down fears into small, manageable steps",
      "Waiting until anxiety goes away naturally"
    ],
    correctAnswer: 2,
    explanation: "Gradual exposure (exposure hierarchy/ladder) involves facing fears step-by-step, building confidence at each level.",
    category: "exposure"
  },
  {
    id: "q8",
    question: "How should you model healthy coping for someone with anxiety?",
    options: [
      "Hide your stress so they don't worry",
      "Verbalize your coping: 'I'm worried, so I'll take deep breaths'",
      "Show that you never get anxious",
      "Complain about stress frequently"
    ],
    correctAnswer: 1,
    explanation: "Modeling means demonstrating coping strategies out loud so they learn by example. Normalize emotions + show healthy responses.",
    category: "validation"
  },
  {
    id: "q9",
    question: "Which is a behavioral sign of anxiety in children?",
    options: [
      "Increased appetite",
      "Improved sleep",
      "Excessive reassurance-seeking",
      "Reduced worry about tests"
    ],
    correctAnswer: 2,
    explanation: "Behavioral signs include reassurance-seeking, avoidance, clinginess, irritability, perfectionism, and regression.",
    category: "recognition"
  },
  {
    id: "q10",
    question: "What's the first-line treatment for anxiety according to NICE guidelines?",
    options: [
      "Benzodiazepines",
      "Beta-blockers",
      "CBT (Cognitive Behavioral Therapy)",
      "Immediate medication"
    ],
    correctAnswer: 2,
    explanation: "NICE recommends CBT as first-line treatment for anxiety disorders. Medication (SSRIs) is typically for moderate-severe cases.",
    category: "professional"
  }
]

export function SupportQuiz() {
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>("anxiety-support-quiz-results", [])
  const [currentQuiz, setCurrentQuiz] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)

  const startQuiz = () => {
    // Randomly select 5 questions
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
    setCurrentQuiz(shuffled)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizComplete(false)
    setScore(0)
    setQuizStarted(true)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    const correct = selectedAnswer === currentQuiz[currentIndex].correctAnswer
    if (correct) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentIndex < currentQuiz.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz complete
      setQuizComplete(true)
      const result: QuizResult = {
        quizId: Date.now().toString(),
        score,
        totalQuestions: currentQuiz.length,
        completedDate: new Date().toISOString()
      }
      setQuizResults([...quizResults, result])
      
      // Track progress
      void trackProgress({
        type: 'quiz_completed',
        metadata: {
          quizId: result.quizId,
          score,
          maxScore: currentQuiz.length,
          topic: 'anxiety-support',
          category: 'anxiety',
        },
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
    }
  }

  const currentQuestion = currentQuiz[currentIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
  
  const totalQuizzes = quizResults.length
  const averageScore = totalQuizzes > 0 
    ? (quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / totalQuizzes).toFixed(0)
    : 0

  if (!quizStarted) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
            <Brain className="h-5 w-5 text-indigo-500" />
            Knowledge Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Test your understanding of anxiety support strategies! This quiz covers recognition, validation, exposure therapy, and professional guidance.
          </p>
          
          {totalQuizzes > 0 && (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Taken</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            size="lg"
          >
            <Brain className="h-5 w-5 mr-2" />
            Start Quiz (5 Questions)
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (quizComplete) {
    const percentage = (score / currentQuiz.length * 100).toFixed(0)
    const isPerfect = score === currentQuiz.length
    const isGood = parseInt(percentage) >= 80
    
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
            <Award className="h-5 w-5 text-indigo-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${
              isPerfect ? "text-amber-500" : 
              isGood ? "text-emerald-500" : 
              "text-blue-500"
            }`}>
              {percentage}%
            </div>
            
            <div>
              <p className="text-lg font-semibold">
                {score} out of {currentQuiz.length} correct
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {isPerfect ? "🏆 Perfect score! You're an expert supporter!" :
                 isGood ? "🌟 Great job! You have strong knowledge!" :
                 "💪 Keep learning! You're building important skills!"}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Your Progress</h4>
              <Progress value={parseInt(percentage)} className="h-3" />
            </div>
            
            <Button 
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
            <Brain className="h-5 w-5 text-indigo-500" />
            Question {currentIndex + 1} of {currentQuiz.length}
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            {currentQuestion?.category}
          </Badge>
        </div>
        <Progress value={(currentIndex / currentQuiz.length) * 100} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
          <p className="font-semibold text-lg">{currentQuestion?.question}</p>
        </div>
        
        <RadioGroup 
          value={selectedAnswer?.toString()} 
          onValueChange={(value) => !showExplanation && setSelectedAnswer(parseInt(value))}
          disabled={showExplanation}
        >
          {currentQuestion?.options.map((option, index) => (
            <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all ${
              showExplanation
                ? index === currentQuestion.correctAnswer
                  ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                  : selectedAnswer === index
                  ? "bg-red-50 dark:bg-red-950/20 border-red-500"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                : selectedAnswer === index
                ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-indigo-300"
            }`}>
              <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showExplanation} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {showExplanation && index === currentQuestion.correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
              {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {showExplanation && (
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect 
              ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700"
          }`}>
            <div className="flex items-start gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-sm mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">{currentQuestion?.explanation}</p>
              </div>
            </div>
          </div>
        )}
        
        {!showExplanation ? (
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {currentIndex < currentQuiz.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
