// Єдине джерело правди для навігації (хедер, меню, футер)

export const servicesNav = [
  { label: 'Дипломна робота', href: '/poslugy/dyplomna-robota/' },
  { label: 'Курсова робота', href: '/poslugy/kursova-robota/' },
  { label: 'Стаття', href: '/poslugy/stattia/' },
  { label: 'Реферат', href: '/poslugy/referat/' },
  { label: 'Звіт з практики', href: '/poslugy/zvit-z-praktyky/' },
  { label: 'Теза', href: '/poslugy/teza/' },
] as const;

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
      { label: 'Усі міста', href: '/mista/' },
      { label: 'Університети', href: '/universytety/' },
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