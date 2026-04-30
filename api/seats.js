import { getRedis, normalizeContact } from './_lib.js';

const TOTAL = 20;

export default async function handler(req, res) {
  try {
    const redis = await getRedis();

    // One-shot migration: if set is empty but list has records, populate set
    const setSize = await redis.sCard('bookings:contacts');
    const listSize = await redis.lLen('bookings');
    if (setSize === 0 && listSize > 0) {
      const all = await redis.lRange('bookings', 0, -1);
      for (const s of all) {
        try {
          const r = JSON.parse(s);
          const norm = normalizeContact(r.contact);
          if (norm) await redis.sAdd('bookings:contacts', norm);
        } catch {}
      }
    }

    const occupied = await redis.sCard('bookings:contacts');
    const available = Math.max(0, TOTAL - occupied);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ total: TOTAL, occupied, available });
  } catch (e) {
    console.error('seats err', e);
    res.status(500).json({ error: 'server' });
  }
}
