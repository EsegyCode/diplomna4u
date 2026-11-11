// src/data/site.ts
// Single source of truth for contacts and brand

import { services } from './services.ts';

const importMetaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const isProdBuild = Boolean(importMetaEnv.PROD);
const envUrl = (importMetaEnv.PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
if (isProdBuild && !envUrl) {
  throw new Error('PUBLIC_SITE_URL is required for production build');
}
const domain = envUrl || 'http://localhost:4321';

export const site = {
  brand: 'Diplomna 4 U',
  brandUk: 'Дипломна 4 U',
  tagline: 'Дипломна робота для тебе',
  description: 'Допомога з дипломною, курсовою та статтею по всій Україні. Калькулятор ціни онлайн, безкоштовна консультація.',
  domain,
  email: 'diplomna4u@gmail.com',
  telegram: {
    username: 'diplomna4u_bot',
    url: 'https://t.me/diplomna4u_bot',
    label: 'Написати в Telegram',
  },
  viber: null,
  phone: null,
  schedule: 'щодня 9:00–21:00',
  zone: 'вся Україна (дистанційно)',
  legal: 'Працюємо офіційно за договором',
  foundedYear: 2019,
  socials: [],
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
  cta: { label: 'Дізнатись ціну', href: '/#quick-order' },
};