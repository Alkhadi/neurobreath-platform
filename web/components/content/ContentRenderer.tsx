import { cn } from '@/lib/utils';
import type { ResolvedContentBlock } from '@/lib/content/canonical-schema';
import type { Region } from '@/lib/region/region';
import { splitTextWithGlossary } from '@/lib/glossary/recogniseTerms';
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip';

interface ContentRendererProps {
  blocks: ResolvedContentBlock[];
  region?: Region;
  enableGlossaryTooltips?: boolean;
  glossaryMaxLinks?: number;
}

export function ContentRenderer({ blocks, region, enableGlossaryTooltips, glossaryMaxLinks = 5 }: ContentRendererProps) {
  let glossaryRemaining = glossaryMaxLinks;

  const renderGlossaryText = (text: string) => {
    if (!enableGlossaryTooltips || !region || glossaryRemaining <= 0) return text;
    const segments = splitTextWithGlossary(text, region, glossaryRemaining);
    const termCount = segments.filter(segment => segment.type === 'term').length;
    glossaryRemaining = Math.max(0, glossaryRemaining - termCount);

    return segments.map((segment, index) => {
      if (segment.type === 'text') return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
      return (
        <GlossaryTooltip
          key={`${segment.termId}-${index}`}
          termId={segment.termId || ''}
          display={segment.value}
          region={region}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {blocks.map(block => {
        switch (block.type) {
          case 'heading': {
            const HeadingTag = block.level;
            return (
              <HeadingTag key={block.id} className="text-xl font-semibold text-slate-900">
                {block.text}
              </HeadingTag>
            );
          }
          case 'paragraph':
            return (
              <p key={block.id} className="text-sm text-slate-600 leading-relaxed">
                {renderGlossaryText(block.text)}
              </p>
            );
          case 'bullets':
            return (
              <ul key={block.id} className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                {block.items.map((item, index) => (
                  <li key={`${block.id}-${index}`}>{renderGlossaryText(item)}</li>
                ))}
              </ul>
            );
          case 'steps':
            return (
              <ol key={block.id} className="list-decimal pl-5 text-sm text-slate-600 space-y-2">
                {block.items.map((item, index) => (
                  <li key={`${block.id}-${index}`}>{renderGlossaryText(item)}</li>
                ))}
              </ol>
            );
          case 'callout':
            return (
              <div key={block.id} className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
                {renderGlossaryText(block.text)}
              </div>
            );
          case 'cta':
            return (
              <a
                key={block.id}
                href={block.cta.href}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700',
                )}
              >
                {block.cta.label}
              </a>
            );
          case 'divider':
            return <hr key={block.id} className="border-slate-200" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
