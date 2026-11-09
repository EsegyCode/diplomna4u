// src/data/site.ts
// Єдине джерело правди для контактів і бренду

export const site = {
  brand: 'Diplomna 4 U',
  brandUk: 'Дипломна 4 U',
  tagline: 'Дипломна робота для тебе',
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
  services: [
    { label: 'Дипломна робота', href: '/poslugy/dyplomna-robota/' },
    { label: 'Курсова робота', href: '/poslugy/kursova-robota/' },
    { label: 'Стаття', href: '/poslugy/stattia/' },
    { label: 'Реферат', href: '/poslugy/referat/' },
    { label: 'Звіт з практики', href: '/poslugy/zvit-z-praktyky/' },
    { label: 'Теза', href: '/poslugy/teza/' },
  ],
  main: [
    { label: 'Ціни', href: '/tsiny/' },
    { label: 'Відгуки', href: '/vidhuky/' },
    { label: 'Блог', href: '/blog/' },
    { label: 'Про нас', href: '/pro-nas/' },
  ],
  cities: { label: 'Міста', href: '/mista/' },
  universities: { label: 'Університети', href: '/universytety/' },
  cta: { label: 'Дізнатись ціну', href: '/#quick-order' },
};
