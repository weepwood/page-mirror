# Bencho.dev 复刻提示词（反推规格书）

> 来源：对 `https://bencho.dev/` 构建产物（Vite build artifacts）的逆向取证。
> 用途：作为一份「详细提示词 / 规格书」，可整体喂给 AI 编码助手，或作为人工复刻的设计底稿。
> 立场：镜像的是**前端体验**（视觉 + 交互）。`/api/*` 与 Supabase 后端无法离线复刻，下文标注了哪些是「前端可做、后端需自建」。

---

## 0. 一句话定义（Elevator Pitch）

> A library of **live, interactive UI blocks and sounds** you can explore, tweak, and take straight into your projects. Everything is live, not mocked.

核心精神：**Live, not mocked.** 每个组件都是真实运行的交互，不是截图/GIF。用户能「玩」、能「复制源码」、能「通过 MCP 直接拖进自己的编辑器」。

---

## 1. 产品定位与目标用户

- **是什么**：一个交互式 UI 组件 + UI 音效的展示/分发站。两大板块 = **Blocks**（交互组件）+ **Sounds**（界面音效）。
- **作者/品牌署名**：run by Lorenzo Cabra（页脚/about 留名）。
- **目标用户**：前端工程师、产品设计师、独立开发者、AI 编码 Agent。
- **价值主张**：
  1. 看到即用到——每个 block 都是可交互的活例子；
  2. 拿走即用——一键复制源码 / 通过 MCP 接入；
  3. 灵感不假——真交互，不是静态演示。

---

## 2. 技术栈（精确）

| 层 | 选型 | 证据 |
|---|---|---|
| 构建 | **Vite**（原生，非 Next） | `/assets/index-*.js` hash 命名、`<script type=module>` |
| 框架 | **React + TypeScript** | `jsx-runtime`、`react-*.js` chunk |
| 样式 | **原生 CSS + CSS 自定义属性**（无 Tailwind/无 CSS-in-JS 主方案） | 单一 `index-*.css` + `:root` 设计 token |
| 动画 | **Framer Motion** | `spring`、`MotionConfigContext`、`use-motion-value`、`motion-*` chunk |
| 图标 | **Lucide** | `createLucideIcon`、`square`/`grid-2x2`/`heart`/`skip-forward`/`sound` chunk |
| 图形/特效 | **Canvas / WebGL + SVG filters**（gooey 液体、metaballs、orbit） | `Canvas-*`、`Metaballs-*`、`Gooey-*`、`Orbit-*`、`OrbitCards-*` chunk |
| 后端/账号 | **Supabase**（可选，离线可无） | `supabase-*`、`authStore-*` chunk |
| 音效 | 内置 Sounds 库 | `sound-*`、`Sound-*`、`skip-forward` chunk |
| 路由 | 客户端路由（SPA），`/blocks/<id>`、`/sounds`、… | 无文件扩展名的动态路由 |

**工程要求**：
- 代码分割：每个 block 是独立懒加载 chunk（`import('./Xxx-HASH.js')`），首页只加载框架 + 首屏；
- 静态可部署到任意 CDN/Netlify；
- 字体走 Google Fonts（`Google Sans`、`Instrument Sans`、`Inter`），并预连接 `fonts.gstatic.com`（crossorigin）。

---

## 3. 设计系统（Design Tokens，提取自 `:root`）

### 3.1 色彩（Figma 风 + 暖纸感）
```css
:root{
  --bg:#fff;
  --surface:#f7f7f6;        /* 主表面，偏暖灰白 */
  --surface-2:#f1f1f0;
  --surface-3:#ecebe7;
  --board:#fff;
  --canvas-bg:#f7f7f6;
  --ink:#17181a;            /* 主文字 */
  --ink-2:#3c3b37; --ink-3:#5c5b56; --ink-4:#6f6e68; --ink-5:#85847e;
  --lock:#adaca6;
  --solid:#0e0f11;          /* 深色反白块 */
  --solid-ink:#f4f3f1;
  --pick:#0d99ff;           /* Figma 蓝（选中/主操作） */
  --guide:#ff3b6b;          /* Figma 红/粉（引导线/强调） */
  --paper:#dcd9cf;          /* 暖牛皮纸（卡片内底） */
  --paper-2:#e9e7df;
  --rule:#17181a29;         /* 发丝分割线 */
  --signal:#2231dd;         /* 信号蓝 */
  --ember:#b8431c;          /* 余烬橙 */
  --ok:#15803d;
}
```
块预览里还用了一组活泼强调色（用于不同组件点缀）：`#e5484d` 红、`#1f9d55` 绿、`#e09a12` 琥珀、`#4c8dff`/`#5b8def` 蓝、`#f2c46d` 黄、`#e57bb8` 粉、`#9d7bf5` 紫、`#74dcae` 薄荷、`#9ab8db` 雾蓝。

### 3.2 玻璃 / 斜切高光（拟物但克制）
```css
--glass-a:.35; --glass-edge-a:.4;
--edge-hi:.75; --edge-lo:.18; --edge-far:.42;
--slab-dark:#0e0f11; --spec-max:.35; --ring-max:.4; --lift-max:.06;
```
→ 卡片用极淡玻璃面板 + 顶部高光线，呈现「精密仪器面板」质感，但不过度拟物。

### 3.3 字体
```css
--font-head:"Google Sans","Inter Head",var(--font-ui);
--font-ui:"Inter","Maison Neue","MaisonNeue-Book","Instrument Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
--font-code:ui-monospace,"SF Mono",SFMono-Regular,Menlo,Consolas,monospace;
```
标题用 Google Sans（圆润现代），UI 用 Inter，代码/数字用等宽。整体是「编辑感 + 技术感」的混合。

### 3.4 主题
- 支持 **light & dark**，跟随系统（`color-scheme`，CSS 内用媒体查询切换 token，共 110+ 处 dark 覆盖）。
- 但 **favicon 颜色跟随的是浏览器标签栏主题**（不是站点主题）——内联 SVG 内含 `@media (prefers-color-scheme)` 媒体查询。

---

## 4. 信息架构 / 路由

| 路由 | 内容 |
|---|---|
| `/` | 首页：Hero + 交互类型筛选 + Block 网格 |
| `/blocks/<id>` | 单个 block 详情：活预览 + 信息面板 + 源码/复制/MCP |
| `/sounds` | UI 音效库（播放/试听） |
| `/sponsor` | 赞助商墙（如 Mobbin），含 `/sponsor/apply` 申请入口 |
| `/pro` | Pro 付费墙（`/pro/lock-wall.jpg` 锁屏图） |
| `/docs` | 文档（Docs chunk 存在） |

导航栏（截图实测）：**Catalog / Sounds / Sponsor / Pro / Docs** + 登录/CTA。

---

## 5. 首页结构（精确还原要点）

1. **顶部导航**：左 logo（内联 SVG 山羊/环形），右导航链接 + 主题无关配色。
2. **Hero**：大标题 "Bencho"，副标题 "Explore and interact with a selection of **Blocks and Sounds**."（可加一句 "take straight into your projects."）。强调「Live, not mocked」。
3. **筛选 Chips**：按交互类型切换——`All / Press / Hover / Drag / Type / Loading`（共 5 类，对应 138 block）。
4. **Block 网格**：响应式卡片网格，**每张卡片内嵌该 block 的真实交互预览**（不是图片）。卡片 hover/点击进入详情。
5. **赞助卡**：网格中穿插赞助商卡（如 Mobbin 全息海报 `Mobbin-gcemcORc.js`）。
6. **页脚**：版权 + "run by Lorenzo Cabra" + 链接。

---

## 6. Block 组件架构（核心）

- **总数**：138 个（JSON-LD `numberOfItems:138`）。
- **分类（kind）**：Press(44) / Hover(35) / Drag(30) / Type(6) / Loading(4)。
- **每个 block 自包含**：一个 React 组件 + 懒加载 chunk（`<Component名>-<hash>.js`），首页仅按需 import。
- **典型 block 示例**（来自源码/SEO 壳）：Ink bloom(Press)、Peek rating(Hover)、Load cards(Press)、Edge light(Hover)、Line sidebar(Hover)、Card swap(Drag)、Dot swarm(Hover)、Option wheel(Drag)、Wake slider(Drag)、Line sphere(Hover)、Page peel(Drag)、Stacked bars(Hover)、Blast radius/Network graph(Hover)、Connect sources/Integrations(Press)、Blueprint loader(Loading)、AI chat input(Type)、FAQ accordion(Press)、Avatar group(Hover)、Profile hover card(Hover)、Resizable panels(Drag)、Toast stack(Hover)、Dot loader(Loading)、Image shimmer(Loading)、Shimmer text(Loading)、Orbit cards(Drag)、Metaballs(Hover)、Tree view(Press)、Access request(Press) … 覆盖按钮、卡片、滑块、图表、加载、导航、表单等。
- **详情页**：活预览 + 元信息（标题、交互类型、描述）+ **View source / Copy / 通过 MCP 导出**。源码来自 `/api/block-source?id=<id>`（**后端**，离线时该按钮不可用，但预览照常）。

### 6.1 关键微交互规范（来自源码 `<head>` 注释的「执念级」细节）
- **禁用双指缩放（三层防御）**：viewport `maximum-scale=1, user-scalable=no` + JS 里针对 iOS Safari 的 WebKit 处理 + `body{touch-action: pan-x pan-y}`。理由：单个方案都覆盖不全所有手机。
- **favicon 内联 data-URI SVG**：因为站点还会打包成一个自包含 `bundle.html` 单文件，相对路径图标在那种格式下会坏；data-URI 在 dev / 部署站 / 单文件三处都正确。且内联 SVG 内含媒体查询随**浏览器标签栏**主题变色。
- **OG 分享图**：`share-cover-ring.png` **1200×630**（1.91:1，FB/LinkedIn/Twitter 裁切一致）；取自「环形轨道页，山羊居中」的整图中心裁切；改图必改**文件名**（unfurler 按 URL 缓存，旧图数日不下）。
- **不要 `og:url`**：设为根会让带 `?c=slide-confirm` 等查询参数的分享链接 unfurl 成首页。
- **`<noscript>` SEO 壳**：在无 JS 时渲染 `<h1>` + 138 个 block 文字链接列表，保证爬虫/可读性。
- **SEO 标题前置**：`<title>` 把品牌名放最前（Google 截 ~60 字符、手机标签 ~12 字符）。

---

## 7. 后端 / 账号 / 商业化（需自建，离线可省）

- **Supabase Auth**：登录/Pro 账号（`supabase-*`、`authStore-*`）。
- **源码分发**：`/api/block-source?id=<id>` 返回组件源码；`/api/mcp?key=` + `/api/mcp-key` 提供 **MCP** 接口，让 AI 编辑器直接拉取组件。
- **支付/赞助**：`/api/dodo-checkout`、`/api/dodo-portal`、`/api/paddle-portal`（Dodo Payments / Paddle）。
- **实时**：`/api/broadcast`（在线人数/协同，离线时不显示或静态占位）。
- **统计**：`/stats/script.js`（轻量自研统计，可选）。

> 复刻取舍：前端 + 静态资源可 100% 镜像（已验证本地 404=0、首页 44 卡渲染正常）；上述 5 类接口需你自己接后端，否则对应按钮/功能降级。

---

## 8. 文案语气（Tone）

- 自信、克制、带工程师幽默（如 "Everything is live, not mocked"）。
- 动词主导、短句："Explore", "Interact", "Take straight into your projects"。
- 不堆术语，强调「能玩、能拿、能接」。

---

## 9. 可直接粘贴的「AI 构建提示词」（English Prompt）

> 把下面整段喂给任意 AI 编码助手，即可按本规格起项目。

```
Build "Bencho" — a showcase & distribution site for live, interactive UI components
and UI sound effects. Tagline: "Explore and interact with a selection of Blocks and
Sounds. Take them straight into your projects. Everything is live, not mocked."

STACK (exact):
- Vite + React + TypeScript. No Next.js.
- Styling: plain CSS with CSS custom properties only — NO Tailwind, NO CSS-in-JS.
  One global stylesheet with a :root design-token block.
- Animation: Framer Motion (spring physics, MotionConfig, use-motion-value).
- Icons: Lucide (tree-shake, lazy per block).
- Graphics: Canvas/WebGL + SVG filters for gooey/liquid/metaball/orbit effects.
- Optional backend: Supabase (auth) + small API for source export & MCP.

DESIGN SYSTEM (copy these tokens into :root):
  --bg:#fff; --surface:#f7f7f6; --surface-2:#f1f1f0; --surface-3:#ecebe7;
  --ink:#17181a; --ink-2:#3c3b37; --ink-3:#5c5b56; --ink-4:#6f6e68; --ink-5:#85847e;
  --solid:#0e0f11; --solid-ink:#f4f3f1;
  --pick:#0d99ff; --guide:#ff3b6b; --paper:#dcd9cf; --paper-2:#e9e7df;
  --rule:#17181a29; --signal:#2231dd; --ember:#b8431c; --ok:#15803d;
  --glass-a:.35; --glass-edge-a:.4; --edge-hi:.75; --edge-lo:.18;
  --font-head:"Google Sans","Inter Head",sans-serif;
  --font-ui:"Inter","Maison Neue","Instrument Sans","Helvetica Neue",sans-serif;
  --font-code:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
- Light & dark themes via prefers-color-scheme media query overriding the tokens.
- Figma-inspired: blue (--pick) for selection, pink/red (--guide) for emphasis,
  warm paper (#dcd9cf) card insets, hairline rules (--rule), subtle glass + top-edge
  highlight on cards (precision-instrument panel feel, not heavy skeuomorphism).

PAGES / ROUTES (client-side SPA):
- "/" Home: top nav (Catalog, Sounds, Sponsor, Pro, Docs) + Hero ("Bencho" big,
  subtitle about Blocks & Sounds) + filter chips (All/Press/Hover/Drag/Type/Loading)
  + responsive grid of BLOCK CARDS. CRITICAL: each card embeds the REAL, running,
  interactive preview of that block — never a screenshot or GIF.
- "/blocks/:id" detail: live preview + meta panel (title, interaction kind, desc)
  + "View source / Copy / Export via MCP" actions.
- "/sounds" UI sound library with play/preview.
- "/sponsor" sponsor wall (e.g. Mobbin) + "/sponsor/apply".
- "/pro" paywall (lock-wall image). /docs documentation.

CONTENT MODEL:
- 138 interactive blocks across 5 kinds: Press(44) / Hover(35) / Drag(30) /
  Type(6) / Loading(4). Each block = self-contained React component, code-split into
  its own lazy chunk (import('./Xxx-HASH.js')). Home loads only framework + above-fold.
- Examples to implement first: Ink bloom, Peek rating, Card swap, Dot swarm,
  Wake slider, Orbit cards, Metaballs, FAQ accordion, Toast stack, Blueprint loader,
  AI chat input, Tree view, Resizable panels.

ENGINEERING REQUIREMENTS:
- Code-split every block; don't bundle all 138 into one file.
- Google Fonts (Google Sans, Instrument Sans, Inter) with preconnect to
  fonts.gstatic.com (crossorigin).
- Hard rules from the original: (1) disable pinch-zoom in 3 layers (viewport
  maximum-scale=1,user-scalable=no + iOS WebKit JS handler + body touch-action:
  pan-x pan-y); (2) favicon as INLINE data-URI SVG containing its own
  prefers-color-scheme media query (follows the BROWSER tab theme, not the page);
  (3) OG image exactly 1200x630, change FILENAME on update; (4) NO og:url;
  (5) <noscript> SEO shell with h1 + text links to all blocks.
- Accessibility: keyboard operable, aria-labels on icon-only controls.

BACKEND (optional, stub if offline):
- Supabase auth for Pro. /api/block-source?id returns component source.
- MCP endpoint (/api/mcp?key=) so AI editors can pull components.
- Payments via Dodo/Paddle (checkout + portal). /api/broadcast for presence.
If backend absent, degrade gracefully (preview still works; source/MCP buttons show
a "needs backend" state).

TONE: confident, concise, engineer-humor. Lead copy with the brand name. Verbs over nouns.

DELIVER: runnable `npm run dev`, deployable static build to Netlify/CDN.
```

---

## 10. 复刻交付检查清单（用于验收）

- [ ] 首页 Hero + 5 类筛选 chip 正常
- [ ] 网格中每个卡片是**真实可交互**预览（非图片）
- [ ] 点进 `/blocks/:id` 预览可玩
- [ ] Light/Dark 跟随系统
- [ ] favicon 随浏览器标签主题变色、OG 图 1200×630
- [ ] `<noscript>` 含全部 block 链接
- [ ] 代码分割：每个 block 独立 chunk
- [ ] 本地静态托管 404 = 0（仅 `/api/*` 后端相关可缺失）
