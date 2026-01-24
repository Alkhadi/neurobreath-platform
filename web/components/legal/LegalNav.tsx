import Link from 'next/link';

interface LegalNavProps {
  region: 'uk' | 'us';
  currentPage?: 'privacy' | 'terms' | 'cookies' | 'disclaimer' | 'accessibility' | 'data-rights' | 'privacy-rights';
}

export function LegalNav({ region, currentPage }: LegalNavProps) {
  const prefix = `/${region}/legal`;
  
  const ukLinks = [
    { href: `${prefix}/privacy`, label: 'Privacy Policy', key: 'privacy' },
    { href: `${prefix}/terms`, label: 'Terms of Service', key: 'terms' },
    { href: `${prefix}/cookies`, label: 'Cookie Policy', key: 'cookies' },
    { href: `${prefix}/disclaimer`, label: 'Disclaimer', key: 'disclaimer' },
    { href: `${prefix}/accessibility`, label: 'Accessibility', key: 'accessibility' },
    { href: `${prefix}/data-rights`, label: 'Your Data Rights', key: 'data-rights' },
  ] as const;
  
  const usLinks = [
    { href: `${prefix}/privacy`, label: 'Privacy Policy', key: 'privacy' },
    { href: `${prefix}/terms`, label: 'Terms of Service', key: 'terms' },
    { href: `${prefix}/cookies`, label: 'Cookie Policy', key: 'cookies' },
    { href: `${prefix}/disclaimer`, label: 'Disclaimer', key: 'disclaimer' },
    { href: `${prefix}/accessibility`, label: 'Accessibility', key: 'accessibility' },
    { href: `${prefix}/privacy-rights`, label: 'Your Privacy Rights', key: 'privacy-rights' },
  ] as const;
  
  const links = region === 'uk' ? ukLinks : usLinks;
  
  return (
    <nav className="mb-8 pb-6 border-b" aria-label="Legal pages navigation">
      <ul className="flex flex-wrap gap-3 text-sm">
        {links.map((link) => {
          const isCurrent = currentPage === link.key;
          return (
            <li key={link.key}>
              {isCurrent ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold" aria-current="page">
                  {link.label}
                </span>
              ) : (
                <Link
                  href={link.href}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
