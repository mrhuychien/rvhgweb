import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { renderOg } from '../../../lib/og';

export const prerender = true;

export async function getStaticPaths() {
  const products = await getCollection('products');
  return products.map((p) => ({ params: { slug: p.id }, props: { entry: p } }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'products'>>>[number];
  const category = await getEntry('productCategories', entry.data.category);
  const eyebrow = category ? `Sản phẩm · ${category.data.title}` : 'Sản phẩm';
  const png = await renderOg({
    eyebrow,
    title: entry.data.title,
    ocop5: entry.data.isOcop5Star,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
