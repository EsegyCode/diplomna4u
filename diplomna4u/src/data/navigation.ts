import { services } from './services.ts';

export const servicesNav = services.map(s => ({ label: s.label, href: `/poslugy/${s.slug}/` }));

export const mainNav = [
  { label: 'Ціни', href: '/tsiny/' },
  { label: 'Відгуки', href: '/vidhuky/' },
  { label: 'Про нас', href: '/pro-nas/' },
  { label: 'Де ми працюємо', href: '/mista/' },
] as const;

export const footerGroups = [
  {
    title: 'Послуги',
    links: [...servicesNav],
  },
  {
    title: 'Компанія',
    links: [
      { label: 'Ціни', href: '/tsiny/' },
      { label: 'Відгуки', href: '/vidhuky/' },
      { label: 'Про нас', href: '/pro-nas/' },
      { label: 'Блог', href: '/blog/' },
      { label: 'FAQ', href: '/faq/' },
      { label: 'Контакти', href: '/kontakty/' },
      { label: 'Карта сайту', href: '/karta-saitu/' },
    ],
  },
  {
    title: 'Де ми працюємо',
    links: [
      { label: 'Міста', href: '/mista/' },
      { label: 'Суми', href: '/sumy/' },
      { label: 'Київ', href: '/kyiv/' },
      { label: 'Харків', href: '/kharkiv/' },
      { label: 'Львів', href: '/lviv/' },
      { label: 'Дніпро', href: '/dnipro/' },
      { label: 'Одеса', href: '/odesa/' },
      { label: 'Усі міста', href: '/mista/' },
    ],
  },
  {
    title: 'Юридичне',
    links: [
      { label: 'Політика конфіденційності', href: '/polityka-konfidentsiinosti/' },
      { label: 'Публічна оферта', href: '/publichna-oferta/' },
      { label: 'Політика cookie', href: '/polityka-cookie/' },
    ],
  },
] as const;

export const ctaNav = { label: 'Дізнатись ціну', href: '/#quick-order' } as const;