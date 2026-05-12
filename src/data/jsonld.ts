import { SITE, COMPANY, ASSETS } from './site';

const abs = (path: string) => (path.startsWith('http') ? path : SITE.url.replace(/\/$/, '') + path);

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE.url + '#organization',
    name: COMPANY.legalName,
    alternateName: COMPANY.brand,
    slogan: SITE.tagline,
    url: SITE.url,
    logo: abs(ASSETS.logo),
    image: abs(ASSETS.ogDefault),
    foundingDate: COMPANY.founded,
    taxID: COMPANY.taxId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Đường An Lưu, Cụm Công nghiệp Cẩm Thượng',
      addressLocality: 'phường Thành Đông',
      addressRegion: 'Thành phố Hải Phòng',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY.phoneIntl,
      email: COMPANY.email,
      contactType: 'customer service',
      availableLanguage: ['vi', 'en'],
    },
    sameAs: [COMPANY.facebook],
    award: [
      'OCOP 5 sao Quốc gia 2024 — sản phẩm bánh đậu xanh đầu tiên và duy nhất',
      'ISO 22000:2018 — HA 394/2.23.CIV',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE.url + '#website',
    url: SITE.url,
    name: SITE.name,
    inLanguage: 'vi',
    publisher: { '@id': SITE.url + '#organization' },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.url),
    })),
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  images: string[];
  category?: string;
  sku?: string;
  isOcop5Star?: boolean;
  url: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    image: opts.images.map(abs),
    url: abs(opts.url),
    brand: { '@type': 'Brand', name: COMPANY.brand, slogan: SITE.tagline },
    manufacturer: { '@type': 'Organization', name: COMPANY.legalName },
    category: opts.category ?? 'Bánh đậu xanh',
  };
  if (opts.sku) schema.sku = opts.sku;
  if (opts.isOcop5Star) schema.award = 'OCOP 5 sao Quốc gia 2024';
  return schema;
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: opts.image ? abs(opts.image) : abs(ASSETS.ogDefault),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@type': 'Organization', name: opts.author },
    publisher: { '@id': SITE.url + '#organization' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(opts.url) },
    inLanguage: 'vi',
  };
}

export function faqSchema(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
