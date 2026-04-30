import crypto from 'node:crypto';
import { getRedis, notifyAdmins, escHtml } from '../_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    // basic anti-spam: 1 link per 60s globally
    const redis = await getRedis();
    const cooldown = await redis.get('admin:sendlink:cooldown');
    if (cooldown) return res.status(429).json({ error: 'too_frequent' });
    await redis.set('admin:sendlink:cooldown', '1', { EX: 60 });

    const token = crypto.randomBytes(24).toString('base64url');
    await redis.set(`admin:magic:${token}`, '1', { EX: 600 }); // 10 min

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `https://${host}/api/admin/magic?token=${token}`;
    const text =
      `🔐 <b>Вход в админку</b>\n` +
      `Ссылка действительна 10 минут, одноразовая.\n\n` +
      `<a href="${escHtml(url)}">${escHtml(url)}</a>`;
    await notifyAdmins(text);

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('sendlink err', e);
    res.status(500).json({ error: 'server' });
  }
}
