"""
Final integration: Add all Sprint 3-4 components
"""
import re

with open('src/components/TranTradingTerminal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add new imports
new_imports = """import BacktestPanel from './tools/BacktestPanel';
import PortfolioManager from './tools/PortfolioManager';
import Achievements from './gamification/Achievements';
import Leaderboard from './social/Leaderboard';
"""

content = content.replace(
    "import PricePrediction from './dashboard/PricePrediction';",
    "import PricePrediction from './dashboard/PricePrediction';\n" + new_imports
)

# 2. Update ToolsView to include new tools
tools_view_replacement = """const ToolsView = () => {
  const [activeToolTab, setActiveToolTab] = React.useState('backtest');
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveToolTab('backtest')}
          className={`px-4 py-2 rounded-lg font-medium transition-all \${
            activeToolTab === 'backtest'
              ? 'bg-neon-blue text-white shadow-neon-blue'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Backtesting
        </button>
        <button
          onClick={() => setActiveToolTab('portfolio')}
          className={`px-4 py-2 rounded-lg font-medium transition-all \${
            activeToolTab === 'portfolio'
              ? 'bg-neon-cyan text-white shadow-neon-cyan'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveToolTab('achievements')}
          className={`px-4 py-2 rounded-lg font-medium transition-all \${
            activeToolTab === 'achievements'
              ? 'bg-neon-green text-white shadow-neon-green'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveToolTab('leaderboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-all \${
            activeToolTab === 'leaderboard'
              ? 'bg-purple-600 text-white shadow-purple-600'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          Leaderboard
        </button>
      </div>
      
      <div>
        {activeToolTab === 'backtest' && <BacktestPanel />}
        {activeToolTab === 'portfolio' && <PortfolioManager />}
        {activeToolTab === 'achievements' && <Achievements />}
        {activeToolTab === 'leaderboard' && <Leaderboard />}
      </div>
    </div>
  );
};"""

# Find and replace ToolsView or add if not exists
if 'import ToolsView' in content:
    # ToolsView is imported, we need to create it in-file instead
    # Find where renderContent is and add before it
    content = re.sub(
        r'(const renderContent = )',
        tools_view_replacement + '\n\n  \\1',
        content
    )

with open('src/components/TranTradingTerminal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Sprint 3-4 components integrated!")
print("Added:")
print("- BacktestPanel")  
print("- PortfolioManager")
print("- Achievements")
print("- Leaderboard")
print("- Enhanced ToolsView with tabs")
