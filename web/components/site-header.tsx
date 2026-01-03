'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Brain, Home, Sparkles, BookOpen, 
  GraduationCap, School, MessageCircle, Info,
  ChevronDown, Heart, Wind, Target, Smile,
  TrendingUp, Award, Download, Users, FileText,
  Zap, Focus, Palette, Dice6, Grid3x3, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { 
    name: 'Hubs', 
    href: '#',
    icon: Sparkles,
    children: [
      { name: 'ADHD Hub', href: '/adhd', description: 'Focus tools & strategies' },
      { name: 'Autism Hub', href: '/autism', description: 'Calm toolkit & resources' },
      { name: 'Blog', href: '/blog', description: 'Articles & guides' },
    ]
  },
  { 
    name: 'Tools', 
    href: '/tools',
    icon: Brain,
    megaMenu: true,
    sections: [
      {
        title: 'Mental Health Tools',
        links: [
          { name: 'ADHD Tools', href: '/tools/adhd-tools', icon: Target },
          { name: 'Autism Tools', href: '/tools/autism-tools', icon: Heart },
          { name: 'Anxiety Tools', href: '/tools/anxiety-tools', icon: Activity },
          { name: 'Depression Tools', href: '/tools/depression-tools', icon: Smile },
          { name: 'Stress Tools', href: '/tools/stress-tools', icon: Zap },
          { name: 'Mood Tools', href: '/tools/mood-tools', icon: Smile },
          { name: 'Sleep Tools', href: '/tools/sleep-tools', icon: Brain },
        ]
      },
      {
        title: 'Interactive Activities',
        links: [
          { name: 'Focus Training', href: '/tools/focus-training', icon: Focus },
          { name: 'ADHD Focus Lab', href: '/tools/adhd-focus-lab', icon: Target },
          { name: 'Focus Tiles', href: '/tools/focus-tiles', icon: Grid3x3 },
          { name: 'Colour Path', href: '/tools/colour-path', icon: Palette },
          { name: 'Breath Tools', href: '/tools/breath-tools', icon: Wind },
          { name: 'Breath Ladder', href: '/tools/breath-ladder', icon: TrendingUp },
          { name: 'Roulette', href: '/tools/roulette', icon: Dice6 },
        ]
      },
      {
        title: 'ADHD Deep Dive',
        links: [
          { name: 'What is ADHD?', href: '/tools/adhd-deep-dive/what-is-adhd' },
          { name: 'Diagnosis', href: '/tools/adhd-deep-dive/diagnosis' },
          { name: 'Assessment', href: '/tools/adhd-deep-dive/assessment' },
          { name: 'Support at Home', href: '/tools/adhd-deep-dive/support-at-home' },
          { name: 'Working with School', href: '/tools/adhd-deep-dive/working-with-school' },
          { name: 'Young People', href: '/tools/adhd-deep-dive/young-people' },
          { name: 'Teens', href: '/tools/adhd-deep-dive/teens' },
          { name: 'Self-Care', href: '/tools/adhd-deep-dive/self-care' },
          { name: 'Helplines', href: '/tools/adhd-deep-dive/helplines' },
        ]
      },
    ]
  },
  { 
    name: 'Breathing', 
    href: '/breathing',
    icon: Wind,
    children: [
      { name: 'All Breathing Exercises', href: '/breathing', description: 'Complete breathing toolkit' },
      { name: 'Box Breathing', href: '/techniques/box-breathing', description: '4-4-4-4 pattern' },
      { name: '4-7-8 Technique', href: '/techniques/4-7-8', description: 'Deep relaxation' },
      { name: 'Coherent Breathing', href: '/techniques/coherent', description: '5-5 balance' },
      { name: 'SOS 60-Second', href: '/techniques/sos', description: 'Quick calm' },
      { name: 'Breath Focus', href: '/breathing/breath', description: 'Mindful breathing' },
      { name: 'Mindfulness', href: '/breathing/mindfulness', description: 'Present moment' },
      { name: 'Focus Garden', href: '/breathing/training/focus-garden', description: 'Gamified practice' },
    ]
  },
  { 
    name: 'Conditions', 
    href: '#',
    icon: Heart,
    children: [
      { name: 'Autism', href: '/conditions/autism', description: 'Autism information & support' },
      { name: 'Autism (Parents)', href: '/conditions/autism-parent', description: 'For parents & carers' },
      { name: 'Anxiety', href: '/conditions/anxiety', description: 'Anxiety support' },
      { name: 'Depression', href: '/conditions/depression', description: 'Depression resources' },
      { name: 'Mood', href: '/conditions/mood', description: 'Mood management' },
      { name: 'Bipolar', href: '/conditions/bipolar', description: 'Bipolar information' },
      { name: 'Low Mood & Burnout', href: '/conditions/low-mood-burnout', description: 'Burnout support' },
      { name: 'Stress', href: '/stress', description: 'Stress management' },
      { name: 'Sleep Issues', href: '/sleep', description: 'Sleep support' },
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    icon: BookOpen,
    children: [
      { name: 'All Resources', href: '/resources', description: 'Complete resource library' },
      { name: 'Downloads', href: '/downloads', description: 'Printable materials' },
      { name: 'Dyslexia Training', href: '/dyslexia-reading-training', description: 'Reading support' },
    ]
  },
  { 
    name: 'For Teachers', 
    href: '/teacher-quick-pack',
    icon: GraduationCap,
    children: [
      { name: 'Teacher Quick Pack', href: '/teacher-quick-pack', description: 'Classroom strategies' },
      { name: 'Schools', href: '/schools', description: 'School support' },
      { name: 'Teacher Dashboard', href: '/teacher/dashboard', description: 'Progress tracking' },
      { name: 'Send Report', href: '/send-report', description: 'Generate reports' },
    ]
  },
  { 
    name: 'Track Progress', 
    href: '/progress',
    icon: TrendingUp,
    children: [
      { name: 'Progress Dashboard', href: '/progress', description: 'View your progress' },
      { name: 'Rewards', href: '/rewards', description: 'Earn achievements' },
      { name: 'AI Coach', href: '/coach', description: 'Personal AI guidance' },
    ]
  },
  { 
    name: 'About', 
    href: '/about',
    icon: Info,
    children: [
      { name: 'About Us', href: '/about-us', description: 'Our story & mission' },
      { name: 'Our Mission', href: '/aims-objectives', description: 'Goals & objectives' },
      { name: 'Contact', href: '/contact', description: 'Get in touch' },
      { name: 'Support Us', href: '/support-us', description: 'Help our mission' },
    ]
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-200',
        scrolled 
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' 
          : 'bg-background'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <Brain className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                NeuroBreath
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children || item.megaMenu ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {/* Mega Menu for Tools */}
                    {openDropdown === item.name && item.megaMenu && item.sections && (
                      <div className="absolute top-full left-0 mt-1 w-[600px] rounded-lg border bg-popover shadow-lg p-4 animate-in fade-in-0 zoom-in-95">
                        <div className="grid grid-cols-3 gap-4">
                          {item.sections.map((section) => (
                            <div key={section.title}>
                              <h4 className="font-semibold text-sm mb-2 text-foreground">{section.title}</h4>
                              <ul className="space-y-1">
                                {section.links.map((link) => (
                                  <li key={link.name}>
                                    <Link
                                      href={link.href}
                                      className={cn(
                                        'flex items-center gap-2 px-2 py-1.5 text-xs rounded-md hover:bg-muted transition-colors',
                                        isActive(link.href) && 'bg-primary/10 text-primary font-medium'
                                      )}
                                    >
                                      {link.icon && <link.icon className="h-3 w-3 flex-shrink-0" />}
                                      <span className="line-clamp-1">{link.name}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular Dropdown Menu */}
                    {openDropdown === item.name && item.children && (
                      <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border bg-popover shadow-lg p-2 animate-in fade-in-0 zoom-in-95 max-h-[calc(100vh-100px)] overflow-y-auto">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'block px-3 py-2 rounded-md hover:bg-muted transition-colors',
                              isActive(child.href) && 'bg-primary/10 text-primary'
                            )}
                          >
                            <div className="font-medium text-sm">{child.name}</div>
                            <div className="text-xs text-muted-foreground">{child.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 animate-in slide-in-from-top-5 fade-in-20 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children || item.megaMenu ? (
                    <div>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className={cn(
                          'flex w-full items-center justify-between px-3 py-2 text-base font-medium rounded-md transition-colors',
                          'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          {item.name}
                        </span>
                        <ChevronDown 
                          className={cn(
                            'h-4 w-4 transition-transform',
                            openDropdown === item.name && 'rotate-180'
                          )} 
                        />
                      </button>
                      {openDropdown === item.name && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-muted pl-4">
                          {/* Mega Menu Sections */}
                          {item.sections && item.sections.map((section) => (
                            <div key={section.title} className="py-2">
                              <h4 className="font-semibold text-xs text-foreground mb-1 px-3">{section.title}</h4>
                              {section.links.map((link) => (
                                <Link
                                  key={link.name}
                                  href={link.href}
                                  className={cn(
                                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                                    isActive(link.href)
                                      ? 'bg-primary/10 text-primary font-medium'
                                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                  )}
                                >
                                  {link.icon && <link.icon className="h-4 w-4" />}
                                  {link.name}
                                </Link>
                              ))}
                            </div>
                          ))}

                          {/* Regular Children */}
                          {item.children && item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'block px-3 py-2 text-sm rounded-md transition-colors',
                                isActive(child.href)
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              <div>{child.name}</div>
                              <div className="text-xs text-muted-foreground">{child.description}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-base font-medium rounded-md transition-colors',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-4 space-y-2 border-t pt-4">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-purple-600" asChild>
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
