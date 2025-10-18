export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    ts: Date.now(),
    msg: "Ping OK ✅ from Vercel Node",
    env: process.env.NODE_ENV || 'unknown'
  });
}
