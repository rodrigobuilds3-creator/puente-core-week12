import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNumericInput, displayNumericInput, resultHeading, savedDateLabel } from '../lib/presentation.ts';
import { evaluateRoute, type RouteInput } from '../lib/engine.ts';

const input = (): RouteInput => ({cash:1800,weeklyFloor:1200,retainedHoursWeekly:0,transitionCosts:450,
  days:[{gross:480,restock:200,transport:30,other:10,hours:6},{gross:460,restock:190,transport:30,other:10,hours:6},
    {gross:500,restock:220,transport:30,other:10,hours:6},{gross:430,restock:180,transport:30,other:10,hours:6},
    {gross:470,restock:190,transport:30,other:10,hours:6}], routeName:'Ejemplo',source:'',sourceDate:'',owner:'',confirmed:false});

test('blank required numbers stay empty and cannot produce an apparently valid zero calculation',()=>{
  for(const key of ['cash','weeklyFloor','retainedHoursWeekly','transitionCosts'] as const){
    const data=input();data[key]=parseNumericInput('');
    assert.equal(evaluateRoute(data,'2026-11-04').inputValid,false);
    assert.equal(displayNumericInput(data[key]),'');
  }
  const data=input();data.days[0].restock=parseNumericInput('   ');
  assert.equal(evaluateRoute(data,'2026-11-04').inputValid,false);
  assert.equal(parseNumericInput('0'),0);
});
test('reported fixture retains -1260 and +240 without treating positive cash as a verified opportunity',()=>{
  const data=input();const first=evaluateRoute(data,'2026-11-04');
  assert.equal(first.margin,-1260);assert.equal(first.reserve,210);assert.equal(first.net,1160);
  data.cash=3300;const second=evaluateRoute(data,'2026-11-04');
  assert.equal(second.margin,240);assert.equal(second.status,'PROVISIONAL');
  assert.match(resultHeading[second.status],/sin confirmar/);
});
test('invalid old saved dates do not crash the restore label',()=>{
  assert.equal(savedDateLabel('bad date'),null);assert.equal(savedDateLabel(null),null);
  assert.ok(savedDateLabel('2026-11-04T12:00:00Z'));
});
