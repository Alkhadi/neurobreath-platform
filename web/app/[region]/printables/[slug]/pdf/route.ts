import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { getPrintableById, getPrintableSummary, getPrintableTitle } from '@/lib/printables/printables';
import { getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';

export const runtime = 'nodejs';

interface PrintablePdfRouteProps {
  params: Promise<{ region: string; slug: string }>;
}

const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

export async function GET(request: Request, { params }: PrintablePdfRouteProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const printable = getPrintableById(resolved.slug);

  if (!printable || !printable.formatOptions.pdf) {
    return new NextResponse('Not found', { status: 404 });
  }

  const title = getPrintableTitle(printable, region);
  const summary = getPrintableSummary(printable, region);
  const canonicalUrl = generateCanonicalUrl(`/${regionKey}/printables/${printable.id}`);

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const lineHeight = 16;
  const contentWidth = pageWidth - margin * 2;
  const footerHeight = 36;

  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  y = addWrappedText(doc, title, margin, y, contentWidth, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  y += 6;
  y = addWrappedText(doc, summary, margin, y, contentWidth, lineHeight);
  y += 8;

  const addSectionHeading = (heading: string) => {
    if (y + 24 > pageHeight - margin - footerHeight) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    y = addWrappedText(doc, heading, margin, y, contentWidth, lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  };

  const addBulletList = (items: string[]) => {
    items.forEach(item => {
      const bulletText = `• ${item}`;
      if (y + lineHeight > pageHeight - margin - footerHeight) {
        doc.addPage();
        y = margin;
      }
      y = addWrappedText(doc, bulletText, margin, y, contentWidth, lineHeight);
    });
  };

  const addStepList = (steps: string[]) => {
    steps.forEach((step, index) => {
      const stepText = `${index + 1}. ${step}`;
      if (y + lineHeight > pageHeight - margin - footerHeight) {
        doc.addPage();
        y = margin;
      }
      y = addWrappedText(doc, stepText, margin, y, contentWidth, lineHeight);
    });
  };

  printable.sections.forEach(section => {
    addSectionHeading(section.heading);
    section.blocks.forEach(block => {
      if (block.type === 'paragraph') {
        y = addWrappedText(doc, block.text, margin, y, contentWidth, lineHeight);
      }
      if (block.type === 'bullets') {
        addBulletList(block.items);
      }
      if (block.type === 'steps') {
        addStepList(block.steps);
      }
      if (block.type === 'table') {
        const headers = block.table.headers.join(' | ');
        y = addWrappedText(doc, headers, margin, y, contentWidth, lineHeight);
        block.table.rows.forEach(row => {
          const rowText = row.join(' | ');
          y = addWrappedText(doc, rowText, margin, y, contentWidth, lineHeight);
        });
      }
      y += 8;
    });
  });

  const footerText = `Educational resource — not medical advice · Last reviewed ${printable.reviewedAt} · ${canonicalUrl}`;
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(9);
  doc.setTextColor('#444444');
  for (let pageIndex = 1; pageIndex <= pageCount; pageIndex += 1) {
    doc.setPage(pageIndex);
    doc.text(footerText, margin, pageHeight - margin / 2);
  }

  const pdfBuffer = doc.output('arraybuffer');

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${printable.id}.pdf"`,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex, nofollow',
      Link: `<${canonicalUrl}>; rel="canonical"`,
    },
  });
}
