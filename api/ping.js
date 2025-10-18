export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.status(200).send(JSON.stringify({ ok: true, ts: Date.now() }));
}
