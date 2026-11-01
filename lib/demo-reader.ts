import { evaluateRoute, type RouteInput } from './engine.ts';

/** Read only a curated fictional example. No visitor inputs are sent to Supabase. */
export async function readDemoScenario(url: string, key: string, request: typeof fetch = fetch): Promise<RouteInput | null> {
  if (!url || !key) return null;
  try {
    const endpoint = new URL('/rest/v1/demo_scenarios?id=eq.puente-base&select=payload&limit=1', url);
    const response = await request(endpoint, {
      headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const rows: unknown = await response.json();
    if (!Array.isArray(rows) || rows.length !== 1 || !rows[0] || typeof rows[0] !== 'object') return null;
    const candidate = (rows[0] as { payload?: RouteInput }).payload;
    return candidate && evaluateRoute(candidate).inputValid ? candidate : null;
  } catch {
    return null;
  }
}
