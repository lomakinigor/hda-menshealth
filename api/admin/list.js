import { getRedis, readAdminCookie, isAdminUsername } from '../_lib.js';

export default async function handler(req, res) {
  const sess = readAdminCookie(req);
  if (!sess || !isAdminUsername(sess.username)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  try {
    const redis = await getRedis();
    const [bookings, questions] = await Promise.all([
      redis.lRange('bookings', 0, 999),
      redis.lRange('questions', 0, 999)
    ]);
    res.status(200).json({
      bookings: bookings.map(s => JSON.parse(s)),
      questions: questions.map(s => JSON.parse(s))
    });
  } catch (e) {
    console.error('list err', e);
    res.status(500).json({ error: 'server' });
  }
}
