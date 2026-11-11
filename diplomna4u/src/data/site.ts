// src/data/site.ts
// Єдине джерело правди для контактів і бренду

import { services } from './services.ts';

export const site = {
  brand: 'Diplomna 4 U',
  brandUk: 'Дипломна 4 U',
  tagline: 'Дипломна робота для тебе',
  description: 'Допомога з дипломною, курсовою та статтею по всій Україні. Калькулятор ціни онлайн, безкоштовна консультація.',
  domain: 'https://diplomna4u.cx.ua',
  email: 'diplomna4u@gmail.com',
  telegram: {
    username: 'diplomna4u_bot',
    url: 'https://t.me/diplomna4u_bot',
    label: 'Написати в Telegram',
  },
  viber: null, // немає — кнопку не рендерити
  phone: null, // немає — tel: ніде не рендерити
  schedule: 'щодня 9:00–21:00',
  zone: 'вся Україна (дистанційно)',
  // Юридична форма — не згадувати на сайті
  legal: 'Працюємо офіційно за договором',
  foundedYear: 2019,
  socials: [], // TODO: власник додасть коли з'являться
};

export const nav = {
  services: services.map(s => ({ label: s.label, href: `/poslugy/${s.slug}/` })),
  main: [
    { label: 'Ціни', href: '/tsiny/' },
    { label: 'Відгуки', href: '/vidhuky/' },
    { label: 'Блог', href: '/blog/' },
    { label: 'Про нас', href: '/pro-nas/' },
  ],
  cities: { label: 'Міста', href: '/mista/' },
  // universities page removed; city pages list universities
  cta: { label: 'Дізнатись ціну', href: '/#quick-order' },
};
