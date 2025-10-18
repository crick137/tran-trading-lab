// api/ping.js —— 最小可运行版本，用于确认函数是否挂起

export default async function handler(req) {
  const start = Date.now();
  console.log("=== /api/ping invoked ===", start);

  try {
    return new Response(
      JSON.stringify({
        ok: true,
        ts: start,
        url: req.url || "no-url",
        runtime: process.env.VERCEL_RUNTIME || "node",
        env: process.env.VERCEL_ENV || "unknown",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "access-control-allow-origin": "*",
        },
      }
    );
  } catch (e) {
    console.error("PING_ERROR", e);
    return new Response(
      JSON.stringify({ ok: false, err: e.message || String(e) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
