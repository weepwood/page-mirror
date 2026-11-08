# Google 首页 1:1 镜像（静态版）

本仓库是 [https://www.google.com/](https://www.google.com/) 首页的 1:1 复刻静态站点。

## 实现要点
- 抓取真实的 `index.html`（含内联 CSS/JS），保证标记、类名、布局与官方一致。
- 中心 Google 字标为**内联 SVG**，断网也能渲染，无需外部图片。
- 所有外部资源（字体、图标、xjs 主 JS/CSS 包等）已本地化到 `_m/`。
- 搜索框提交/回车会**跳转到真实的 Google 搜索结果页**（`https://www.google.com/search?q=...`），
  通过 `</body>` 前注入的捕获阶段脚本抢在 Google 的运行时 JS 之前拦截，保证真正跳走。

## 本地预览
```bash
# 纯静态托管即可（无需 Node 服务器）
npx serve .
# 或
python3 -m http.server 8080
```
打开 http://localhost:8080/ 即可看到与官方像素级一致的页面。

> 说明：本仓库为**纯静态**版本，适合直接部署到 Netlify / GitHub Pages 等静态托管。
> 需要"反向代理兜底实时功能（联想词 / doodle / 应用菜单）"的动态版见 `server.js`（本地用）。

## 在线预览
**站点地址：** https://google-homepage-mirror.netlify.app

---

## 统一仓库迁移记录

- 来源仓库：`weepwood/google-homepage-mirror`（`master@bb37eb2ed872`）
- 导入日期：2026-07-10
- 统一仓库：`weepwood/page-mirror` → `sites/google-homepage/`
- 状态：`review`（尚未完成逐屏对照验收）
- 原仓库保留历史；迁入后的改动请在本仓库 `sites/google-homepage/` 内进行。
