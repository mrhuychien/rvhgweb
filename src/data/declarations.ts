/**
 * Sổ đăng ký hồ sơ tự công bố sản phẩm — nguồn duy nhất cho mọi link văn bản.
 *
 * Bản gốc 21 văn bản nằm trên Google Drive của công ty (thư mục công khai
 * "Tu Cong Bo Chuan"), không host trong repo: mỗi bản tự công bố là ảnh scan
 * 0,7–5 MB, cộng lại 24 MB — tải thẳng từ host thì tốn băng thông mà bản gốc
 * vẫn do công ty giữ. File PDF cũ vẫn còn trong public/cong-bo/ làm bản dự
 * phòng nhưng KHÔNG còn được dẫn tới (tools/drivecheck.mjs canh việc này).
 *
 * Số hiệu và ngày ký dưới đây đọc trực tiếp từ bản scan, và mỗi số hiệu đều
 * được một văn bản thứ hai xác nhận lại:
 *   · 01–08/2023 và 09, 10/2021  → liệt kê trong công văn đính chính 2026
 *   · 01–06/HOANGGIANG/2026      → liệt kê trong Thông báo 10/TB-HGC
 * Chỗ nào bản scan mờ thì lấy theo văn bản xác nhận, không suy đoán.
 *
 * Toàn bộ file đã kiểm quyền chia sẻ: "anyone with the link → reader". Thêm
 * văn bản mới thì phải kiểm lại quyền này bằng tay — drivecheck không gọi mạng.
 */

export const DRIVE_FOLDER =
  'https://drive.google.com/drive/folders/1hwasJijp95Oev3_4UBZsSl46N99mc0GF';

/** Dạng /file/d/<id>/view là dạng duy nhất mở được bản xem trước trên di động. */
export const driveUrl = (id: string): string => `https://drive.google.com/file/d/${id}/view?usp=sharing`;

export type DeclGroup = 'banh-2023' | 'bot-2021' | 'bot-2026' | 'tccs' | 'cong-van';

export interface Declaration {
  /** Khoá ổn định dùng trong code; không đổi khi tên sản phẩm đổi. */
  key: string;
  /** Google Drive file ID. */
  id: string;
  /** Số hiệu in trên văn bản. */
  no: string;
  /** Nhãn hiển thị (tên sản phẩm hoặc tên văn bản). */
  label: string;
  /** Ngày ký, dd/mm/yyyy. */
  signed: string;
  group: DeclGroup;
  /** Đường dẫn PDF cũ trong public/ mà văn bản này thay thế. */
  local?: string;
}

export const DECLARATIONS: Declaration[] = [
  // ---- Bánh đậu xanh — 8 bản tự công bố ký 01/07/2023 ----
  {
    key: 'banh-dau-xanh',
    id: '1I6mVj6dZ2xZl2SA_ScMIpMEvVhfwsS8G',
    no: '01/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh Rồng Vàng Hoàng Gia',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/01-banh-dau-xanh.pdf',
  },
  {
    key: 'banh-dau-tra-xanh',
    id: '1biFw1WzVQzdOqD5SM2Nr0DqXm7boxYw2',
    no: '02/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu trà xanh Rồng Vàng Hoàng Gia',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/02-banh-dau-tra-xanh.pdf',
  },
  {
    key: 'banh-dau-sau-rieng',
    id: '1SxMOgYfGV6DDVeSDb42jgjBBSYHRuK5u',
    no: '03/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu sầu riêng Rồng Vàng Hoàng Gia',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/03-banh-dau-sau-rieng.pdf',
  },
  {
    key: 'banh-dau-trai-cay',
    id: '1rk9xX7z0MSE4Fh-MGP8VC1_czNIOb8ma',
    no: '04/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh hương vị trái cây',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/04-banh-dau-xanh-huong-vi-trai-cay.pdf',
  },
  {
    key: 'banh-dau-sen',
    id: '1ks3qqKVgSb-_hCzPHpU81KOm56S2QdcO',
    no: '05/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh hương vị sen',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/05-banh-dau-xanh-huong-vi-sen.pdf',
  },
  {
    key: 'banh-dau-dua',
    id: '1qba3D6UZnPUiLTeSpSMg35sjW9-oIlLl',
    no: '06/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh hương vị dừa',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/06-banh-dau-xanh-huong-vi-dua.pdf',
  },
  {
    key: 'banh-dau-khoai-mon',
    id: '1Bm_Z58S3J69oJWD9OCSkpd2DH5hfDOTI',
    no: '07/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh hương vị khoai môn',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/07-banh-dau-xanh-huong-vi-khoai-mon.pdf',
  },
  {
    key: 'banh-dau-com',
    id: '1eao1MPMDtIz2oB6b6CHNpPdubvQdoP-F',
    no: '08/Công ty cổ phần Hoàng Giang/Năm 2023',
    label: 'Bánh đậu xanh hương vị cốm',
    signed: '01/07/2023',
    group: 'banh-2023',
    local: '/cong-bo/08-banh-dau-xanh-huong-vi-com.pdf',
  },

  // ---- Bột đậu / chè — 2 bản tự công bố ký 01/06/2021 ----
  {
    key: 'bot-dau-xanh-dinh-duong',
    id: '1gbJNuJ5Pc5RRjar2RLYt3SiHE13srrnC',
    no: '09/Công ty cổ phần Hoàng Giang/Năm 2021',
    label: 'Bột đậu xanh dinh dưỡng',
    signed: '01/06/2021',
    group: 'bot-2021',
    local: '/cong-bo/09-bot-dau-xanh-dinh-duong.pdf',
  },
  {
    key: 'che-dau-den-cot-dua',
    id: '1Ni3o_9vuVKNsnoEbl2c2eZho7lg9dKKl',
    no: '10/Công ty cổ phần Hoàng Giang/Năm 2021',
    label: 'Chè đậu đen cốt dừa',
    signed: '01/06/2021',
    group: 'bot-2021',
    local: '/cong-bo/10-che-dau-den-cot-dua.pdf',
  },

  // ---- Bột đậu xanh pha sẵn — 6 bản tự công bố năm 2026 ----
  {
    key: 'bot-carot',
    id: '18TjQP5dI3MAniWv5LvgHc6SNBnO0atSX',
    no: '01/HOANGGIANG/2026',
    label: 'Bột đậu xanh Cà Rốt',
    signed: '09/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/01. Bột đậu xanh cà rốt RVHG.pdf',
  },
  {
    key: 'bot-suadua',
    id: '1Jh8_ruJnYJP4NFZs6VQFp3G5XhTXPA_4',
    no: '02/HOANGGIANG/2026',
    label: 'Bột đậu xanh Sữa Dừa',
    signed: '09/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/02. Bột đậu xanh sữa dừa RVHG.pdf',
  },
  {
    key: 'bot-rauma',
    id: '1iGM9Zuu026Vd8eOdscKneojL9dfH02u8',
    no: '03/HOANGGIANG/2026',
    label: 'Bột đậu xanh Rau Má',
    signed: '29/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/03. Bột đậu xanh rau má RVHG.pdf',
  },
  {
    key: 'bot-matcha',
    id: '1R8Ebe_XZKt1WikBlYRIvhYBs5d5dnrCM',
    no: '04/HOANGGIANG/2026',
    label: 'Bột đậu xanh Matcha',
    signed: '09/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/04. Bột đậu xanh matcha RVHG.pdf',
  },
  {
    key: 'bot-suadua-khongduong',
    id: '1J3iH4j62Si3mklthW9pw21XwANm2eGJj',
    no: '05/HOANGGIANG/2026',
    label: 'Bột đậu xanh Sữa Dừa, không thêm đường',
    signed: '09/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/05. Bột đậu xanh sữa dừa không thêm đường RVHG.pdf',
  },
  {
    key: 'bot-rauma-khongduong',
    id: '1Q9yy4lg8bM182poDjPj-SCh7LH4VR-D6',
    no: '06/HOANGGIANG/2026',
    label: 'Bột đậu xanh Rau Má, không thêm đường',
    signed: '09/06/2026',
    group: 'bot-2026',
    local: '/cong-bo/TCB2026/06. Bột đậu xanh rau má không thêm đường RVHG.pdf',
  },

  // ---- Tiêu chuẩn cơ sở ----
  // TCCS 01 và 03 đều là bản SOÁT XÉT LẦN 1; bản ban hành đầu (QĐ 08/QĐ-HGC
  // ngày 17/3/2026 và QĐ 10/QĐ-HGC ngày 03/8/2026) đã bị thay thế.
  {
    key: 'tccs-01-2026',
    id: '1fRUgclhAFLxHKHdYncZkjg5WhlQ4L8Gi',
    no: 'TCCS 01:2026/RVHG — soát xét lần 1 (QĐ 11/QĐ-HGC)',
    label: 'Bột đậu có đường',
    signed: '10/08/2026',
    group: 'tccs',
    local: '/cong-bo/TCB2026/TCCS 01 2026.pdf',
  },
  {
    key: 'tccs-02-2026',
    id: '1u1XGTjGRgMbUrXvGFMMteX_5lhTVNxDp',
    no: 'TCCS 02:2026/RVHG (QĐ 09/QĐ-HGC)',
    label: 'Bột đậu không thêm đường',
    signed: '17/03/2026',
    group: 'tccs',
    local: '/cong-bo/TCB2026/TCCS 02 2026.pdf',
  },
  {
    key: 'tccs-03-2026',
    id: '1dW0UIu0cJZDB2W_3MVEhqGNsesR6g9BH',
    no: 'TCCS 03:2026/RVHG — soát xét lần 1 (QĐ 12/QĐ-HGC)',
    label: 'Bánh đậu xanh',
    signed: '15/08/2026',
    group: 'tccs',
  },

  // ---- Công văn gửi cơ quan quản lý ----
  {
    key: 'cv-dinh-chinh-2026',
    id: '1U5VwTou6LPyFswzqYWkmbwyDJ0DVIGxF',
    // Số hiệu và ngày/tháng trên bản scan không đọc được (chỉ rõ "năm 2026");
    // không ghi số hiệu phỏng đoán lên trang pháp lý.
    no: 'Công văn đính chính, bổ sung hồ sơ tự công bố',
    label: 'Đính chính 10 bản tự công bố 2023 & 2021',
    signed: '2026',
    group: 'cong-van',
  },
  {
    key: 'cv-nhan-tu-cong-bo',
    id: '1d8SYL9s2K4p50K-vpEkjrIvPkv9dHsFa',
    no: 'Thông báo 10/TB-HGC',
    label: 'Nộp hồ sơ tự công bố 6 sản phẩm bột đậu xanh',
    signed: '29/06/2026',
    group: 'cong-van',
    local: '/cong-bo/TCB2026/CV nhan tu cong bo.pdf',
  },
];

const BY_KEY: Record<string, Declaration> = Object.fromEntries(DECLARATIONS.map((d) => [d.key, d]));

/** Link Drive của một văn bản. Ném lỗi lúc build nếu khoá sai — không để link chết. */
export const declUrl = (key: string): string => {
  const d = BY_KEY[key];
  if (!d) throw new Error(`declarations: không có văn bản nào mang khoá '${key}'`);
  return driveUrl(d.id);
};

export const byGroup = (group: DeclGroup): Declaration[] => DECLARATIONS.filter((d) => d.group === group);

/** Tập URL Drive hợp lệ — dùng để chặn link lệch trong frontmatter (content.config.ts). */
export const DECL_URLS: ReadonlySet<string> = new Set(DECLARATIONS.map((d) => driveUrl(d.id)));
