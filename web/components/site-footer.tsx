'use client';

import Link from 'next/link';
import { Brain, Heart, Mail, Twitter, Github, Linkedin, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const footerLinks = {
  hubs: {
    title: 'Our Hubs',
    links: [
      { name: 'ADHD Hub', href: '/adhd' },
      { name: 'Autism Hub', href: '/autism' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  tools: {
    title: 'Tools & Resources',
    links: [
      { name: 'Interactive Tools', href: '/tools' },
      { name: 'Breathing Exercises', href: '/breathing' },
      { name: 'Resources', href: '/resources' },
      { name: 'Downloads', href: '/downloads' },
    ],
  },
  educators: {
    title: 'For Educators',
    links: [
      { name: 'Teacher Quick Pack', href: '/teacher-quick-pack' },
      { name: 'Schools', href: '/schools' },
      { name: 'Getting Started', href: '/get-started' },
    ],
  },
  about: {
    title: 'About',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/aims-objectives' },
      { name: 'Contact', href: '/contact' },
      { name: 'Support Us', href: '/support-us' },
    ],
  },
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'GitHub', href: '#', icon: Github },
];

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center space-x-2 group mb-4">
                <div className="relative">
                  <Brain className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  NeuroBreath
                </span>
              </Link>
              
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Empowering neurodivergent people, parents, teachers, and carers with evidence-based tools and resources for ADHD and autism support.
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span>Supporting neurodiversity with care</span>
              </div>

              {/* Newsletter */}
              <div className="max-w-sm">
                <h3 className="text-sm font-semibold mb-2">Stay Updated</h3>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                    disabled={subscribed}
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={subscribed}
                  >
                    {subscribed ? 'Subscribed!' : 'Subscribe'}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  Get updates on new tools and resources
                </p>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {Object.entries(footerLinks).map(([key, section]) => (
                  <div key={key}>
                    <h3 className="text-sm font-semibold mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} NeuroBreath. All rights reserved.
              </p>
              <p className="text-xs mt-1">
                Evidence-based support from NICE, CDC, NHS & peer-reviewed research
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground sm:justify-start">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
            <span>•</span>
            <Link href="/accessibility" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 text-xs text-muted-foreground/80 max-w-4xl">
            <p className="italic">
              <strong>Disclaimer:</strong> NeuroBreath provides educational information only and is not medical advice. 
              For diagnosis, treatment, or medical concerns, please consult qualified healthcare professionals. 
              All strategies and tools are evidence-informed but should be adapted to individual needs with professional guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
