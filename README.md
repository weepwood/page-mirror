# Page Mirror

个人网站镜像统一工作区。**每个镜像独立维护，一套目录与发布流水线统一管理。**

长期源仓库为 page-mirror，原有独立 *-mirror 仓库在迁移完成、审核与回归验收前继续保留。

## 在线入口

https://weepwood.github.io/page-mirror/

## 核心结构

- sites/registry.json：站点展示目录、分类标签及验收状态。
- sites/mirror-sources.json：**公开**旧仓库的一次性迁移配置；未来可按需继续添加。
- sites/\<slug\>/：独立镜像的源码、静态资源、字体与图片。
- scripts/import-mirrors.mjs：克隆公开源仓库并复制完整代码、记录迁移 SHA。
- scripts/build-site.mjs：按站点类型独立构建，输出 .site-build/；支持 `--only=<slug>` 只重建单个站点。
- scripts/site-assets.mjs：发布过滤与敏感文件规则，供导入器和构建脚本共用。
- scripts/registry-rules.mjs：站点清单校验的单一真源，供校验脚本与测试共用。
- scripts/validate-registry.mjs：校验站点目录、路径、状态、分类与导入记录一致性。
- scripts/audit-links.mjs：扫描发布产物的链接健康并生成报告（只诊断，不改镜像 HTML）。
- scripts/audit-external.mjs：登记镜像 HTML 向第三方域名发起的请求（只诊断，不改镜像 HTML）。
- scripts/audit-build.mjs：体检发布产物的体积、重复内容、发布卫生与 sitemap 一致性（只诊断，不改镜像 HTML）。
- scripts/sitemap.mjs：从 registry 生成 sitemap.xml，仅收录产物中真实存在的站点，URL 基准取 package.json 的 `homepage`。
- index.html / 404.html / robots.txt / favicon.svg：站点目录与全局发布页面。
- tests/：清单规则、发布过滤、首页与全局页面、sitemap 与链接扫描测试。
- docs/link-audit.md：链接健康基线报告（自动生成，请勿手改）。
- docs/external-assets.md：第三方外链资源清单（自动生成，请勿手改）。
- docs/build-audit.md：发布产物体检报告（自动生成，请勿手改）。
- docs/acceptance.md：站点验收 SOP 与状态流转规则。
- .github/workflows/sync-mirrors.yml：首次同步及可选人工重新导入。
- .github/workflows/pages.yml：自动检查和统一 GitHub Pages 发布；其 push 路径与同步工作流互斥，避免同一提交重复部署。

## 首批迁移（自动导入，仅限公开源）

- mimo-mirror → sites/mimo-rl/（静态站点）
- inftab-mirror → sites/inftab-app/（Vue 3 / Vite）

自动导入只接受公开仓库，配置在 sites/mirror-sources.json。原有 holo、artcraft-apps、inftab、weread 项目继续存在。

## 一次性批量导入（2026-11-08）

经明确确认后，另外 17 个原私有镜像仓库已一次性迁入本公开仓库，站点清单共 23 个。15 个为纯静态镜像，planes-react-clone 与 zhheo-blog-clone 先在本地构建为静态产物再迁入，完整源码保存在各自的 `reference/source/`（不会发布到 Pages）。

- 每个导入目录含 `MIRROR-IMPORT.json`，记录来源仓库、分支、原提交 SHA 与导入日期。
- 所有新站点状态为 `review`，尚未完成逐屏对照验收。
- 这批仓库**不登记**到 `sites/mirror-sources.json`，因此自动导入 Action 不会重复克隆，也不会放宽「私有源禁止自动导入」的边界。
- 迁入后源码与第三方站点素材已随公开仓库及 GitHub Pages 对外可见；上游字体、图片、商标与交互代码的许可仍需逐站核对，详见 [镜像迁移说明](docs/mirror-import.md)。

## 站点分类

`registry.json` 每个站点都有 `kind` 与 `tags`，由 `scripts/registry-rules.mjs` 强制校验：

| kind | 含义 | 数量 |
| --- | --- | ---: |
| `snapshot` | 直接复制的静态快照 | 16 |
| `build` | 导入前在本地构建出的静态产物 | 2 |
| `source` | 部署期才构建的 Vite 源码 | 1 |
| `original` | 本仓库直接维护或从头复刻 | 4 |

`artcraft-apps`、`holo`、`inftab`、`weread` 没有外部导入来源，因此没有 `sourceRepository` 与 `MIRROR-IMPORT.json`，这是预期状态而非缺失。自动导入器会为新站点写入默认分类与标签。首页卡片展示分类与最多两个技术标签，字段规范见 [镜像子项目规范](docs/site-guidelines.md)。

## 添加新镜像

    node scripts/add-mirror.mjs --slug=demo --repo=weepwood/demo-mirror --name=Demo --sourceUrl=https://example.com/

普通静态网页无需改动中央部署流程；Vue/Vite 的镜像加上 --kind=vite。提交配置后 GitHub Actions 会完成首次导入，之后直接修改本仓库内 sites/\<slug\>/。若无需从其他仓库导入，可复制 sites/_template/ 并更新 registry.json。

## 开发与验证

需要 Node.js 22+。源仓库导入需 Git；Vite 镜像构建需 npm。统一入口在根 `package.json`：

    npm run validate                     # 镜像源配置 + 站点清单校验
    npm test                             # 单元测试
    npm run build                        # 全量构建 .site-build/
    npm run build -- --only=feralui      # 仅重建单个站点，保留其余产物
    npm run audit:links                  # 扫描产物链接健康并刷新 docs/link-audit.md
    npm run audit:external               # 登记第三方外链并刷新 docs/external-assets.md
    npm run audit:build                  # 体检产物并刷新 docs/build-audit.md
    npm run audit:build -- --check       # 只读门禁：错误时退出码 1，不写文件
    npm run audit                        # 依次运行上面三个审计
    npm run check                        # validate + test + build

构建时只把浏览器资源复制进 `.site-build/sites/<slug>/`，并在产物根目录发布 `404.html`、`robots.txt`、`favicon.svg` 与由 registry 生成的 `sitemap.xml`（全量构建 24 个 URL；`--only` 只列出产物中实际存在的站点）；规则集中在 `scripts/site-assets.mjs`：`MIRROR-IMPORT.json`、`package*.json`、`snapshot-status.json`、本地服务/采集/校验脚本（`server.js`、`shot*.js`、`validate.mjs` 等）、凭据文件、sourcemap 与 `reference/` 源码都不会发布。

三个审计脚本不纳入 `npm run check`：它们会写入报告文件，适合验收前手动运行并提交结果；其中 `audit:build -- --check` 是只读门禁，已接入 CI 的构建后检查。

首页的状态筛选、搜索、排序与类型筛选都会写入 URL 查询参数，可直接分享或刷新恢复：离散筛选会 push 一条浏览器历史（后退可还原），连续输入则合并为一次 URL 写入；按 `/` 聚焦搜索、`Esc` 清空搜索或全部筛选。命中未收录的站内路由时，[404 页](404.html) 会根据请求路径从 `registry.json` 推测对应镜像，并给出直达该站首页的建议链接；脚本不可用时静态入口仍然可用。

## 发布产物体检

`npm run audit:build` 只读扫描 `.site-build/`（真正部署的产物），生成 [产物体检报告](docs/build-audit.md)：文件数、逐站点体积、最大文件、内容完全相同的重复资源、必需文件、发布卫生违规，以及 sitemap 与产物站点是否一致。`-- --check` 作为 CI 只读门禁运行，**错误**（必需文件缺失、内部文件/凭据混入、站点缺 `index.html`、sitemap 与产物不一致）会阻断部署；**提示**（`--only` 部分构建、重复资源、体积超阈值）只记录不阻断。

基线（2026-11-08）：2442 个文件 / 152.0 MB / 23 个站点，18 组重复内容约 1.3 MB，错误 0、提示 0。重复资源多为各镜像自带的同一份脚本或贴图，按 1:1 独立原则不在构建期合并。

## 链接策略

镜像快照通常只收录原站首页，站内导航仍指向原站根路径。经确认，**不自动改写镜像 HTML**：构建脚本只把本地确实存在的根绝对资源重写为相对路径，其余引用统一登记在自动生成的 [链接健康报告](docs/link-audit.md)。

基线（2026-11-08）：636 处根绝对引用中 543 处为快照未收录的站内路由、6 处为上游快照缺失资源、87 处已适配，本地相对资源缺失 0。具体数字随产物变化，以报告为准；逐站处理规则见 [验收 SOP](docs/acceptance.md)。点击这类路由会落到自定义 404 页，页面会按请求路径推荐对应镜像的首页，而不是让访问者停在空白错误页。

## 第三方外链

部分镜像快照保留了原站的外部脚本、字体与统计代码。`npm run audit:external` 会把这些请求登记到 [第三方外链报告](docs/external-assets.md)：当前 37 处外部引用涉及 16 个域名，其中 4 处为追踪/分析类（GTM 与 Twitter 广告像素，含 2 个原站统计 ID），其余 33 处为运行时 CDN 依赖。

访问公开镜像时，浏览器会向这些第三方域名发起请求（携带当前页面 referrer）。按项目决议**只登记、不拦截、不改写**镜像 HTML；若后续决定阻断，需逐站评估后单独记录。授权与隐私状态应在逐站验收时核对。

详细安全边界、导入模式、私有镜像与发布验证参阅 [镜像迁移说明](docs/mirror-import.md)。完整设计对照与治理规范见 docs/。

## 验收与来源

新导入镜像默认标记 review，必须按 [验收 SOP](docs/acceptance.md) 完成自动检查、线上可达性与人工对照后，才可标记 completed。镜像属于个人学习和研究，站点的第三方版权、商标和素材授权仍归原权利人。
