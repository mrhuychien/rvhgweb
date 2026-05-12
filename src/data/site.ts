/** Single source of truth for company / brand data used across components, SEO and llms.txt. */

export const SITE = {
  url: 'https://www.rongvanghoanggia.com',
  name: 'Rồng Vàng Hoàng Gia',
  legalName: 'Công ty Cổ phần Hoàng Giang',
  tagline: 'Đặc sản nức tiếng Hải Dương',
  shortDescription:
    'Bánh đậu xanh và bột đậu xanh truyền thống Hải Dương — sản phẩm bánh đậu xanh duy nhất đạt OCOP 5 sao Quốc gia 2024. Sản xuất bởi Công ty Cổ phần Hoàng Giang từ 1997, chứng nhận ISO 22000:2018.',
  locale: 'vi_VN',
  lang: 'vi',
} as const;

export const COMPANY = {
  legalName: 'Công ty Cổ phần Hoàng Giang',
  brand: 'Rồng Vàng Hoàng Gia',
  taxId: '0800280839',
  businessLicense: '06/06/2003',
  founded: '1997',
  founders: ['Ông Đào Văn Tiến (nguyên Thẩm phán TAND tỉnh Hải Dương)', 'cùng hai anh em'],
  iso: 'ISO 22000:2018 — HA 394/2.23.CIV (cấp 08/08/2023, Quacert)',
  ocop: 'OCOP 5 sao Quốc gia 2024 — bánh đậu xanh đầu tiên và duy nhất',
  factoryAddress: 'Đường An Lưu, Cụm Công nghiệp Cẩm Thượng, phường Thành Đông, TP Hải Phòng',
  showrooms: ['209C Tuệ Tĩnh, TP Hải Dương', '9 Bạch Đằng, TP Hải Dương'],
  phone: '0934362658',
  phoneIntl: '+84-934-362-658',
  email: 'info@rongvanghoanggia.com',
  facebook: 'https://www.facebook.com/rongvanghoanggiapage',
  exportMarkets: ['Nhật Bản', 'Hoa Kỳ', 'Anh', 'Hàn Quốc', 'Canada'],
  distributors: [
    'BigC / GO!',
    'WinMart',
    'AEON',
    'Lotte Mart',
    'Co.opmart',
    'MegaMarket',
    'Lan Chi Mart',
  ],
  ecommerce: [
    { name: 'Shopee', url: 'https://shopee.vn/' },
    { name: 'TikTok Shop', url: 'https://www.tiktok.com/' },
  ],
} as const;

/** Brand assets — mirrored from the original wp-content into /images/legacy/ in Phase 1.
 * If a file is missing it falls back to the inline SVG mark in Header/Footer. */
export const ASSETS = {
  logo: '/images/legacy/logo-web-120x120.png',
  logoLarge: '/images/legacy/cropped-logo-web-270x270.png',
  ogDefault: '/og-default.png',
  favicon: '/favicon.ico',
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu/' },
  { label: 'Sản phẩm', href: '/san-pham/' },
  { label: 'Điểm bán', href: '/diem-ban-rong-vang-hoang-gia/' },
  { label: 'Tin tức', href: '/tin-tuc/' },
  { label: 'Công bố', href: '/cong-bo/' },
  { label: 'Liên hệ', href: '/lien-he/' },
];

/** Báo chí đã đưa tin — citation external, mở tab mới. */
export const MEDIA_MENTIONS: { name: string; url: string }[] = [
  { name: 'Báo Chính phủ', url: 'https://baochinhphu.vn/' },
  { name: 'VTV — Đài Truyền hình Việt Nam', url: 'https://vtv.vn/' },
  { name: 'Báo Nhân Dân', url: 'https://nhandan.vn/' },
  { name: 'Báo Pháp Luật Việt Nam', url: 'https://baophapluat.vn/' },
  { name: 'VOV — Đài Tiếng nói Việt Nam', url: 'https://vov.vn/' },
  { name: 'Báo Dân Trí', url: 'https://dantri.com.vn/' },
  { name: 'HTV — Đài Truyền hình TP. Hồ Chí Minh', url: 'https://www.htv.com.vn/' },
  { name: 'Đài PT-TH Hải Dương (THHD)', url: 'https://haiduongtv.com.vn/' },
];

/** Three brand-story anchors — every long-form content references at least one. */
export const ANCHORS = {
  khaiDinh1918:
    'Năm 1918, vua Khải Định trong chuyến tuần du miền Bắc kinh lý trấn Hải Dương; người dân dâng bánh đậu xanh, nhà vua ban sắc phong "Bánh Ngon" và ấn chỉ Rồng Vàng của Hoàng Gia.',
  ocop5Sao:
    'Năm 2024, bánh đậu xanh Rồng Vàng Hoàng Gia là sản phẩm bánh đậu xanh đầu tiên và duy nhất cả nước đạt chứng nhận OCOP 5 sao Quốc gia.',
  iso22000:
    'Toàn bộ quy trình sản xuất đạt chứng nhận quốc tế ISO 22000:2018 (HA 394/2.23.CIV) do Quacert cấp ngày 08/08/2023.',
} as const;
