import test from 'node:test';
import assert from 'node:assert/strict';
import { readDemoScenario } from '../lib/demo-reader.ts';

const input = {
  cash: 1800, weeklyFloor: 1200, retainedHoursWeekly: 0, transitionCosts: 450,
  days: Array.from({ length: 5 }, () => ({ gross: 400, restock: 100, transport: 30, other: 10, hours: 6 })),
  routeName: 'Opción ficticia', source: '', sourceDate: '', owner: '', confirmed: false,
};

test('recupera únicamente el escenario de demostración y usa la clave publicable', async () => {
  const request: typeof fetch = async (url, options) => {
    assert.equal(String(url), 'https://example.supabase.co/rest/v1/demo_scenarios?id=eq.puente-base&select=payload&limit=1');
    assert.deepEqual(options?.headers, { apikey: 'public-test-key' });
    return Response.json([{ payload: input }]);
  };
  assert.deepEqual(await readDemoScenario('https://example.supabase.co', 'public-test-key', request), input);
});

test('ante falta de configuración, datos inválidos o fallo remoto devuelve null', async () => {
  assert.equal(await readDemoScenario('', ''), null);
  assert.equal(await readDemoScenario('https://example.supabase.co', 'public-test-key', async () => Response.json([{ payload: {} }])), null);
  assert.equal(await readDemoScenario('https://example.supabase.co', 'public-test-key', async () => { throw new Error('offline'); }), null);
});
