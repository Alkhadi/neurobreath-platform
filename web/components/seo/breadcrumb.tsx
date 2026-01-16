/**
 * Breadcrumb Navigation Component
 * 
 * Provides accessible navigation breadcrumbs with schema.org markup
 */

'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {isLast ? (
              <span
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  let currentPath = '';
  for (const path of paths) {
    currentPath += `/${path}`;
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    items.push({
      label,
      href: currentPath,
    });
  }

  return items;
}
