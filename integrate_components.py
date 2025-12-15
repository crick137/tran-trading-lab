"""
Script to safely integrate new components into TranTradingTerminal.jsx
"""
import re

# Read the file
with open('src/components/TranTradingTerminal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports after line with useRealtimeData
imports_to_add = """import ParticleBackground from './common/ParticleBackground';
import MouseGlowTrail from './common/MouseGlowTrail';
import CommandPalette from './common/CommandPalette';
import ThemeSwitcher from './common/ThemeSwitcher';
import MatrixRain from './common/MatrixRain';
import ScanlineEffect from './common/ScanlineEffect';
import NeonPulse from './common/NeonPulse';
import ThemeEditor from './common/ThemeEditor';
import { useTheme } from '../hooks/useTheme';
import ThreeDView from './views/ThreeDView';
"""

# Find the useRealtimeData import and add after it
content = content.replace(
    "import { useCandlestickData, useOrderFlow } from '../hooks/useRealtimeData';",
    "import { useCandlestickData, useOrderFlow } from '../hooks/useRealtimeData';\n" + imports_to_add
)

# 2. Add Box to lucide-react imports
content = content.replace(
    '  ArrowUp, ArrowDown, BellRing, XCircle, Share2, Heart, Edit3, Plus',
    '  ArrowUp, ArrowDown, BellRing, XCircle, Share2, Heart, Edit3, Plus, Box'
)

# 3. Add state variables - find where useState is used
# Look for "const [activeTab" and add after it
state_to_add = """  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  
  // Theme system
  const { theme, matrixRainEnabled } = useTheme();
"""

content = re.sub(
    r"(const \[activeTab, setActiveTab\] = useState\('dashboard'\);)",
    r"\1\n" + state_to_add,
    content
)

# 4. Add keyboard shortcut to useEffect
keyboard_code = """
    // Command palette shortcut (Cmd/Ctrl + K)
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
"""

# Find the useEffect and add before the return statement
content = re.sub(
    r"(document\.addEventListener\('fullscreenchange', handleFsChange\);)",
    r"\1" + keyboard_code,
    content
)

# Also add to cleanup
content = re.sub(
    r"(document\.removeEventListener\('fullscreenchange', handleFsChange\);)",
    r"\1\n      window.removeEventListener('keydown', handleKeyDown);",
    content
)

# 5. Add 3d-view case to switch statement
case_to_add = """      case '3d-view':
        return <ThreeDView />;
"""

content = re.sub(
    r"(case 'tools':\s+return <ToolsView />;\s+)",
    r"\1" + case_to_add,
    content
)

# 6. Add navigation item after tools
nav_item = """          <NavItem onClick={() => setActiveTab('3d-view')} icon={<Box size={20} />} label="3D 시각화 (3D)" active={activeTab === '3d-view'} collapsed={collapsed} />
"""

content = re.sub(
    r"(<NavItem onClick=\{\(\) => setActiveTab\('tools'\)\}[^/]+/>\s+)",
    r"\1" + nav_item,
    content
)

# 7. Add components before closing main div
# Find the last closing div before export
components_to_add = """
      {/* Mythical Ultimate Background Effects */}
      <ParticleBackground />
      <MouseGlowTrail />
      {matrixRainEnabled && <MatrixRain />}
      {theme.effects?.scanlines && <ScanlineEffect />}

      {/* Command Palette (Cmd/Ctrl + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setCommandPaletteOpen(false);
        }}
      />
      
      {/* Theme Switcher */}
      <ThemeSwitcher />
      
      {/* Theme Editor */}
      <ThemeEditor 
        isOpen={themeEditorOpen} 
        onClose={() => setThemeEditorOpen(false)} 
      />
"""

# Find the outer wrapping div's closing tag (before export default)
content = re.sub(
    r"(    </div>\s+  \);\s+}\s+$)",
    components_to_add + r"\n\1",
    content,
    flags=re.MULTILINE
)

# Write back
with open('src/components/TranTradingTerminal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Integration complete!")
print("Added:")
print("- 10 new imports")
print("- 3 state variables") 
print("- Keyboard shortcut handler")
print("- 3D view case to switch")
print("- Navigation item")
print("- Background components")
print("- Command Palette, ThemeSwitcher, ThemeEditor")
