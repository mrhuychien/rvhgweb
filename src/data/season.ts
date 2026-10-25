/**
 * Lịch mùa vụ — một công tắc duy nhất cho toàn bộ lớp áo Tết.
 *
 * BaseLayout gắn kết quả lên <html data-season="tet">, nên mọi CSS theo mùa
 * sống dưới `[data-season='tet'] { … }` ở một chỗ trong global.css. Hết mùa là
 * attribute biến mất và cả lớp áo tự rụng — không phải đi gỡ từng selector.
 *
 * Vì sao theo NGÀY chứ không phải cờ bật tay: site là tĩnh, nhưng
 * .github/workflows/scheduled-publish.yml gọi deploy hook lúc 07:00 giờ VN mỗi
 * ngày để đăng bài hẹn giờ. Nhờ cái cron đó, cửa sổ ngày tự bật và tự tắt trong
 * vòng một ngày — không ai phải nhớ tháng 3 vào gỡ áo Tết. Cờ bật tay thì đúng
 * vào lúc quên là sai.
 *
 * Lưu ý: cron chỉ chạy khi secret CLOUDFLARE_PAGES_DEPLOY_HOOK đã cấu hình.
 * Chưa có thì lớp áo vẫn lên/xuống đúng ở lần deploy kế tiếp, chỉ là không tự
 * động trong ngày.
 */

/** Mùng 1 Tết Nguyên đán (giờ Việt Nam). Phải tra lịch âm và điền tay —
 *  không suy ra được từ Date. Hết bảng thì mùa Tết ngừng bật, nên nhớ nối
 *  thêm năm trước khi dùng hết. */
const TET_NEW_YEAR_DAYS = ['2027-02-06', '2028-01-26', '2029-02-13'] as const;

/** Mở sớm 110 ngày — với Tết 2027 (06/02) là từ 19/10/2026, với Tết 2028
 *  (26/01) là từ 08/10/2027. Nghe dài nhưng đúng thực tế bán hàng: mùa quà Tết
 *  doanh nghiệp khởi động từ giữa tháng 10, và ảnh hero Tết đã lên trang chủ
 *  từ 25/10/2026. Muốn muộn hơn thì hạ số này. */
const DAYS_BEFORE = 110;
/** Giữ thêm 15 ngày sau mùng 1 — hết rằm tháng Giêng mới coi là qua Tết. */
const DAYS_AFTER = 15;

const DAY_MS = 86_400_000;

export type Season = 'tet' | null;

/** `now` nhận vào được để test; mặc định là thời điểm build. */
export function currentSeason(now: Date = new Date()): Season {
  // Ép về nửa đêm giờ VN (UTC+7) rồi mới so, để biên cửa sổ không lệch một
  // ngày tuỳ theo múi giờ của máy chạy build.
  const nowVn = Math.floor((now.getTime() + 7 * 3_600_000) / DAY_MS);

  for (const day of TET_NEW_YEAR_DAYS) {
    const tet = Math.floor(Date.parse(`${day}T00:00:00Z`) / DAY_MS);
    if (nowVn >= tet - DAYS_BEFORE && nowVn <= tet + DAYS_AFTER) return 'tet';
  }
  return null;
}

/**
 * Ghi đè để xem trước: `RVHG_SEASON=tet pnpm build` bật cưỡng bức,
 * `RVHG_SEASON=off` tắt cưỡng bức. Không đặt thì theo lịch.
 */
export function resolveSeason(now: Date = new Date()): Season {
  const override = import.meta.env.RVHG_SEASON;
  if (override === 'tet') return 'tet';
  if (override === 'off') return null;
  return currentSeason(now);
}
