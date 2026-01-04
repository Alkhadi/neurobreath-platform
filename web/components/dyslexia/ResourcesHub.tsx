'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, Users, GraduationCap, ExternalLink } from 'lucide-react';

const resources = [
  {
    category: 'Worksheets',
    icon: FileText,
    color: 'blue',
    items: [
      { title: 'Phonics Practice Sheets', description: 'Letter-sound correspondence activities', type: 'PDF' },
      { title: 'Sight Word Flash Cards', description: 'Printable flashcards for common words', type: 'PDF' },
      { title: 'Syllable Division Exercises', description: 'Breaking words into syllables', type: 'PDF' },
      { title: 'Reading Comprehension Passages', description: 'Age-appropriate texts with questions', type: 'PDF' },
    ],
  },
  {
    category: 'Parent Guides',
    icon: Users,
    color: 'emerald',
    items: [
      { title: 'Supporting Your Dyslexic Child', description: 'Daily strategies and emotional support', type: 'PDF' },
      { title: 'Homework Help Strategies', description: 'Making homework less stressful', type: 'PDF' },
      { title: 'Advocating for Your Child', description: 'Working with schools and IEPs', type: 'PDF' },
      { title: 'Building Confidence', description: 'Nurturing strengths and self-esteem', type: 'PDF' },
    ],
  },
  {
    category: 'Teacher Resources',
    icon: GraduationCap,
    color: 'purple',
    items: [
      { title: 'Classroom Accommodations Guide', description: 'Evidence-based adjustments', type: 'PDF' },
      { title: 'Multisensory Teaching Techniques', description: 'Structured literacy approaches', type: 'PDF' },
      { title: 'Assessment Strategies', description: 'Alternative testing methods', type: 'PDF' },
      { title: 'IEP Writing Guide', description: 'Creating effective education plans', type: 'PDF' },
    ],
  },
  {
    category: 'Recommended Apps & Tools',
    icon: BookOpen,
    color: 'orange',
    items: [
      { title: 'Text-to-Speech Tools', description: 'Assistive reading technology', type: 'Link' },
      { title: 'Graphic Organizers', description: 'Visual planning and organization', type: 'Link' },
      { title: 'Audiobook Platforms', description: 'Building literacy through listening', type: 'Link' },
      { title: 'Spell-Check & Grammar Tools', description: 'Writing support technology', type: 'Link' },
    ],
  },
];

const externalLinks = [
  { name: 'NHS Dyslexia Information', url: 'https://www.nhs.uk/conditions/dyslexia/', description: 'Official NHS guidance' },
  { name: 'British Dyslexia Association', url: 'https://www.bdadyslexia.org.uk/', description: 'UK support organization' },
  { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org/', description: 'Global research & resources' },
  { name: 'Yale Center for Dyslexia & Creativity', url: 'https://dyslexia.yale.edu/', description: 'Research-based information' },
  { name: 'Reading Rockets', url: 'https://www.readingrockets.org/', description: 'Teaching strategies & resources' },
];

export function ResourcesHub() {
  const handleDownload = (title: string) => {
    // In a real implementation, this would trigger actual download
    console.log(`Downloading: ${title}`);
    alert(`"${title}" would be downloaded in a production environment`);
  };

  return (
    <section id="resources" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50">
              <Download className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Resources Hub</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Downloadable worksheets, guides, and tools for individuals, parents, teachers, and carers. 
                All resources are evidence-based and designed for practical use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      {resources.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.category}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/50`}>
                  <IconComponent className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full bg-${category.color}-100 dark:bg-${category.color}-900/30 text-${category.color}-700 dark:text-${category.color}-300`}>
                        {item.type}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(item.title)}
                      className="ml-3 flex-shrink-0"
                    >
                      {item.type === 'PDF' ? (
                        <Download className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* External Resources */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <ExternalLink className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">External Resources & Organizations</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {externalLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {link.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0 ml-3" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">📚 How to Use These Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Worksheets:</strong> Print and use for daily practice. Repetition builds mastery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Guides:</strong> Read through carefully and implement strategies gradually.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Tools & Apps:</strong> Explore recommended technology to support reading and writing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>External Links:</strong> Visit for additional research-backed information and community support.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
