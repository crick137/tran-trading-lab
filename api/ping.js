export const config = { runtime: 'edge' };

export default async function handler(req, res) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.status(200).send(JSON.stringify({ ok: true, ts: Date.now() }));
}
