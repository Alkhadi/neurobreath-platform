'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Lightbulb, X, Award, TrendingUp, Download, Printer } from 'lucide-react';
import { getDeviceId } from '@/lib/device-id';

const ASSESSMENT_SECTIONS = [
  { title: 'Letter Recognition', questions: 3 },
  { title: 'Phonics Skills', questions: 4 },
  { title: 'Sight Words', questions: 4 },
  { title: 'Comprehension', questions: 4 },
];

const ASSESSMENT_QUESTIONS = {
  'Letter Recognition': [
    { question: 'What letter is this? (Aa)', options: ['A', 'O', 'Q'], correct: 0 },
    { question: 'Which letter matches "M"?', options: ['W', 'M', 'N'], correct: 1 },
    { question: 'Identify the letter "D"', options: ['O', 'D', 'B'], correct: 1 },
  ],
  'Phonics Skills': [
    { question: 'What sound does "C" make in "cat"?', options: ['/s/', '/k/', '/ch/'], correct: 1 },
    { question: 'What sound does "E" make in "bed"?', options: ['/ē/', '/ĕ/', '/ə/'], correct: 1 },
    { question: 'Blend these sounds: /c/ /a/ /t/', options: ['cat', 'cut', 'cot'], correct: 0 },
    { question: 'What is the final sound in "dog"?', options: ['/g/', '/d/', '/k/'], correct: 0 },
  ],
  'Sight Words': [
    { question: 'What word is this? "the"', options: ['that', 'the', 'this'], correct: 1 },
    { question: 'Select "and"', options: ['are', 'and', 'an'], correct: 1 },
    { question: 'Which says "to"?', options: ['too', 'to', 'two'], correct: 1 },
    { question: 'Find "in"', options: ['inn', 'in', 'on'], correct: 1 },
  ],
  'Comprehension': [
    { question: 'What is a cat?', options: ['A plant', 'An animal', 'A food'], correct: 1 },
    { question: 'What do you do at school?', options: ['Sleep', 'Learn', 'Eat'], correct: 1 },
    { question: 'What is opposite of big?', options: ['Large', 'Small', 'Huge'], correct: 1 },
    { question: 'Which is a fruit?', options: ['Carrot', 'Apple', 'Broccoli'], correct: 1 },
  ],
};

// Reading level calculation based on accuracy
interface ReadingLevelResult {
  band: string;
  percentile: number;
  description: string;
  recommendations: string[];
}

function calculateReadingLevel(score: number, totalQuestions: number): ReadingLevelResult {
  const accuracy = (score / totalQuestions) * 100;

  if (accuracy >= 90) {
    return {
      band: 'Advanced',
      percentile: 90 + Math.floor((accuracy - 90) / 10),
      description: 'Excellent comprehension and advanced reading skills',
      recommendations: [
        'Explore challenging texts and literature',
        'Practice higher-level comprehension strategies',
        'Try reading advanced materials for your age group',
      ],
    };
  } else if (accuracy >= 75) {
    return {
      band: 'Intermediate',
      percentile: 75 + Math.floor((accuracy - 75) / 15),
      description: 'Good reading comprehension and decoding skills',
      recommendations: [
        'Continue practicing regular reading exercises',
        'Focus on phonics and word recognition',
        'Read a variety of engaging stories',
      ],
    };
  } else if (accuracy >= 60) {
    return {
      band: 'Elementary',
      percentile: 60 + Math.floor((accuracy - 60) / 15),
      description: 'Basic reading skills with room for improvement',
      recommendations: [
        'Practice letter recognition and basic phonics daily',
        'Use multisensory reading techniques',
        'Build sight word vocabulary gradually',
      ],
    };
  } else {
    return {
      band: 'Beginner',
      percentile: Math.floor(accuracy / 60 * 50),
      description: 'Building foundational reading skills',
      recommendations: [
        'Focus on letter sounds and basic recognition',
        'Practice with simple, short words',
        'Use interactive and fun reading games',
        'Consider dyslexia-specific interventions if needed',
      ],
    };
  }
}

export function ReadingAssessment() {
  const [assessmentActive, setAssessmentActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const resultsPrintRef = useRef<HTMLDivElement>(null);

  const totalQuestions = Object.values(ASSESSMENT_QUESTIONS).reduce((sum, arr) => sum + arr.length, 0);
  const completedQuestions = currentSectionIdx * 4 + currentQuestionIdx;
  const progress = Math.round((completedQuestions / totalQuestions) * 100);

  const currentSection = ASSESSMENT_SECTIONS[currentSectionIdx];
  const questions = ASSESSMENT_QUESTIONS[currentSection.title as keyof typeof ASSESSMENT_QUESTIONS];
  const currentQuestion = questions[currentQuestionIdx];

  const readingLevel = calculateReadingLevel(score, totalQuestions);
  const accuracy = Math.round((score / totalQuestions) * 100);

  const saveAttempt = async () => {
    setIsSaving(true);
    try {
      const deviceId = getDeviceId();
      const endTime = Date.now();
      const durationSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;

      const response = await fetch('/api/assessment/save-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          assessmentType: 'quickAssessment',
          totalWords: totalQuestions,
          wordsCorrect: score,
          errorsTotal: totalQuestions - score,
          accuracyPct: accuracy,
          readingLevelBand: readingLevel.band,
          readingLevelPercentile: readingLevel.percentile,
          durationSeconds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✓ Assessment saved:', data);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentActive(true);
    setShowResults(false);
    setCurrentSectionIdx(0);
    setCurrentQuestionIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setSectionScores({});
    setStartTime(Date.now());
  };

  const handleAnswer = (optionIdx: number) => {
    if (answered) return;
    
    setSelectedAnswer(optionIdx);
    setShowFeedback(true);
    setAnswered(true);
    
    if (optionIdx === currentQuestion.correct) {
      setScore(score + 1);
      setSectionScores(prev => ({
        ...prev,
        [currentSection.title]: (prev[currentSection.title] || 0) + 1
      }));
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setAnswered(false);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else if (currentSectionIdx < ASSESSMENT_SECTIONS.length - 1) {
      setCurrentSectionIdx(currentSectionIdx + 1);
      setCurrentQuestionIdx(0);
    } else {
      // Assessment complete - show results
      setAssessmentActive(false);
      setShowResults(true);
      saveAttempt();
    }
  };

  const handleCloseAssessment = () => {
    setAssessmentActive(false);
    setShowResults(false);
    setCurrentSectionIdx(0);
    setCurrentQuestionIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setSectionScores({});
    setStartTime(null);
  };

  const handleRetakeAssessment = () => {
    handleStartAssessment();
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '', 'width=850,height=1100');
      if (!printWindow) {
        alert('Please allow pop-ups to print');
        return;
      }

    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const performanceBySection = ASSESSMENT_SECTIONS.map((section) => {
      const sectionQCount = section.questions;
      const sectionScore = sectionScores[section.title] || 0;
      const sectionAccuracy = Math.round((sectionScore / sectionQCount) * 100);
      return {
        title: section.title,
        score: sectionScore,
        total: sectionQCount,
        accuracy: sectionAccuracy,
      };
    });

    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.3;
          color: #2c3e50;
          background: #fff;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        .document {
          max-width: 100%;
          background: white;
        }
        
        /* Header Section */
        .header {
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid #7c3aed;
        }
        .logo-text {
          font-size: 7px;
          color: #7c3aed;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .header h1 {
          font-size: 18px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 2px;
        }
        .header p {
          font-size: 9px;
          color: #64748b;
          margin-bottom: 6px;
        }
        .assessment-date {
          font-size: 7px;
          color: #94a3b8;
          padding-top: 4px;
          text-align: right;
        }
        
        /* Main Content */
        .content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        /* Reading Level Section */
        .reading-level-card {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          border: 1px solid #7c3aed;
          border-radius: 6px;
          padding: 12px;
          page-break-inside: avoid;
        }
        .reading-level-label {
          font-size: 6px;
          font-weight: 800;
          text-transform: uppercase;
          color: #7c3aed;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .reading-level-band {
          font-size: 28px;
          font-weight: 900;
          color: #7c3aed;
          margin: 4px 0;
          line-height: 1;
        }
        .reading-level-description {
          font-size: 8px;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        /* Score Grid */
        .score-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-bottom: 4px;
          page-break-inside: avoid;
        }
        .score-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px 6px;
          text-align: center;
        }
        .score-label {
          font-size: 6px;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }
        .score-value {
          font-size: 16px;
          font-weight: 900;
          color: #1a202c;
          line-height: 1;
        }
        
        /* Performance Bar */
        .performance-section {
          margin-top: 8px;
        }
        .performance-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 8px;
          font-weight: 600;
          color: #2c3e50;
        }
        .performance-bar {
          background: #e2e8f0;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }
        .performance-fill {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
          height: 100%;
          border-radius: 3px;
        }
        
        /* Section Performance */
        .section-title {
          font-size: 9px;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          gap: 6px;
          page-break-inside: avoid;
        }
        .section-title::before {
          content: '';
          display: inline-block;
          width: 2px;
          height: 10px;
          background: #7c3aed;
          border-radius: 1px;
        }
        .performance-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          page-break-inside: avoid;
        }
        .performance-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 6px;
          page-break-inside: avoid;
        }
        .performance-item-title {
          font-size: 7px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 3px;
          display: flex;
          justify-content: space-between;
        }
        .performance-item-score {
          font-size: 6px;
          font-weight: 800;
          color: #10b981;
          background: #f0fdf4;
          padding: 1px 3px;
          border-radius: 2px;
        }
        .performance-item-bar {
          background: #e5e7eb;
          height: 3px;
          border-radius: 1.5px;
          overflow: hidden;
          margin-bottom: 2px;
        }
        .performance-item-fill {
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
          height: 100%;
        }
        .performance-item-percent {
          font-size: 6px;
          color: #64748b;
          font-weight: 600;
        }
        
        /* Recommendations */
        .recommendations-container {
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 4px;
          padding: 8px;
          page-break-inside: avoid;
        }
        .recommendations-title {
          font-size: 8px;
          font-weight: 800;
          color: #1e40af;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .recommendations-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .recommendations-list li {
          font-size: 7px;
          color: #1e3a8a;
          margin-bottom: 3px;
          padding-left: 10px;
          position: relative;
          font-weight: 500;
        }
        .recommendations-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          font-weight: 900;
          color: #0369a1;
          font-size: 7px;
        }
        
        /* Disclaimer */
        .disclaimer {
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          border-radius: 4px;
          padding: 8px;
          margin-top: 6px;
          page-break-inside: avoid;
        }
        .disclaimer-title {
          font-weight: 800;
          color: #92400e;
          font-size: 7px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .disclaimer-text {
          font-size: 7px;
          color: #78350f;
          font-weight: 500;
          line-height: 1.2;
        }
        
        /* Footer */
        .footer {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 6px;
          color: #94a3b8;
          page-break-inside: avoid;
        }
        .footer-note {
          font-weight: 600;
          margin-bottom: 2px;
          color: #64748b;
        }
        
        @media print {
          body { background: white !important; }
          * { page-break-inside: avoid !important; }
        }
      </style>
    `;

    const performanceSectionsHTML = performanceBySection
      .map(
        (section) => `
          <div class="performance-item">
            <div class="performance-item-title">
              <span>${section.title}</span>
              <span class="performance-item-score">${section.score}/${section.total}</span>
            </div>
            <div class="performance-item-bar">
              <div class="performance-item-fill" style="width: ${section.accuracy}%"></div>
            </div>
            <div class="performance-item-percent">${section.accuracy}% correct</div>
          </div>
        `
      )
      .join('');

    const recommendationsHTML = readingLevel.recommendations
      .map((rec) => `<li>${rec}</li>`)
      .join('');

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reading Assessment Results - ${timestamp}</title>
        ${styles}
      </head>
      <body>
        <div class="document">
          <div class="header">
            <div class="logo-text">📖 NeuroBreath</div>
            <h1>Reading Level Assessment</h1>
            <p>Comprehensive Performance Report</p>
            <div class="assessment-date">Assessment Date: ${timestamp}</div>
          </div>
          
          <div class="content">
            <!-- Reading Level Card -->
            <div class="reading-level-card">
              <div class="reading-level-label">Reading Level</div>
              <div class="reading-level-band">${readingLevel.band}</div>
              <div class="reading-level-description">${readingLevel.description}</div>
              
              <div class="score-grid">
                <div class="score-card">
                  <div class="score-label">Score</div>
                  <div class="score-value">${score}/${totalQuestions}</div>
                </div>
                <div class="score-card">
                  <div class="score-label">Accuracy</div>
                  <div class="score-value">${accuracy}%</div>
                </div>
                <div class="score-card">
                  <div class="score-label">Percentile</div>
                  <div class="score-value">${readingLevel.percentile}</div>
                </div>
              </div>
              
              <div class="performance-section">
                <div class="performance-label">
                  <span>Overall Performance</span>
                  <span>${accuracy}%</span>
                </div>
                <div class="performance-bar">
                  <div class="performance-fill" style="width: ${accuracy}%"></div>
                </div>
              </div>
            </div>
            
            <!-- Section Performance -->
            <div>
              <h2 class="section-title">Performance by Section</h2>
              <div class="performance-grid">
                ${performanceSectionsHTML}
              </div>
            </div>
            
            <!-- Recommendations -->
            <div class="recommendations-container">
              <h3 class="recommendations-title">Personalized Recommendations</h3>
              <ul class="recommendations-list">
                ${recommendationsHTML}
              </ul>
            </div>
            
            <!-- Disclaimer -->
            <div class="disclaimer">
              <div class="disclaimer-title">⚠️ Important Notice</div>
              <div class="disclaimer-text">
                This assessment is for training and monitoring purposes only. For formal diagnosis, please consult with a qualified reading specialist or educational psychologist.
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-note">NeuroBreath Platform - Training & Monitoring Assessment</div>
            <div>For formal diagnosis, consult with a qualified reading specialist</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Use onload callback for reliable rendering
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 100);
    };
    
    // Fallback timeout in case onload doesn't fire
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.print();
      }
    }, 500);
    } catch (error) {
      console.error('Print error:', error);
      alert('Error preparing print. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const performanceBySection = ASSESSMENT_SECTIONS.map((section) => {
        const sectionQCount = section.questions;
        const sectionScore = sectionScores[section.title] || 0;
        const sectionAccuracy = Math.round((sectionScore / sectionQCount) * 100);
        return {
          title: section.title,
          score: sectionScore,
          total: sectionQCount,
          accuracy: sectionAccuracy,
        };
      });

      const styles = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.5;
            color: #2c3e50;
            background: #fff;
            padding: 20px;
          }
          .document {
            max-width: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 35px;
            padding-bottom: 25px;
            border-bottom: 3px solid #7c3aed;
          }
          .logo-text {
            font-size: 11px;
            color: #7c3aed;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: block;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 15px;
          }
          .assessment-date {
            font-size: 11px;
            color: #94a3b8;
            padding-top: 15px;
            text-align: right;
          }
          
          .content {
            display: flex;
            flex-direction: column;
            gap: 28px;
          }
          
          .reading-level-card {
            background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
            border: 2px solid #7c3aed;
            border-radius: 12px;
            padding: 32px 28px;
          }
          .reading-level-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            color: #7c3aed;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
          }
          .reading-level-band {
            font-size: 48px;
            font-weight: 900;
            color: #7c3aed;
            margin: 12px 0;
          }
          .reading-level-description {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 24px;
            font-weight: 500;
          }
          
          .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 8px;
          }
          .score-card {
            background: white;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px 12px;
            text-align: center;
          }
          .score-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 0.8px;
            margin-bottom: 10px;
          }
          .score-value {
            font-size: 28px;
            font-weight: 900;
            color: #1a202c;
          }
          
          .performance-section {
            margin-top: 20px;
          }
          .performance-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #2c3e50;
          }
          .performance-bar {
            background: #e2e8f0;
            height: 14px;
            border-radius: 7px;
            overflow: hidden;
          }
          .performance-fill {
            background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
            height: 100%;
            border-radius: 7px;
          }
          
          h2, h3 {
            font-size: 16px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          h2::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #7c3aed;
            border-radius: 2px;
            margin-right: 10px;
          }
          
          .performance-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .performance-item {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 16px;
          }
          .performance-item-title {
            font-size: 13px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
          }
          .performance-item-score {
            font-size: 12px;
            font-weight: 800;
            color: #10b981;
            background: #f0fdf4;
            padding: 3px 8px;
            border-radius: 4px;
          }
          .performance-item-bar {
            background: #e5e7eb;
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 6px;
          }
          .performance-item-fill {
            background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
            height: 100%;
          }
          .performance-item-percent {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
          }
          
          .recommendations-container {
            background: #eff6ff;
            border-left: 5px solid #3b82f6;
            border-radius: 8px;
            padding: 20px 18px;
          }
          .recommendations-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .recommendations-list li {
            font-size: 12px;
            color: #1e3a8a;
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
            font-weight: 500;
          }
          .recommendations-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            font-weight: 900;
            color: #0369a1;
          }
          
          .disclaimer {
            background: #fef3c7;
            border-left: 5px solid #f59e0b;
            border-radius: 8px;
            padding: 15px 16px;
            margin-top: 20px;
          }
          .disclaimer-title {
            font-weight: 800;
            color: #92400e;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 6px;
          }
          .disclaimer-text {
            font-size: 11px;
            color: #78350f;
            font-weight: 500;
          }
          
          .footer {
            margin-top: 35px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
          }
          .footer-note {
            font-weight: 600;
            margin-bottom: 6px;
            color: #64748b;
          }
        </style>
      `;

      const performanceSectionsHTML = performanceBySection
        .map(
          (section) => `
            <div class="performance-item">
              <div class="performance-item-title">
                <span>${section.title}</span>
                <span class="performance-item-score">${section.score}/${section.total}</span>
              </div>
              <div class="performance-item-bar">
                <div class="performance-item-fill" style="width: ${section.accuracy}%"></div>
              </div>
              <div class="performance-item-percent">${section.accuracy}% correct</div>
            </div>
          `
        )
        .join('');

      const recommendationsHTML = readingLevel.recommendations
        .map((rec) => `<li>${rec}</li>`)
        .join('');

      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reading Assessment Results</title>
          ${styles}
        </head>
        <body>
          <div class="document">
            <div class="header">
              <span class="logo-text">📖 NeuroBreath</span>
              <h1>Reading Level Assessment</h1>
              <p>Comprehensive Performance Report</p>
              <div class="assessment-date">Assessment Date: ${timestamp}</div>
            </div>
            
            <div class="content">
              <div class="reading-level-card">
                <div class="reading-level-label">Reading Level</div>
                <div class="reading-level-band">${readingLevel.band}</div>
                <div class="reading-level-description">${readingLevel.description}</div>
                
                <div class="score-grid">
                  <div class="score-card">
                    <div class="score-label">Score</div>
                    <div class="score-value">${score}/${totalQuestions}</div>
                  </div>
                  <div class="score-card">
                    <div class="score-label">Accuracy</div>
                    <div class="score-value">${accuracy}%</div>
                  </div>
                  <div class="score-card">
                    <div class="score-label">Percentile</div>
                    <div class="score-value">${readingLevel.percentile}</div>
                  </div>
                </div>
                
                <div class="performance-section">
                  <div class="performance-label">
                    <span>Overall Performance</span>
                    <span>${accuracy}%</span>
                  </div>
                  <div class="performance-bar">
                    <div class="performance-fill" style="width: ${accuracy}%"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2>Performance by Section</h2>
                <div class="performance-grid">
                  ${performanceSectionsHTML}
                </div>
              </div>
              
              <div class="recommendations-container">
                <h3>Personalized Recommendations</h3>
                <ul class="recommendations-list">
                  ${recommendationsHTML}
                </ul>
              </div>
              
              <div class="disclaimer">
                <div class="disclaimer-title">⚠️ Important Notice</div>
                <div class="disclaimer-text">
                  This assessment is for training and monitoring purposes only. For formal diagnosis, please consult with a qualified reading specialist or educational psychologist.
                </div>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-note">NeuroBreath Platform - Training & Monitoring Assessment</div>
              <div>For formal diagnosis, consult with a qualified reading specialist</div>
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reading-Assessment-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  // Results screen
  if (showResults) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900/95 to-black/95 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <button
          onClick={handleCloseAssessment}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-51"
          aria-label="Close results"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-2xl mx-auto space-y-8 pt-24 pb-24" ref={resultsPrintRef}>
          {/* Header */}
          <div className="text-center space-y-4">
            <Award className="w-16 h-16 text-amber-400 mx-auto" />
            <h2 className="text-4xl font-bold text-white">Assessment Complete!</h2>
            <p className="text-white/70">Here's your reading level assessment results</p>
          </div>

          {/* Reading Level Display */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-block bg-white/10 rounded-full px-6 py-2 border border-white/30">
                <p className="text-white/70 text-sm font-semibold uppercase tracking-wide">Reading Level</p>
              </div>
              <h3 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                {readingLevel.band}
              </h3>
              <p className="text-white/80 text-lg">{readingLevel.description}</p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <p className="text-white/60 text-sm font-semibold uppercase">Score</p>
                <p className="text-3xl font-bold text-white mt-2">{score}/{totalQuestions}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <p className="text-white/60 text-sm font-semibold uppercase">Accuracy</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{accuracy}%</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <p className="text-white/60 text-sm font-semibold uppercase">Percentile</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{readingLevel.percentile}</p>
              </div>
            </div>

            {/* Accuracy Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Overall Performance</span>
                <span>{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-3" />
            </div>
          </div>

          {/* Section Performance */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Performance by Section</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ASSESSMENT_SECTIONS.map((section) => {
                const sectionQCount = section.questions;
                const sectionScore = sectionScores[section.title] || 0;
                const sectionAccuracy = Math.round((sectionScore / sectionQCount) * 100);
                return (
                  <div key={section.title} className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white">{section.title}</h4>
                      <span className="text-sm font-bold text-green-400">{sectionScore}/{sectionQCount}</span>
                    </div>
                    <Progress value={sectionAccuracy} className="h-2" />
                    <p className="text-xs text-white/60">{sectionAccuracy}% correct</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 space-y-4 pb-24">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-blue-300 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-white mb-3">Personalized Recommendations</h3>
                <ul className="space-y-2">
                  {readingLevel.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30 text-center">
            <p className="text-sm text-amber-100">
              <strong>Note:</strong> This assessment is for training and monitoring purposes only. 
              For formal diagnosis, please consult with a qualified reading specialist or educational psychologist.
            </p>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/80 p-4 z-52">
          <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="py-6 text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
              size="lg"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="py-6 text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
              size="lg"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              onClick={handleRetakeAssessment}
              variant="outline"
              className="py-6 text-sm sm:text-base font-semibold"
              size="lg"
            >
              Retake
            </Button>
            <Button
              onClick={handleCloseAssessment}
              className="py-6 text-sm sm:text-base font-semibold"
              size="lg"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (assessmentActive) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900/95 to-black/95 flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="fixed top-8 left-0 right-0 flex flex-col items-center gap-2 z-51">
          <button
            onClick={handleCloseAssessment}
            className="absolute right-6 top-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close assessment"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wide">
              {currentSection.title}
            </h2>
            <p className="text-white/60 text-xs mt-1">
              Question {currentQuestionIdx + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Main Assessment Card */}
        <div className="w-full max-w-2xl mx-auto space-y-8 mt-20 mb-20">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="grid gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`p-4 rounded-lg font-semibold text-lg transition-all ${
                    selectedAnswer === idx
                      ? idx === currentQuestion.correct
                        ? 'bg-green-500/80 text-white scale-105'
                        : 'bg-red-500/80 text-white scale-105'
                      : answered && idx === currentQuestion.correct
                      ? 'bg-green-500/80 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20 disabled:cursor-not-allowed'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-4 rounded-lg text-center font-semibold ${
                  selectedAnswer === currentQuestion.correct
                    ? 'bg-green-500/30 text-green-200'
                    : 'bg-red-500/30 text-red-200'
                }`}
              >
                {selectedAnswer === currentQuestion.correct
                  ? '✓ Correct! Great job!'
                  : '✗ Not quite. Keep practicing!'}
              </div>
            )}
          </div>

          {/* Next Button */}
          {answered && (
            <Button
              onClick={handleNextQuestion}
              className="w-full py-6 text-lg font-semibold"
              size="lg"
            >
              {currentSectionIdx === ASSESSMENT_SECTIONS.length - 1 && 
               currentQuestionIdx === questions.length - 1
                ? 'Complete Assessment'
                : 'Next Question'}
            </Button>
          )}
        </div>

        {/* Score Indicator */}
        <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20 text-center">
          <div className="text-white/60 text-xs uppercase tracking-wider">Score</div>
          <div className="text-3xl font-bold text-white">{score}/{completedQuestions || 1}</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Reading Level Assessment</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Discover Your Reading Level
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Take this quick assessment to find out your reading level and get personalized activity recommendations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSESSMENT_SECTIONS.map((section, idx) => (
            <div key={idx} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{section.title}</h3>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{section.questions} questions</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg flex gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-xs sm:text-sm">
            <strong>Tip:</strong> Take your time! There is no time limit. Answer each question to the best of your ability. You'll get helpful feedback after each answer.
          </p>
        </div>

        <Button 
          onClick={handleStartAssessment}
          className="w-full" 
          size="lg"
        >
          Start Assessment
        </Button>
      </CardContent>
    </Card>
  );
}
