import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_SPONSOR_INPUT as defaults,calculateSponsorship as calc,planInput,cleanScenario,readSponsorScenarios,writeSponsorScenarios,MAX_SCENARIOS} from '../lib/sponsorship.ts';

test('manual pilot costs derive a contract quote; margin is not markup',()=>{
  const r=calc({...defaults});assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.staffHours,17);assert.equal(r.laborCost,2040);assert.equal(r.deliveryCost,2240);
  assert.equal(r.costDerivedQuote,2800);assert.equal(r.contribution,560);assert.equal(r.actualMarginPct,20);
  assert.equal(r.fullResourceCost,2980);assert.equal(r.ratio,5000/2980);assert.equal(r.passesTen,false);
});
test('program duration includes support and infrastructure each month but setup only once',()=>{
  const r=calc(planInput('program'));assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.staffHours,43);assert.equal(r.infrastructureCost,600);assert.equal(r.quote,7200);
  assert.equal(r.monthlyEquivalent,2400);assert.equal(r.annualEquivalent,28800);
});
test('conversion never fabricates signed agreements or cash; fractional expected sponsors are explicit',()=>{
  const r=calc({...defaults,prospects:5,conversionPct:10});assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.expectedAgreements,.5);assert.equal(r.signedContractValue,0);assert.equal(r.signedParticipants,0);
  const zero=calc({...defaults,conversionPct:0,signedAgreements:1,cashReceived:100});assert.ok(zero.ok);if(!zero.ok)return;
  assert.equal(zero.expectedContractValue,0);assert.equal(zero.signedContractValue,2800);assert.equal(zero.unfundedDeliveryCost,2140);
});
test('capacity shortage stays visible for both forecast and signed cohort',()=>{
  const r=calc({...defaults,prospects:10,conversionPct:100,signedAgreements:7,capacity:100});assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.expectedCapacityShortfall,100);assert.equal(r.signedCapacityShortfall,40);assert.equal(r.deliverableSignedParticipants,100);
});
test('alternative offer below cost shows a loss and does not alter resource comparison',()=>{
  const r=calc({...defaults,offeredQuote:1000});assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.contribution,-1240);assert.equal(r.fullResourceCost,2980);assert.equal(r.actualMarginPct,-124);
});
test('blank/nonfinite, negatives, fractional counts and impossible agreement cash combinations fail',()=>{
  for(const patch of [{months:0},{participants:2.5},{participants:NaN},{hourlyCost:Infinity},{marginPct:100},{offeredQuote:-1},{conversionPct:101},{signedAgreements:11},{signedAgreements:0,cashReceived:1}])assert.equal(calc({...defaults,...patch}).ok,false,JSON.stringify(patch));
});
test('zero resource denominator does not produce an infinite 10:1 success',()=>{
  const r=calc({...defaults,hourlyCost:0,infrastructureMonthly:0,workerHourlyCost:0});assert.ok(r.ok);if(!r.ok)return;
  assert.equal(r.ratio,null);assert.equal(r.passesTen,false);
});
const row={id:'scenario-A',name:'Piloto ficticio A',savedAt:'2026-11-13T12:00:00.000Z',input:{...defaults}};
test('two distinct scenarios reopen independently and retain editable inputs',()=>{
  const b={...row,id:'scenario-B',name:'Programa ficticio B',input:planInput('program')};
  const rows=readSponsorScenarios(writeSponsorScenarios([row,b]));assert.equal(rows.length,2);
  assert.equal(rows[0].input.participants,20);assert.equal(rows[1].input.participants,60);
  const modified={...rows[0],input:{...rows[0].input,participants:25}};
  const next=readSponsorScenarios(writeSponsorScenarios([modified,b]));assert.equal(next[0].input.participants,25);assert.equal(next[1].input.participants,60);
});
test('corrupted, unsupported, duplicate and excessive storage is rejected without discarding data silently',()=>{
  for(const raw of ['{','{"version":2,"scenarios":[]}',JSON.stringify({version:1,scenarios:[row,row]}),JSON.stringify({version:1,scenarios:Array.from({length:MAX_SCENARIOS+1},(_,i)=>({...row,id:String(i)}))})])assert.throws(()=>readSponsorScenarios(raw));
  assert.equal(cleanScenario({...row,email:'private@example.invalid'}),null);
  assert.equal(cleanScenario({...row,name:'x'.repeat(41)}),null);
  assert.equal(cleanScenario({...row,input:{...defaults,personalRecord:'private'}}),null);
  assert.deepEqual(readSponsorScenarios(null),[]);
});
