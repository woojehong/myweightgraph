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
  for(const token of ['shiftSelectedDate','mainDatePicker','addBowelEvent','운동 상세 기록','openWorkoutRecorder','mweg-workout-close'])assert.ok(input.includes(token),token);
  assert.ok(!html.includes('시작 시각'));
  assert.ok(db.includes("{ exercise:true }"));
  assert.ok(db.includes("{ exercise:null }"));
  assert.ok(db.includes('workoutProfile:clean'));
  assert.ok(!rules.includes('workoutProfiles'));
  assert.ok(sw.includes('./workout.html'));
});

test('split recorder supports per-set completion, timestamps, filters and unit conversion',async()=>{
  const [source,css,db]=await Promise.all([
    readFile(new URL('../js/workout.js',import.meta.url),'utf8'),
    readFile(new URL('../css/workout.css',import.meta.url),'utf8'),
    readFile(new URL('../js/db.js',import.meta.url),'utf8'),
  ]);
  for(const token of ['data-complete-set','completedAt','data-set-time','favoriteKey','muscleFilter','kgToLb','lbToKg','embed-recorder'])assert.ok(source.includes(token),token);
  for(const token of ['#strengthEditor','set-complete','weight-input','exercise-filters','embed-recorder'])assert.ok(css.includes(token),token);
  assert.ok(db.includes('completedAt: raw.completedAt || null'));
});
