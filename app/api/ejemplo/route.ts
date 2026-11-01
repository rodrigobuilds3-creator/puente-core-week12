import { readDemoScenario } from '../../../lib/demo-reader';

export const dynamic = 'force-dynamic';

export async function GET() {
  const input = await readDemoScenario(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_PUBLISHABLE_KEY ?? '');
  if (!input) return Response.json({ error: 'Ejemplo no disponible' }, { status: 503 });
  return Response.json({ input }, { headers: { 'Cache-Control': 'no-store' } });
}
