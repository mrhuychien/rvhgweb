/**
 * Rehype plugin: bọc mỗi <table> trong nội dung bằng một khung cuộn ngang.
 *
 *   <table>…</table>
 *   → <div class="rvhg-table-scroll" tabindex="0" role="region"
 *          aria-label="Bảng — vuốt ngang để xem thêm">…</div>
 *
 * Bảng nhiều cột (vd. bảng so sánh dinh dưỡng 6 vị) rộng hơn màn hình điện
 * thoại. Không có khung cuộn thì bảng kéo phình cả cột chữ: đo trên iPhone 13,
 * cột nội dung nở thành 476px trong viewport 390px, chữ tràn ra ngoài.
 *
 * `tabindex="0"` để người dùng bàn phím cuộn được vùng này (yêu cầu của
 * WCAG 2.1.1 với vùng cuộn); `role="region"` + aria-label để trình đọc màn
 * hình biết đây là vùng riêng.
 */
export default function rehypeTableScroll() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type !== 'element') continue;

        // đã bọc rồi thì thôi
        if (child.tagName === 'div' && child.properties?.className?.includes?.('rvhg-table-scroll')) continue;

        if (child.tagName !== 'table') {
          walk(child);
          continue;
        }

        node.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['rvhg-table-scroll'],
            tabindex: '0',
            role: 'region',
            'aria-label': 'Bảng — vuốt ngang để xem thêm',
          },
          children: [child],
        };
      }
    };

    walk(tree);
  };
}
