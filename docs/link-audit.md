# 镜像链接健康报告

> 由 `npm run audit:links` 生成，扫描对象是 `.site-build/`（实际发布到 GitHub Pages 的产物）。请勿手工编辑。

## 口径与处置策略

- 构建脚本的 `rewriteLocalAssetUrls()` 已经把**本地存在**的根绝对资源改写为相对路径；本报告统计的是改写后仍指向域名根的引用。
- 项目决议：镜像 HTML 保持 1:1 原样，**不自动改写站内导航**。多数残留引用是原站路由，而快照只收录首页，因此在 `/page-mirror/sites/<slug>/` 下无法解析。
- 这类差异随各站验收逐项处理，状态在此之前保持 `review`。处理流程见 [验收 SOP](acceptance.md)。

## 总览

| 指标 | 数量 |
| --- | ---: |
| 扫描站点 | 23 |
| 扫描 HTML 文件 | 28 |
| 根绝对路径引用（含重复） | 636 |
| ├ 站内路由，快照未收录 | 543 |
| ├ 快照本身缺失的资源 | 6 |
| ├ 本地存在但仍是根绝对路径 | 0 |
| └ 已适配（含 URL 编码路径） | 87 |
| 本地相对资源缺失 | 0 |
| 存在根绝对引用的站点 | 8 |

## 逐站结果

| 站点 | 状态 | HTML | 根绝对引用 | 站内路由 | 缺失资源 | 已适配 | 本地存在可改 | 本地相对资源缺失 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `arc-crm` | review | 2 | 29 | 23 | 2 | 4 | 0 | 0 |
| `artcraft-apps` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `bencho` | review | 1 | 141 | 141 | 0 | 0 | 0 | 0 |
| `ccunpacked` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `chaz-5310` | review | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| `feralui` | review | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `firewood` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `google-homepage` | review | 1 | 5 | 3 | 2 | 0 | 0 | 0 |
| `holo` | building | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `icon-museum` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inftab` | building | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `inftab-app` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `makemepulse-2019` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `mimo-rl` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `opencode-data` | review | 1 | 48 | 48 | 0 | 0 | 0 | 0 |
| `outlier-portfolio` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `planes-react` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `pnpm-io` | review | 1 | 22 | 20 | 2 | 0 | 0 | 0 |
| `railcode` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `shaders` | review | 1 | 37 | 37 | 0 | 0 | 0 | 0 |
| `weread` | building | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `zcode-website` | review | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| `zhheo-blog` | review | 4 | 353 | 270 | 0 | 83 | 0 | 0 |

## 重点站点明细

### `zhheo-blog`（353 处）

- 已适配（含编码路径）：`/page-mirror/sites/zhheo-blog/img/music-cover.webp`、`/page-mirror/sites/zhheo-blog/_next/static/chunks/0ouovsk43fvj4.css`、`/page-mirror/sites/zhheo-blog/_next/static/chunks/3z5q_p4msz2ha.js`
- 站内路由：`/page-mirror/sites/zhheo-blog/`、`/page-mirror/sites/zhheo-blog/p/1/`、`/page-mirror/sites/zhheo-blog/p/2/`

### `bencho`（141 处）

- 站内路由：`/blocks/ink-bloom`、`/blocks/peek-rating`、`/blocks/load-cards`

### `opencode-data`（48 处）

- 站内路由：`/zh/data/`、`/zh/data/deepseek/deepseek-v4-flash`、`/zh/data/deepseek/deepseek-v4-pro`

### `shaders`（37 处）

- 站内路由：`/`、`/docs/guide`、`/pro`

### `arc-crm`（29 处）

- 已适配（含编码路径）：`/_next/static/chunks/app/templates/%5Bid%5D/live/page-e0dec56806ee8ecf.js`、`/_next/static/chunks/app/templates/%5Bid%5D/page-97063ddb57d26ddc.js`、`/_next/static/chunks/app/templates/%5Bid%5D/preview/page-a7ee24225d8504da.js`
- 快照缺失资源：`/manifest.webmanifest`
- 站内路由：`/_next/image?url=%2Fmedia%2Fpeople%2Ftyler-hayes.jpg&w=3840&q=75`、`/_next/image?url=%2Fmedia%2Fpeople%2Fryan-sullivan.jpg&w=3840&q=75`、`/_next/image?url=%2Fmedia%2Fpeople%2Fsofia-ramirez.jpg&w=3840&q=75`

### `pnpm-io`（22 处）

- 快照缺失资源：`/blog/rss.xml`、`/blog/atom.xml`
- 站内路由：`/blog/whats-different-in-pnpm-12`、`/installation`、`/benchmarks`

### `google-homepage`（5 处）

- 快照缺失资源：`/_m/xjs_main.css`、`/_m/xjs_main.js`
- 站内路由：`/advanced_search?hl=en&fg=1`、`/history/privacyadvisor/search/unauth?utm_source=googlemenu&fg=1&cctld=com`、`/history/optout?hl=en&fg=1`

### `chaz-5310`（1 处）

- 站内路由：`/`

## 说明

- 扫描前会移除 `<script>` / `<style>` 内容，只统计真正的 HTML 属性引用，避免把内联脚本里的字符串（如 Google 首页的 `jsaction` 数据）误判为缺失资源。
- `/page-mirror/` 前缀但目标页未收录的分页链接计入「站内路由」；URL 编码路径（如 `%5Bid%5D`）计入「已适配」，因为浏览器会解码后请求，构建期保守跳过这类路径的重写。
- `本地存在可改` 出现非零值时，应检查该引用是否位于 JS 动态字符串或 CSS 中；静态 HTML 属性里的本地资源已由重写逻辑覆盖。
- `快照缺失资源` 属于上游快照本身不完整（例如 `google-homepage` 的 `/_m/xjs_main.css|js`），不是部署路径问题。
- 站内路由未收录不影响站点首页可访问；首页可达性由 `npm run build` 与线上抽检另行验证。
