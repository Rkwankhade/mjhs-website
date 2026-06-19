import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: {
      name,
      email,
      phone: phone || null,
      password: hashed,
      role: 'STAFF',
      status: 'PENDING', // must be approved by super admin
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
