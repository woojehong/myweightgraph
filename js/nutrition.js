export const ACTIVITY_LEVELS = Object.freeze({
  low:      { label: '낮음', factor: 1.3, note: '좌식 생활 · 운동 주 1~2회' },
  moderate: { label: '보통', factor: 1.5, note: '웨이트 주 3~4회' },
  high:     { label: '높음', factor: 1.7, note: '웨이트 주 5회 이상 · 활동량 높음' },
});

export const PHOTO_ANALYSIS_DAILY_LIMIT = 3;
export const PHOTO_DESCRIPTION_MIN_LENGTH = 15;
export const MAX_FAVORITE_FOODS = 30;

export function foodAssemblyKey(food = {}) {
  return String(food.presetId || food.id || food.name || '').trim();
}

export function foodWeightUnit(food = {}) {
  const explicitAmount = Number(food.servingAmount);
  const explicitUnit = String(food.unit || '').toLowerCase();
  if (explicitAmount > 0 && explicitUnit === 'g') return { amount: explicitAmount, unit: 'g' };
  const match = String(food.servingLabel || '').match(/(\d+(?:\.\d+)?)\s*g\b/i);
  return match ? { amount: Number(match[1]), unit: 'g' } : null;
}

export function nutritionForSelection(food = {}, selection = {}) {
  const weight = foodWeightUnit(food);
  const quantity = Math.max(0, Number(selection.quantity) || 0);
  const grams = weight && Number(selection.grams) > 0 ? Number(selection.grams) : null;
  const multiplier = grams == null ? quantity : grams / weight.amount;
  const scaled = {};
  for (const key of ['calories', 'carbs', 'protein', 'fat', 'sodium', 'sugar']) {
    const value = food[key];
    scaled[key] = value == null ? null : Number(value) * multiplier;
  }
  return { ...scaled, multiplier, quantity, grams };
}

export function updateFoodAssembly(items = [], food = {}, delta = 1) {
  const key = foodAssemblyKey(food);
  if (!key) return [...items];
  const next = items.map(item => ({ ...item }));
  const index = next.findIndex(item => item.key === key);
  const weight = foodWeightUnit(food);
  if (index < 0) {
    if (delta <= 0) return next;
    next.push({ key, food, quantity: delta, grams: weight ? weight.amount * delta : null });
    return next;
  }
  const item = next[index];
  if (weight && item.grams != null) {
    item.grams = Math.max(0, item.grams + weight.amount * delta);
    item.quantity = item.grams / weight.amount;
  } else {
    item.quantity = Math.max(0, Number(item.quantity || 0) + delta);
  }
  if (item.quantity <= 0 || item.grams === 0) next.splice(index, 1);
  return next;
}

export function setFoodAssemblyGrams(items = [], food = {}, grams) {
  const weight = foodWeightUnit(food);
  if (!weight) return [...items];
  const key = foodAssemblyKey(food);
  const next = items.map(item => ({ ...item }));
  const index = next.findIndex(item => item.key === key);
  const safeGrams = Math.max(0, Number(grams) || 0);
  if (safeGrams === 0) {
    if (index >= 0) next.splice(index, 1);
    return next;
  }
  const value = { key, food, grams: safeGrams, quantity: safeGrams / weight.amount };
  if (index >= 0) next[index] = value;
  else next.push(value);
  return next;
}

export function foodAssemblyTotals(items = []) {
  return items.reduce((total, item) => {
    const scaled = nutritionForSelection(item.food, item);
    for (const key of ['calories', 'carbs', 'protein', 'fat', 'sodium', 'sugar']) {
      if (scaled[key] != null) total[key] += scaled[key];
    }
    total.itemCount += 1;
    total.unitCount += scaled.quantity;
    return total;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, sugar: 0, itemCount: 0, unitCount: 0 });
}

export function sortFavoriteFoods(favorites = [], mode = 'manual') {
  const rows = [...favorites];
  if (mode === 'frequency') {
    return rows.sort((a, b) => Number(b.useCount || 0) - Number(a.useCount || 0)
      || Number(a.sortOrder ?? 999) - Number(b.sortOrder ?? 999)
      || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
  }
  if (mode === 'name') return rows.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
  return rows.sort((a, b) => Number(a.sortOrder ?? 999) - Number(b.sortOrder ?? 999)
    || Number(b.useCount || 0) - Number(a.useCount || 0));
}

export function normalizePhotoDescription(value = '') {
  return String(value).trim().replace(/\s+/g, ' ');
}

export function validatePhotoDescription(value = '', minimum = PHOTO_DESCRIPTION_MIN_LENGTH) {
  const normalized = normalizePhotoDescription(value);
  const meaningfulLength = normalized.replace(/\s/g, '').length;
  return {
    value: normalized,
    length: meaningfulLength,
    minimum,
    valid: meaningfulLength >= minimum,
    message: meaningfulLength >= minimum
      ? '분석에 필요한 설명이 입력되었습니다.'
      : `실제로 먹은 양과 남긴 음식을 ${minimum}자 이상 자세히 적어주세요.`,
  };
}

export function photoAnalysisUsage(used = 0, limit = PHOTO_ANALYSIS_DAILY_LIMIT) {
  const safeLimit = Math.max(0, Math.floor(Number(limit) || 0));
  const safeUsed = Math.min(safeLimit, Math.max(0, Math.floor(Number(used) || 0)));
  return {
    used: safeUsed,
    limit: safeLimit,
    remaining: Math.max(0, safeLimit - safeUsed),
    exhausted: safeUsed >= safeLimit,
  };
}

export function createPhotoAnalysisAdapter(adapter) {
  const analyze = typeof adapter?.analyze === 'function' ? adapter.analyze.bind(adapter) : null;
  const getUsage = typeof adapter?.getUsage === 'function' ? adapter.getUsage.bind(adapter) : null;
  return Object.freeze({
    available: Boolean(analyze),
    async getUsage(context) {
      if (!getUsage) return null;
      return getUsage(context);
    },
    async analyze(payload) {
      if (!analyze) throw new Error('사진 분석 서버가 아직 연결되지 않았습니다.');
      return analyze(payload);
    },
  });
}

export async function compressNutritionPhoto(file, {
  maxBytes = 10 * 1024 * 1024,
  maxDimension = 1024,
  quality = 0.82,
  documentRef = globalThis.document,
  createBitmap = globalThis.createImageBitmap,
} = {}) {
  if (!file || !String(file.type || '').startsWith('image/')) {
    throw new Error('이미지 파일만 선택할 수 있습니다.');
  }
  if (Number(file.size) > maxBytes) {
    throw new Error('원본 사진은 10MB 이하만 선택할 수 있습니다.');
  }
  if (!documentRef?.createElement || typeof createBitmap !== 'function') {
    throw new Error('이 브라우저에서는 사진 압축을 지원하지 않습니다.');
  }

  const bitmap = await createBitmap(file);
  try {
    const sourceWidth = Number(bitmap.width);
    const sourceHeight = Number(bitmap.height);
    if (!(sourceWidth > 0) || !(sourceHeight > 0)) throw new Error('사진 크기를 확인할 수 없습니다.');
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = documentRef.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('사진 압축을 시작할 수 없습니다.');
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('사진 압축에 실패했습니다.');
    return {
      blob,
      width,
      height,
      originalBytes: Number(file.size) || 0,
      compressedBytes: blob.size,
      mimeType: blob.type || 'image/jpeg',
    };
  } finally {
    bitmap.close?.();
  }
}

const round5 = value => Math.max(0, Math.round(Number(value || 0) / 5) * 5);

export function suggestNutritionTargets({
  weight, height, birthYear, activityLevel = 'moderate', currentYear = new Date().getFullYear(),
}) {
  const w = Number(weight);
  const h = Number(height);
  const age = Math.max(18, currentYear - Number(birthYear));
  if (!(w > 0) || !(h > 0) || !Number.isFinite(age)) {
    throw new Error('목표 제안에는 현재 체중·신장·출생연도가 필요합니다.');
  }
  const activity = ACTIVITY_LEVELS[activityLevel] || ACTIVITY_LEVELS.moderate;
  const bmr = 10 * w + 6.25 * h - 5 * age + 5;
  const maintenance = bmr * activity.factor;
  const calories = round5(maintenance * 0.9);
  const protein = round5(w * 1.8);
  const fat = round5(Math.max(w * 0.8, calories * 0.22 / 9));
  const carbs = round5(Math.max(80, (calories - protein * 4 - fat * 9) / 4));
  return {
    calories, protein, carbs, fat,
    bmr: Math.round(bmr),
    maintenance: Math.round(maintenance),
    activityLevel,
    method: 'mifflin-st-jeor-recomp-v1',
  };
}

export function validateNutritionTargets(targets) {
  const t = {
    calories: Number(targets?.calories),
    carbs: Number(targets?.carbs),
    protein: Number(targets?.protein),
    fat: Number(targets?.fat),
    sodium: Number(targets?.sodium || 2000),
    sugar: Number(targets?.sugar || 50),
  };
  const errors = [];
  if (!(t.calories >= 1200 && t.calories <= 5000)) errors.push('칼로리 목표는 1,200~5,000kcal로 설정하세요.');
  if (!(t.carbs >= 50 && t.carbs <= 800)) errors.push('탄수화물 목표를 확인하세요.');
  if (!(t.protein >= 40 && t.protein <= 350)) errors.push('단백질 목표를 확인하세요.');
  if (!(t.fat >= 25 && t.fat <= 250)) errors.push('지방 목표를 확인하세요.');
  const macroCalories = t.carbs * 4 + t.protein * 4 + t.fat * 9;
  if (t.calories && Math.abs(macroCalories - t.calories) / t.calories > 0.18) {
    errors.push('탄·단·지 열량 합계가 목표 칼로리와 크게 다릅니다.');
  }
  return { values: t, errors };
}

export function nutritionDayFor(date = new Date()) {
  const shifted = new Date(date);
  shifted.setHours(shifted.getHours() - 6);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}-${String(shifted.getDate()).padStart(2, '0')}`;
}

export function sumNutrition(entries = []) {
  return entries.reduce((total, entry) => {
    const factor = Math.max(0, Number(entry.consumedRatio ?? 1));
    for (const key of ['calories', 'carbs', 'protein', 'fat', 'sodium', 'sugar']) {
      total[key] += Number(entry[key] || 0) * factor;
    }
    if (entry.source === 'estimate') total.estimatedCount += 1;
    return total;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, sugar: 0, estimatedCount: 0 });
}

export function targetStatus(key, consumed, target, finalized = false) {
  if (!(target > 0)) return 'neutral';
  const ratio = consumed / target;
  if (!finalized && ratio < 0.75) return 'neutral';
  const bands = key === 'protein'
    ? { good: [0.9, 1.2], caution: [0.8, 1.4] }
    : key === 'calories'
      ? { good: [0.95, 1.05], caution: [0.9, 1.1] }
      : { good: [0.85, 1.15], caution: [0.75, 1.25] };
  if (ratio >= bands.good[0] && ratio <= bands.good[1]) return 'good';
  if (ratio >= bands.caution[0] && ratio <= bands.caution[1]) return 'caution';
  return 'danger';
}

export const STARTER_FOODS = Object.freeze([
  { id:'rice-210', name:'공기밥', servingLabel:'1공기', servingAmount:210, unit:'g', calories:310, carbs:68, protein:6, fat:0.6, sodium:10, sugar:0 },
  { id:'rice-half', name:'공기밥 반 공기', servingLabel:'반 공기', servingAmount:105, unit:'g', calories:155, carbs:34, protein:3, fat:0.3, sodium:5, sugar:0 },
  { id:'chicken-breast-100', name:'닭가슴살', servingLabel:'100g', servingAmount:100, unit:'g', calories:120, carbs:1, protein:23, fat:2, sodium:75, sugar:0 },
  { id:'egg', name:'달걀', servingLabel:'1개', servingAmount:1, unit:'개', calories:72, carbs:0.4, protein:6.3, fat:4.8, sodium:71, sugar:0.2 },
  { id:'protein-shake', name:'프로틴 쉐이크', servingLabel:'1회', servingAmount:1, unit:'회', calories:130, carbs:5, protein:24, fat:2, sodium:170, sugar:2 },
  { id:'banana', name:'바나나', servingLabel:'1개', servingAmount:1, unit:'개', calories:105, carbs:27, protein:1.3, fat:0.4, sodium:1, sugar:14 },
  { id:'sweet-potato-100', name:'고구마', servingLabel:'100g', servingAmount:100, unit:'g', calories:128, carbs:30, protein:1.4, fat:0.2, sodium:15, sugar:6 },
  { id:'kimchi-30', name:'배추김치', servingLabel:'30g', servingAmount:30, unit:'g', calories:10, carbs:2, protein:0.6, fat:0.2, sodium:180, sugar:1 },
  { id:'almonds-20', name:'아몬드', servingLabel:'20g', servingAmount:20, unit:'g', calories:116, carbs:4, protein:4.2, fat:10, sodium:1, sugar:0.9 },
  { id:'greek-yogurt', name:'그릭요거트', servingLabel:'100g', servingAmount:100, unit:'g', calories:90, carbs:5, protein:10, fat:3, sodium:36, sugar:4 },
]);
