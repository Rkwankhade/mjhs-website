import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, category, message } = body;
  if (!name || !email || !subject || !message) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const msg = await prisma.contactMessage.create({ data: { name, email, phone: phone || null, subject, category: category || 'GENERAL', message } });
  return NextResponse.json(msg, { status: 201 });
}
