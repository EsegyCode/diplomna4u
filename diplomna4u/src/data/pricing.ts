// src/data/pricing.ts
// Усі числа для калькулятора — в одному місці

export interface WorkTypePricing {
  slug: string;
  label: string;
  minPrice: number;
  hasCalculator: boolean;
  basePrice: number;
  hasPages: boolean;
  pagesMin: number | null;
  pagesMax: number | null;
  pagesDefault: [number, number] | null;
  ratePerPage: number | null;
  rateRange?: [number, number];
  includedPages: number | null;
  minDays: number | null;
  note?: string;
}

export const pricing = {
  currency: 'грн',
  rounding: 1, // ціни до гривні, без округлення

  workTypes: [
    {
      slug: 'dyplomna-robota',
      label: 'Дипломна робота',
      minPrice: 14800,
      hasCalculator: true,
      basePrice: 14800,      hasCalculator: true,
      basePrice: 14800,      hasPages: true,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: [45, 60],
      ratePerPage: 200,
      rateRange: [200, 300] as [number, number],
      includedPages: null,
      minDays: 3,
      note: 'Середня ціна 45–60 стор.: 18 000–20 000 грн без презентації й підготовки до захисту',
    },
    {
      slug: 'kursova-robota',
      label: 'Курсова робота',
      minPrice: 3250,
      hasCalculator: true,
      basePrice: 3250,      hasCalculator: true,
      basePrice: 3250,      hasPages: true,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: 150,
      rateRange: [150, 200] as [number, number],
      includedPages: null,
      minDays: null,
      note: 'Орієнтовно ~5000 грн залежно від складності',
    },
    {
      slug: 'stattia',
      label: 'Стаття',
      minPrice: 460,
      hasCalculator: false,
      basePrice: 460,      hasCalculator: false,
      basePrice: 460,      hasPages: true,
      pagesMin: 7,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'Від 7 сторінок з перерахунком',
    },
    {
      slug: 'teza',
      label: 'Теза',
      minPrice: 280,
      hasCalculator: false,
      basePrice: 280,      hasCalculator: false,
      basePrice: 280,      hasPages: true,
      pagesMin: null,
      pagesMax: 5,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'До 5 сторінок',
    },
    {
      slug: 'referat',
      label: 'Реферат',
      minPrice: 960,
      hasCalculator: false,
      basePrice: 960,      hasCalculator: false,
      basePrice: 960,      hasPages: true,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'Від 7 сторінок з перерахунком',
    },
    {
      slug: 'zvit-z-praktyky',
      label: 'Звіт з практики',
      minPrice: 3200,
      hasCalculator: false,
      basePrice: 3200,      hasCalculator: false,
      basePrice: 3200,      hasPages: false,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'Ціна з документами',
    },
   {
      slug: 'prezentatsiya',
      label: 'Презентація',
      minPrice: 300,
      hasCalculator: false,
      basePrice: 300,      hasCalculator: false,
      basePrice: 300,      hasPages: false,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'Лише в калькуляторі, окремої сторінки немає',
    },
  ] as WorkTypePricing[],

  deadline: [
    { id: 'week', label: 'Менше тижня', k: 1.3, position: 0 },
    { id: 'month', label: 'Менше місяця', k: 1.15, position: 1 },
    { id: 'long', label: 'Більше місяця', k: 1, position: 2 },
  ],

  addons: [],

  extraRevisionPrice: 250, // +250 грн за подію правок після першого місяця

  specialties: [
    { key: 'H1', code: 'H1', name: 'Агрономія', legacyCode: '201', label: 'H1 · Агрономія (201)', coef: 1 },
    { key: 'H2', code: 'H2', name: 'Тваринництво', legacyCode: '204', label: 'H2 · Тваринництво (204)', coef: 1.1 },
    { key: 'H3', code: 'H3', name: 'Садово-паркове господарство', legacyCode: '206', label: 'H3 · Садово-паркове господарство (206)', coef: 1.1 },
    { key: 'H4', code: 'H4', name: 'Лісове господарство', legacyCode: '205', label: 'H4 · Лісове господарство (205)', coef: 1.1 },
    { key: 'H5', code: 'H5', name: 'Водні біоресурси та аквакультура', legacyCode: '207', label: 'H5 · Водні біоресурси та аквакультура (207)', coef: 1.1 },
    { key: 'H6', code: 'H6', name: 'Ветеринарна медицина', legacyCode: '211', label: 'H6 · Ветеринарна медицина (211)', coef: 1.1 },
    { key: 'H7', code: 'H7', name: 'Агроінженерія', legacyCode: '208', label: 'H7 · Агроінженерія (208)', coef: 1.1 },
    { key: 'E2', code: 'E2', name: 'Екологія', legacyCode: '101', label: 'E2 · Екологія (101)', coef: 1.1 },
    { key: 'E4', code: 'E4', name: 'Науки про Землю', legacyCode: '103', label: 'E4 · Науки про Землю (103)', coef: 1.1 },
    { key: 'E1', code: 'E1', name: 'Біологія та біохімія', legacyCode: '091', label: 'E1 · Біологія та біохімія (091)', coef: 1.1 },
    { key: 'C6', code: 'C6', name: 'Географія та регіональні студії', legacyCode: '106', label: 'C6 · Географія та регіональні студії (106)', coef: 1.1 },
    { key: 'G18', code: 'G18', name: 'Геодезія та землеустрій', legacyCode: '193', label: 'G18 · Геодезія та землеустрій (193)', coef: 1.1 },
    { key: 'G21', code: 'G21', name: 'Біотехнології та біоінженерія', legacyCode: '162', label: 'G21 · Біотехнології та біоінженерія (162)', coef: 1.1 },
    { key: 'G2', code: 'G2', name: 'Технології захисту навколишнього середовища', legacyCode: '183', label: 'G2 · Технології захисту навколишнього середовища (183)', coef: 1.1 },
    { key: 'G14', code: 'G14', name: 'Деревообробні та меблеві технології', legacyCode: '187', label: 'G14 · Деревообробні та меблеві технології (187)', coef: 1.1 },
    { key: 'G13', code: 'G13', name: 'Харчові технології', legacyCode: '181', label: 'G13 · Харчові технології (181)', coef: 1.1 },
    { key: 'J3', code: 'J3', name: 'Туризм та рекреація', legacyCode: '242', label: 'J3 · Туризм та рекреація (242)', coef: 1.1 },
    { key: 'other', code: 'інше', name: 'Інша спеціальність / не з переліку', legacyCode: '', label: 'Інша спеціальність / не з переліку', coef: 1.15 },
  ] as { key: string; code: string; name: string; legacyCode: string; label: string; coef: number }[],

  specialtyCoef: {
    H1: 1, H2: 1.1, H3: 1.1, H4: 1.1, H5: 1.1, H6: 1.1, H7: 1.1,
    E2: 1.1, E4: 1.1, E1: 1.1, C6: 1.1, G18: 1.1, G21: 1.1, G2: 1.1, G14: 1.1, G13: 1.1, J3: 1.1,
    other: 1.15,
  } as Record<string, number>,
};

// subject removed; use SpecialtyKey instead
