// public/js/auto-image.js
(function () {
  const start = () => {
    try {
      const ROOT = document.querySelector('#app') || document.body;
      const IMG_EXT_RE = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;
      const URL_IN_TEXT_RE = /(https?:\/\/[^\s'"<>]+?\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s'"<>]*)?)/gi;

      function makeImg(src, alt = 'image') {
        const img = new Image();
        img.src = src;
        img.alt = alt || 'image';
        img.loading = 'lazy';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.margin = '8px 0';
        return img;
      }

      // 1) <a href="...jpg"> -> <img>
      function replaceAnchorImages(root) {
        try {
          root.querySelectorAll('a[href]').forEach(a => {
            const href = a.getAttribute('href') || '';
            if (IMG_EXT_RE.test(href)) {
              const img = makeImg(href, a.textContent.trim());
              img.onerror = () => { try { a.replaceWith(a.cloneNode(true)); } catch (_) {} };
              a.replaceWith(img);
            }
          });
        } catch (_) {}
      }

      // 2) 纯文本里的图片URL -> <img>
      function replaceTextUrlImages(root) {
        try {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
              const p = node.parentNode && node.parentNode.nodeName;
              if (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
              return URL_IN_TEXT_RE.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
          });
          const nodes = [];
          while (walker.nextNode()) nodes.push(walker.currentNode);

          nodes.forEach(textNode => {
            const frag = document.createDocumentFragment();
            const parts = textNode.nodeValue.split(URL_IN_TEXT_RE);
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              if (!part) continue;
              if (IMG_EXT_RE.test(part)) {
                const img = makeImg(part);
                img.onerror = () => { try { frag.appendChild(document.createTextNode(part)); } catch(_){} };
                frag.appendChild(img);
              } else {
                frag.appendChild(document.createTextNode(part));
              }
            }
            textNode.replaceWith(frag);
          });
        } catch (_) {}
      }

      function process(root) {
        replaceAnchorImages(root);
        replaceTextUrlImages(root);
      }

      // 初次（等一帧，避免阻塞渲染）
      requestAnimationFrame(() => process(ROOT));

      // 监听 SPA 内容变化
      const mo = new MutationObserver(() => {
        requestAnimationFrame(() => process(ROOT));
      });
      mo.observe(ROOT, { childList: true, subtree: true });

      // 兼容 hash 路由
      window.addEventListener('hashchange', () => {
        requestAnimationFrame(() => process(ROOT));
      });
    } catch (err) {
      console.error('[auto-image] disabled:', err);
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(start, 0);
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }
})();
