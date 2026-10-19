// Lấy số lượt thích, bình luận, chia sẻ của bài đăng công khai qua dịch vụ dữ liệu bên thứ ba.
// Khóa API đặt trong Netlify: Site configuration → Environment variables:
//   METRICS_API_URL  – địa chỉ endpoint của nhà cung cấp
//   METRICS_API_KEY  – khóa API (không đưa vào mã nguồn)
// Chỉnh hai dòng "gọi nhà cung cấp" và "đọc kết quả" cho đúng tài liệu của nhà cung cấp đã chọn.

const ALLOWED_HOST = /(^|\.)(facebook\.com|fb\.watch|fb\.com|fb\.me|tiktok\.com)$/i;

const json = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const raw = (event.queryStringParameters || {}).url;
  if (!raw) return json(400, { error: 'missing_url' });

  let target;
  try { target = new URL(raw); } catch (e) { return json(400, { error: 'bad_url' }); }
  if (target.protocol !== 'https:' && target.protocol !== 'http:') return json(400, { error: 'bad_url' });
  if (!ALLOWED_HOST.test(target.hostname)) return json(400, { error: 'host_not_allowed' });

  const base = process.env.METRICS_API_URL;
  const key = process.env.METRICS_API_KEY;
  if (!base || !key) return json(503, { error: 'not_configured' });

  // Gọi nhà cung cấp (chỉnh theo tài liệu của họ)
  const r = await fetch(base + '?url=' + encodeURIComponent(target.href), {
    headers: { Authorization: 'Bearer ' + key, Accept: 'application/json' },
  });
  if (!r.ok) return json(502, { error: 'provider_' + r.status });

  // Đọc kết quả (chỉnh tên trường theo nhà cung cấp)
  const d = await r.json();
  return json(200, {
    likes: Number(d.likes) || 0,
    comments: Number(d.comments) || 0,
    shares: Number(d.shares) || 0,
  });
};
