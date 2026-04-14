import { NextResponse } from 'next/server';
import { TEMPLATES, TEMPLATE_ORDER } from '@/lib/templates';

/**
 * GET /api/templates
 * Returns the 5 canonical templates.
 * These are static seed data — never user-edited.
 */
export async function GET() {
  const templates = TEMPLATE_ORDER.map((key) => TEMPLATES[key]);
  return NextResponse.json({ templates });
}
