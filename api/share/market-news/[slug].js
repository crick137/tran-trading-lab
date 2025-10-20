import { readJSONViaFetch } from '../../_lib/blob.js';

const STORE_PATH = 'market-news';

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripTags(value = '') {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(text = '', limit = 180) {
  const clean = stripTags(text)
    .replace(/https?:\/\/\S+/g, '')
    .trim();
  if (!clean) return '';
  return clean.length > limit ? `${clean.slice(0, limit)}…` : clean;
}

function findFirstImage(...inputs) {
  for (const source of inputs) {
    const match = String(source ?? '').match(/https?:\/\/[^\s"'<>]+?\.(?:png|jpe?g|gif|webp|svg)(\?[^\s"'<>]*)?/i);
    if (match) return match[0];
  }
  return '';
}

async function loadNews(slug) {
  return await readJSONViaFetch(`${STORE_PATH}/${slug}.json`);
}

export default async function handler(req, res) {
  try {
    const slug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug;
    if (!slug) {
      res.statusCode = 400;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<!doctype html><title>Missing slug</title><p>Missing market news slug.</p>');
      return;
    }

    let data = {};
    try {
      data = await loadNews(slug);
    } catch (err) {
      console.warn('[share market-news] load failed', slug, err?.message || err);
    }

    const headers = req.headers || {};
    const proto = headers['x-forwarded-proto'] || 'https';
    const host = headers['x-forwarded-host'] || headers.host || 'localhost';
    const origin = `${proto}://${host}`;
    const canonicalUrl = `${origin}/market-news/${encodeURIComponent(slug)}`;
    const redirectUrl = `${origin}/#/market-news/${encodeURIComponent(slug)}`;

    const title = (data?.title || data?.id || slug).trim();
    const description =
      summarize(data?.summary) ||
      summarize(Array.isArray(data?.bullets) ? data.bullets.join(' • ') : '') ||
      'TRAN TRADING LAB — Market News';

    const image =
      data?.hero ||
      findFirstImage(data?.summary, ...(Array.isArray(data?.bullets) ? data.bullets : [])) ||
      `${origin}/favicon.ico`;

    const meta = `
      <meta property="og:type" content="article">
      <meta property="og:title" content="${escapeHtml(title)}">
      <meta property="og:description" content="${escapeHtml(description)}">
      <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
      <meta property="og:site_name" content="TRAN TRADING LAB">
      ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ''}
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${escapeHtml(title)}">
      <meta name="twitter:description" content="${escapeHtml(description)}">
      ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ''}
      <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
    `;

    const html = `<!doctype html>
      <html lang="ko">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          ${meta}
          <title>${escapeHtml(title)}</title>
          <meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}">
          <style>
            body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f1115;color:#eaecee;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;}
            .card{max-width:560px;background:#15171a;border:1px solid #23262b;border-radius:16px;padding:24px;box-shadow:0 18px 48px rgba(0,0,0,.45);}
            a{color:#66e0ff;text-decoration:none;}
            a:hover{text-decoration:underline;}
          </style>
        </head>
        <body>
          <article class="card">
            <h1>${escapeHtml(title)}</h1>
            <p>${escapeHtml(description)}</p>
            <p><a href="${escapeHtml(redirectUrl)}">본문으로 이동</a></p>
          </article>
          <script>
            setTimeout(function(){ location.replace(${JSON.stringify(redirectUrl)}); }, 50);
          </script>
        </body>
      </html>`;

    res.statusCode = data?.title ? 200 : 404;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 's-maxage=1800, stale-while-revalidate=86400');
    res.end(html);
  } catch (err) {
    console.error('[share market-news] unexpected error', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<!doctype html><title>Error</title><p>Unable to render market news preview.</p>');
  }
}
