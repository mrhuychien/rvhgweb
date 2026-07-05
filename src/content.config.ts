import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    /** Tiêu đề tối ưu SEO cho thẻ <title> (tách khỏi H1 hiển thị). Bỏ trống thì dùng `title`. */
    seoTitle: z.string().optional(),
    description: z.string(),
    oldUrl: z.string(),
    route: z.string(),
    ogImage: z.string().optional(),
    heroImage: z.string().optional(),
    updated: z.coerce.date().optional(),
    standalone: z.boolean().default(false),
  }),
});

const productItem = z.object({
  name: z.string(),
  image: z.string().optional(),
  weight: z.string().optional(),
  isOcop5Star: z.boolean().default(false),
  /** Optional link to a dedicated product page; makes the tile clickable. */
  href: z.string().optional(),
});

const certification = z.object({
  title: z.string(),
  body: z.string(),
});

const declarationLink = z.object({
  label: z.string(),
  href: z.string(),
});

/** A "product line" page — replaces the old per-SKU detail pages.
 *  One file per line; the body is brand-voice prose; frontmatter carries
 *  the structured cert/compliance/product-grid data the layout renders. */
const productCategories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/product-categories' }),
  schema: z.object({
    title: z.string(),
    /** Tiêu đề tối ưu SEO cho thẻ <title> (tách khỏi H1 hiển thị). Bỏ trống thì dùng `title`. */
    seoTitle: z.string().optional(),
    /** Short eyebrow phrase shown above the line title, Apple-style. */
    eyebrow: z.string().optional(),
    /** Hero subline — one breathing sentence under the title. */
    tagline: z.string(),
    /** Card description fallback for grids on home / overview. */
    description: z.string(),
    /** Câu trả lời ngắn kiểu "định-nghĩa-trước" hiển thị dưới hero — tối ưu AI trích dẫn (GEO). */
    quickAnswer: z.string().optional(),
    /** Hỏi–đáp → mục FAQ hiển thị + FAQPage JSON-LD (rich result + được AI trích dẫn). */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    order: z.number().default(0),
    heroImage: z.string().optional(),
    /** Image for the homepage "Danh mục sản phẩm" card grid (authentic old-site photo). */
    cardImage: z.string().optional(),
    /** object-position for the card image when its aspect differs from the tile (e.g. portrait Tết). */
    cardImagePos: z.string().optional(),
    /** Optional secondary image used in the brand-intro band. */
    storyImage: z.string().optional(),
    /** Per-line accent color (hex). Used sparingly — Apple keeps colour to media. */
    accent: z.string().optional(),
    /** Compliance certifications (ISO, OCOP, ATTP, …) shown as a card row. */
    certifications: z.array(certification).default([]),
    /** Self-declarations published by the company. Each links to a PDF or hub page. */
    selfDeclarations: z.array(declarationLink).default([]),
    /** Product tiles (name + image only, no link out). */
    products: z.array(productItem).default([]),
    oldUrl: z.string(),
  }),
});

/** Legacy `products` collection retained for archival data; no routes render from it. */
const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sku: z.string().optional(),
    category: z.enum([
      'banh-dau-xanh-thuong-hang',
      'banh-dau-xanh-tet',
      'banh-dau-xanh-truyen-thong',
      'banh-dau-xanh-trai-cay-truyen-thong',
      'bot-dau',
    ]),
    weight: z.string().optional(),
    packaging: z.string().optional(),
    isOcop5Star: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    order: z.number().default(0),
    images: z.array(z.string()).min(1),
    shopeeLink: z.string().url().optional(),
    tiktokLink: z.string().url().optional(),
    oldUrl: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Rồng Vàng Hoàng Gia'),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    oldUrl: z.string(),
    relatedProducts: z.array(z.string()).default([]),
    /** Hỏi–đáp → FAQPage JSON-LD (giúp rich result + được AI trích dẫn). */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** Các bước hướng dẫn → HowTo JSON-LD (vd. cách pha). */
    howTo: z.object({ name: z.string(), steps: z.array(z.string()).min(2) }).optional(),
    draft: z.boolean().default(false),
    /**
     * Link tùy chỉnh cho bài viết, ghi đè tên file.
     * Chỉ chữ thường, số và dấu gạch ngang. Ví dụ: `bdx-carot` → /bdx-carot/.
     * Bỏ trống để dùng tên file làm link (mặc định).
     */
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug chỉ gồm chữ thường, số và dấu gạch ngang (vd: bdx-carot)')
      .optional(),
  }),
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/policies' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    effectiveDate: z.coerce.date().optional(),
    oldUrl: z.string(),
  }),
});

export const collections = { pages, products, productCategories, posts, policies };
