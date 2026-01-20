---
description: Upgrade trantradinglab.com for growth: SEO traffic + sample report + tools + archives + Start Here + CTA system + analytics; fix 404s/category filtering/FAQ; build Playbooks + Plans for future monetization. Output final website copy in Korean (KR).
---

# TranTradingLab Build-Now Workflow (No Plans)

## Output rules
- All **user-facing website copy** must be Korean (한국어). English only for tickers/abbreviations (SMC/OB/FVG/ORB/BTC).
- No Chinese in final website copy.
- Education-only / NFA. No guaranteed profits.
- Do NOT output execution plans, roadmaps, or timelines. Focus on implementation.

---

## Objective
Implement the full site upgrade directly: fix critical issues, add new pages/sections, wire SEO + analytics, and ensure everything works end-to-end.

---

## Phase 0 — Blockers (MUST FIX FIRST)
1) Fix **all 404 routes**:
   - /privacy and /terms must exist and be linked in footer.
   - Any blog card must link to a real post page (no dead slugs).
2) Fix category filtering:
   - /blog?category=analysis|strategy|news must actually filter posts.
3) Unify metrics:
   - Remove placeholders like “0+”. Home/About numbers must match and be truthful.
4) FAQ must contain real answers (not only questions).
5) Baseline SEO plumbing:
   - Unique title/meta per page, canonical, OG tags (X/Telegram)
   - robots.txt + sitemap.xml
   - Article JSON-LD schema for posts

After Phase 0: proceed immediately (no long report). Only briefly list what changed.

---

## Phase 1 — Build Site Map v2 (Implement pages)
Create/ensure these routes exist and are wired in nav/footer:

- / (Home)
- /start (Start Here)
- /sample (Sample Report)
- /reports (Reports Archive: daily/weekly summaries)
- /briefings (Newsletter/Briefing Archive: indexable summaries)
- /blog (Blog hub + tags + search + working categories)
- /glossary (Glossary: OB/FVG/Liquidity/ORB…)
- /playbooks (Playbooks: course-like)
- /tools (Tools hub)
  - /tools/position-sizing
  - /tools/rr-calculator
  - /tools/templates
- /plans (Free vs Pro, Pro can be “Coming Soon”)
- /about /faq /contact
- /privacy /terms

---

## Phase 2 — Unified CTA System (Global)
Implement reusable CTA component and use it everywhere:
- Primary CTA: “무료 브리핑 받기” (Email)
- Secondary CTA: “텔레그램에서 실시간 받기”
Rules:
- Home hero max 2 CTAs
- Every post ends with CTA block
- Mobile sticky bottom CTA (dismissible)
- Track events: click_telegram_join, submit_newsletter, view_sample_report

---

## Phase 3 — Conversion Pages (Start Here + Sample + Archives)
### /start
- 3 onboarding paths: 초보 / 단타 / 거시
- How to use: sample → subscribe → Telegram → weekly review
- Provide/Not provide boundaries + NFA

### /sample
Template:
- TL;DR (3 bullets)
- Key levels table
- 3 scenarios (상/중/하) with triggers
- Risk/invalidation conditions
- End CTA

### /reports + /briefings
- Date filter + search + categories/tags
- Public summaries must remain indexable (SEO friendly)
- Full detail can be delivered via email/Telegram (soft gate)

---

## Phase 4 — SEO Engine (Implement, not just plan)
- Create 4 pillar pages (one per cluster) + internal linking:
  A) SMC (OB/FVG/Liquidity)
  B) ORB strategy
  C) KOSPI / USDKRW / rates / semis cycle
  D) China finance translations
- Implement /glossary term pages and link from relevant posts
- Ensure headings: one H1 per page; logical H2/H3; add TOC on long posts

---

## Phase 5 — Tools (Implement pages + logic)
1) Position sizing calculator:
   - inputs: account size, risk %, entry, stop
   - outputs: position size, max loss, warnings
2) RR calculator:
   - entry, stop, target → RR
3) Templates:
   - downloads: trading journal, weekly review, checklist
Add CTA + tracking:
- use_tool_position_size / use_tool_rr / download_template

---

## Phase 6 — Monetization Ready (Implement structure)
### /playbooks
- SMC 101 → OB → FVG → Liquidity → checklist → case studies
- Each lesson includes: goal, concept, rules, example, exercises, mistakes
- Mark Pro sections as “Coming Soon” (no paywall needed yet)

### /plans
- Free vs Pro comparison (clear)
- Pro waitlist CTA (email capture)

---

## Phase 7 — Analytics (Implement)
Add analytics (GA4 or Plausible) + events:
- click_telegram_join, submit_newsletter, view_sample_report
- scroll_depth_25/50/75, search_site_query
- use_tool_position_size, use_tool_rr, download_template

---

## Final output requirements
- Do NOT write a roadmap.
- Provide only:
  1) a concise change log (what was implemented),
  2) the files/paths changed or created,
  3) any commands needed to run/build,
  4) verify checklist: no 404, categories work, SEO tags present, events firing.
Proceed to implement now.
