import type { CollectionEntry } from 'astro:content';

/**
 * URL slug cho một bài viết.
 * Trường `slug` trong frontmatter (nếu có) sẽ ghi đè tên file —
 * cho phép đặt link tùy chỉnh, ví dụ `slug: bdx-carot` → /bdx-carot/.
 * Mặc định dùng `post.id` (tên file, kiểu WordPress phẳng).
 */
export function postSlug(post: CollectionEntry<'posts'>): string {
  return (post.data.slug ?? post.id).replace(/^\/+|\/+$/g, '');
}

/** Đường dẫn đầy đủ (kèm trailing slash) của một bài viết. */
export function postPath(post: CollectionEntry<'posts'>): string {
  return `/${postSlug(post)}/`;
}
