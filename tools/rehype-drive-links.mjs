/**
 * Rehype plugin: link văn bản gốc trên Google Drive mở ở tab mới.
 *
 *   [Bản tự công bố 01](https://drive.google.com/file/d/…/view?usp=sharing)
 *   → <a … target="_blank" rel="noopener noreferrer" class="rvhg-drivelink">
 *
 * Bản gốc hồ sơ tự công bố nằm trên Drive (xem src/data/declarations.ts). Người
 * đọc trang pháp lý thường mở liên tiếp nhiều văn bản để đối chiếu — điều hướng
 * hẳn sang Drive là mất chỗ đang đọc và phải quay lại bằng nút back. PowerLayout
 * và trang /cong-bo/ đã mở tài liệu ở tab mới, đây là cho phần Markdown.
 *
 * Chỉ nhận diện theo tên miền drive.google.com, không áp dụng cho link ngoài
 * khác (link báo chí trong bài viết vẫn giữ nguyên hành vi điều hướng).
 */
export default function rehypeDriveLinks() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName !== 'a') {
          walk(child);
          continue;
        }
        const href = child.properties?.href;
        if (typeof href !== 'string' || !href.includes('drive.google.com')) continue;

        child.properties.target = '_blank';
        child.properties.rel = 'noopener noreferrer';
        child.properties.className = [...(child.properties.className ?? []), 'rvhg-drivelink'];
      }
    };
    walk(tree);
  };
}
