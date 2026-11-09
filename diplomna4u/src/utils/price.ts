// src/utils/price.ts
// Чиста функція розрахунку ціни для калькулятора (B12)
// Формула: price = round(base * subjectCoef * uniquenessK * deadlineK) + addons

import { pricing } from '@/data/pricing';

export interface PriceInput {
  workSlug: string;
  subjectId: string;
  pages: number;         // нижня межа поля «від»
  uniquenessId: string;  // '85' або '90'
  deadlineId: string;    // 'long' | 'month' | 'week'
  addons: string[];      // id додатків
}

export type PriceResult =
  | { ok: true; price: number; formatted: string }
  | { ok: false; reason: string };

/*
 * Контрольні приклади (перевірено):
 * 1. Дипломна, agronomy, 45 стор., 85%+, long → max(15000, 45×200=9000)=15000 → 15 000
 * 2. Дипломна, other, 45 стор., 85%+, long → 15000×1.15=17 250
 * 3. Дипломна, other, 45 стор., 90%+, week → 15000×1.15×1.2×1.3=26910 → +2000=28 910
 * 4. Курсова, agronomy, 30 стор., 85%+, long → max(3250, 30×150=4500)=4 500
 * 5. Стаття, other, 7 стор., 85%+, month → 460×1.15×1.15=608.35→608
 */
export function calcPrice(input: PriceInput): PriceResult {
  const workType = pricing.workTypes.find(w => w.slug === input.workSlug);
  if (!workType) return { ok: false, reason: 'Невідомий тип роботи' };

  const subjectCoef = pricing.subjectCoef[input.subjectId];
  if (subjectCoef === undefined) return { ok: false, reason: 'Невідомий напрям' };

  const uniqueness = pricing.uniqueness.find(u => u.id === input.uniquenessId);
  if (!uniqueness) return { ok: false, reason: 'Невідомий рівень унікальності' };

  const deadline = pricing.deadline.find(d => d.id === input.deadlineId);
  if (!deadline) return { ok: false, reason: 'Невідомий термін' };

  // Calculate base price
  let base: number;
  if (workType.includedPages !== null && workType.ratePerPage !== null) {
    // Model: included pages in minPrice
    base = workType.minPrice + Math.max(0, input.pages - workType.includedPages) * workType.ratePerPage;
  } else if (workType.ratePerPage !== null && workType.hasPages) {
    // Model: max(minPrice, pages * rate)
    base = Math.max(workType.minPrice, input.pages * workType.ratePerPage);
  } else {
    // No page rate — just minPrice
    base = workType.minPrice;
  }

  // Apply coefficients
  const multiplied = base * subjectCoef * uniqueness.k * deadline.k;

  // Round to nearest 1 грн (rounding: 1)
  let price = Math.round(multiplied);

  // Add addons
  for (const addonId of input.addons) {
    const addon = pricing.addons.find(a => a.id === addonId);
    if (addon && (addon.onlyFor === undefined || addon.onlyFor.includes(input.workSlug))) {
      price += addon.price;
    }
  }

  const formatted = price.toLocaleString('uk-UA') + '\u00a0грн';
  return { ok: true, price, formatted };
}

export function getMinPriceFormatted(workSlug: string): string {
  const workType = pricing.workTypes.find(w => w.slug === workSlug);
  if (!workType) return 'Уточніть вартість у менеджера';
  return workType.minPrice.toLocaleString('uk-UA') + '\u00a0грн';
}
