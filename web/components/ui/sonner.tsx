'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[var(--nb-toast-surface)] group-[.toaster]:text-[var(--nb-toast-body)] group-[.toaster]:border-[var(--nb-toast-border)] group-[.toaster]:shadow-lg',
          title:
            'group-[.toast]:text-[var(--nb-toast-title)] group-[.toast]:font-semibold',
          description:
            'group-[.toast]:text-[var(--nb-toast-muted)]',
          actionButton:
            'group-[.toast]:bg-[var(--nb-btn-primary-bg)] group-[.toast]:text-[var(--nb-btn-primary-text)]',
          cancelButton:
            'group-[.toast]:bg-[var(--nb-surface-soft)] group-[.toast]:text-[var(--nb-text-secondary)]',
          error:
            'group-[.toaster]:bg-[var(--nb-error-bg)] group-[.toaster]:border-[var(--nb-error-border)] group-[.toaster]:text-[var(--nb-error-text)]',
          success:
            'group-[.toaster]:bg-[var(--nb-success-bg)] group-[.toaster]:border-[var(--nb-success-border)] group-[.toaster]:text-[var(--nb-success-text)]',
          warning:
            'group-[.toaster]:bg-[var(--nb-warning-bg)] group-[.toaster]:border-[var(--nb-warning-border)] group-[.toaster]:text-[var(--nb-warning-text)]',
          info:
            'group-[.toaster]:bg-[var(--nb-info-bg)] group-[.toaster]:border-[var(--nb-info-border)] group-[.toaster]:text-[var(--nb-info-text)]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
