'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Heart, 
  Target, 
  BookOpen, 
  AlertCircle, 
  HelpCircle, 
  Award,
  ChevronUp 
} from 'lucide-react';

const sections = [
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'toolkit', label: 'Toolkit', icon: Heart },
  { id: 'challenges', label: 'Challenges', icon: Target },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'evidence', label: 'Evidence', icon: HelpCircle },
  { id: 'myths', label: 'Myths & Facts', icon: AlertCircle },
  { id: 'crisis', label: 'Crisis Support', icon: AlertCircle }
];

export const PageNavigation = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button after scrolling down
      setShowBackToTop(window.scrollY > 500);

      // Update active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-sm">
        <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isCrisis = section.id === 'crisis';
              
              return (
                <Button
                  key={section.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    isCrisis ? 'text-red-600 hover:text-red-700 dark:text-red-400' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-lg"
          size="icon"
        >
          <ChevronUp className="h-6 w-6" />
          <span className="sr-only">Back to top</span>
        </Button>
      )}
    </>
  );
};

