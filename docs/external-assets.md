# 第三方外链资源审计

> 自动生成，请勿手工编辑。运行 `npm run audit:external` 重新生成（需先 `npm run build`）。

本报告登记**已发布镜像 HTML 会向第三方域名发起的请求**。按项目决议，镜像 HTML 保持 1:1 原样，这里只登记、不拦截、不改写。

## 汇总

| 指标 | 数值 |
| --- | ---: |
| 扫描 HTML 文件 | 28 |
| 存在外链的站点 | 10 / 23 |
| 外部引用（按 URL + 来源去重） | 37 |
| ├ 追踪 / 分析类 | 4 |
| └ 运行时 CDN 类 | 33 |
| 涉及的第三方域名 | 16 |
| 快照中残留的原站统计 ID | 2 |

## 逐站明细

| 站点 | 类型 | 引用 | 原站统计 ID |
| --- | --- | --- | --- |
| `arc-crm` | CDN 2 | 2 | — |
| `artcraft-apps` | CDN 3 | 3 | — |
| `bencho` | CDN 3 | 3 | — |
| `firewood` | CDN 3 | 3 | — |
| `icon-museum` | CDN 1 | 1 | — |
| `outlier-portfolio` | CDN 5 | 5 | — |
| `pnpm-io` | 追踪 1 · CDN 4 | 5 | `G-RPD4HWL84Z` |
| `railcode` | CDN 2 | 2 | — |
| `shaders` | 追踪 3 · CDN 6 | 9 | `G-N0RTLYHDPB` |
| `zcode-website` | CDN 4 | 4 | — |

## 外部引用清单

### `arc-crm`

- `CDN` · link · `a.uiarc.dev` — https://a.uiarc.dev
- `CDN` · link · `clerk.uiarc.dev` — https://clerk.uiarc.dev/npm/@clerk/ui@1/dist/ui.browser.js

### `artcraft-apps`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com

### `bencho`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&family=Instrument+Sans:wght@400;500;600&family=Inter:wght@300..700&display=swap
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com

### `firewood`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com

### `icon-museum`

- `CDN` · link · `assets.icon.museum` — https://assets.icon.museum

### `outlier-portfolio`

- `CDN` · script · `cdn.jsdelivr.net` — https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
- `CDN` · script · `cdn.tailwindcss.com` — https://cdn.tailwindcss.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=Inter:wght@300;400;440;500;600&display=swap
- `CDN` · link · `unpkg.com` — https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
- `CDN` · script · `unpkg.com` — https://unpkg.com/leaflet@1.9.4/dist/leaflet.js

### `pnpm-io`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;1,400&display=swap
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com
- `追踪` · script · `www.googletagmanager.com` — https://www.googletagmanager.com/gtag/js?id=G-RPD4HWL84Z

### `railcode`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com

### `shaders`

- `CDN` · link · `data.shaders.com` — https://data.shaders.com
- `CDN` · link · `ev.shaders.com` — https://ev.shaders.com
- `CDN` · link · `ka-f.fontawesome.com` — https://ka-f.fontawesome.com
- `CDN` · link · `kit.fontawesome.com` — https://kit.fontawesome.com
- `CDN` · script · `kit.fontawesome.com` — https://kit.fontawesome.com/65e294ceab.js
- `追踪` · link · `static.ads-twitter.com` — https://static.ads-twitter.com
- `追踪` · inline · `static.ads-twitter.com` — https://static.ads-twitter.com/uwt.js
- `CDN` · link · `static.shaders.com` — https://static.shaders.com
- `追踪` · inline · `www.googletagmanager.com` — https://www.googletagmanager.com/gtag/js

### `zcode-website`

- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com
- `CDN` · link · `fonts.googleapis.com` — https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap
- `CDN` · link · `fonts.gstatic.com` — https://fonts.gstatic.com
- `CDN` · link · `zcode.z.ai` — https://zcode.z.ai/favicon.ico?v=20260707-transparent

## 说明与处置

- **追踪类**：访问公开镜像时，浏览器会向原站所有的统计服务发起请求（携带当前页面 referrer）。ID 属于原站，不是本项目配置。
- **CDN 类**：这些脚本是页面运行时的实际依赖；移除会破坏 1:1 保真，因此保留。
- 本报告是**登记基线**，不是验收结论。若后续决定阻断外链，应逐站评估并单独记录，不在构建期统一改写镜像 HTML。
- 与 [链接审计](link-audit.md) 配合阅读：后者统计路径可用性，本报告统计对外请求。
