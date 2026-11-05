import test from 'node:test';
import assert from 'node:assert/strict';
import {appendEvent,MAX_EVENTS,type FeedbackEvent} from '../lib/feedback.ts';

test('opt-out records nothing, even for a valid event',()=>assert.deepEqual(appendEvent([],false,'calculation_attempted',12),[]));
test('schema rejects arbitrary fields and reasons and stores only allowlisted values',()=>{
  assert.deepEqual(appendEvent([],true,{cash:1800,name:'private'},1),[]);
  assert.deepEqual(appendEvent([],true,'reason_selected',1,'private free text'),[]);
  const events=appendEvent([],true,'reason_selected',12.7,'result_unclear');
  assert.deepEqual(events,[{event:'reason_selected',elapsedMs:13,reason:'result_unclear'}]);
  assert.deepEqual(appendEvent([],true,'calculation_attempted',1,{cash:1800}),[{event:'calculation_attempted',elapsedMs:1}]);
});
test('event count and relative time are bounded',()=>{
  let events:FeedbackEvent[]=[];
  for(let i=0;i<MAX_EVENTS+10;i++)events=appendEvent(events,true,'help_requested',i);
  assert.equal(events.length,MAX_EVENTS);
  assert.equal(appendEvent([],true,'help_requested',Infinity).length,0);
  assert.equal(appendEvent([],true,'help_requested',-1).length,0);
  assert.equal(appendEvent([],true,'help_requested',100_000_000)[0].elapsedMs,86_400_000);
});
