'use client'

import { useState } from 'react'

type PostPayload = {
  title: string
  slug: string
  summary: string
  tags: string[]
  content: string
  draft: boolean
  author: string
}

const CATEGORIES = [
  '모닝 브리핑',
  '전략',
  '복기',
  '지표',
  '가이드',
  '수학',
  // 你可以把想要的分类继续加在这里
]

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const form = e.currentTarget
    const fd = new FormData(form)

    const category = String(fd.get('category') ?? '').trim()
    const tagsRaw = String(fd.get('tags') ?? '')

    const extraTags = tagsRaw
      ? tagsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    // 把“分类”并入 tags（避免重复）
    const tags = [
      ...new Set([...(category ? [category] : []), ...extraTags]),
    ]

    const payload: PostPayload = {
      title: String(fd.get('title') ?? ''),
      slug: String(fd.get('slug') ?? ''),
      summary: String(fd.get('summary') ?? ''),
      tags,
      content: String(fd.get('content') ?? ''),
      draft: fd.get('draft') !== null,
      author: String(fd.get('author') ?? 'tran'),
    }

    const res = await fetch('/api/admin/new-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: { ok?: boolean; error?: string } = await res.json()
    setLoading(false)
    setMsg(res.ok ? '已提交到 GitHub，Vercel 将自动部署 ✅' : `失败：${json.error ?? res.statusText}`)
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">发新文章</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="title" placeholder="标题" required className="w-full rounded border p-2" />
        <input name="slug" placeholder="自定义 slug（可留空自动生成）" className="w-full rounded border p-2" />
        <input name="summary" placeholder="摘要" required className="w-full rounded border p-2" />

        {/* 新增：分类（单选/可自填） */}
        <div>
          <input
            list="categoryOptions"
            name="category"
            placeholder="分类（可下拉选择或自填）"
            className="w-full rounded border p-2"
          />
          <datalist id="categoryOptions">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <input
          name="tags"
          placeholder="额外标签, 逗号分隔 例如: 모닝, 전략"
          className="w-full rounded border p-2"
        />
        <input name="author" placeholder="作者（默认 tran）" className="w-full rounded border p-2" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="draft" /> draft（勾选=草稿）
        </label>
        <textarea name="content" placeholder="正文 MDX" rows={12} className="w-full rounded border p-2" />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? '提交中…' : '提交到 GitHub'}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm opacity-80">{msg}</p>}
    </main>
  )
}
