import './styles/global.css';
import { loadTheme, watchSystem } from './utils/theme.js';

loadTheme();   // 启动时应用用户或系统主题
watchSystem(); // 如果选择了“系统”，跟随系统变化
import './styles/global.css';
import './components/app-shell.js';
import './components/x-header.js';
import './components/x-dashboard.js';
import './components/x-tv-chart.js';
import './components/x-signal-card.js';
import './components/x-signal-board.js';
import './components/x-metrics.js';
import './components/x-knowledge.js';
import './components/x-about.js';
import './components/x-articles.js';
import './data/store_posts.js';
import './components/x-publisher.js';
