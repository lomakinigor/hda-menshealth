export default async function handler(req, res) {
  res.setHeader('Set-Cookie', `hda_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  res.statusCode = 302;
  res.setHeader('Location', '/admin.html');
  res.end();
}
