// src/data/pricing.ts
// Усі числа для калькулятора — в одному місці

export interface WorkTypePricing {
  slug: string;
  label: string;
  minPrice: number;
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
      minPrice: 15000,
      hasPages: true,
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
      hasPages: true,
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
      hasPages: true,
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
      hasPages: true,
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
      hasPages: true,
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
      hasPages: false,
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
      hasPages: false,
      pagesMin: null,
      pagesMax: null,
      pagesDefault: null,
      ratePerPage: null,
      includedPages: null,
      minDays: null,
      note: 'Лише в калькуляторі, окремої сторінки немає',
    },
  ] as WorkTypePricing[],

  subjectCoef: {
    agronomy: 1,
    forestry: 1.15,
    'plant-protection': 1.15,
    ecology: 1.15,
    'landscape-gardening': 1.15,
    other: 1.15,
  } as Record<string, number>,

  subjects: [
    { id: 'agronomy', label: 'Агрономія', coef: 1 },
    { id: 'forestry', label: 'Лісове господарство', coef: 1.15 },
    { id: 'plant-protection', label: 'Захист рослин', coef: 1.15 },
    { id: 'ecology', label: 'Екологія', coef: 1.15 },
    { id: 'landscape-gardening', label: 'Садово-паркове господарство', coef: 1.15 },
    { id: 'other', label: 'Інше', coef: 1.15 },
  ],


  deadline: [
    { id: 'week', label: 'Менше тижня', k: 1.3, position: 0 },
    { id: 'month', label: 'Менше місяця', k: 1.15, position: 1 },
    { id: 'long', label: 'Більше місяця', k: 1, position: 2 },
  ],

  addons: [],

  extraRevisionPrice: 250, // +250 грн за подію правок після першого місяця
};

export type SubjectId = keyof typeof pricing.subjectCoef;
