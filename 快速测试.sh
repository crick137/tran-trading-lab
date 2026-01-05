#!/bin/bash

# 快速测试脚本
# 使用方法: ./快速测试.sh your-project.vercel.app your_cron_secret

PROJECT_URL=${1:-"your-project.vercel.app"}
CRON_SECRET=${2:-"your_cron_secret_here"}

echo "🚀 开始测试 Telegram 功能"
echo "📍 项目地址: https://${PROJECT_URL}"
echo "━".repeat(60)

# 测试交易小贴士
echo ""
echo "🧪 测试: 每日交易小贴士"
curl -X GET "https://${PROJECT_URL}/api/cron/daily-trading-tip" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' || echo "响应不是JSON格式"

sleep 2

# 测试新闻解读
echo ""
echo "🧪 测试: 新闻深度解读"
curl -X GET "https://${PROJECT_URL}/api/cron/news-analysis" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' || echo "响应不是JSON格式"

sleep 2

# 测试市场情绪卡片
echo ""
echo "🧪 测试: 市场情绪卡片"
curl -X GET "https://${PROJECT_URL}/api/cron/market-sentiment-card" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -w "\n状态码: %{http_code}\n" \
  -s | jq '.' || echo "响应不是JSON格式"

echo ""
echo "✅ 测试完成！请检查 Telegram 频道 @http4477"
