# TRAN Trading Lab

专业的金融教育与交易分析平台，采用高端"暗黑金融终端"风格。

## 技术栈

- **框架**: React + Vite
- **样式**: Tailwind CSS (内联样式)
- **图标**: Lucide React
- **图表**: Recharts
- **语言**: JavaScript

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:5173 查看应用

## 功能模块

### 前台交易终端（韩语）

1. **Dashboard（仪表盘）**
   - 实时 BTC/USD K 线图
   - 市场状态指标
   - 实时订单流

2. **Brief（实况简报）**
   - 时间轴样式市场快讯
   - 重要性标记（高/中/低）

3. **Analysis（分析档案）**
   - 网格布局深度分析
   - 模态框详情查看

4. **News（市场新闻）**
   - 聚合新闻流
   - 看涨/看跌情绪标签

5. **Lab（知识研究所）**
   - 系统化课程学习路径
   - 进度追踪

6. **Note（交易日记）**
   - 交易复盘记录
   - P&L 统计图表

7. **Tools（工具箱）**
   - 风险回报比 (R:R) 计算器
   - 仓位管理工具

## 项目结构

```
src/
├── components/
│   ├── common/
│   │   └── Modal.jsx          # 通用模态框
│   ├── views/
│   │   ├── BriefView.jsx      # 快讯模块
│   │   ├── AnalysisView.jsx   # 分析模块
│   │   ├── NewsView.jsx       # 新闻模块
│   │   ├── LabView.jsx        # 课程模块
│   │   ├── NoteView.jsx       # 日记模块
│   │   └── ToolsView.jsx      # 工具模块
│   └── TranTradingTerminal.jsx # 主组件
├── hooks/
│   └── useRealtimeData.js     # 实时数据 Hooks
├── data/
│   └── mockData.js            # 模拟数据
└── main.jsx
```

## 设计特点

- 🎨 深色金融终端风格 (#050505, #0a0a0a, #0e1015)
- ✨ 磨砂玻璃效果和极细边框
- 📊 实时数据模拟和动画
- 🇰🇷 韩国金融配色（绿涨红跌）
- 📱 完全响应式设计

## 开发计划

- ✅ 前台交易终端（所有7个模块）
- ⏳ 后台管理系统（下一步）
- ⏳ Tailwind 配置优化
- ⏳ API 路由集成

## License

MIT
