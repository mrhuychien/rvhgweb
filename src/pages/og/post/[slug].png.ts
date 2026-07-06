import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg } from '../../../lib/og';
import { isPublished } from '../../../lib/posts';

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection('posts', isPublished);
  return posts.map((p) => ({ params: { slug: p.id }, props: { entry: p } }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'posts'>>>[number];
  const png = await renderOg({
    eyebrow: 'Tin tức · Rồng Vàng Hoàng Gia',
    title: entry.data.title,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
