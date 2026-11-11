// src/data/site.ts
// Р„РґРёРЅРµ РґР¶РµСЂРµР»Рѕ РїСЂР°РІРґРё РґР»СЏ РєРѕРЅС‚Р°РєС‚С–РІ С– Р±СЂРµРЅРґСѓ

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
  brandUk: 'Р”РёРїР»РѕРјРЅР° 4 U',
  tagline: 'Р”РёРїР»РѕРјРЅР° СЂРѕР±РѕС‚Р° РґР»СЏ С‚РµР±Рµ',
  description: 'Р”РѕРїРѕРјРѕРіР° Р· РґРёРїР»РѕРјРЅРѕСЋ, РєСѓСЂСЃРѕРІРѕСЋ С‚Р° СЃС‚Р°С‚С‚РµСЋ РїРѕ РІСЃС–Р№ РЈРєСЂР°С—РЅС–. РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ С†С–РЅРё РѕРЅР»Р°Р№РЅ, Р±РµР·РєРѕС€С‚РѕРІРЅР° РєРѕРЅСЃСѓР»СЊС‚Р°С†С–СЏ.',
  domain,
  email: 'diplomna4u@gmail.com',
  telegram: {
    username: 'diplomna4u_bot',
    url: 'https://t.me/diplomna4u_bot',
    label: 'РќР°РїРёСЃР°С‚Рё РІ Telegram',
  },
  viber: null, // РЅРµРјР°С” вЂ” РєРЅРѕРїРєСѓ РЅРµ СЂРµРЅРґРµСЂРёС‚Рё
  phone: null, // РЅРµРјР°С” вЂ” tel: РЅС–РґРµ РЅРµ СЂРµРЅРґРµСЂРёС‚Рё
  schedule: 'С‰РѕРґРЅСЏ 9:00вЂ“21:00',
  zone: 'РІСЃСЏ РЈРєСЂР°С—РЅР° (РґРёСЃС‚Р°РЅС†С–Р№РЅРѕ)',
  // Р®СЂРёРґРёС‡РЅР° С„РѕСЂРјР° вЂ” РЅРµ Р·РіР°РґСѓРІР°С‚Рё РЅР° СЃР°Р№С‚С–
  legal: 'РџСЂР°С†СЋС”РјРѕ РѕС„С–С†С–Р№РЅРѕ Р·Р° РґРѕРіРѕРІРѕСЂРѕРј',
  foundedYear: 2019,
  socials: [], // TODO: РІР»Р°СЃРЅРёРє РґРѕРґР°СЃС‚СЊ РєРѕР»Рё Р·'СЏРІР»СЏС‚СЊСЃСЏ
};

export const nav = {
  services: services.map(s => ({ label: s.label, href: `/poslugy/${s.slug}/` })),
  main: [
    { label: 'Р¦С–РЅРё', href: '/tsiny/' },
    { label: 'Р’С–РґРіСѓРєРё', href: '/vidhuky/' },
    { label: 'Р‘Р»РѕРі', href: '/blog/' },
    { label: 'РџСЂРѕ РЅР°СЃ', href: '/pro-nas/' },
  ],
  cities: { label: 'РњС–СЃС‚Р°', href: '/mista/' },
  // universities page removed; city pages list universities
  cta: { label: 'Р”С–Р·РЅР°С‚РёСЃСЊ С†С–РЅСѓ', href: '/#quick-order' },
};
