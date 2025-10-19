#!/usr/bin/env node
// Push syllabus JSON to /api/research/syllabus
// Usage:
//   ADMIN_PASSWORD=... node tools/push-syllabus.mjs https://your.domain backup/syllabus-full.json

import fs from 'node:fs/promises';
import { Agent, fetch as undiciFetch } from 'undici';

const base = (process.argv[2] || '').replace(/\/$/, '') || 'http://localhost:3000';
const file = process.argv[3] || 'backup/syllabus-full.json';
const token = process.env.ADMIN_PASSWORD || '';

const dispatcher = new Agent({
  connect: {
    timeout: Number(process.env.HTTP_CONNECT_TIMEOUT_MS || 20000),
    family: 4
  }
});

const fetchWithAgent = (url, init = {}) => undiciFetch(url, { dispatcher, ...init });

if (!token) {
  console.error('ERROR: ADMIN_PASSWORD env is required');
  process.exit(1);
}

async function main(){
  const text = await fs.readFile(file, 'utf8');
  let syllabus = null;
  try { syllabus = JSON.parse(text); } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }
  if (!Array.isArray(syllabus)) {
    console.error('Top-level JSON must be an array');
    process.exit(1);
  }
  const res = await fetchWithAgent(`${base}/api/research/syllabus`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token },
    body: JSON.stringify({ syllabus })
  });
  const body = await res.text();
  console.log('Status:', res.status);
  try { console.log(JSON.parse(body)); } catch { console.log(body); }
  if (!res.ok) process.exit(2);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
