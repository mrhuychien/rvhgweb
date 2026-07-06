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

/**
 * Mốc thời gian "as-of" dùng để mở khoá bài theo lịch (đăng bài hẹn giờ).
 * Mặc định là thời điểm build. Có thể ghi đè bằng biến môi trường
 * `PUBLIC_PUBLISH_AS_OF` (định dạng ISO, vd. 2026-08-01) để XEM TRƯỚC các bài
 * tương lai khi build/preview mà chưa muốn công bố thật.
 */
export function publishAsOf(): Date {
  const override = import.meta.env.PUBLIC_PUBLISH_AS_OF;
  const d = override ? new Date(override) : new Date();
  return Number.isNaN(d.valueOf()) ? new Date() : d;
}

/**
 * Bài đã "lên sóng": không phải bản nháp và đã tới ngày đăng
 * (publishDate <= mốc as-of). Bài có publishDate ở tương lai sẽ bị ẩn cho tới
 * khi site được build lại vào/hoặc sau ngày đó → cơ chế đăng bài theo lịch.
 */
export function isPublished(post: CollectionEntry<'posts'>): boolean {
  return !post.data.draft && post.data.publishDate.valueOf() <= publishAsOf().valueOf();
}
