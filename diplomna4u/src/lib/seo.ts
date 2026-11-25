export function articleSchema(options: {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    image: options.image,
    author: { '@type': 'Organization', name: 'Diplomna 4 U' },
    publisher: {
      '@type': 'Organization',
      name: 'Diplomna 4 U',
      logo: { '@type': 'ImageObject', url: new URL('/logo.webp', 'https://diplomna4u.cx.ua').href },
    },
    inLanguage: 'uk',
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[], domain: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : new URL(item.href, domain).href,
    })),
  };
}
