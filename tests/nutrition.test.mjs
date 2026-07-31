import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  compressNutritionPhoto,
  createPhotoAnalysisAdapter,
  foodAssemblyTotals,
  foodWeightUnit,
  MAX_FAVORITE_FOODS,
  nutritionDayFor,
  nutritionForSelection,
  photoAnalysisUsage,
  setFoodAssemblyGrams,
  sortFavoriteFoods,
  suggestNutritionTargets,
  sumNutrition,
  targetStatus,
  updateFoodAssembly,
  validateNutritionTargets,
  validatePhotoDescription,
} from '../js/nutrition.js';

test('activity day changes at 06:00', () => {
  assert.equal(nutritionDayFor(new Date(2026, 6, 31, 5, 59)), '2026-07-30');
  assert.equal(nutritionDayFor(new Date(2026, 6, 31, 6, 0)), '2026-07-31');
});

test('male recomposition suggestion is internally coherent', () => {
  const result = suggestNutritionTargets({ weight: 80, height: 178, birthYear: 1988, currentYear: 2026, activityLevel: 'moderate' });
  assert.ok(result.calories > 1800 && result.calories < 3000);
  assert.ok(result.protein >= 140);
  assert.ok(Math.abs(result.carbs * 4 + result.protein * 4 + result.fat * 9 - result.calories) < 80);
});

test('consumed ratio affects totals and estimates are counted', () => {
  const total = sumNutrition([{ calories: 400, carbs: 50, protein: 30, fat: 10, consumedRatio: .5, source: 'estimate' }]);
  assert.equal(total.calories, 200);
  assert.equal(total.protein, 15);
  assert.equal(total.estimatedCount, 1);
});

test('target bands are nutrient-specific', () => {
  assert.equal(targetStatus('calories', 1000, 1000, true), 'good');
  assert.equal(targetStatus('protein', 115, 100, true), 'good');
  assert.equal(targetStatus('fat', 140, 100, true), 'danger');
});

test('target validation catches macro mismatch', () => {
  const result = validateNutritionTargets({ calories: 2000, carbs: 50, protein: 50, fat: 30 });
  assert.ok(result.errors.length > 0);
});

test('photo description blocks short details and accepts a concrete intake note', () => {
  assert.equal(validatePhotoDescription('밥 조금 먹음').valid, false);
  const detailed = validatePhotoDescription('밥 반 공기, 국물은 절반 남기고 고기는 모두 먹음');
  assert.equal(detailed.valid, true);
  assert.equal(detailed.value, '밥 반 공기, 국물은 절반 남기고 고기는 모두 먹음');
});

test('photo analysis usage clearly enforces the daily three-request limit', () => {
  assert.deepEqual(photoAnalysisUsage(2), { used: 2, limit: 3, remaining: 1, exhausted: false });
  assert.deepEqual(photoAnalysisUsage(9), { used: 3, limit: 3, remaining: 0, exhausted: true });
  assert.equal(photoAnalysisUsage(-1).used, 0);
});

test('photo analysis adapter is unavailable and makes no request without an API', async () => {
  const adapter = createPhotoAnalysisAdapter();
  assert.equal(adapter.available, false);
  assert.equal(await adapter.getUsage({ day: '2026-07-31' }), null);
  await assert.rejects(adapter.analyze({}), /아직 연결되지 않았습니다/);
});

test('photo analysis adapter calls the injected API only on explicit analyze', async () => {
  let calls = 0;
  const adapter = createPhotoAnalysisAdapter({
    async analyze(payload) {
      calls += 1;
      return { echoed: payload.description };
    },
  });
  assert.equal(adapter.available, true);
  assert.equal(calls, 0);
  const result = await adapter.analyze({ description: '밥 반 공기를 모두 먹었습니다.' });
  assert.equal(calls, 1);
  assert.equal(result.echoed, '밥 반 공기를 모두 먹었습니다.');
});

test('nutrition photo compression scales the preview without requesting analysis', async () => {
  let closed = false;
  let drawn;
  const bitmap = { width: 3200, height: 2400, close() { closed = true; } };
  const outputBlob = new Blob(['compressed'], { type: 'image/jpeg' });
  const documentRef = {
    createElement(name) {
      assert.equal(name, 'canvas');
      return {
        width: 0,
        height: 0,
        getContext() {
          return { drawImage(...args) { drawn = args; } };
        },
        toBlob(resolve, type, quality) {
          assert.equal(type, 'image/jpeg');
          assert.equal(quality, 0.82);
          resolve(outputBlob);
        },
      };
    },
  };
  const file = { type: 'image/png', size: 2_000_000 };
  const result = await compressNutritionPhoto(file, { documentRef, createBitmap: async () => bitmap });
  assert.equal(result.width, 1024);
  assert.equal(result.height, 768);
  assert.deepEqual(drawn.slice(1), [0, 0, 1024, 768]);
  assert.equal(closed, true);
});

test('photo analysis UI keeps selection separate from the final API request', async () => {
  const html = await readFile(new URL('../diet.html', import.meta.url), 'utf8');
  const selectionHandler = html.slice(html.indexOf("$('photoInput').onchange"), html.indexOf("$('photoDescription').oninput"));
  const requestHandler = html.slice(html.indexOf("$('requestPhotoAnalysis').onclick"), html.indexOf("$('addEntry').onclick"));
  assert.match(selectionHandler, /compressNutritionPhoto\(file\)/);
  assert.doesNotMatch(selectionHandler, /photoAdapter\.analyze/);
  assert.match(requestHandler, /photoAdapter\.analyze/);
  assert.match(html, /신중하게 확인해 주세요/);
  assert.match(html, /섭취량/);
  assert.match(html, /남긴 양/);
  assert.match(html, /조리·제품 특성/);
});

test('favorite food cards assemble like blocks and update nutrition immediately', () => {
  const chicken = { id: 'chicken', name: '닭가슴살', servingLabel: '1팩', calories: 120, carbs: 1, protein: 23, fat: 2 };
  let basket = updateFoodAssembly([], chicken, 1);
  basket = updateFoodAssembly(basket, chicken, 1);
  assert.equal(basket.length, 1);
  assert.equal(basket[0].quantity, 2);
  assert.deepEqual(
    Object.fromEntries(Object.entries(foodAssemblyTotals(basket)).filter(([key]) => ['calories','carbs','protein','fat'].includes(key))),
    { calories: 240, carbs: 2, protein: 46, fat: 4 },
  );
  basket = updateFoodAssembly(basket, chicken, -1);
  assert.equal(basket[0].quantity, 1);
  basket = updateFoodAssembly(basket, chicken, -1);
  assert.equal(basket.length, 0);
});

test('weight foods support 150g, 200g and arbitrary gram selections', () => {
  const rice = { id: 'rice', name: '밥', servingLabel: '100g', calories: 150, carbs: 33, protein: 3, fat: 0.3 };
  assert.deepEqual(foodWeightUnit(rice), { amount: 100, unit: 'g' });
  let basket = setFoodAssemblyGrams([], rice, 150);
  assert.equal(nutritionForSelection(rice, basket[0]).calories, 225);
  basket = setFoodAssemblyGrams(basket, rice, 200);
  assert.equal(nutritionForSelection(rice, basket[0]).carbs, 66);
  basket = setFoodAssemblyGrams(basket, rice, 175);
  assert.equal(nutritionForSelection(rice, basket[0]).multiplier, 1.75);
});

test('favorite foods cap at 30 and support manual or frequency ordering', () => {
  assert.equal(MAX_FAVORITE_FOODS, 30);
  const favorites = [
    { name: '달걀', sortOrder: 1, useCount: 9 },
    { name: '밥', sortOrder: 0, useCount: 2 },
    { name: '닭가슴살', sortOrder: 2, useCount: 15 },
  ];
  assert.deepEqual(sortFavoriteFoods(favorites, 'manual').map(item => item.name), ['밥','달걀','닭가슴살']);
  assert.deepEqual(sortFavoriteFoods(favorites, 'frequency').map(item => item.name), ['닭가슴살','달걀','밥']);
});

test('diet UI keeps one-off tools secondary and defaults new records to current time', async () => {
  const html = await readFile(new URL('../diet.html', import.meta.url), 'utf8');
  assert.match(html, /즐겨먹는 음식 <span id="favoriteCount">0\/30/);
  assert.match(html, /class="assembly-dock hidden"/);
  assert.match(html, /id="assemblyMeal"/);
  assert.match(html, /id="assemblyTime"/);
  assert.match(html, /class="nut-card photo-analysis-card photo-analysis-secondary"/);
  assert.match(html, /\$\('assemblyTime'\)\.value=currentTimeValue\(\)/);
  assert.match(html, /\$\('eTime'\)\.value=editing\?\(data\?\.eatenAt\|\|''\):\(data\?\.eatenAt\|\|currentTimeValue\(\)\)/);
});

test('every user footer marks the diet tab as beta', async () => {
  const pages = ['input.html', 'dashboard.html', 'compare.html', 'achievements.html', 'import.html', 'dressroom.html', 'diet.html'];
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /식단 <span class="nav-beta">BETA<\/span>/, `${page} must display the diet beta badge`);
  }
  const css = await readFile(new URL('../css/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.bottom-nav \.nav-beta/);
});
