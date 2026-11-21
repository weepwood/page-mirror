import { existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

/**
 * GitHub Pages 使用 /page-mirror/sites/<slug>/ 子目录。
 * 修复 HTML 内联 style 中指向本地字体/图片的根路径；
 * 不处理 script、路由、data: URL 或不存在的文件。
 */
export function rewriteInlineStyleAssetUrls(html, siteRoot, htmlPath) {
  return html.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, block =>
    block.replace(/url\(\s*(["']?)\/(?!\/)([^)"']+)\1\s*\)/gi,
      (all, quote, path) => {
        const [pathname, suffix=''] = path.split(/(?=[?#])/);
        if (!pathname || !existsSync(join(siteRoot, pathname))) return all;
        let dest = relative(dirname(htmlPath), join(siteRoot, pathname)).split(sep).join('/');
        if (!dest.startsWith('.')) dest = './' + dest;
        return 'url(' + quote + dest + suffix + quote + ')';
      }));
}
