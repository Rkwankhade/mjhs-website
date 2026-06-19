import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  req: NextRequest,
  options: { windowMs?: number; max?: number } = {}
): { success: boolean; remaining: number } {
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW || '60000');
  const max = options.max || parseInt(process.env.RATE_LIMIT_MAX || '100');

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1 };
  }

  if (existing.count >= max) {
    return { success: false, remaining: 0 };
  }

  existing.count++;
  return { success: true, remaining: max - existing.count };
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: { windowMs?: number; max?: number }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { success, remaining } = rateLimit(req, options);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60',
          },
        }
      );
    }

    const response = await handler(req);
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return response;
  };
}

export function validateCSRF(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin || !host) return true; // Allow requests without origin (e.g., server-to-server)

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 10000); // Limit length
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function createApiError(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function createApiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ data, success: true }, { status });
}
