import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRoute, type RouteInput } from '../lib/engine.ts';

const day = (gross = 400, restock = 100, transport = 50, other = 0, hours = 5) => ({ gross, restock, transport, other, hours });
const sample = (): RouteInput => ({
  cash: 3000, weeklyFloor: 1000, days: Array.from({ length: 5 }, () => day()),
  retainedHoursWeekly: 0, transitionCosts: 100, routeName: 'Ruta de ejemplo',
  source: 'Fuente de ejemplo', sourceDate: '2026-10-25', owner: 'Responsable de ejemplo', confirmed: true,
});
const run = (input: RouteInput) => evaluateRoute(input, '2026-11-01');

test('exige entre cinco y siete días completos', () => {
  const input = sample(); input.days.pop();
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
  input.days = Array.from({ length: 8 }, () => day());
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
});
test('la reserva usa el menor neto positivo y excluye ceros', () => {
  const input = sample(); input.days[0] = day(150, 100, 50); input.days[1] = day(250, 100, 50);
  const result = run(input);
  assert.equal(result.reserve, 100); assert.equal(result.floor, 2000); assert.equal(result.protectedAmount, 2100);
});
test('un registro con pérdida o sin ningún neto positivo no produce estado completo', () => {
  const input = sample(); input.days[0] = day(100, 100, 50);
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
  input.days = Array.from({ length: 5 }, () => day(150, 100, 50));
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
});
test('el piso semanal debe ser positivo y las horas posibles', () => {
  const input = sample(); input.weeklyFloor = 0;
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
  input.weeklyFloor = 1000; input.days[0].hours = 25;
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
  input.days[0].hours = 5; input.retainedHoursWeekly = 26;
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
});
test('margen negativo bloquea aun con datos de ruta completos', () => {
  const input = sample(); input.cash = 1800; input.transitionCosts = 400;
  const result = run(input); assert.equal(result.margin, -850); assert.equal(result.status, 'NO_DISPONIBLE');
});
test('margen positivo sin fuente o confirmación sigue provisional', () => {
  const input = sample(); input.confirmed = false;
  assert.equal(run(input).status, 'PROVISIONAL');
  input.confirmed = true; input.source = '';
  assert.equal(run(input).status, 'PROVISIONAL');
});
test('fecha futura, antigua o inválida no permite ruta lista', () => {
  const input = sample();
  for (const date of ['2026-11-02', '2026-09-01', '2026-02-30', '']) {
    input.sourceDate = date; assert.equal(run(input).status, 'PROVISIONAL');
  }
});
test('margen suficiente y fuente reciente se presentan como lista para revisar, no verificada', () => {
  const result = run(sample());
  assert.equal(result.status, 'LISTA_PARA_REVISAR');
  assert.match(result.warnings.join(' '), /no demuestra una verificación independiente/);
});
test('horas conservadas añaden solo ingreso informal, sin restar oportunidad dos veces', () => {
  const input = sample(); input.retainedHoursWeekly = 10;
  const result = run(input);
  assert.equal(result.retainedIncome, 1000); assert.equal(result.opportunityCost, 1500);
  assert.equal(result.margin, 1650);
});
test('rechaza montos negativos, infinitos y datos malformados', () => {
  const input = sample(); input.cash = Number.POSITIVE_INFINITY;
  assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
  input.cash = -1; assert.equal(run(input).status, 'DATOS_INCOMPLETOS');
});
