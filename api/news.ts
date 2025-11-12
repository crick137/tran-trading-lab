// api/news.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 先返回空数组，保证前端 .map 不报错
  // 之后你再接第三方源映射即可
  const items: Array<{
    title: string;
    url: string;
    source: string;
    publishedAt: string;
  }> = [];

  res.status(200).json(items);
}
