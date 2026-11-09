// src/data/cities.ts
// Дані для гео-сторінок міст (B11 / A14)

export interface CityUniversity {
  name: string;
  short?: string;
  note?: string;
}

export interface City {
  slug: string;
  name: string;
  inCity: string;        // «у Києві»
  genitive: string;      // «Києва»
  region: string;
  universities: CityUniversity[];
  localFacts: string[];
  localFaq: { q: string; a: string }[];
  intro?: string;
  localContentReady: boolean; // true лише коли заповнені universities/localFacts/localFaq
}

export const cities: City[] = [
  {
    slug: 'kyiv',
    name: 'Київ',
    inCity: 'у Києві',
    genitive: 'Києва',
    region: 'м. Київ',
    universities: [
      { name: 'НУБіП України', short: 'НУБіП' },
      { name: 'КНУ ім. Т. Шевченка', short: 'КНУ' },
    ],
    localFacts: [], // TODO: власник заповнить
    localFaq: [],   // TODO: власник заповнить
    localContentReady: false,
  },
  {
    slug: 'sumy',
    name: 'Суми',
    inCity: 'у Сумах',
    genitive: 'Сум',
    region: 'Сумська область',
    universities: [
      { name: 'Сумський національний аграрний університет', short: 'СНАУ' },
      { name: 'СумДУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'lviv',
    name: 'Львів',
    inCity: 'у Львові',
    genitive: 'Львова',
    region: 'Львівська область',
    universities: [
      { name: 'Львівський національний університет природокористування', short: 'ЛНУП' },
      { name: 'НЛТУ України' },
      { name: 'ЛНУ ім. І. Франка' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'zhytomyr',
    name: 'Житомир',
    inCity: 'у Житомирі',
    genitive: 'Житомира',
    region: 'Житомирська область',
    universities: [
      { name: 'Поліський національний університет', short: 'ПНУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'bila-tserkva',
    name: 'Біла Церква',
    inCity: 'у Білій Церкві',
    genitive: 'Білої Церкви',
    region: 'Київська область',
    universities: [
      { name: 'Білоцерківський національний аграрний університет', short: 'БНАУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'poltava',
    name: 'Полтава',
    inCity: 'у Полтаві',
    genitive: 'Полтави',
    region: 'Полтавська область',
    universities: [
      { name: 'Полтавський державний аграрний університет', short: 'ПДАУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'kharkiv',
    name: 'Харків',
    inCity: 'у Харкові',
    genitive: 'Харкова',
    region: 'Харківська область',
    universities: [
      { name: 'ХНАУ ім. В. В. Докучаєва', short: 'ХНАУ' },
      { name: 'ХНУ ім. В. Н. Каразіна', short: 'ХНУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'dnipro',
    name: 'Дніпро',
    inCity: 'у Дніпрі',
    genitive: 'Дніпра',
    region: 'Дніпропетровська область',
    universities: [
      { name: 'Дніпровський державний аграрно-економічний університет', short: 'ДДАЕУ' },
      { name: 'ДНУ ім. О. Гончара' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'vinnytsia',
    name: 'Вінниця',
    inCity: 'у Вінниці',
    genitive: 'Вінниці',
    region: 'Вінницька область',
    universities: [
      { name: 'Вінницький національний аграрний університет', short: 'ВНАУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
  {
    slug: 'odesa',
    name: 'Одеса',
    inCity: 'в Одесі',
    genitive: 'Одеси',
    region: 'Одеська область',
    universities: [
      { name: 'Одеський державний аграрний університет', short: 'ОДАУ' },
      { name: 'Одеський державний екологічний університет', short: 'ОДЕКУ' },
    ],
    localFacts: [],
    localFaq: [],
    localContentReady: false,
  },
];

// Reserved slugs that must not conflict with city slugs
export const reservedSlugs = [
  'poslugy', 'tsiny', 'vidhuky', 'blog', 'pro-nas', 'mista',
  'universytety', 'faq', 'kontakty', 'karta-saitu',
  'polityka-konfidentsiinosti', 'publichna-oferta', 'polityka-cookie',
  'api', '404',
];
