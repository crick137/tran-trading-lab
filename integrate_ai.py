"""
Integrate AI components into TranTradingTerminal
"""
import re

with open('src/components/TranTradingTerminal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add AI component imports
ai_imports = """import AIChatbot from './common/AIChatbot';
import SentimentGauge from './dashboard/SentimentGauge';
import PricePrediction from './dashboard/PricePrediction';
"""

# Add after ThreeDView import
content = content.replace(
    "import ThreeDView from './views/ThreeDView';",
    "import ThreeDView from './views/ThreeDView';\n" + ai_imports
)

# 2. Add AI components before closing components section (before ThemeSwitcher)
ai_components = """
      {/* AI Chatbot */}
      <AIChatbot platformData={{ 
        currentPrice: ticker[0]?.value,
        marketSentiment: 'Bullish',
        recentTrades: []
      }} />
"""

content = re.sub(
    r"(      {/\* Theme Switcher \*/})",
    ai_components + r"\n\1",
    content
)

# 3. Insert Sentiment and Prediction in DashboardView
# Find the StatCard section and add two new cards

dashboard_additions = """
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <SentimentGauge chartData={chartData} />
            <PricePrediction chartData={chartData} symbol="BTC/USD" />
          </div>
"""

# Add after the last </div> in grid-cols-1 lg:grid-cols-3 gap-6 section
content = re.sub(
    r"(      </div>\s+    </div>\s+  \);\s+};\s+export default function TranTradingTerminal)",
   dashboard_additions + r"\n\1",
    content
)

with open('src/components/TranTradingTerminal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ AI components integrated!")
print("Added:")
print("- AIChatbot (floating button)")
print("- SentimentGauge (in dashboard)")
print("- PricePrediction (in dashboard)")
