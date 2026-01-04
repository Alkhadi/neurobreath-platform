'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckSquare } from 'lucide-react';

const accommodations = [
  'Extended time on tests and assignments',
  'Audio books and text-to-speech technology',
  'Note-taking assistance or copies of class notes',
  'Preferential seating near the teacher',
  'Reduced homework or modified assignments',
  'Alternative assessment methods',
  'Use of assistive technology',
  'Extra time for reading passages',
  'Oral testing options',
  'Spell-checker and grammar-checker tools',
];

export function AccommodationLetterGenerator() {
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);

  const toggleAccommodation = (accommodation: string) => {
    if (selectedAccommodations.includes(accommodation)) {
      setSelectedAccommodations(selectedAccommodations.filter(a => a !== accommodation));
    } else {
      setSelectedAccommodations([...selectedAccommodations, accommodation]);
    }
  };

  const generateLetter = () => {
    const letter = `
ACCOMMODATION LETTER

Date: ${new Date().toLocaleDateString()}

Re: Classroom Accommodations for ${studentName || '[Student Name]'} - Grade ${grade || '[Grade]'}

To Whom It May Concern:

This letter is to request the following accommodations for ${studentName || '[Student Name]'}, who has been identified with dyslexia:

${selectedAccommodations.map((acc, i) => `${i + 1}. ${acc}`).join('\n')}

These accommodations are necessary to provide equal access to education and are supported by research on effective interventions for students with dyslexia.

Thank you for your cooperation in implementing these accommodations.

Sincerely,
[Parent/Guardian Name]
    `;

    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accommodation-letter-${studentName || 'student'}.txt`;
    a.click();
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Accommodation Letter Generator
          </h3>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Grade Level</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g., 3rd, 4th, 5th"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold">Select Accommodations:</label>
            {accommodations.map((accommodation) => (
              <div
                key={accommodation}
                onClick={() => toggleAccommodation(accommodation)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAccommodations.includes(accommodation)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare
                    className={`w-5 h-5 ${
                      selectedAccommodations.includes(accommodation)
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className="text-sm">{accommodation}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={generateLetter}
            disabled={!studentName || !grade || selectedAccommodations.length === 0}
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate & Download Letter
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>📝 Generate a formal accommodation letter to share with teachers and administrators</p>
        </div>
      </CardContent>
    </Card>
  );
}
