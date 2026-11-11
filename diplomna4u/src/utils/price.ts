// Pure price calculation for calculator (B12)
// Formula: price = round(base * specialtyCoef * deadlineK) + addons

import { pricing } from '@/data/pricing';

export interface PriceInput {
  workSlug: string;
  specialtyKey: string;
  pages: number;         // selected number of pages (slider)
  deadlineId: string;     // 'long' | 'month' | 'week'
  addons: string[];      // addon ids
}

export type PriceResult =
  | { ok: true; price: number; formatted: string }
  | { ok: false; reason: string };

/*
 * Control examples:
 * 1. Diploma, agronomy, 45 pages, 85%+, long -> max(15000, 45*200=9000)=15000 -> 15 000
 * 2. Diploma, other, 45 pages, 85%+, long -> 15000*1.15=17 250
 * 3. Diploma, other, 45 pages, 90%+, week -> 15000*1.15*1.3=22425; presentation +2000
 * 4. Coursework, agronomy, 30 pages, 85%+, long -> max(3250, 30*150=4500)=4 500
 * 5. Article, other, 7 pages, 85%+, month -> 460*1.15*1.15=608
 */
export function calcPrice(input: PriceInput): PriceResult {
  const workType = pricing.workTypes.find(w => w.slug === input.workSlug);
  if (!workType) return { ok: false, reason: 'Unknown work type' };

  if (!workType.hasCalculator) {
    const price0 = workType.basePrice || workType.minPrice;
    return { ok: true, price: price0, formatted: price0.toLocaleString('uk-UA') + '\u00a0грн' };
  }

  const specialtyCoef = pricing.specialtyCoef?.[input.specialtyKey] ?? 1.15;

  const deadline = pricing.deadline.find(d => d.id === input.deadlineId);
  if (!deadline) return { ok: false, reason: 'Unknown deadline' };

  // Calculate base price
  let base: number;
  if (workType.includedPages !== null && workType.ratePerPage !== null) {
    // Model: included pages in minPrice
    base = workType.minPrice + Math.max(0, input.pages - workType.includedPages) * workType.ratePerPage;
  } else if (workType.ratePerPage !== null && workType.hasPages) {
    // Model: max(minPrice, pages * rate)
    base = Math.max(workType.minPrice, input.pages * workType.ratePerPage);
  } else {
    // No page rate -- just minPrice
    base = workType.minPrice;
  }

  // Apply coefficients
  const multiplied = base * specialtyCoef * deadline.k;

  // Round to nearest 1 uah (rounding: 1)
  let price = Math.round(multiplied);

  // Add addons
  for (const addonId of input.addons) {
    const addon = (pricing.addons as any[]).find(a => a.id === addonId);
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