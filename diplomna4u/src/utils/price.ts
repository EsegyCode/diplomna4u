// src/utils/price.ts
// Р§РёСЃС‚Р° С„СѓРЅРєС†С–СЏ СЂРѕР·СЂР°С…СѓРЅРєСѓ С†С–РЅРё РґР»СЏ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР° (B12)
// Р¤РѕСЂРјСѓР»Р°: price = round(base * subjectCoef * uniquenessK * deadlineK) + addons

import { pricing } from '@/data/pricing';

export interface PriceInput {
  workSlug: string;
  specialtyKey: string;
  pages: number;         // РІРёР±СЂР°РЅР° РєС–Р»СЊРєС–СЃС‚СЊ СЃС‚РѕСЂС–РЅРѕРє (РїРѕРІР·СѓРЅРѕРє)
  deadlineId: string;     // 'long' | 'month' | 'week'
  addons: string[];      // id РґРѕРґР°С‚РєС–РІ
}

export type PriceResult =
  | { ok: true; price: number; formatted: string }
  | { ok: false; reason: string };

/*
 * РљРѕРЅС‚СЂРѕР»СЊРЅС– РїСЂРёРєР»Р°РґРё (РїРµСЂРµРІС–СЂРµРЅРѕ):
 * 1. Р”РёРїР»РѕРјРЅР°, agronomy, 45 СЃС‚РѕСЂ., 85%+, long в†’ max(15000, 45Г—200=9000)=15000 в†’ 15 000
 * 2. Р”РёРїР»РѕРјРЅР°, other, 45 СЃС‚РѕСЂ., 85%+, long в†’ 15000Г—1.15=17 250
 * 3. Р”РёРїР»РѕРјРЅР°, other, 45 СЃС‚РѕСЂ., 90%+, week в†’ 15000Г—1.15Г—1.2Г—1.3=26910 в†’ +2000=28 910
 * 4. РљСѓСЂСЃРѕРІР°, agronomy, 30 СЃС‚РѕСЂ., 85%+, long в†’ max(3250, 30Г—150=4500)=4 500
 * 5. РЎС‚Р°С‚С‚СЏ, other, 7 СЃС‚РѕСЂ., 85%+, month в†’ 460Г—1.15Г—1.15=608.35в†’608
 */
export function calcPrice(input: PriceInput): PriceResult {
  const workType = pricing.workTypes.find(w => w.slug === input.workSlug);
  if (!workType) return { ok: false, reason: 'РќРµРІС–РґРѕРјРёР№ С‚РёРї СЂРѕР±РѕС‚Рё' };

  const workType2 = workType;
  if (!workType2.hasCalculator) {
    const price0 = workType2.basePrice || workType2.minPrice;
    return { ok: true, price: price0, formatted: price0.toLocaleString('uk-UA') + '\\u00a0РіСЂРЅ' };
  }
  const specialtyCoef = pricing.specialtyCoef?.[input.specialtyKey] ?? 1.15;


  const deadline = pricing.deadline.find(d => d.id === input.deadlineId);
  if (!deadline) return { ok: false, reason: 'РќРµРІС–РґРѕРјРёР№ С‚РµСЂРјС–РЅ' };

  // Calculate base price
  let base: number;
  if (workType.includedPages !== null && workType.ratePerPage !== null) {
    // Model: included pages in minPrice
    base = workType.minPrice + Math.max(0, input.pages - workType.includedPages) * workType.ratePerPage;
  } else if (workType.ratePerPage !== null && workType.hasPages) {
    // Model: max(minPrice, pages * rate)
    base = Math.max(workType.minPrice, input.pages * workType.ratePerPage);
  } else {
    // No page rate вЂ” just minPrice
    base = workType.minPrice;
  }

  // Apply coefficients
  const multiplied = base * specialtyCoef * deadline.k;

  // Round to nearest 1 РіСЂРЅ (rounding: 1)
  let price = Math.round(multiplied);

  // Add addons
  for (const addonId of input.addons) {
    const addon = (pricing.addons as any[]).find(a => a.id === addonId);
    if (addon && (addon.onlyFor === undefined || addon.onlyFor.includes(input.workSlug))) {
      price += addon.price;
    }
  }

  const formatted = price.toLocaleString('uk-UA') + '\u00a0РіСЂРЅ';
  return { ok: true, price, formatted };
}

export function getMinPriceFormatted(workSlug: string): string {
  const workType = pricing.workTypes.find(w => w.slug === workSlug);
  if (!workType) return 'РЈС‚РѕС‡РЅС–С‚СЊ РІР°СЂС‚С–СЃС‚СЊ Сѓ РјРµРЅРµРґР¶РµСЂР°';
  return workType.minPrice.toLocaleString('uk-UA') + '\u00a0РіСЂРЅ';
}
