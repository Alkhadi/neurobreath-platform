'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BookOpen, Clipboard, Award, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: any;
  downloadType: string;
  color: string;
}

const RESOURCES: Resource[] = [
  {
    id: 'parent-guide',
    title: 'Parent & Educator Guide',
    description: 'Comprehensive evidence-based strategies for supporting dyslexic learners at home and in the classroom',
    type: 'Guide (HTML)',
    icon: BookOpen,
    downloadType: 'parent-guide',
    color: 'blue'
  },
  {
    id: 'progress-tracker',
    title: 'Weekly Progress Tracker',
    description: 'Track daily practice sessions, skills mastered, and celebrate weekly achievements',
    type: 'Worksheet (HTML)',
    icon: Clipboard,
    downloadType: 'progress-tracker',
    color: 'green'
  },
  {
    id: 'phonics-worksheets',
    title: 'Phonics Practice Worksheets',
    description: 'Printable worksheets for letter sounds, blending, and segmenting practice',
    type: 'Worksheets (HTML)',
    icon: FileText,
    downloadType: 'phonics-worksheets',
    color: 'purple'
  },
  {
    id: 'letter-reversal',
    title: 'Letter Reversal Practice',
    description: 'Targeted exercises for b/d and p/q confusion with memory tricks and visual aids',
    type: 'Worksheet (HTML)',
    icon: FileText,
    downloadType: 'letter-reversal-practice',
    color: 'cyan'
  }
];

export function DownloadableResources() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (resource: Resource) => {
    setDownloading(resource.id);
    toast.info(`Preparing ${resource.title}...`);

    try {
      const response = await fetch(`/api/download-resource?type=${resource.downloadType}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${resource.title} downloaded!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const handleGenerateCertificate = () => {
    const name = prompt('Enter student name:');
    if (!name) return;

    const achievement = prompt('Enter achievement (e.g., "Phonics Mastery Level 1"):');
    if (!achievement) return;

    const url = `/api/download-resource?type=certificate&name=${encodeURIComponent(name)}&achievement=${encodeURIComponent(achievement)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_Certificate.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success('Certificate generated!');
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950 dark:to-fuchsia-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500 rounded-lg">
            <Download className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Downloadable Resources Hub</CardTitle>
            <CardDescription>Free printable materials for home and classroom use</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-violet-50 dark:bg-violet-950/50 p-4 rounded-lg border-l-4 border-violet-500">
          <p className="text-sm font-medium text-violet-900 dark:text-violet-100">
            <strong>📥 Free Resources:</strong> All materials are evidence-based and aligned with structured literacy principles. Download, print, and use as often as needed!
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.id}
                className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all bg-white dark:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-${resource.color}-100 dark:bg-${resource.color}-900 rounded-lg flex-shrink-0`}>
                    <Icon className={`h-6 w-6 text-${resource.color}-600 dark:text-${resource.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Evidence-Based
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleDownload(resource)}
                      disabled={downloading === resource.id}
                      size="sm"
                      className="w-full bg-violet-500 hover:bg-violet-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {downloading === resource.id ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certificate Generator */}
        <div className="p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950 dark:to-fuchsia-950 rounded-lg border-2 border-violet-200 dark:border-violet-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-violet-500 rounded-lg flex-shrink-0">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">🏆 Achievement Certificate Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create personalized certificates to celebrate student achievements and milestones. Perfect for motivation and building confidence!
              </p>
              <Button
                onClick={handleGenerateCertificate}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
              >
                <Award className="h-5 w-5 mr-2" />
                Generate Custom Certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Usage Tips:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
            <li>Download resources open as HTML files - right-click and "Print" or "Save as PDF" from your browser</li>
            <li>Use the Progress Tracker weekly to maintain consistency and track growth</li>
            <li>Worksheets can be laminated and used with dry-erase markers for repeated practice</li>
            <li>Share the Parent Guide with educators to ensure consistent strategies across environments</li>
            <li>Generate certificates frequently to celebrate small wins and maintain motivation</li>
          </ul>
        </div>

        {/* Additional Resources */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-semibold text-lg mb-3">📚 Recommended External Resources:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org' },
              { name: 'Reading Rockets', url: 'https://www.readingrockets.org' },
              { name: 'Understood.org', url: 'https://www.understood.org' },
              { name: 'Yale Center for Dyslexia & Creativity', url: 'https://dyslexia.yale.edu' }
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all text-sm flex items-center justify-between group"
              >
                <span className="font-medium">{link.name}</span>
                <span className="text-violet-500 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
