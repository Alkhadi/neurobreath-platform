'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'treatments', label: 'Treatments' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'support', label: 'Support' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window?.scrollY ?? 0) > 50);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document?.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 no-print ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="w-[88vw] mx-auto">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => window?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Understanding Depression
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems?.map?.((item) => (
              <button
                key={item?.id}
                onClick={() => scrollToSection(item?.id ?? '')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                {item?.label}
              </button>
            )) ?? null}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems?.map?.((item) => (
              <button
                key={item?.id}
                onClick={() => scrollToSection(item?.id ?? '')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                {item?.label}
              </button>
            )) ?? null}
          </div>
        )}
      </div>
    </nav>
  );
}
