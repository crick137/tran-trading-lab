const KEY = 'ttl_theme'; // 'light' | 'dark' | 'system'

export function getSystemDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.dataset.theme = getSystemDark() ? 'dark' : 'light';
  } else {
    root.dataset.theme = theme; // 'light' or 'dark'
  }
  window.dispatchEvent(new CustomEvent('ttl:theme-changed', { detail: root.dataset.theme }));
}

export function loadTheme() {
  const saved = localStorage.getItem(KEY) || 'system';
  applyTheme(saved);
  return saved;
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme || (getSystemDark() ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(KEY, next);
  applyTheme(next);
}

export function watchSystem() {
  if (!window.matchMedia) return;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if ((localStorage.getItem(KEY) || 'system') === 'system') applyTheme('system');
  });
}
