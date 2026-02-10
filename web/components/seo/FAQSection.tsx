import { JsonLd } from '@/components/seo/json-ld';
import { buildFaqPageSchema, type FaqItem } from '@/lib/seo/faq-schema';

interface FaqSectionProps {
  pageUrl: string;
  faqs: FaqItem[];
  title?: string;
  includeSchema?: boolean;
}

export function FaqSection({
  pageUrl,
  faqs,
  title = 'Frequently asked questions',
  includeSchema = true,
}: FaqSectionProps) {
  if (!faqs?.length) return null;

  const schema = includeSchema ? buildFaqPageSchema({ url: pageUrl, faqs }) : null;

  return (
    <section className="mt-10" aria-labelledby="faq-heading" data-faq-section="true">
      <div className="rounded-2xl border border-neutral-200 bg-white/70 p-5 shadow-sm">
        <h2 id="faq-heading" className="text-lg font-semibold text-neutral-900">
          {title}
        </h2>

        <div className="mt-4 space-y-3">
          {faqs.map(faq => (
            <details key={faq.question} className="rounded-xl border border-neutral-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-neutral-900">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-5 text-xs text-neutral-600">
          Educational information only. If you are worried about your health or safety, seek professional advice.
        </p>
      </div>

      {schema ? <JsonLd data={schema} /> : null}
    </section>
  );
}
