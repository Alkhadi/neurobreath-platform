interface LastUpdatedProps {
  date: string;
  className?: string;
}

export function LastUpdated({ date, className = '' }: LastUpdatedProps) {
  const formatted = new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <p className={`text-sm text-slate-600 dark:text-slate-400 ${className}`}>
      <strong>Last updated:</strong> <time dateTime={date}>{formatted}</time>
    </p>
  );
}
