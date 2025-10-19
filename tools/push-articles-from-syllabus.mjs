#!/usr/bin/env node
// Seed placeholder articles for each syllabus lesson via /api/research/articles/<slug>.json
// Usage:
//   ADMIN_PASSWORD=... node tools/push-articles-from-syllabus.mjs https://your.domain backup/syllabus-full.json

import fs from 'node:fs/promises';

const base = (process.argv[2] || '').replace(/\/$/, '') || 'http://localhost:3000';
const file = process.argv[3] || 'backup/syllabus-full.json';
const token = process.env.ADMIN_PASSWORD || '';

if (!token) {
  console.error('ERROR: ADMIN_PASSWORD env is required');
  process.exit(1);
}

const slugify = (s) => String(s || '')
  .toLowerCase()
  .replace(/[#/]/g, ' ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 120);

const linkToSlug = (link) => {
  const m = String(link || '').match(/#\/?articles\/?([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
};

async function upsertArticle(item){
  const { slug, title, excerpt, tags } = item;
  const payload = {
    slug,
    title: title || slug,
    excerpt: excerpt || '',
    hero: '',
    date: new Date().toISOString(),
    tags,
    body: ''
  };
  const res = await fetch(`${base}/api/research/articles/${encodeURIComponent(slug)}.json`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PUT ${slug} failed: ${res.status} ${text}`);
  return text;
}

async function main(){
  const text = await fs.readFile(file, 'utf8');
  const syllabus = JSON.parse(text);
  const lessons = [];
  for (const group of syllabus){
    const groupLabel = group?.level || '';
    for (const item of (group?.lessons||[])){
      const name = typeof item === 'string' ? item : (item?.name || '');
      const link = typeof item === 'string' ? '' : (item?.link || '');
      const desc = typeof item === 'string' ? '' : (item?.desc || '');
      const type = typeof item === 'string' ? '' : (item?.type || '');
      const s = linkToSlug(link) || slugify(name);
      if (!s) continue;
      const tags = [];
      if (groupLabel) tags.push(groupLabel.replace(/\s+·\s+.*$/, '')); // keep 앞부분
      if (type) tags.push(type);
      lessons.push({ slug: s, title: name, excerpt: desc, tags });
    }
  }
  console.log(`Seeding ${lessons.length} articles...`);
  for (const it of lessons){
    try{
      await upsertArticle(it);
      console.log('OK', it.slug);
    }catch(e){
      console.error('FAIL', it.slug, e.message);
    }
  }
}

main().catch((e)=>{ console.error(e); process.exit(1); });
