import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Static content pages: gioi-thieu, lien-he, diem-ban, cau-chuyen-thuong-hieu… */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Original WordPress URL (kept 1:1 for SEO). */
    oldUrl: z.string(),
    /** Astro route this page is served at, e.g. "/gioi-thieu/". */
    route: z.string(),
    ogImage: z.string().optional(),
    heroImage: z.string().optional(),
    updated: z.coerce.date().optional(),
    /** When true the file owns its own dedicated .astro route (not rendered by a generic collection page). */
    standalone: z.boolean().default(false),
  }),
});

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

const productCategories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/product-categories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    heroImage: z.string().optional(),
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
    /** Slugs of related products to surface at the foot of the post. */
    relatedProducts: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
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
