import { getRedis, notifyAdmins, readJson, sanitize, escHtml } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const body = await readJson(req);
    const lastName  = sanitize(body.lastName, 80);
    const firstName = sanitize(body.firstName, 80);
    const middleName = sanitize(body.middleName, 80);
    const contact   = sanitize(body.contact, 120);
    const consent   = !!body.consent;

    if (!firstName) return res.status(400).json({ error: 'firstName required' });
    if (!contact)   return res.status(400).json({ error: 'contact required' });
    if (!consent)   return res.status(400).json({ error: 'consent required' });

    const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ts = new Date().toISOString();
    const record = { id, ts, lastName, firstName, middleName, contact };

    const redis = await getRedis();
    await redis.lPush('bookings', JSON.stringify(record));
    await redis.lTrim('bookings', 0, 9999);

    const text =
      `🎫 <b>Новая бронь</b>\n` +
      `${escHtml([lastName, firstName, middleName].filter(Boolean).join(' '))}\n` +
      `📞 ${escHtml(contact)}\n` +
      `🕐 ${ts}`;
    await notifyAdmins(text);

    res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error('booking err', e);
    res.status(500).json({ error: 'server' });
  }
}
