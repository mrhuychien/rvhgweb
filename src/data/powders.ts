/**
 * Content for the "Bột đậu xanh" (mung-bean powder drink) product line.
 * Every field is transcribed from the official product labels (public/images/nhan/*)
 * and self-declaration dossiers (public/cong-bo/TCB2026/*). Nutrition is per 100 g.
 *
 * These feed the flat landing pages: /botdx-carot/, /botdx-rauma/, /botdx-suadua/,
 * /botdx-matcha/ (single) and /bdx-rauma-khongduong/ (the two no-sugar SKUs).
 */

export interface Nutrition {
  energy: string;  // kcal / 100g
  protein: string;
  carb: string;
  fat: string;
  sodium: string;
  sugar: string;
}

export interface Powder {
  slug: string;            // route + dir name (URL = /<slug>/)
  name: string;            // full product name
  flavor: string;          // short flavour label
  tagline: string;
  story: string;           // brand/product narrative (from the label)
  /** flavour accent (saturated), readable ink-accent (on cream), and soft tint */
  accent: string;
  accentInk: string;
  accentSoft: string;
  image: string;           // packshot in /public (raw path, encoded at render)
  ingredients: string;
  highlights: { title: string; body: string }[];
  nutrition: Nutrition;
  weight: string;
  usage: string[];
  sku: string;             // barcode / GTIN
  declHref: string;        // self-declaration PDF (raw path, encoded at render)
  noSugar?: boolean;
}

const CERT_NOTE =
  'Sản xuất trên dây chuyền đạt chứng nhận ISO 22000:2018 (Quacert). Nhà sản xuất Rồng Vàng Hoàng Gia có 3 sản phẩm bánh đậu xanh đạt OCOP 5 sao Quốc gia.';

const USE_SACHET = [
  'Xé 1 gói bột (40 g) cho vào ly.',
  'Rót khoảng 150 ml nước sôi.',
  'Khuấy đều đến khi tan mịn rồi thưởng thức. Uống lạnh: thêm đá, nên dùng 2 gói.',
];
const USE_JAR = [
  'Cho 3–4 thìa bột (khoảng 30 g) vào ly.',
  'Rót khoảng 150 ml nước sôi.',
  'Khuấy đều đến khi tan mịn. Uống lạnh: thêm đá.',
];

export const POWDERS: Record<string, Powder> = {
  'botdx-carot': {
    slug: 'botdx-carot',
    name: 'Bột đậu xanh Cà Rốt',
    flavor: 'Cà Rốt',
    tagline: 'Đậu xanh lòng vàng hoà quyện cà rốt giàu dưỡng chất — ngọt bùi tự nhiên, tiện lợi mỗi ngày.',
    story:
      'Bột đậu xanh cà rốt Rồng Vàng Hoàng Gia được chế biến từ vùng đất nức tiếng đặc sản Hải Dương xưa, là sự kết hợp giữa truyền thống và xu hướng thưởng thức hiện đại. Đậu xanh lòng vàng tinh mịn, thơm ngon phối trộn cùng cà rốt giàu dinh dưỡng tạo nên thức uống hài hòa, ngọt bùi đặc trưng, hương vị tự nhiên và lành tính — tiện lợi cho bữa phụ, bữa sáng hoặc bổ sung năng lượng trong ngày.',
    accent: '#e1622a',
    accentInk: '#b0451a',
    accentSoft: '#fbeee4',
    image: '/images/bot/bot-dau-xanh-ca-rot.jpg',
    ingredients:
      'Đường (đường kính trắng, đường gluco), bột đậu xanh (40%), bột cà rốt (9%), sữa bột, bột nghệ, hương liệu vani tổng hợp.',
    highlights: [
      { title: 'Cà rốt giàu dưỡng chất', body: 'Bột cà rốt tự nhiên (9%) cho sắc cam ấm và vị ngọt bùi đặc trưng.' },
      { title: 'Đậu xanh lòng vàng', body: '40% đậu xanh tinh mịn, giữ trọn hương bùi truyền thống Hải Dương.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
      { title: 'Tiện lợi dễ dùng', body: 'Hộp 10 gói 40 g, pha nhanh trong 150 ml nước sôi cho bữa sáng hay bữa phụ.' },
    ],
    nutrition: { energy: '382 kcal', protein: '12,3 g', carb: '79,4 g', fat: '1,7 g', sodium: '28,4 mg', sugar: '56,9 g' },
    weight: '400 g (10 gói × 40 g)',
    usage: USE_SACHET,
    sku: '8936110893077',
    declHref: '/cong-bo/TCB2026/01. Bột đậu xanh cà rốt RVHG.pdf',
  },

  'botdx-rauma': {
    slug: 'botdx-rauma',
    name: 'Bột đậu xanh Rau Má',
    flavor: 'Rau Má',
    tagline: 'Đậu xanh lòng vàng gặp rau má Bắc Trung Bộ — thức uống thanh mát từ thiên nhiên.',
    story:
      'Bột đậu xanh rau má Rồng Vàng Hoàng Gia được chế biến từ vùng đất nức tiếng đặc sản Hải Dương xưa, là sự kết hợp giữa truyền thống và xu hướng thưởng thức hiện đại. Đậu xanh lòng vàng tinh mịn, thơm ngon được phối trộn cùng rau má Bắc Trung Bộ, mang đến thức uống thanh mát từ thiên nhiên, thích hợp cho nhịp sống năng động mỗi ngày.',
    accent: '#86b23a',
    accentInk: '#5e7d24',
    accentSoft: '#f1f6e4',
    image: '/images/bot/bot-dau-xanh-rau-ma.jpg',
    ingredients:
      'Đường (đường kính trắng, đường gluco), bột đậu xanh (40%), bột rau má (10%), sữa bột, hương liệu vani tổng hợp.',
    highlights: [
      { title: 'Rau má thanh mát', body: 'Rau má Bắc Trung Bộ tự nhiên (10%) mang cảm giác thanh nhẹ, dễ chịu.' },
      { title: 'Đậu xanh lòng vàng', body: '40% đậu xanh tinh mịn, bùi béo truyền thống Hải Dương.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
      { title: 'Tiện lợi dễ dùng', body: 'Hộp 10 gói 40 g, pha nhanh trong 150 ml nước sôi.' },
    ],
    nutrition: { energy: '365 kcal', protein: '11,3 g', carb: '75,6 g', fat: '1,89 g', sodium: '88,3 mg', sugar: '55,9 g' },
    weight: '400 g (10 gói × 40 g)',
    usage: USE_SACHET,
    sku: '8936110893091',
    declHref: '/cong-bo/TCB2026/03. Bột đậu xanh rau má RVHG.pdf',
  },

  'botdx-suadua': {
    slug: 'botdx-suadua',
    name: 'Bột đậu xanh Sữa Dừa',
    flavor: 'Sữa Dừa',
    tagline: 'Đậu xanh lòng vàng quyện sữa dừa thanh khiết — béo nhẹ, tròn vị, thư giãn.',
    story:
      'Bột đậu xanh sữa dừa Rồng Vàng Hoàng Gia được chế biến từ vùng đất nức tiếng đặc sản Hải Dương xưa, là sự kết hợp giữa truyền thống và xu hướng thưởng thức hiện đại. Đậu xanh lòng vàng tinh mịn, thơm ngon phối trộn cùng bột sữa dừa thanh khiết mang đến thức uống vừa quen thuộc vừa hấp dẫn, tròn vị hơn với cảm giác béo nhẹ khi thưởng thức — phù hợp cho những ai tìm kiếm sự nhẹ nhàng và thư giãn, dùng linh hoạt nhiều thời điểm trong ngày.',
    accent: '#e0a32e',
    accentInk: '#986a14',
    accentSoft: '#fbf2dd',
    image: '/images/bot/bot-dau-xanh-sua-dua.jpg',
    ingredients:
      'Đường (đường kính trắng, đường gluco), bột đậu xanh (30%), bột sữa dừa (20%), sữa bột, hương liệu vani tổng hợp.',
    highlights: [
      { title: 'Sữa dừa thanh khiết', body: '20% bột sữa dừa cho vị béo nhẹ, thơm dịu tự nhiên.' },
      { title: 'Đậu xanh lòng vàng', body: '30% đậu xanh tinh mịn, nền vị bùi quen thuộc.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
      { title: 'Tiện lợi dễ dùng', body: 'Hộp 10 gói 40 g, pha nhanh trong 150 ml nước sôi.' },
    ],
    nutrition: { energy: '404 kcal', protein: '8,08 g', carb: '79,1 g', fat: '6,12 g', sodium: '23 mg', sugar: '64,4 g' },
    weight: '400 g (10 gói × 40 g)',
    usage: USE_SACHET,
    sku: '8936110893084',
    declHref: '/cong-bo/TCB2026/02. Bột đậu xanh sữa dừa RVHG.pdf',
  },

  'botdx-matcha': {
    slug: 'botdx-matcha',
    name: 'Bột đậu xanh Matcha',
    flavor: 'Matcha',
    tagline: 'Đậu xanh lòng vàng và matcha tự nhiên thanh mát — trải nghiệm tinh tế mỗi ngày.',
    story:
      'Bột đậu xanh matcha Rồng Vàng Hoàng Gia được chế biến từ vùng đất nức tiếng đặc sản Hải Dương xưa, là sự kết hợp giữa truyền thống và xu hướng thưởng thức hiện đại. Đậu xanh lòng vàng tinh mịn, thơm ngon phối trộn cùng matcha tự nhiên thanh mát đã tạo nên hương vị đặc trưng, mang lại trải nghiệm tinh tế — phù hợp với những người yêu thích sự nhẹ nhàng, dùng như thức uống bổ sung trong nhịp sống năng động mỗi ngày.',
    accent: '#5c9a3e',
    accentInk: '#3f6e2a',
    accentSoft: '#eaf3e2',
    image: '/images/bot/bot-dau-xanh-matcha.jpg',
    ingredients:
      'Đường (đường kính trắng, đường gluco), bột đậu xanh (45%), bột matcha trà xanh (2,5%), sữa bột, hương liệu vani tổng hợp.',
    highlights: [
      { title: 'Matcha tự nhiên', body: '2,5% bột matcha trà xanh, thanh mát và tinh tế.' },
      { title: 'Đậu xanh lòng vàng', body: '45% đậu xanh — tỷ lệ đậu cao nhất trong dòng sản phẩm.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
      { title: 'Tiện lợi dễ dùng', body: 'Hộp 10 gói 40 g, pha nhanh trong 150 ml nước sôi.' },
    ],
    nutrition: { energy: '381 kcal', protein: '11,7 g', carb: '79,6 g', fat: '1,78 g', sodium: '13,5 mg', sugar: '54,7 g' },
    weight: '400 g (10 gói × 40 g)',
    usage: USE_SACHET,
    sku: '8936110893107',
    declHref: '/cong-bo/TCB2026/04. Bột đậu xanh matcha RVHG.pdf',
  },

  'botdx-rauma-khongduong': {
    slug: 'botdx-rauma-khongduong',
    name: 'Bột đậu xanh Rau Má — Không thêm đường',
    flavor: 'Rau Má',
    tagline: 'Vị bùi truyền thống của đậu xanh và rau má tự nhiên — loại bỏ hoàn toàn đường.',
    story:
      'Bột đậu xanh rau má không thêm đường Rồng Vàng Hoàng Gia là sự kết hợp hoàn hảo giữa vị bùi truyền thống từ đậu xanh và rau má tự nhiên. Công thức loại bỏ hoàn toàn đường và giữ trọn nguồn dinh dưỡng thuần khiết cho cơ thể. Đây là thức uống đồng hành cùng lối sống xanh và gu thưởng thức nguyên bản.',
    accent: '#3f7d4e',
    accentInk: '#2c5c39',
    accentSoft: '#e9f0e6',
    image: '/images/bot/bot-dau-xanh-rau-ma-khong-duong.jpg',
    ingredients: 'Bột đậu xanh (80%), bột sữa dừa, bột rau má (8%), bột matcha trà xanh.',
    highlights: [
      { title: '80% đậu xanh nguyên chất', body: 'Tỷ lệ đậu xanh rất cao — đạm 22,2 g/100 g, giàu dưỡng chất.' },
      { title: 'Không thêm đường', body: 'Chỉ 17,8 g đường tổng/100 g, hoàn toàn từ nguyên liệu tự nhiên.' },
      { title: 'Thuần thực vật (plant-based)', body: 'Rau má và matcha thanh mát, hợp lối sống xanh.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
    ],
    nutrition: { energy: '391 kcal', protein: '22,2 g', carb: '65,9 g', fat: '4,27 g', sodium: '17,5 mg', sugar: '17,8 g' },
    weight: '500 g',
    usage: USE_JAR,
    sku: '8936110893121',
    declHref: '/cong-bo/TCB2026/06. Bột đậu xanh rau má không thêm đường RVHG.pdf',
    noSugar: true,
  },

  'botdx-suadua-khongduong': {
    slug: 'botdx-suadua-khongduong',
    name: 'Bột đậu xanh Sữa Dừa — Không thêm đường',
    flavor: 'Sữa Dừa',
    tagline: 'Vị bùi của đậu xanh và béo nhẹ tự nhiên từ sữa dừa — không một chút đường thêm vào.',
    story:
      'Bột đậu xanh sữa dừa không thêm đường Rồng Vàng Hoàng Gia là sự kết hợp hoàn hảo giữa vị bùi truyền thống từ đậu xanh và béo nhẹ tự nhiên từ sữa dừa. Sản phẩm tiên phong loại bỏ hoàn toàn đường, giữ trọn nguồn dinh dưỡng thuần khiết cho cơ thể. Đây là thức uống thanh lành cho lối sống xanh và gu thưởng thức nguyên bản.',
    accent: '#c79a3a',
    accentInk: '#8f6816',
    accentSoft: '#f8f1dc',
    image: '/images/bot/bot-dau-xanh-sua-dua-khong-duong.jpg',
    ingredients: 'Bột đậu xanh (74%), bột sữa dừa (20%), bột cà rốt, bột nghệ.',
    highlights: [
      { title: '74% đậu xanh nguyên chất', body: 'Đạm 19,8 g/100 g, giàu dưỡng chất từ đậu xanh.' },
      { title: 'Không thêm đường', body: 'Chỉ 24,1 g đường tổng/100 g, vị ngọt tự nhiên từ nguyên liệu.' },
      { title: 'Sữa dừa béo thơm', body: '20% bột sữa dừa cho vị béo nhẹ, thanh khiết.' },
      { title: 'Không chất bảo quản', body: CERT_NOTE },
    ],
    nutrition: { energy: '381 kcal', protein: '19,8 g', carb: '62,0 g', fat: '6,04 g', sodium: '27,4 mg', sugar: '24,1 g' },
    weight: '500 g',
    usage: USE_JAR,
    sku: '8936110893114',
    declHref: '/cong-bo/TCB2026/05. Bột đậu xanh sữa dừa không thêm đường RVHG.pdf',
    noSugar: true,
  },
};

/** Sweetened single-flavour pages, in display order. */
export const POWDER_SINGLES: string[] = ['botdx-carot', 'botdx-rauma', 'botdx-suadua', 'botdx-matcha'];

/** The two no-added-sugar SKUs shown together on /bdx-rauma-khongduong/. */
export const POWDER_NOSUGAR: string[] = ['botdx-rauma-khongduong', 'botdx-suadua-khongduong'];

/** Encode a raw /public path (with spaces/diacritics) into a safe URL. */
export const assetUrl = (p: string): string => encodeURI(p);
