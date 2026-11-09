// src/utils/template.ts
// Шаблонізатор для SEO-текстів гео-сторінок

import type { City } from '@/data/cities';
import { site } from '@/data/site';
import { pricing } from '@/data/pricing';

export type TemplateVars = {
  city: string;
  inCity: string;
  genitive: string;
  region: string;
  brand: string;
  price: string;
};

const KNOWN_VARS: (keyof TemplateVars)[] = ['city', 'inCity', 'genitive', 'region', 'brand', 'price'];

export function fill(template: string, cityData: City): string {
  const diplomna = pricing.workTypes.find(w => w.slug === 'dyplomna-robota');
  const minPrice = diplomna?.minPrice ?? 0;

  const vars: TemplateVars = {
    city: cityData.name,
    inCity: cityData.inCity,
    genitive: cityData.genitive,
    region: cityData.region,
    brand: site.brand,
    price: minPrice.toLocaleString('uk-UA'),
  };

  // Check for unknown vars — throw build error
  const matches = template.matchAll(/\{(\w+)\}/g);
  for (const match of matches) {
    const key = match[1] as keyof TemplateVars;
    if (!KNOWN_VARS.includes(key)) {
      throw new Error(`[template.ts] Невідома змінна {${key}} у шаблоні: "${template}"`);
    }
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key as keyof TemplateVars] ?? `{${key}}`);
}
