// 自动识别并显示图片链接
document.addEventListener('DOMContentLoaded', () => {
  const container = document.body; // 可以改成 .article 或 .content 以限定范围
  const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi;

  function replaceImageLinks(node) {
    if (node.nodeType === Node.TEXT_NODE && urlRegex.test(node.textContent)) {
      const html = node.textContent.replace(
        urlRegex,
        '<img src="$1" alt="image" style="max-width:100%;border-radius:8px;margin:8px 0;">'
      );
      const span = document.createElement('span');
      span.innerHTML = html;
      node.replaceWith(span);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(replaceImageLinks);
    }
  }

  replaceImageLinks(container);
});
