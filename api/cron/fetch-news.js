// /api/cron/fetch-news.js
const TG_API = 'https://api.telegram.org';

async function sendTG(token, chatId, text) {
  const url = `${TG_API}/bot${token}/sendMessage`;
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.ok;
}

export default async function handler(req, res) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return res.status(500).json({ ok:false, error:'Missing TELEGRAM_* env' });
    }

    // 复用 /api/news 的聚合逻辑
    const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const r = await fetch(`${base}/api/news?n=5`, { cache: 'no-store' });
    const list = r.ok ? await r.json() : [];

    if (!Array.isArray(list) || list.length === 0) {
      await sendTG(token, chatId, '⚠️ 뉴스 수집 결과가 비었습니다.');
      return res.status(200).json({ ok:true, sent:false, reason:'empty' });
    }

    const lines = list.map(n => `- ${n.summaryKo} [원문](${n.link})`);
    const text = `📰 *마켓 뉴스 (Top ${Math.min(5, list.length)})*\n\n${lines.join('\n')}\n\n#뉴스 #마켓`;
    const ok = await sendTG(token, chatId, text);

    return res.status(200).json({ ok, count: list.length });
  } catch (e) {
    return res.status(500).json({ ok:false, error: String(e) });
  }
}
