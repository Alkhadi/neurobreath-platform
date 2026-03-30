'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, BookOpen, Users, GraduationCap, ExternalLink, Headphones, Smartphone } from 'lucide-react';

interface ResourceItem {
  title: string;
  description: string;
  type: 'PDF' | 'Link' | 'Free' | 'Freemium' | 'Paid';
  url?: string;
}

interface ResourceCategory {
  category: string;
  icon: React.ElementType;
  color: string;
  items: ResourceItem[];
}

const resources: ResourceCategory[] = [
  {
    category: 'Worksheets & Printables',
    icon: FileText,
    color: 'blue',
    items: [
      { title: 'Phonics Practice Sheets', description: 'Letter-sound correspondence activities with multisensory prompts', type: 'PDF' },
      { title: 'Sight Word Flash Cards', description: 'Printable flashcards for the 100 most common words', type: 'PDF' },
      { title: 'Syllable Division Exercises', description: 'Breaking 2–4 syllable words into manageable parts', type: 'PDF' },
      { title: 'Reading Comprehension Passages', description: 'Age-appropriate texts with who/what/where/why questions', type: 'PDF' },
      { title: 'LSCCWC Spelling Template', description: 'Look–Say–Cover–Write–Check weekly spelling practice sheet', type: 'PDF' },
      { title: 'PEEL Writing Frame', description: 'Structured paragraph template: Point, Evidence, Explain, Link', type: 'PDF' },
    ],
  },
  {
    category: 'Parent Guides',
    icon: Users,
    color: 'emerald',
    items: [
      { title: 'Supporting Your Dyslexic Child', description: 'Daily strategies and emotional support at home', type: 'PDF' },
      { title: 'Homework Help Strategies', description: 'Making homework less stressful — practical tools and routines', type: 'PDF' },
      { title: 'Advocating for Your Child', description: 'Working with schools, SEN processes, and IEPs/EHCPs', type: 'PDF' },
      { title: 'Building Confidence at Home', description: 'Nurturing strengths, managing setbacks, building self-esteem', type: 'PDF' },
    ],
  },
  {
    category: 'Teacher Resources',
    icon: GraduationCap,
    color: 'purple',
    items: [
      { title: 'Classroom Accommodations Guide', description: 'Evidence-based adjustments for dyslexic learners', type: 'PDF' },
      { title: 'Multisensory Teaching Techniques', description: 'Structured literacy: visual + auditory + kinesthetic methods', type: 'PDF' },
      { title: 'Alternative Assessment Strategies', description: 'Oral presentations, portfolios, and multiple-choice accommodations', type: 'PDF' },
      { title: 'IEP / EHCP Writing Guide', description: 'Creating effective, measurable education plans', type: 'PDF' },
    ],
  },
  {
    category: 'Text-to-Speech & Reading Tools',
    icon: BookOpen,
    color: 'orange',
    items: [
      {
        title: 'Natural Reader',
        description: 'Paste any text and hear it read aloud — free browser and desktop app with natural voices.',
        type: 'Free',
        url: 'https://www.naturalreaders.com',
      },
      {
        title: 'Read&Write for Google Chrome',
        description: 'Literacy support toolbar that reads webpages, PDFs and documents aloud. Free for personal use.',
        type: 'Freemium',
        url: 'https://www.texthelp.com/products/read-and-write-for-google/',
      },
      {
        title: 'Speechify',
        description: 'Converts any text — emails, PDFs, web pages, screenshots — into spoken audio at adjustable speeds.',
        type: 'Freemium',
        url: 'https://speechify.com',
      },
      {
        title: 'Immersive Reader (Microsoft)',
        description: 'Built into Microsoft Office, Teams and Edge. Reads aloud, spaces words, highlights lines. Free.',
        type: 'Free',
        url: 'https://www.onenote.com/learningtools',
      },
      {
        title: 'OpenDyslexic Font',
        description: 'Free typeface designed to increase readability for dyslexic readers — bottom-weighted letters.',
        type: 'Free',
        url: 'https://opendyslexic.org',
      },
      {
        title: 'Claro ScanPen (mobile)',
        description: 'Point your phone camera at printed text and have it read aloud instantly.',
        type: 'Paid',
        url: 'https://www.clarosoftware.com/portfolio/claroscanpen/',
      },
    ],
  },
  {
    category: 'Audiobook Services',
    icon: Headphones,
    color: 'amber',
    items: [
      {
        title: 'Libby / OverDrive',
        description: 'Borrow audiobooks completely free using your local library card. Thousands of titles for all ages.',
        type: 'Free',
        url: 'https://libbyapp.com',
      },
      {
        title: 'Learning Ally',
        description: 'Human-narrated audiobooks for students with dyslexia — includes school textbooks and novels.',
        type: 'Paid',
        url: 'https://learningally.org',
      },
      {
        title: 'Bookshare',
        description: 'World\'s largest accessible ebook library. Free for qualifying US students; low-cost UK options.',
        type: 'Free',
        url: 'https://www.bookshare.org',
      },
      {
        title: 'RNIB Talking Books (UK)',
        description: 'Free audiobook postal and download service for those with a print disability. Huge library.',
        type: 'Free',
        url: 'https://www.rnib.org.uk/reading-services/talking-books/',
      },
      {
        title: 'Storynory (Children)',
        description: 'Hundreds of free audio fairy tales, myths, and original children\'s stories. No account needed.',
        type: 'Free',
        url: 'https://www.storynory.com',
      },
      {
        title: 'LibriVox',
        description: 'Completely free public domain audiobooks — Dickens, Austen, Conan Doyle — read by volunteers.',
        type: 'Free',
        url: 'https://librivox.org',
      },
    ],
  },
  {
    category: 'Podcasts About Dyslexia',
    icon: Smartphone,
    color: 'violet',
    items: [
      {
        title: 'Made By Dyslexia Podcast',
        description: 'Kate Griggs interviews dyslexic thinkers, entrepreneurs and leaders. Reframes dyslexia as a strength. Essential listening for adults and teens.',
        type: 'Free',
        url: 'https://madebydyslexia.org/podcast/',
      },
      {
        title: 'Dyslexia Quest Podcast',
        description: 'Practical strategies and lived experience from the dyslexic community. Evidence-based guidance for all ages.',
        type: 'Free',
        url: 'https://podcasts.apple.com/gb/podcast/dyslexia-quest/id1484681267',
      },
      {
        title: 'Understood — Thinking Differently',
        description: 'Thoughtful exploration of learning and thinking differences. Ideal for teens, adults and parents seeking practical guidance.',
        type: 'Free',
        url: 'https://www.understood.org/articles/the-thinking-differently-podcast',
      },
      {
        title: 'British Dyslexia Association Podcast',
        description: 'Expert interviews on dyslexia in education, employment, and daily life from the UK\'s leading charity.',
        type: 'Free',
        url: 'https://www.bdadyslexia.org.uk',
      },
      {
        title: 'Story Pirates Podcast (Children)',
        description: 'Children\'s stories performed with music and comedy — brilliant for building listening skills and imagination.',
        type: 'Free',
        url: 'https://www.storypirates.com/podcast',
      },
      {
        title: 'BBC Sounds — In Our Time',
        description: 'Melvyn Bragg leads deep dives into history, science and philosophy. Builds vocabulary and knowledge for adults.',
        type: 'Free',
        url: 'https://www.bbc.co.uk/programmes/b006qykl/episodes/downloads',
      },
    ],
  },
  {
    category: 'Spelling, Writing & Organisation Apps',
    icon: Smartphone,
    color: 'teal',
    items: [
      {
        title: 'Grammarly',
        description: 'Real-time grammar, spelling and style suggestions. Works in browsers, Word, and email. Free plan is highly useful.',
        type: 'Freemium',
        url: 'https://www.grammarly.com',
      },
      {
        title: 'Google Docs — Voice Typing',
        description: 'Free built-in voice dictation in Google Docs. Tools → Voice Typing. Excellent accuracy for drafting.',
        type: 'Free',
        url: 'https://docs.google.com',
      },
      {
        title: 'Otter.ai',
        description: 'Records voice memos and meetings, then generates an automatic transcript. Free plan available.',
        type: 'Freemium',
        url: 'https://otter.ai',
      },
      {
        title: 'Anki (Spaced Repetition)',
        description: 'The world\'s best free flashcard app using spaced repetition — proven most efficient memory technique.',
        type: 'Free',
        url: 'https://apps.ankiweb.net',
      },
      {
        title: 'Quizlet',
        description: 'Create and share digital flashcards with audio pronunciation — ideal for spelling and vocabulary.',
        type: 'Freemium',
        url: 'https://quizlet.com',
      },
      {
        title: 'Dragon Dictate (Professional)',
        description: 'Industry-leading dictation software for Mac and Windows. Near-perfect accuracy for those who rely on voice input.',
        type: 'Paid',
        url: 'https://www.nuance.com/dragon.html',
      },
    ],
  },
];

const externalLinks = [
  { name: 'NHS Dyslexia Information', url: 'https://www.nhs.uk/conditions/dyslexia/', description: 'Official NHS guidance on symptoms, diagnosis and support' },
  { name: 'British Dyslexia Association', url: 'https://www.bdadyslexia.org.uk/', description: 'UK\'s leading dyslexia charity — helpline, resources, events' },
  { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org/', description: 'Global research, structured literacy standards, practitioner directory' },
  { name: 'Yale Center for Dyslexia & Creativity', url: 'https://dyslexia.yale.edu/', description: 'World-class research on dyslexia, reading science and strengths' },
  { name: 'Reading Rockets', url: 'https://www.readingrockets.org/', description: 'Teaching strategies, phonics resources, and family guides' },
  { name: 'Made By Dyslexia', url: 'https://madebydyslexia.org/', description: 'Global charity reframing dyslexia — famous dyslexics, workplace guides' },
  { name: 'Dyslexia Scotland', url: 'https://www.dyslexiascotland.org.uk/', description: 'Scotland-specific support, assessments and training' },
  { name: 'National Center on Improving Literacy (US)', url: 'https://improvingliteracy.org/', description: 'US government-funded research, screeners and intervention guides' },
  { name: 'Understood.org', url: 'https://www.understood.org/', description: 'Expert-backed guides for parents and adults with learning differences' },
  { name: 'Dyslexia Action', url: 'https://dyslexiaaction.org.uk/', description: 'UK assessment and specialist teaching centre — adults and children' },
];

const typeColors: Record<ResourceItem['type'], string> = {
  PDF: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Link: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  Free: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Freemium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Paid: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

export function ResourcesHub() {
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
                Worksheets, guides, apps, audiobooks and podcasts for individuals with dyslexia, parents, teachers and carers.
                All resources are evidence-based and link to trusted sources.
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

              <div className="flex flex-wrap gap-3 [&>*]:basis-full md:[&>*]:basis-[calc(50%-6px)] [&>*]:min-w-0">
                {category.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                        {item.type}
                      </span>
                    </div>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${item.title}`}
                        className="ml-3 flex-shrink-0 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ) : (
                      <div className="ml-3 flex-shrink-0 p-2 rounded-md">
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
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
            <h3 className="text-xl font-bold text-foreground">Expert Organisations &amp; Research Bodies</h3>
          </div>

          <div className="flex flex-wrap gap-3 [&>*]:basis-full sm:[&>*]:basis-[calc(50%-6px)] [&>*]:min-w-0">
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

      {/* How to use */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">📚 How to Use These Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Worksheets:</strong> Print and use for daily practice. 10 minutes a day beats one long session per week.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>TTS Tools:</strong> Install Natural Reader or Read&Write first — they transform any screen text into audio instantly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Audiobooks:</strong> Start with Libby (free via library) for adults. Storynory is the best free option for children.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Podcasts:</strong> &ldquo;Made By Dyslexia&rdquo; is the single most recommended listen for adults. Begin there.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>External Links:</strong> BDA (UK) and IDA (global) have helplines, practitioner directories, and free fact sheets.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
