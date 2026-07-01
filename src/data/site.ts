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
  /** Full registration line incl. latest amendment. */
  businessLicenseFull:
    'ĐKKD 0800280839 cấp ngày 06/06/2003. Đăng ký thay đổi lần thứ 7 ngày 06/8/2025 bởi Sở Tài chính Thành phố Hải Phòng.',
  representative: 'Ông Đào Văn Tiến',
  isoFull:
    'Chứng nhận Hệ thống Quản lý An toàn thực phẩm TCVN ISO 22000:2018 / ISO 22000:2018 số HA 394/2.23.CIV cấp ngày 08/08/2023 bởi Tổng cục Tiêu chuẩn Đo lường Chất lượng (Quacert).',
  founded: '1997',
  /** Three brothers founded the company in 1997. */
  chairman: 'Ông Đào Quang Chuyện — Chủ tịch HĐQT (nguyên Thẩm phán Toà án Nhân dân tỉnh Hải Dương)',
  director: 'Ông Đào Văn Tiến — Giám đốc, đại diện pháp luật',
  founders: [
    'Ông Đào Quang Chuyện (Chủ tịch HĐQT, nguyên Thẩm phán TAND tỉnh Hải Dương)',
    'Ông Đào Văn Tiến (Giám đốc, đại diện pháp luật)',
    'cùng người anh em thứ ba',
  ],
  capital: '20 tỷ đồng',
  factorySize: '6.200 m²',
  workforce: '100–150 công nhân',
  iso: 'ISO 22000:2018 — HA 394/2.23.CIV (cấp 08/08/2023, Quacert)',
  ocop: 'OCOP 5 sao Quốc gia 2024 — bánh đậu xanh đầu tiên và duy nhất',
  factoryAddress: 'Đường An Lưu, Cụm Công nghiệp Cẩm Thượng, phường Thành Đông, thành phố Hải Phòng, Việt Nam',
  showrooms: ['209C Tuệ Tĩnh, TP Hải Dương', '9 Bạch Đằng, TP Hải Dương'],
  phone: '0934362658',
  phoneIntl: '+84-934-362-658',
  email: 'info@rongvanghoanggia.com',
  facebook: 'https://www.facebook.com/rongvanghoanggiapage',
  exportMarkets: ['Nhật Bản', 'Hoa Kỳ', 'Anh', 'Hàn Quốc', 'Canada', 'Trung Quốc'],
  distributors: [
    'GO! / BigC',
    'WinMart',
    'AEON',
    'Lotte Mart',
    'Co.opmart',
    'MM Mega Market',
    'BRG Mart',
    'Lan Chi Mart',
  ],
  airports: ['Nội Bài', 'Đà Nẵng', 'Cam Ranh', 'Tân Sơn Nhất', 'Phú Quốc'],
  bank: {
    holder: 'Đào Bích Hằng',
    account: '0341007014720',
    name: 'Vietcombank — Chi nhánh Hải Dương',
  },
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

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const NAV: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu/' },
  {
    label: 'Sản phẩm',
    href: '/san-pham/',
    children: [
      { label: 'Tất cả sản phẩm', href: '/san-pham/' },
      { label: 'Bột đậu xanh Cà Rốt', href: '/botdx-carot/' },
      { label: 'Bột đậu xanh Rau Má', href: '/botdx-rauma/' },
      { label: 'Bột đậu xanh Sữa Dừa', href: '/botdx-suadua/' },
      { label: 'Bột đậu xanh Matcha', href: '/botdx-matcha/' },
      { label: 'Bột đậu xanh Không thêm đường', href: '/bdx-rauma-khongduong/' },
    ],
  },
  { label: 'Điểm bán', href: '/diem-ban-rong-vang-hoang-gia/' },
  { label: 'Tin tức', href: '/tin-tuc/' },
  { label: 'Công bố', href: '/cong-bo/' },
  { label: 'Liên hệ', href: '/lien-he/' },
];

/** Báo chí đã đưa tin — citation external, mở tab mới.
 *  Verified live URLs from rongvanghoanggia.com home page mirror. */
export const MEDIA_MENTIONS: { name: string; url: string }[] = [
  { name: 'Báo Chính phủ', url: 'https://baochinhphu.vn/them-4-san-pham-duoc-cong-nhan-ocop-5-sao-102240625172136981.htm' },
  { name: 'VTV — Đài Truyền hình Việt Nam', url: 'https://www.youtube.com/watch?v=49EjYQaYTl4' },
  { name: 'Đài PT-TH Hải Dương (THHD)', url: 'http://www.haiduongtv.com.vn/media/trang-3.html?view=39246' },
  { name: 'HTV — Đài Truyền hình TP. Hồ Chí Minh', url: 'https://www.youtube.com/watch?v=SFmEYYRiATw' },
  { name: 'Báo Pháp Luật Việt Nam', url: 'https://baophapluat.vn/banh-dau-xanh-hoang-gia-la-san-pham-dau-tien-cua-hai-duong-duoc-trao-chung-nhan-ocop-5-sao-post528437.html' },
  { name: 'Báo Nhân Dân', url: 'https://nhandan.vn/' },
  { name: 'VOV — Đài Tiếng nói Việt Nam', url: 'https://vov.vn/' },
  { name: 'Báo Dân Trí', url: 'https://dantri.com.vn/' },
];

/** Nine reasons / "Bí quyết thành công" — distilled from the live home page. */
export const REASONS: { title: string; body: string }[] = [
  {
    title: 'Kinh nghiệm 28 năm',
    body: 'Khởi nghiệp từ 1997. 28 năm sản xuất và kinh doanh bánh đậu xanh tại thị trường Việt Nam và xuất khẩu.',
  },
  {
    title: 'Nguyên liệu chất lượng',
    body: 'Khắt khe tuyển chọn những nguyên liệu chất lượng cao nhất, minh bạch nguồn gốc và đảm bảo sức khoẻ.',
  },
  {
    title: 'Công thức bí truyền',
    body: 'Công thức làm bánh được chân truyền từ những nghệ nhân làm bánh dâng Vua khi xưa, đảm bảo hương vị truyền thống.',
  },
  {
    title: 'ISO 22000:2018',
    body: 'Áp dụng hệ thống quản lý chất lượng theo tiêu chuẩn quốc tế ISO 22000:2018 — HA 394/2.23.CIV (Quacert).',
  },
  {
    title: 'OCOP 5 sao Quốc gia',
    body: 'Sản phẩm bánh đậu xanh duy nhất được Chính phủ công nhận đạt tiêu chuẩn OCOP 5 sao Quốc gia 2024.',
  },
  {
    title: 'Nhà sản xuất uy tín',
    body: 'Nhiều năm liền là nhà sản xuất uy tín tại các chuỗi đại siêu thị: GO! BigC, WinMart, Co.opmart, Lotte Mart, AEON, Mega Market, Lan Chi.',
  },
  {
    title: 'Bao bì sang trọng',
    body: 'Bao bì sang trọng, lịch lãm, đa dạng cho nhu cầu làm quà biếu, quà tặng, cưới hỏi, lễ Tết.',
  },
  {
    title: 'Xuất khẩu Nhật Bản',
    body: 'Sản phẩm chất lượng được xuất khẩu sang những thị trường khó tính nhất thế giới: Nhật Bản, Mỹ, Anh, Hàn, Canada.',
  },
  {
    title: 'Hàng triệu khách hàng',
    body: 'Hàng triệu khách hàng đã tin dùng, sử dụng và yêu thích sản phẩm truyền thống của chúng tôi.',
  },
];

/** "Sản phẩm cao cấp" — 8 featured products on the home page (mirror order). */
export const FEATURED: { name: string; image: string; href: string }[] = [
  { name: 'Bánh đậu xanh thượng hạng', image: '/images/legacy/th300-web.jpg', href: '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/' },
  { name: 'Bánh đậu trà xanh', image: '/images/legacy/tx300-web.jpg', href: '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/' },
  { name: 'Bánh đậu sầu riêng', image: '/images/legacy/sr300-web.jpg', href: '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/' },
  { name: 'Hộp quà OCOP 5 sao', image: '/images/legacy/hop-5-sao-web.jpg', href: '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/' },
  { name: 'Bánh đậu xanh MIX vị', image: '/images/legacy/catalogue24-15-2.png', href: '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/' },
  { name: 'Hộp tre cao cấp', image: '/images/legacy/banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg', href: '/danh-muc-san-pham/banh-dau-xanh-tet/' },
  { name: 'Bột đậu xanh dinh dưỡng', image: '/images/legacy/bx-web.jpg', href: '/danh-muc-san-pham/bot-dau/' },
  { name: 'Chè đậu đen cốt dừa', image: '/images/legacy/cd-web.jpg', href: '/danh-muc-san-pham/bot-dau/' },
];

/** "Hệ thống phân phối" — supermarket partner logos (mirror order). */
export const DISTRIBUTION_LOGOS: { name: string; image: string }[] = [
  { name: 'GO! / BigC', image: '/images/legacy/1652155214649-sieu-thi-big-c.png' },
  { name: 'Co.opmart', image: '/images/legacy/tai-xuong-1.png' },
  { name: 'AEON', image: '/images/legacy/aeon.jpg' },
  { name: 'WinMart', image: '/images/legacy/WinMart-Logo-PNG-1.png' },
  { name: 'Lotte Mart', image: '/images/legacy/29-06-20129-47-16AM.jpg' },
  { name: 'MM Mega Market', image: '/images/legacy/9181825b44d9689e0ccf2d93347a16db.png' },
  { name: 'Lan Chi Mart', image: '/images/legacy/LANCHI-MART-brand-book-1.png' },
  { name: 'BRG Mart', image: '/images/legacy/ptaDgh9mP0wOuDOXGLZZDU31ShBsp7b5_1718088935____4fd9dc4561b6639ea4f091cbf995b431-1024x1024.png' },
];

/** "Trên truyền thông" — press/media logos (mirror order). url optional. */
export const MEDIA_LOGOS: { name: string; image: string; url?: string }[] = [
  { name: 'Báo Chính phủ', image: '/images/legacy/bao-chinh-phu-150x150.jpg', url: 'https://baochinhphu.vn/them-4-san-pham-duoc-cong-nhan-ocop-5-sao-102240625172136981.htm' },
  { name: 'VTV — Đài Truyền hình Việt Nam', image: '/images/legacy/Dai-truyen-hinh-Viet-Nam-VTV-150x150.jpg', url: 'https://www.youtube.com/watch?v=49EjYQaYTl4' },
  { name: 'Đài PT-TH Hải Dương', image: '/images/legacy/lich-phat-song-thhd-150x150.png', url: 'http://www.haiduongtv.com.vn/media/trang-3.html?view=39246' },
  { name: 'HTV — Đài Truyền hình TP. Hồ Chí Minh', image: '/images/legacy/Dai-Truyen-hinh-TP-Ho-Chi-Minh-HTV-150x150.png', url: 'https://www.youtube.com/watch?v=SFmEYYRiATw' },
  { name: 'Báo Nhân Dân', image: '/images/legacy/Logo-NhanDan-150x150.png' },
  { name: 'Báo Pháp Luật Việt Nam', image: '/images/legacy/Logo_bao_phap_luat_Viet_Nam-150x150.png', url: 'https://baophapluat.vn/banh-dau-xanh-hoang-gia-la-san-pham-dau-tien-cua-hai-duong-duoc-trao-chung-nhan-ocop-5-sao-post528437.html' },
  { name: 'VOV — Đài Tiếng nói Việt Nam', image: '/images/legacy/vov-tai-xuong-150x150.png' },
  { name: 'Báo chí đưa tin', image: '/images/legacy/logoshare-150x150.png' },
  { name: 'Báo Dân Trí', image: '/images/legacy/logo-bao-dien-tu-dan-tri1-150x150.jpg' },
  { name: 'Kênh truyền thông', image: '/images/legacy/channels4_profile.jpg' },
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
