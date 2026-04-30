import { createClient } from 'redis';
import crypto from 'node:crypto';

let _client = null;
export async function getRedis() {
  if (_client && _client.isOpen) return _client;
  _client = createClient({ url: process.env.KV_REDIS_URL });
  _client.on('error', (e) => console.error('redis error', e));
  await _client.connect();
  return _client;
}

export async function notifyAdmins(text) {
  const token = process.env.TG_BOT_TOKEN;
  const ids = (process.env.ADMIN_CHAT_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!token || !ids.length) return;
  await Promise.all(ids.map(chat_id =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true })
    }).catch(e => console.error('tg send fail', chat_id, e))
  ));
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; if (data.length > 1e5) reject(new Error('payload too big')); });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

export function escHtml(s) {
  return String(s ?? '').replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));
}

export function sanitize(s, max = 200) {
  return String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
}

// Telegram Login Widget hash verification
// docs: https://core.telegram.org/widgets/login#checking-authorization
export function verifyTgAuth(authData, botToken) {
  if (!authData || !authData.hash) return false;
  const { hash, ...fields } = authData;
  const dataCheckString = Object.keys(fields)
    .sort()
    .map(k => `${k}=${fields[k]}`)
    .join('\n');
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  if (hmac !== hash) return false;
  // expire after 24h
  const ts = Number(fields.auth_date || 0);
  if (!ts || Math.floor(Date.now() / 1000) - ts > 86400) return false;
  return true;
}

const COOKIE_NAME = 'hda_admin';

export function setAdminCookie(res, payload) {
  const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.TG_BOT_TOKEN).update(token).digest('base64url');
  const value = `${token}.${sig}`;
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
}

export function readAdminCookie(req) {
  const raw = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return null;
  const value = raw.slice(COOKIE_NAME.length + 1);
  const [token, sig] = value.split('.');
  if (!token || !sig) return null;
  const expected = crypto.createHmac('sha256', process.env.TG_BOT_TOKEN).update(token).digest('base64url');
  if (expected !== sig) return null;
  try { return JSON.parse(Buffer.from(token, 'base64url').toString()); } catch { return null; }
}

export function isAdminUsername(username) {
  const allowed = (process.env.ADMIN_USERNAMES || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return !!username && allowed.includes(String(username).toLowerCase());
}
