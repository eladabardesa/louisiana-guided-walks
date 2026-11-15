import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const content = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [body];

  const results = [];
  for (const item of items) {
    const key = String(item.key || '').trim();
    if (!key) continue;
    const row = await prisma.siteContent.upsert({
      where: { key },
      update: {
        value: String(item.value ?? ''),
        label: item.label ? String(item.label) : undefined,
      },
      create: {
        key,
        value: String(item.value ?? ''),
        label: item.label ? String(item.label) : null,
      },
    });
    results.push(row);
  }

  return NextResponse.json(results);
}
