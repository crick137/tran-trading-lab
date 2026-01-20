---
description: Upgrade trantradinglab.com for growth: SEO traffic + sample report + tools + archives + Start Here + CTA system + analytics; fix 404s/category filtering/FAQ; build Playbooks + Plans for future monetization. Output final website copy in Korean (KR).
---

# TranTradingLab — Build Now (Next.js) / No Fake Content / No Roadmap

## Hard rules
- Tech: Next.js (App Router) + TypeScript + Tailwind (project already).
- Do NOT output execution plans/roadmaps/timelines. Only implement changes + brief changelog.
- Since content is NOT ready yet: remove/hide ALL sample/demo placeholders and any links that point to non-existent content.
- Fix 404 first. Never ship pages that link to 404 internally.
- User-facing copy: Korean only (한국어). English only for tickers/abbreviations. No Chinese in final website copy.
- Education-only / NFA. No guaranteed profits.

---

## P0 (must do first): Kill all 404 + remove fake routes
### 1) Fix Reports + Home “latest” 404 (TOP PRIORITY)
- Home “latest posts” must NEVER render links to missing slugs.
- Reports archive must NEVER render links to missing routes.
Implementation:
- If there is no real content, show an “empty state” (콘텐츠 준비 중) WITHOUT links.
- If content exists, only list items that actually resolve to valid routes.

### 2) Remove/hide sample-related sections (content not ready)
- Remove nav links and home sections that mention:
  - Sample / Sample report / Example report / Demo
  - Newsletter archive with fake entries
  - Any “report archive” entries that do not exist
- If a route must exist for future, keep it but:
  - do NOT link to it anywhere
  - return a clean “준비 중” page (no 404) and include noindex meta.

### 3) Fix /privacy and /terms must exist and be reachable
- Footer links must point to real pages (no 404).

### 4) Fix /blog & category pages SSR/SSG (must not be empty)
- /blog must server-render a real list of posts OR show a proper empty state.
- /blog?category=analysis|strategy|news must actually filter on the server side (or at least produce correct rendered result).
- Do not rely on client-only JS for initial render. Google must see content/empty-state.

---

## Data consistency (must be centralized)
### 5) Unify all “community/member/content” numbers
- Remove “0+” placeholder everywhere.
- Create ONE single source of truth, e.g. `lib/site-stats.ts` or `config/site.ts`, exporting:
  - communityMembers (string or number)
  - contentCount
  - yearsActive
- Home/About/CTA blocks must import from the same source.
- If the number is not verified, do NOT show a hard number. Use a soft statement (예: “많은 투자자가 함께합니다”).

---

## FAQ (perfect implementation required)
### 6) FAQ page must contain answers + FAQ schema
- Render Q/A in an Accordion (accessible).
- Add JSON-LD structured data type: FAQPage on /faq.
- Ensure each question has a clear, policy-safe answer:
  - What you provide / what you do NOT provide (signals vs education)
  - Update frequency
  - Data sources
  - Risk disclaimer (NFA)
  - How to use the content
  - Community rules
  - Privacy / email unsubscribe
- Must be indexable (no noindex).

---

## Plans (fix Free/Pro benefits logic)
### 7) Rebuild /plans benefit table so Free never includes Pro-only benefits
Rules:
- Free can include:
  - public articles
  - basic educational content
  - community join
  - basic updates
- Pro can include (even if “Coming Soon”):
  - structured courses/playbooks
  - template packs
  - deep-dive weekly reports
  - priority Q&A / office hours
But:
- If Pro is not launched, keep Pro CTA as “대기자 등록” (waitlist), not “결제”.
- Make the comparison visually clean and non-confusing.

---

## Global conversion (must implement now)
### 8) Add post-footer CTA block on every post page
- Every blog post must end with a unified CTA section:
  - Primary: “무료 브리핑 받기” (Email capture if implemented; otherwise a link to Telegram for now)
  - Secondary: “텔레그램에서 실시간 받기”
- Since sample pages are removed, DO NOT mention “sample” in CTA.
- Add tracking hooks (even if analytics not yet installed): data attributes for events.

---

## SEO baseline (keep minimal but correct)
### 9) Must-have SEO
- Unique title/meta for key pages.
- OG tags for share.
- canonical.
- robots.txt + sitemap.xml must exist and not broken.
- Do NOT index placeholder “준비 중” routes: add noindex on those pages.

---

## Deliverables (NO roadmap)
When finished, output only:
1) concise changelog
2) list of pages/routes touched
3) files changed/created
4) verification checklist:
   - Home latest no dead links
   - Reports no dead links
   - /blog SSR visible or empty-state
   - category filtering works
   - FAQ has answers + FAQPage JSON-LD
   - stats consistent, no “0+”
   - plans Free/Pro corrected
   - every post has footer CTA

Start now with fixing Reports + Home latest 404, then /blog SSR, then stats, then FAQ schema, then plans, then global post CTA.
