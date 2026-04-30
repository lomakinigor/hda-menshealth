import { verifyTgAuth, isAdminUsername, setAdminCookie } from '../_lib.js';

export default async function handler(req, res) {
  // Telegram Login Widget redirects here with auth_data in query
  const url = new URL(req.url, `https://${req.headers.host}`);
  const auth = Object.fromEntries(url.searchParams.entries());

  const token = process.env.TG_BOT_TOKEN;
  if (!verifyTgAuth(auth, token)) {
    return res.status(401).send('Auth verification failed');
  }
  if (!isAdminUsername(auth.username)) {
    return res.status(403).send(`Доступ только для админов. @${auth.username || 'unknown'} не в списке.`);
  }

  setAdminCookie(res, { id: auth.id, username: auth.username, ts: Date.now() });
  res.statusCode = 302;
  res.setHeader('Location', '/admin.html');
  res.end();
}
