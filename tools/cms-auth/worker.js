/**
 * RVHG CMS auth relay — Cloudflare Worker
 * -------------------------------------------------------------------------
 * Cầu nối đăng nhập GitHub cho trang quản trị /admin (Sveltia / Decap CMS).
 * Triển khai tĩnh, không cần server riêng. Một lần dựng, dùng mãi.
 *
 * Biến môi trường (Settings → Variables) cần đặt khi deploy:
 *   GITHUB_CLIENT_ID      — Client ID của GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  — Client Secret (đặt dạng "Secret/Encrypted")
 *
 * GitHub OAuth App (https://github.com/settings/developers → New OAuth App):
 *   Homepage URL:              https://www.rongvanghoanggia.com
 *   Authorization callback URL: https://<ten-worker>.<subdomain>.workers.dev/callback
 * -------------------------------------------------------------------------
 */

const OAUTH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const OAUTH_TOKEN = 'https://github.com/login/oauth/access_token';

function randomState() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Trang nhỏ postMessage kết quả về cửa sổ CMS rồi tự đóng. */
function resultPage(status, payload) {
  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html><html><body><script>
    (function () {
      function send(e) {
        if (!window.opener) return;
        window.opener.postMessage(${JSON.stringify(msg)}, e && e.origin ? e.origin : '*');
      }
      window.addEventListener('message', send, false);
      send({ origin: '*' });
    })();
  </script><p>Đang hoàn tất đăng nhập…</p></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1) Bắt đầu: CMS mở /auth → chuyển sang trang cấp quyền GitHub
    if (pathname === '/auth') {
      const state = randomState();
      const redirectUri = `${url.origin}/callback`;
      const to = new URL(OAUTH_AUTHORIZE);
      to.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      to.searchParams.set('redirect_uri', redirectUri);
      to.searchParams.set('scope', 'repo,user');
      to.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: {
          Location: to.toString(),
          'Set-Cookie': `rvhg_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
        },
      });
    }

    // 2) GitHub gọi lại /callback với code → đổi lấy access_token
    if (pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookie = request.headers.get('Cookie') || '';
      const saved = (cookie.match(/rvhg_state=([^;]+)/) || [])[1];

      if (!code || !state || !saved || state !== saved) {
        return new Response(resultPage('error', { message: 'Phiên đăng nhập không hợp lệ, thử lại.' }), {
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      const resp = await fetch(OAUTH_TOKEN, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });
      const data = await resp.json();

      if (data.error || !data.access_token) {
        return new Response(resultPage('error', { message: data.error_description || 'Không lấy được token.' }), {
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      return new Response(
        resultPage('success', { token: data.access_token, provider: 'github' }),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      );
    }

    // Kiểm tra hoạt động
    if (pathname === '/' || pathname === '/health') {
      return new Response('RVHG CMS auth relay — OK', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};
