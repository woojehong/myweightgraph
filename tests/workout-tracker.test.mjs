import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { EXERCISE_CATALOG,kgToLb,lbToKg,MUSCLES } from '../js/workout-catalog.js';

test('workout catalog is broad, unique and uses the approved muscle map',()=>{
  assert.ok(EXERCISE_CATALOG.length>=70);
  assert.equal(new Set(EXERCISE_CATALOG.map(x=>x.id)).size,EXERCISE_CATALOG.length);
  assert.equal(MUSCLES.length,17);
  for(const item of EXERCISE_CATALOG){
    assert.ok(item.name&&item.equipment&&Array.isArray(item.primary));
    item.primary.forEach(m=>assert.ok(MUSCLES.includes(m),`${item.name}: ${m}`));
  }
});

test('kg and lb conversion round trips within display precision',()=>{
  assert.equal(lbToKg(kgToLb(60)),60);
  assert.equal(kgToLb(10),22.05);
});

test('exercise page and data input expose the approved recording flow',async()=>{
  const [html,input,db,rules,sw]=await Promise.all([
    readFile(new URL('../workout.html',import.meta.url),'utf8'),
    readFile(new URL('../input.html',import.meta.url),'utf8'),
    readFile(new URL('../js/db.js',import.meta.url),'utf8'),
    readFile(new URL('../firestore.rules',import.meta.url),'utf8'),
    readFile(new URL('../sw.js',import.meta.url),'utf8'),
  ]);
  for(const token of ['웨이트','러닝','자동 임시저장','kg','lb','내 데이터'])assert.match(html,new RegExp(token));
  for(const token of ['shiftSelectedDate','mainDatePicker','addBowelEvent','상세 운동 기록'])assert.ok(input.includes(token),token);
  assert.ok(db.includes("{ exercise:true }"));
  assert.ok(db.includes("{ exercise:null }"));
  assert.ok(rules.includes('workoutProfiles'));
  assert.ok(sw.includes('./workout.html'));
});
