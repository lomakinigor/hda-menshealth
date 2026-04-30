import { getRedis, setAdminCookie } from '../_lib.js';

export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const token = url.searchParams.get('token') || '';
  if (!token) return res.status(400).send('No token');
  try {
    const redis = await getRedis();
    const key = `admin:magic:${token}`;
    const ok = await redis.get(key);
    if (!ok) return res.status(401).send('Ссылка устарела или уже использована.');
    await redis.del(key);

    // first admin in ADMIN_USERNAMES is the default identity
    const username = (process.env.ADMIN_USERNAMES || '').split(',')[0].trim().toLowerCase();
    setAdminCookie(res, { id: 'magic', username, ts: Date.now() });
    res.statusCode = 302;
    res.setHeader('Location', '/admin.html');
    res.end();
  } catch (e) {
    console.error('magic err', e);
    res.status(500).send('server error');
  }
}
