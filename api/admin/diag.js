export const config = { runtime: 'nodejs' };

import { list } from '@vercel/blob';

function detectTokens() {
  const out = [];
  try {
    const env = process.env || {};
    for (const k of Object.keys(env)) {
      if (/_READ_WRITE_TOKEN$/i.test(k)) {
        out.push({ name: k, present: !!env[k] });
      }
    }
  } catch {}
  return out;
}

function pickToken() {
  const env = process.env || {};
  if (env.BLOB_READ_WRITE_TOKEN) return env.BLOB_READ_WRITE_TOKEN;
  if (env.BLOB_RW_TOKEN) return env.BLOB_RW_TOKEN;
  for (const [k, v] of Object.entries(env)) {
    if (/_READ_WRITE_TOKEN$/i.test(k) && v) return v;
  }
  return '';
}

function json(res, status, data){
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res){
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }

  const ver = {
    vercelEnv: process.env.VERCEL_ENV || 'local',
    nodeEnv: process.env.NODE_ENV || 'development',
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  };

  const tokens = detectTokens();
  const token = pickToken();

  // Connectivity check with short timeout
  let connectivity = { ok: false, error: null };
  try {
    const p = list({ prefix: '', token });
    const r = await Promise.race([
      p,
      new Promise((_, rej)=> setTimeout(()=> rej(new Error('TIMEOUT')), 4000))
    ]);
    if (r && (Array.isArray(r.blobs) || typeof r === 'object')) connectivity.ok = true;
  } catch (e) {
    connectivity.error = (e && e.message) ? e.message : String(e||'UNKNOWN');
  }

  return json(res, 200, {
    env: ver,
    tokens,
    tokenDetected: !!token,
    connectivity,
  });
}

