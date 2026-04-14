import { z } from 'zod';

export const runtime = 'nodejs';

const testimonialSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(10).max(500),
  email: z.string().email().optional().or(z.literal('')),
});

function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[^\S ]+/g, ' ')
    .trim();
}

// In-memory store placeholder — replace with database in production.
const pendingTestimonials: Array<{
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  email?: string;
  status: 'pending';
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        { ok: false, error: 'Invalid request body' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: 'Validation failed',
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const { name, role, rating, quote, email } = parsed.data;

    const entry = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: sanitize(name),
      role: sanitize(role),
      rating,
      quote: sanitize(quote),
      email: email ? sanitize(email) : undefined,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    pendingTestimonials.push(entry);

    return Response.json(
      { ok: true, id: entry.id, status: entry.status },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { ok: false, error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
