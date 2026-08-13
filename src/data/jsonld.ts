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
      'ISO 22000:2018 — HA 394/4.26.CIV',
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

/** VideoObject cho video giới thiệu nhúng từ YouTube.
 *  `uploadDate` là tuỳ chọn ở đây nhưng Google yêu cầu nó để hiển thị rich
 *  result video — điền ngày đăng thật trong BRAND_VIDEO khi có. */
export function videoSchema(opts: {
  id: string;
  name: string;
  description: string;
  uploadDate?: string;
  url?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: opts.name,
    description: opts.description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${opts.id}/maxresdefault.jpg`],
    embedUrl: `https://www.youtube-nocookie.com/embed/${opts.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${opts.id}`,
    publisher: { '@id': SITE.url + '#organization' },
    inLanguage: 'vi',
  };
  if (opts.uploadDate) schema.uploadDate = opts.uploadDate;
  if (opts.url) schema.mainEntityOfPage = { '@type': 'WebPage', '@id': abs(opts.url) };
  return schema;
}

export function howToSchema(opts: { name: string; steps: string[]; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    ...(opts.image ? { image: abs(opts.image) } : {}),
    step: opts.steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  };
}
