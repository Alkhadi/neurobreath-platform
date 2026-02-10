import Link from 'next/link';
import { Shield, FileText, BookOpen, AlertCircle, Lock, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustLayoutProps {
  children: React.ReactNode;
}

const trustLinks = [
  {
    href: '/trust',
    label: 'Overview',
    icon: Shield,
  },
  {
    href: '/trust/evidence-policy',
    label: 'Evidence Policy',
    icon: BookOpen,
  },
  {
    href: '/trust/editorial-policy',
    label: 'Editorial Policy',
    icon: FileText,
  },
  {
    href: '/trust/sources',
    label: 'Sources',
    icon: BookOpen,
  },
  {
    href: '/trust/safeguarding',
    label: 'Safeguarding',
    icon: AlertCircle,
  },
  {
    href: '/trust/privacy',
    label: 'Privacy',
    icon: Lock,
  },
  {
    href: '/trust/terms',
    label: 'Terms',
    icon: Scale,
  },
  {
    href: '/trust/disclaimer',
    label: 'Disclaimer',
    icon: FileText,
  },
];

export default function TrustLayout({ children }: TrustLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-2 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Trust Centre
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Our commitment to evidence-based, safe, and transparent health information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <nav className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Navigation
              </h2>
              <ul className="space-y-1">
                {trustLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                          "dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
